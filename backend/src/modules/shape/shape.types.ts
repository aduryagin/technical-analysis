import { InputType, Field, ObjectType, PartialType } from "@nestjs/graphql";

@ObjectType()
export class ShapePoint {
  @Field()
  dataIndex: number;

  @Field()
  timestamp: number;

  @Field()
  value: number;
}

@InputType()
export class SharePointInput extends PartialType(ShapePoint, InputType) {}

@InputType()
export class AddShapeInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  ticker: string;

  @Field(() => [SharePointInput])
  points: string;
}

@InputType()
export class UpdateShapeInput {
  @Field()
  id: number;

  @Field(() => [SharePointInput])
  points: string;
}
