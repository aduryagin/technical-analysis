import { Args, Query, Mutation, Resolver } from "@nestjs/graphql";
import { Indicator } from "./indicator.entity";
import { IndicatorService } from "./indicator.service";
import { AddIndicatorInput } from "./indicator.types";

@Resolver()
export class IndicatorResolver {
  constructor(private readonly indicatorService: IndicatorService) {}

  @Mutation(() => Indicator)
  async addIndicator(
    @Args("input", { type: () => AddIndicatorInput }) input: AddIndicatorInput
  ) {
    return this.indicatorService.addIndicator(input);
  }

  @Mutation(() => Boolean)
  async removeIndicator(@Args("id") id: number) {
    await this.indicatorService.removeIndicator(id);
    return true;
  }

  @Query(() => [Indicator])
  async indicators() {
    return this.indicatorService.indicators();
  }
}
