import { InputType, Field } from "@nestjs/graphql";
import { Transform } from "class-transformer";

@InputType()
export class AddIndicatorInput {
  @Field(() => String)
  name: string;
}

@InputType()
export class UpdateIndicatorInput {
  @Field()
  id: number;

  @Field(() => [Number])
  @Transform(({ value }) => JSON.stringify(value), { toClassOnly: true })
  settings: string;
}
