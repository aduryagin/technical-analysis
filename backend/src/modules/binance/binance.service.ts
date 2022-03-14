import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Instrument } from "../watchList/watchList.entity";
import { SourceService } from "../source/source.service";
import { CandleService } from "../candle/candle.service";
import { SourceName } from "../source/source.entity";
import axios from "axios";
import Binance from "node-binance-api";
import { Candle, Interval } from "../candle/candle.types";

@Injectable()
export class BinanceService {
  instrumentsList: string[] = [];
  instance?: Binance;

  constructor(
    private readonly sourceService: SourceService,
    private readonly candleService: CandleService
  ) {
    this.updateInstance();
  }

  checkInstance() {
    if (!this.instance) {
      return new HttpException(
        "Please add binance api secret key.",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async updateInstance() {
    this.instance = null;
    const binance = await this.sourceService.find(SourceName.Binance);

    if (binance) {
      this.instance = new Binance().options({
        APIKEY: binance.key,
        APISECRET: binance.secret,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        log: () => {},
      });
    }
  }

  async searchInstrument(ticker: string) {
    const instanceError = this.checkInstance();
    if (instanceError) return [];

    if (this.instrumentsList.length === 0) {
      const { data } = await axios({
        url: "https://www.binance.com/bapi/asset/v2/public/asset-service/product/get-products",
        method: "get",
      });

      this.instrumentsList = data.data.map((item) => item.s);
    }

    return this.instrumentsList
      .filter((item) => item.toLowerCase().startsWith(ticker.toLowerCase()))
      .map((item) => {
        const instrument = new Instrument();
        instrument.ticker = item;
        instrument.source = SourceName.Binance;
        return instrument;
      });
  }

  async candles({
    ticker,
    to = new Date().toISOString(),
    interval = Interval.DAY,
  }: {
    ticker: Instrument["ticker"];
    interval?: Interval;
    to?: string;
  }) {
    const binanceInterval = this.mapInterval(interval);
    if (!this.checkIntervalSupport(interval))
      throw new Error("Unsupported interval");

    const data = await this.instance.candlesticks(
      ticker,
      binanceInterval,
      false,
      {
        limit: 500,
        endTime: new Date(to).getTime(),
      }
    );

    return data.map(this.mapCandle);
  }

  checkIntervalSupport(interval: Interval) {
    const supportedIntervals = [
      Interval.MIN1,
      Interval.MIN3,
      Interval.MIN5,
      Interval.MIN10,
      Interval.MIN15,
      Interval.MIN30,
      Interval.HOUR,
      Interval.HOUR2,
      Interval.HOUR4,
      Interval.HOUR6,
      Interval.HOUR8,
      Interval.HOUR12,
      Interval.DAY,
      Interval.DAY3,
      Interval.WEEK,
      Interval.MONTH,
    ];
    return supportedIntervals.includes(interval);
  }

  mapInterval(interval: Interval) {
    const intervals = {
      [Interval.MIN1]: "1m",
      [Interval.MIN3]: "3m",
      [Interval.MIN5]: "5m",
      [Interval.MIN10]: "10m",
      [Interval.MIN15]: "15m",
      [Interval.MIN30]: "30m",
      [Interval.HOUR]: "1h",
      [Interval.HOUR2]: "2h",
      [Interval.HOUR4]: "4h",
      [Interval.HOUR6]: "6h",
      [Interval.HOUR8]: "8h",
      [Interval.HOUR12]: "12h",
      [Interval.DAY]: "1d",
      [Interval.DAY3]: "3d",
      [Interval.WEEK]: "1w",
      [Interval.MONTH]: "1M",
    };

    return intervals[interval];
  }

  mapCandle(candle: any[]): Candle {
    const [time, open, high, low, close, volume] = candle;

    return {
      time: time,
      timestamp: new Date(time).getTime(),
      open,
      high,
      low,
      close,
      volume,
    };
  }
}
