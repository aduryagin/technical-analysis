import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAPI, {
  CandleResolution,
  Interval,
  Candle as TinkoffCandle,
  CandleStreaming,
} from "@tinkoff/invest-openapi-js-sdk";
import { Candle } from "./tinkoff.types";
import { add, sub } from "date-fns";
import { Instrument } from "../watchList/watchList.entity";

@Injectable()
export class TinkoffService {
  instance: OpenAPI;

  constructor(configService: ConfigService) {
    this.instance = new OpenAPI({
      apiURL: "https://api-invest.tinkoff.ru/openapi",
      secretToken: configService.get("TINKOFF_SECRET"),
      socketURL: "wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws",
    });
  }

  async candles({
    figi,
    interval = "day",
    to,
    subPeriodLength = 10,
  }: {
    figi: Instrument["figi"];
    interval?: Interval;
    to?: string;
    subPeriodLength?: number;
  }) {
    const removeTimeDuplicates = (candles: Candle[]): Candle[] => {
      return candles.filter(
        (thing, index, self) =>
          index === self.findIndex((t) => t.time === thing.time)
      );
    };

    const getRangeCandles = async (from, to) => {
      const getCandles = async (companyFigi: string): Promise<Candle[]> => {
        const data = await this.instance.candlesGet({
          from,
          to,
          figi: companyFigi,
          interval: interval as CandleResolution,
        });

        return data.candles.map(this.mapToCandle);
      };

      try {
        return await getCandles(figi);
      } catch (e) {
        if (
          e?.response?.data?.payload?.message.includes(
            "Instrument not found by"
          )
        ) {
          // const companyFigi = await this.getFigiTinkoffApi(company.ticker);
          // if (companyFigi) {
          //   company.figi = companyFigi;
          //   // this.figiByTickerCache[company.ticker] = companyFigi;
          //   return await getCandles(companyFigi);
          // }
        } else {
          console.log(e);
        }

        return [];
      }
    };

    let subPeriod: any = { days: subPeriodLength };
    let addPeriod: any = { days: 1 };

    if (interval === "hour") {
      subPeriod = { weeks: subPeriodLength };
      addPeriod = { weeks: 1 };
    } else if (
      interval === "day" ||
      interval === "week" ||
      interval === "month"
    ) {
      subPeriod = { years: subPeriodLength };
      addPeriod = { years: 1 };
    }

    const today = to ? new Date(to) : new Date();
    if (!to) {
      today.setDate(today.getDate());
      today.setHours(0, 0, 0, 0);
    }

    const startDate = sub(today, subPeriod);
    const dayRanges = [];
    let candles: Candle[] = [];

    if (["hour", "day", "week", "month"].includes(interval)) {
      for (let d = startDate; d <= today; d = add(d, addPeriod)) {
        const begin = new Date(d);
        const end = add(begin, addPeriod);
        dayRanges.push([begin, end]);
      }

      const data = await Promise.all(
        dayRanges.map((range) => getRangeCandles(range[0], range[1]))
      );

      candles = data.reduce(
        (accum, item) => [...accum, ...item],
        [] as Candle[]
      ) as Candle[];

      if (to) {
        candles = candles.filter(
          (candle) => new Date(candle.time).getTime() <= today.getTime()
        );
      }
    } else {
      let subPeriodLengthRealized = 0;

      async function getMinuteCandles(
        currentDate = to ? new Date(to) : new Date()
      ) {
        const startDate = sub(currentDate, { days: 1 });
        const endDate = currentDate;

        const rangeCandles = await getRangeCandles(startDate, endDate);
        if (rangeCandles.length) {
          subPeriodLengthRealized += 1;
          candles = [...candles, ...rangeCandles];
        }

        if (subPeriodLengthRealized < subPeriodLength) {
          await getMinuteCandles(startDate);
        }
      }

      await getMinuteCandles();
      candles = candles.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
      );
    }

    return removeTimeDuplicates(candles);
  }

  mapToCandle(candle: TinkoffCandle | CandleStreaming): Candle {
    return {
      time: candle.time,
      timestamp: new Date(candle.time).getTime(),
      open: candle.o,
      close: candle.c,
      high: candle.h,
      low: candle.l,
      volume: candle.v,
    };
  }
}
