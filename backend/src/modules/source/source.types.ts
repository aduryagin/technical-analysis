import { InputType, Field } from "@nestjs/graphql";
import { SourceName } from "./source.entity";

@InputType()
export class AddSourceInput {
  @Field(() => SourceName)
  name: SourceName;

  @Field(() => String, { nullable: true })
  key?: string;

  @Field(() => String, { nullable: true })
  secret?: string;
}

@InputType()
export class UpdateSourceInput {
  @Field()
  id: number;

  @Field(() => String, { nullable: true })
  key?: string;

  @Field(() => String, { nullable: true })
  secret?: string;
}
