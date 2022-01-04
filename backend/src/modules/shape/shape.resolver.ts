import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { Shape } from "./shape.entity";
import { ShapeService } from "./shape.service";
import { AddShapeInput, UpdateShapeInput } from "./shape.types";

@Resolver()
export class ShapeResolver {
  constructor(private readonly shapeService: ShapeService) {}

  @Mutation(() => Shape)
  async addShape(
    @Args("input", { type: () => AddShapeInput }) input: AddShapeInput
  ) {
    const shape = await this.shapeService.addShape({
      ...input,
      points: JSON.stringify(input.points),
    });

    return { ...shape, points: JSON.parse(shape.points) };
  }

  @Mutation(() => Shape)
  async updateShape(
    @Args("input", { type: () => UpdateShapeInput })
    input: UpdateShapeInput
  ) {
    return this.shapeService.updateShape({
      ...input,
      points: JSON.stringify(input.points),
    });
  }

  @Mutation(() => Boolean)
  async removeShape(@Args("id") id: number) {
    await this.shapeService.removeShape(id);
    return true;
  }

  @Query(() => [Shape])
  async shapes(@Args("ticker", { type: () => String }) ticker: string) {
    const shapes = await this.shapeService.shapes({ ticker });

    return shapes.map((shape) => {
      return {
        ...shape,
        points: JSON.parse(shape.points),
      };
    });
  }
}
