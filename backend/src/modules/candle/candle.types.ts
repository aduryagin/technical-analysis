import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Instrument } from "../watchList/watchList.entity";

@ObjectType()
export class Candle {
  @Field()
  time: string;

  @Field()
  timestamp: number;

  @Field()
  close: number;

  @Field()
  open: number;

  @Field()
  high: number;

  @Field()
  low: number;

  @Field()
  volume: number;
}

@ObjectType()
export class CandleSubscriptionData {
  @Field()
  candle: Candle;

  @Field()
  instrument: Instrument;
}

export enum Interval {
  "MIN1" = "1min", // tinkoff, binance
  "MIN2" = "2min", // tinkoff
  "MIN3" = "3min", // tinkoff, binance
  "MIN5" = "5min", // tinkoff, binance
  "MIN10" = "10min", // tinkoff
  "MIN15" = "15min", // tinkoff, binance
  "MIN30" = "30min", // tinkoff, binance
  "HOUR" = "hour", // tinkoff, binance
  "HOUR2" = "2hour", // binance
  "HOUR4" = "4hour", // binance
  "HOUR6" = "6hour", // binance
  "HOUR8" = "8hour", // binance
  "HOUR12" = "12hour", // binance
  "DAY" = "day", // tinkoff, binance
  "DAY3" = "day3", // binance
  "WEEK" = "week", // tinkoff, binance
  "MONTH" = "month", // tinkoff, binance
}
registerEnumType(Interval, {
  name: "Interval",
});
