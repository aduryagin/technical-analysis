import { Field, ObjectType } from "@nestjs/graphql";

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
