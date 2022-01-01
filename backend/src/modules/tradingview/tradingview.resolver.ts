import { Args, Query, Resolver } from "@nestjs/graphql";
import { TradingViewService } from "./tradingview.service";
import { TradingViewIdea } from "./tradingview.types";

@Resolver()
export class TradingViewResolver {
  constructor(private readonly tradingViewService: TradingViewService) {}

  @Query(() => [TradingViewIdea])
  async tradingViewIdeas(
    @Args("ticker", { type: () => String }) ticker: string
  ) {
    return this.tradingViewService.ideas(ticker);
  }
}
