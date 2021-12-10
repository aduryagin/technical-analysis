import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Candle } from './binance.entity';
import { BinanceService } from './binance.service';

const pubSub = new PubSub();

@Resolver()
export class BinanceResolver {
  constructor(private readonly binanceService: BinanceService) {}

  @Subscription(() => Candle, {
    name: 'candle',
  })
  realtimeCandles(
    @Args('ticker', { type: () => String }) ticker: string,
    @Args('interval', { type: () => String }) interval: string,
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

        pubSub.publish('candle', { candle });
      },
    );

    return pubSub.asyncIterator('candle');
  }

  @Query(() => [Candle])
  async candles(
    @Args('ticker', { type: () => String }) ticker: string,
    @Args('interval', { type: () => String }) interval: string,
  ) {
    return new Promise((resolve) =>
      this.binanceService.binance.candlesticks(
        ticker,
        interval,
        (_error, ticks) => {
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
            }),
          );
        },
      ),
    );
  }
}
