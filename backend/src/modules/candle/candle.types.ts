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
  "MIN1" = "1min",
  "MIN2" = "2min",
  "MIN3" = "3min",
  "MIN5" = "5min",
  "MIN10" = "10min",
  "MIN15" = "15min",
  "MIN30" = "30min",
  "HOUR" = "hour",
  // tinkoff doesn't support it
  // "HOUR2" = "2hour",
  // "HOUR4" = "4hour",
  "DAY" = "day",
  "WEEK" = "week",
  "MONTH" = "month",
}
registerEnumType(Interval, {
  name: "Interval",
});
