import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";

@ObjectType()
export class Candle {
  @Field()
  time: number;

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

export enum Source {
  BINANCE,
}
registerEnumType(Source, {
  name: "Source",
});

@ObjectType()
export class Instrument {
  @Field()
  ticker: string;

  @Field()
  description: string;

  @Field(() => Source)
  source: Source;
}
