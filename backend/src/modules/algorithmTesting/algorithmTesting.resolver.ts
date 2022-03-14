import { Args, Mutation, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { TinkoffService } from "../tinkoff/tinkoff.service";
import { AlgorithmTrade, TradeType } from "./algorithmTesting.entity";
import { WatchListService } from "../watchList/watchList.service";
import { Instrument } from "../watchList/watchList.entity";
import { candles } from "./algorithmTesting.helpers";
import { AlgorithmTestingService } from "./algorithmTesting.service";
import { algorithm } from "./algorithms";
import { CandleService } from "../candle/candle.service";
import { Interval } from "../candle/candle.types";
import { SourceName } from "../source/source.entity";
import { BinanceService } from "../binance/binance.service";

@Resolver()
export class AlgorithmTestingResolver {
  pubSub = new PubSub();

  candlesStorage: {
    [id: Instrument["id"]]: ReturnType<typeof candles>;
  } = {};
  candleUnsubscribe: {
    [id: Instrument["id"]]: () => void;
  } = {};
  interval: Interval = Interval.MIN1;

  constructor(
    private readonly watchListService: WatchListService,
    private readonly tinkoffService: TinkoffService,
    private readonly binanceService: BinanceService,
    private readonly algorithmTestingService: AlgorithmTestingService,
    private readonly candleService: CandleService
  ) {
    this.init();
  }

  async init() {
    if (!this.tinkoffService.instance) return;

    const watchList = await this.watchListService.instruments();

    for (const instrument of watchList) {
      await this.getCandles(instrument);
      this.subscribe(instrument);
    }
  }

  async getCandles(instrument: Instrument) {
    if (instrument.source === SourceName.Tinkoff) {
      const candlesList = await this.tinkoffService.candles({
        figi: instrument.figi,
        interval: this.interval as any,
        subPeriodLength: 1,
      });
      this.candlesStorage[instrument.id] = candles(candlesList);
    } else if (instrument.source === SourceName.Binance) {
      const candlesList = await this.binanceService.candles({
        ticker: instrument.ticker,
        interval: this.interval as any,
      });
      this.candlesStorage[instrument.id] = candles(candlesList);
    }
  }

  async subscribe(instrument: Instrument) {
    if (!this.candlesStorage[instrument.id]) {
      await this.getCandles(instrument);
    }

    const executeAlgorithm = async ({ isNewCandle, instrument, candle }) => {
      const { isShort, isLong } = await algorithm({
        isNewCandle,
        instrument,
        candle,
        candles: this.candlesStorage[instrument.id].result(),
      });

      if (isShort || isLong) {
        const activeTrade = await this.algorithmTestingService.lastActiveTrade(
          instrument.id
        );

        if (activeTrade)
          this.algorithmTestingService.closeTrade(activeTrade.id, candle.close);

        const trade = new AlgorithmTrade();
        trade.interval = this.interval;
        trade.price = candle.close;
        trade.type = isLong ? TradeType.Long : TradeType.Short;
        trade.closed = false;
        trade.instrument = instrument;
        trade.date = new Date().toISOString();
        this.algorithmTestingService.addTrade(trade);
      }

      this.publish();
    };

    if (instrument.source === SourceName.Tinkoff) {
      this.candleUnsubscribe[instrument.id] =
        this.tinkoffService.instance.candle(
          { figi: instrument.figi, interval: this.interval as any },
          async (streamCandle) => {
            const candle = this.candleService.mapToCandle(streamCandle);
            const isNewCandle = !Boolean(
              this.candlesStorage[instrument.id].result().get(candle.time)
            );
            this.candlesStorage[instrument.id].update(candle);

            executeAlgorithm({ isNewCandle, instrument, candle });
          }
        );
    } else if (instrument.source === SourceName.Binance) {
      this.candleUnsubscribe[instrument.id] =
        this.binanceService.instance.websockets.candlesticks(
          instrument.ticker,
          this.binanceService.mapInterval(this.interval),
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
            const isNewCandle = !Boolean(
              this.candlesStorage[instrument.id].result().get(candle.time)
            );
            this.candlesStorage[instrument.id].update(candle);

            executeAlgorithm({ isNewCandle, instrument, candle });
          }
        );
    }
  }

  async publish() {
    const trades = await this.algorithmTestingService.trades();
    this.pubSub.publish("trades", {
      trades: trades
        .filter((trade) => this.candlesStorage[trade.instrument.id])
        .map((trade) => {
          const onePercent = trade.price / 100;

          const currentInstrumentPrice = Array.from(
            this.candlesStorage[trade.instrument.id].result().values()
          ).pop().close;
          const priceDiff =
            trade.type === TradeType.Short
              ? trade.price - trade.closePrice
              : trade.closePrice - trade.price;
          const livePriceDiff =
            trade.type === TradeType.Short
              ? trade.price - currentInstrumentPrice
              : currentInstrumentPrice - trade.price;

          return {
            ...trade,
            pricePercentChange: trade.closed
              ? priceDiff / onePercent
              : livePriceDiff / onePercent,
          };
        }),
    });
  }

  unsubscribe(id: Instrument["id"]) {
    this.algorithmTestingService.removeTrades(id);

    const unsubscribe = this.candleUnsubscribe[id];
    if (typeof unsubscribe === "function") unsubscribe();
    else if (typeof unsubscribe === "string")
      this.binanceService.instance.websockets.terminate(unsubscribe);

    delete this.candleUnsubscribe[id];
  }

  @Mutation(() => Boolean)
  async closeTrade(@Args("id") id: number) {
    const trade = await this.algorithmTestingService.trade(id);

    if (trade) {
      const currentInstrumentPrice = Array.from(
        this.candlesStorage[trade.instrument.id].result().values()
      ).pop().close;

      await this.algorithmTestingService.closeTrade(id, currentInstrumentPrice);
      this.publish();
    }
    return true;
  }

  @Subscription(() => [AlgorithmTrade])
  async trades() {
    this.publish();
    return this.pubSub.asyncIterator("trades");
  }
}
