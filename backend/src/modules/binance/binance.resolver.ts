import { Args, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { Candle, Instrument, Source } from "./binance.entity";
import { BinanceService } from "./binance.service";

const pubSub = new PubSub();

@Resolver()
export class BinanceResolver {
  constructor(private readonly binanceService: BinanceService) {}

  @Subscription(() => Candle, {
    name: "candle",
  })
  realtimeCandles(
    @Args("ticker", { type: () => String }) ticker: string,
    @Args("interval", { type: () => String }) interval: string
  ) {
    this.binanceService.binance.websockets.candlesticks(
      [ticker],
      interval,
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
        const candle = new Candle();
        candle.time = time;
        candle.open = open;
        candle.high = high;
        candle.low = low;
        candle.close = close;
        candle.volume = volume;

        pubSub.publish("candle", { candle });
      }
    );

    return pubSub.asyncIterator("candle");
  }

  @Query(() => [Candle])
  async candles(
    @Args("ticker", { type: () => String }) ticker: string,
    @Args("interval", { type: () => String }) interval: string
  ) {
    return new Promise((resolve, reject) =>
      this.binanceService.binance.candlesticks(
        ticker,
        interval,
        (error, ticks) => {
          if (error) reject(error);

          resolve(
            ticks.map(([time, open, high, low, close, volume]) => {
              const candle = new Candle();
              candle.time = time;
              candle.open = open;
              candle.high = high;
              candle.low = low;
              candle.close = close;
              candle.volume = volume;

              return candle;
            })
          );
        }
      )
    );
  }

  @Query(() => [Instrument])
  findInstrument(@Args("ticker", { type: () => String }) ticker: string) {
    return new Promise((resolve, reject) =>
      this.binanceService.binance.exchangeInfo((error, data) => {
        if (error) reject(error);

        const filtered = data?.symbols?.filter((item) =>
          item.symbol.toLowerCase().startsWith(ticker.toLocaleLowerCase())
        );

        resolve(
          filtered.map((item) => {
            const instrument = new Instrument();
            instrument.ticker = item.symbol;
            instrument.description = "";
            instrument.source = Source.BINANCE;
            return instrument;
          })
        );
      })
    );
  }
}
