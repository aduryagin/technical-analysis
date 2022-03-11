import { Injectable } from "@nestjs/common";
import {
  CandleStreaming,
  Candle as TinkoffCandle,
} from "@tinkoff/invest-openapi-js-sdk";
import { Candle } from "./candle.types";

@Injectable()
export class CandleService {
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
