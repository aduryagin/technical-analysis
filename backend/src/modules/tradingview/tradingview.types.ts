import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TradingViewIdea {
  @Field()
  title: string;

  @Field()
  link: string;

  @Field()
  timeframe: string;

  @Field()
  type: string;

  @Field()
  date: string;

  @Field()
  likes: number;

  @Field()
  comments: number;

  @Field()
  pureDate: string;
}
