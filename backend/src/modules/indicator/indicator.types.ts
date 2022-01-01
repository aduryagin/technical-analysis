import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class AddIndicatorInput {
  @Field(() => String)
  name: string;
}
