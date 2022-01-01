import { Args, Mutation, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { Instrument } from "./watchList.entity";
import { WatchListService } from "./watchList.service";
import { WatchInput } from "./watchList.types";
import { TinkoffService } from "../tinkoff/tinkoff.service";
import { sub } from "date-fns";

@Resolver()
export class WatchListResolver {
  pubSub = new PubSub();

  constructor(
    private readonly watchListService: WatchListService,
    private readonly tinkoffService: TinkoffService
  ) {}

  candleUnsubscribe: {
    [id: number]: () => void;
  } = {};
  instrumentPrice: {
    [id: number]: {
      open: number;
      close: number;
    };
  } = {};

  async publish() {
    const watchList = await this.watchListService.instruments();

    Object.values(this.candleUnsubscribe).forEach((unsubscribe) =>
      unsubscribe()
    );
    watchList.forEach((instrument) => {
      this.candleUnsubscribe[instrument.id] =
        this.tinkoffService.instance.candle(
          { figi: instrument.figi, interval: "day" },
          (streamCandle) => {
            const candle = this.tinkoffService.mapToCandle(streamCandle);
            this.instrumentPrice[instrument.id] = {
              open: candle.open,
              close: candle.close,
            };

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
                  pricePercentChange: percentDiff,
                };
              }),
            });
          }
        );
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
    const data = await this.tinkoffService.instance.candlesGet({
      from: sub(new Date(), { days: 1 }).toISOString(),
      to: new Date().toISOString(),
      figi: instrument.figi,
      interval: "day",
    });

    this.instrumentPrice[instrument.id] = {
      open: data.candles[data.candles.length - 1]?.o || 0,
      close: data.candles[data.candles.length - 1]?.c || 0,
    };
  }

  @Mutation(() => Instrument)
  async watch(@Args("input", { type: () => WatchInput }) input: WatchInput) {
    const instrument = await this.watchListService.addInstrument(input);
    await this.getInitialCandles(instrument);
    this.publish();
    return instrument;
  }

  @Mutation(() => Boolean)
  async unwatch(@Args("id") id: number) {
    await this.watchListService.removeInstrument(id);
    this.publish();
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
