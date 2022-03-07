import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class AddSourceInput {
  @Field(() => String)
  name: string;

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
