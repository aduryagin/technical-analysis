import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { Instrument } from "./watchList.entity";
import { WatchListService } from "./watchList.service";
import { WatchInput } from "./watchList.types";
import { TinkoffService } from "../tinkoff/tinkoff.service";
import { sub } from "date-fns";
import { AlgorithmTestingResolver } from "../algorithmTesting/algorithmTesting.resolver";
import { CandleService } from "../candle/candle.service";
import { SourceService } from "../source/source.service";
import { HttpException } from "@nestjs/common";
import { SourceName } from "../source/source.entity";
import { BinanceService } from "../binance/binance.service";

@Resolver()
export class WatchListResolver {
  pubSub = new PubSub();

  constructor(
    private readonly watchListService: WatchListService,
    private readonly tinkoffService: TinkoffService,
    private readonly candleService: CandleService,
    private readonly sourceService: SourceService,
    private readonly binanceService: BinanceService,
    private readonly algorithmTestingResolver: AlgorithmTestingResolver
  ) {}

  candleUnsubscribe: {
    [id: number]: string | (() => void);
  } = {};
  instrumentPrice: {
    [id: number]: {
      open: number;
      close: number;
    };
  } = {};

  async publish() {
    const watchList = await this.watchListService.instruments();

    Object.keys(this.candleUnsubscribe).forEach((id) => {
      const unsubscribe = this.candleUnsubscribe[id];

      if (typeof unsubscribe === "function") {
        unsubscribe();
      } else if (typeof unsubscribe === "string") {
        this.binanceService.instance.websockets.terminate(unsubscribe);
      }

      delete this.candleUnsubscribe[id];
    });

    const publishWatchList = () => {
      this.pubSub.publish("watchList", {
        watchList: watchList.map((item) => {
          const onePercent = this.instrumentPrice[item.id].open / 100;
          const priceDiff =
            this.instrumentPrice[item.id].close -
            this.instrumentPrice[item.id].open;
          const percentDiff = priceDiff / onePercent;

          return {
            ...item,
            price: this.instrumentPrice[item.id].close,
            pricePercentChange: percentDiff || 0,
          };
        }),
      });
    };

    watchList.forEach((instrument) => {
      if (instrument.source === SourceName.Tinkoff) {
        this.candleUnsubscribe[instrument.id] =
          this.tinkoffService.instance.candle(
            { figi: instrument.figi, interval: "day" },
            (streamCandle) => {
              const candle = this.candleService.mapToCandle(streamCandle);
              this.instrumentPrice[instrument.id] = {
                open: candle.open,
                close: candle.close,
              };

              publishWatchList();
            }
          );
      } else if (instrument.source === SourceName.Binance) {
        this.candleUnsubscribe[instrument.id] =
          this.binanceService.instance.websockets.candlesticks(
            instrument.ticker,
            "1d",
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
              this.instrumentPrice[instrument.id] = {
                open: candle.open,
                close: candle.close,
              };

              publishWatchList();
            }
          );
      }
    });

    this.pubSub.publish("watchList", {
      watchList: watchList.map((instrument) => {
        const open = this.instrumentPrice[instrument.id]?.open || 0;
        const close = this.instrumentPrice[instrument.id]?.close || 0;
        const onePercent = open / 100;
        const priceDiff = close - open;
        const percentDiff = priceDiff / onePercent;

        return {
          ...instrument,
          price: close,
          pricePercentChange: percentDiff || 0,
        };
      }),
    });
  }

  async getInitialCandles(instrument: Instrument) {
    if (instrument.source === SourceName.Tinkoff) {
      if (!this.tinkoffService.instance) return;

      const data = await this.tinkoffService.instance.candlesGet({
        from: sub(new Date(), { days: 5 }).toISOString(),
        to: new Date().toISOString(),
        figi: instrument.figi,
        interval: "day",
      });

      this.instrumentPrice[instrument.id] = {
        open: data.candles[data.candles.length - 1]?.o || 0,
        close: data.candles[data.candles.length - 1]?.c || 0,
      };
    } else if (instrument.source === SourceName.Binance) {
      if (!this.binanceService.instance) return;

      const data = await this.binanceService.instance.candlesticks(
        instrument.ticker,
        "1d",
        false,
        {
          limit: 10,
          endTime: new Date().getTime(),
        }
      );

      const lastCandle = this.binanceService.mapCandle(data[data.length - 1]);

      this.instrumentPrice[instrument.id] = {
        open: lastCandle?.open || 0,
        close: lastCandle?.close || 0,
      };
    }
  }

  @Query(() => [Instrument])
  async searchInstrument(
    @Args("ticker", { type: () => String }) ticker: string
  ) {
    const sources = await this.sourceService.sources();
    if (!sources.length)
      return new HttpException("Please add at least one source", 400);

    let instruments = [];
    if (this.sourceService.find(SourceName.Tinkoff)) {
      const tinkoffInstruments = await this.tinkoffService.searchInstrument(
        ticker
      );
      instruments = [...instruments, ...tinkoffInstruments];
    }

    if (this.sourceService.find(SourceName.Binance)) {
      const binanceInstruments = await this.binanceService.searchInstrument(
        ticker
      );
      instruments = [...instruments, ...binanceInstruments];
    }

    return instruments;
  }

  @Mutation(() => Instrument)
  async watch(@Args("input", { type: () => WatchInput }) input: WatchInput) {
    const instrument = await this.watchListService.addInstrument(input);
    await this.getInitialCandles(instrument);
    await this.algorithmTestingResolver.subscribe(instrument);
    await this.publish();
    return instrument;
  }

  @Mutation(() => Boolean)
  async unwatch(@Args("id") id: number) {
    await this.algorithmTestingResolver.unsubscribe(id);
    await this.watchListService.removeInstrument(id);
    await this.publish();
    return true;
  }

  @Subscription(() => [Instrument])
  async watchList() {
    const watchList = await this.watchListService.instruments();
    await Promise.all(
      watchList.map((instrument) => this.getInitialCandles(instrument))
    );

    this.publish();

    return this.pubSub.asyncIterator("watchList");
  }
}
