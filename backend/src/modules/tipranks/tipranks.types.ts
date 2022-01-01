import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TipRanksInfo {
  @Field()
  priceTarget: number;

  @Field()
  priceTargetHigh: number;

  @Field()
  priceTargetLow: number;

  @Field()
  ratingBuy: number;

  @Field()
  ratingHold: number;

  @Field()
  ratingSell: number;

  @Field()
  stockScore: number;

  @Field()
  newsSentimentBullishPercent: number;

  @Field()
  newsSentimentBearishPercent: number;

  @Field()
  lastWeekBuyNews: number;

  @Field()
  lastWeekSellNews: number;

  @Field()
  lastWeekNeutralNews: number;
}
