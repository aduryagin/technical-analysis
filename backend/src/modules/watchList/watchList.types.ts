import { InputType, Field } from "@nestjs/graphql";
import { SourceName } from "../source/source.entity";

@InputType()
export class WatchInput {
  @Field(() => String)
  ticker: string;

  @Field(() => String, { nullable: true })
  figi?: string;

  @Field(() => String)
  source: SourceName;
}
