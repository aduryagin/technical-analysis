import { Args, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { Instrument } from "../watchList/watchList.entity";
import { Candle, CandleSubscriptionData, Interval } from "./tinkoff.types";
import { TinkoffService } from "./tinkoff.service";
import { WatchListService } from "../watchList/watchList.service";
import withCancel from "../../helpers/withCancel";
import randomString from "../../helpers/randomString";

@Resolver()
export class TinkoffResolver {
  pubSub = new PubSub();

  constructor(
    private readonly tinkoffService: TinkoffService,
    private readonly watchListService: WatchListService
  ) {}

  unsubscribe: { [key: string]: () => void } = {};

  @Subscription(() => CandleSubscriptionData, {
    name: "candle",
  })
  async realtimeCandles(
    @Args("figi", { type: () => String }) figi: string,
    @Args("interval", { type: () => Interval }) interval: Interval
  ) {
    const instrument = await this.watchListService.getInstrument({ figi });
    const randomId = randomString();
    this.unsubscribe[randomId] = this.tinkoffService.instance.candle(
      { figi, interval },
      (streamCandle) => {
        const candle = this.tinkoffService.mapToCandle(streamCandle);
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
    return this.tinkoffService.candles({ figi, interval, to });
  }

  @Query(() => [Instrument])
  async searchInstrument(
    @Args("ticker", { type: () => String }) ticker: string
  ) {
    const data = await this.tinkoffService.instance.search({
      ticker: ticker,
    });

    return data.instruments.map((item) => {
      const instrument = new Instrument();
      instrument.figi = item.figi;
      instrument.ticker = item.ticker;
      return instrument;
    });
  }
}
