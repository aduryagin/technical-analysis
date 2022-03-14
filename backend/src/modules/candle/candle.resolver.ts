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
import { SourceName } from "../source/source.entity";
import { BinanceService } from "../binance/binance.service";

@Resolver()
export class CandleResolver {
  constructor(
    private readonly candleService: CandleService,
    private readonly tinkoffService: TinkoffService,
    private readonly sourceService: SourceService,
    private readonly watchListService: WatchListService,
    private readonly binanceService: BinanceService
  ) {}

  pubSub = new PubSub();

  unsubscribe: { [key: string]: () => void } = {};

  @Subscription(() => CandleSubscriptionData, {
    name: "candle",
  })
  async realtimeCandles(
    @Args("interval", { type: () => Interval }) interval: Interval,
    @Args("ticker", { type: () => String, nullable: true }) ticker?: string,
    @Args("figi", { type: () => String, nullable: true }) figi?: string,
    @Args("source", { type: () => SourceName, nullable: true })
    source?: SourceName
  ) {
    const sources = await this.sourceService.sources();
    if (!sources.length)
      return new HttpException("Please add at least one source", 400);

    const randomId = randomString();

    if (source === SourceName.Tinkoff) {
      const instanceError = this.tinkoffService.checkInstance();
      if (instanceError) return instanceError;

      const instrument = await this.watchListService.getInstrument({ figi });
      this.unsubscribe[randomId] = this.tinkoffService.instance.candle(
        { figi, interval: interval as any },
        (streamCandle) => {
          const candle = this.candleService.mapToCandle(streamCandle);
          this.pubSub.publish("candle", { candle: { candle, instrument } });
        }
      );
    } else if (source === SourceName.Binance) {
      const instanceError = this.binanceService.checkInstance();
      if (instanceError) return instanceError;

      if (!this.binanceService.checkIntervalSupport(interval))
        throw new Error("Unsupported interval");

      const binanceInterval = this.binanceService.mapInterval(interval);

      const instrument = await this.watchListService.getInstrument({ ticker });

      this.unsubscribe[randomId] =
        this.binanceService.instance.websockets.candlesticks(
          ticker,
          binanceInterval,
          (candlesticks) => {
            const { k: ticks } = candlesticks;
            const {
              o: open,
              h: high,
              l: low,
              c: close,
              v: volume,
              t: time,
            } = ticks;
            const candle = {
              time: time,
              timestamp: new Date(time).getTime(),
              open,
              close,
              high,
              low,
              volume,
            };
            this.pubSub.publish("candle", { candle: { candle, instrument } });
          }
        );
    }

    return withCancel(this.pubSub.asyncIterator("candle"), () => {
      const unsubscribe = this.unsubscribe[randomId];
      if (typeof unsubscribe === "function") unsubscribe();
      else if (typeof unsubscribe === "string")
        this.binanceService.instance.websockets.terminate(unsubscribe);
    });
  }

  @Query(() => [Candle])
  async candles(
    @Args("interval", { type: () => Interval }) interval: Interval,
    @Args("to", { type: () => String, nullable: true }) to?: string,
    @Args("figi", { type: () => String, nullable: true }) figi?: string,
    @Args("ticker", { type: () => String, nullable: true }) ticker?: string,
    @Args("source", { type: () => SourceName, nullable: true })
    source?: SourceName
  ) {
    if (source === SourceName.Tinkoff) {
      const instanceError = this.tinkoffService.checkInstance();
      if (instanceError) return instanceError;

      try {
        const candles = await this.tinkoffService.candles({
          figi,
          interval: interval as any,
          to,
        });
        if (!candles.length)
          return new HttpException(
            "Tinkoff: Unauthorized. Try to use valid token.",
            400
          );
        return candles;
      } catch (e) {
        return new HttpException(e.message, 400);
      }
    } else if (source === SourceName.Binance) {
      const instanceError = this.binanceService.checkInstance();
      if (instanceError) return instanceError;

      try {
        const candles = await this.binanceService.candles({
          ticker,
          interval,
          to,
        });
        if (!candles.length)
          return new HttpException(
            "Binance: Unauthorized. Try to use valid token.",
            400
          );
        return candles;
      } catch (e) {
        const errorMessage =
          typeof e?.body === "string" ? JSON.parse(e?.body)?.msg : e.message;

        return new HttpException(errorMessage, 400);
      }
    }
  }
}
