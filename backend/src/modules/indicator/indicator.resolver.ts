import { Args, Query, Mutation, Resolver } from "@nestjs/graphql";
import { Indicator } from "./indicator.entity";
import { IndicatorService } from "./indicator.service";
import { AddIndicatorInput, UpdateIndicatorInput } from "./indicator.types";

@Resolver()
export class IndicatorResolver {
  constructor(private readonly indicatorService: IndicatorService) {}

  @Mutation(() => Indicator)
  async addIndicator(
    @Args("input", { type: () => AddIndicatorInput }) input: AddIndicatorInput
  ) {
    return this.indicatorService.addIndicator(input);
  }

  @Mutation(() => Indicator)
  async updateIndicator(
    @Args("input", { type: () => UpdateIndicatorInput })
    input: UpdateIndicatorInput
  ) {
    return this.indicatorService.updateIndicator(input);
  }

  @Mutation(() => Boolean)
  async removeIndicator(@Args("id") id: number) {
    await this.indicatorService.removeIndicator(id);
    return true;
  }

  @Query(() => [Indicator])
  async indicators() {
    const indicators = await this.indicatorService.indicators();

    return indicators.map((indicator) => {
      return {
        ...indicator,
        settings: indicator.settings
          ? indicator.settings.split(",")
          : indicator.settings,
      };
    });
  }
}
