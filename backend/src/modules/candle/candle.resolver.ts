import { HttpException } from "@nestjs/common";
import { Args, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import randomString from "../../helpers/randomString";
import withCancel from "../../helpers/withCancel";
import { SourceService } from "../source/source.service";
import { TinkoffService } from "../tinkoff/tinkoff.service";
import { WatchListService } from "../watchList/watchList.service";
import { CandleService } from "./candle.service";
import { Candle, CandleSubscriptionData, Interval } from "./candle.types";

@Resolver()
export class CandleResolver {
  constructor(
    private readonly candleService: CandleService,
    private readonly tinkoffService: TinkoffService,
    private readonly sourceService: SourceService,
    private readonly watchListService: WatchListService
  ) {}

  pubSub = new PubSub();

  unsubscribe: { [key: string]: () => void } = {};

  @Subscription(() => CandleSubscriptionData, {
    name: "candle",
  })
  async realtimeCandles(
    @Args("figi", { type: () => String }) figi: string,
    @Args("interval", { type: () => Interval }) interval: Interval
  ) {
    const sources = await this.sourceService.sources();
    if (!sources.length)
      return new HttpException("Please add at least one source", 400);

    const instanceError = this.tinkoffService.checkInstance();
    if (instanceError) return instanceError;

    const instrument = await this.watchListService.getInstrument({ figi });
    const randomId = randomString();
    this.unsubscribe[randomId] = this.tinkoffService.instance.candle(
      { figi, interval },
      (streamCandle) => {
        const candle = this.candleService.mapToCandle(streamCandle);
        this.pubSub.publish("candle", { candle: { candle, instrument } });
      }
    );

    return withCancel(this.pubSub.asyncIterator("candle"), () => {
      this.unsubscribe[randomId]();
    });
  }

  @Query(() => [Candle])
  async candles(
    @Args("figi", { type: () => String }) figi: string,
    @Args("interval", { type: () => Interval }) interval: Interval,
    @Args("to", { type: () => String, nullable: true }) to?: string
  ) {
    const instanceError = this.tinkoffService.checkInstance();
    if (instanceError) return instanceError;

    const candles = await this.tinkoffService.candles({ figi, interval, to });
    if (!candles.length)
      return new HttpException("Unauthorized. Try to use valid token.", 400);
    return candles;
  }
}
