import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import OpenAPI, {
  CandleResolution,
  Interval,
} from "@tinkoff/invest-openapi-js-sdk";
import { Candle } from "../candle/candle.types";
import { add, sub } from "date-fns";
import { Instrument } from "../watchList/watchList.entity";
import { SourceService } from "../source/source.service";
import { CandleService } from "../candle/candle.service";
import { SourceName } from "../source/source.entity";

@Injectable()
export class TinkoffService {
  instance?: OpenAPI;

  constructor(
    private readonly sourceService: SourceService,
    private readonly candleService: CandleService
  ) {
    this.updateInstance();
  }

  checkInstance() {
    if (!this.instance) {
      return new HttpException(
        "Please add tinkoff api secret key.",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async updateInstance() {
    this.instance = null;
    const tinkoff = await this.sourceService.find(SourceName.Tinkoff);

    if (tinkoff) {
      this.instance = new OpenAPI({
        apiURL: "https://api-invest.tinkoff.ru/openapi",
        secretToken: tinkoff.secret,
        socketURL: "wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws",
      });
    }
  }

  async searchInstrument(ticker: string) {
    const instanceError = this.checkInstance();
    if (instanceError) return [];

    const data = await this.instance.search({
      ticker: ticker,
    });

    return data.instruments.map((item) => {
      const instrument = new Instrument();
      instrument.figi = item.figi;
      instrument.ticker = item.ticker;
      instrument.source = SourceName.Tinkoff;
      return instrument;
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
    const instanceError = this.checkInstance();
    if (instanceError) return [];

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

        return data.candles.map(this.candleService.mapToCandle);
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
}
