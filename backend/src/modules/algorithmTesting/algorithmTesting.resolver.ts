import { Args, Mutation, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { TinkoffService } from "../tinkoff/tinkoff.service";
import { AlgorithmTrade, TradeType } from "./algorithmTesting.entity";
import { WatchListService } from "../watchList/watchList.service";
import { Instrument } from "../watchList/watchList.entity";
import { candles } from "./algorithmTesting.helpers";
import { Interval } from "@tinkoff/invest-openapi-js-sdk";
import { AlgorithmTestingService } from "./algorithmTesting.service";
import { algorithm } from "./algorithms";
import { CandleService } from "../candle/candle.service";

@Resolver()
export class AlgorithmTestingResolver {
  pubSub = new PubSub();

  candlesStorage: {
    [id: Instrument["id"]]: ReturnType<typeof candles>;
  } = {};
  candleUnsubscribe: {
    [id: Instrument["id"]]: () => void;
  } = {};
  interval: Interval = "1min";

  constructor(
    private readonly watchListService: WatchListService,
    private readonly tinkoffService: TinkoffService,
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
    const candlesList = await this.tinkoffService.candles({
      figi: instrument.figi,
      interval: this.interval,
      subPeriodLength: 1,
    });
    this.candlesStorage[instrument.id] = candles(candlesList);
  }

  async subscribe(instrument: Instrument) {
    if (!this.candlesStorage[instrument.id]) {
      await this.getCandles(instrument);
    }

    this.candleUnsubscribe[instrument.id] = this.tinkoffService.instance.candle(
      { figi: instrument.figi, interval: this.interval },
      async (streamCandle) => {
        const candle = this.candleService.mapToCandle(streamCandle);
        const isNewCandle = !Boolean(
          this.candlesStorage[instrument.id].result().get(candle.time)
        );
        this.candlesStorage[instrument.id].update(candle);

        const { isShort, isLong } = await algorithm({
          isNewCandle,
          instrument,
          candle,
          candles: this.candlesStorage[instrument.id].result(),
        });

        if (isShort || isLong) {
          const activeTrade =
            await this.algorithmTestingService.lastActiveTrade(instrument.id);

          if (activeTrade)
            this.algorithmTestingService.closeTrade(
              activeTrade.id,
              candle.close
            );

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
      }
    );
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

    if (this.candleUnsubscribe[id]) {
      this.candleUnsubscribe[id]();
      delete this.candleUnsubscribe[id];
    }
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
