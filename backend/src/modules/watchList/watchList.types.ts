import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class WatchInput {
  @Field(() => String)
  ticker: string;

  @Field(() => String)
  figi: string;
}
