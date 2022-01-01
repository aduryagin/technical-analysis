import { Args, Query, Resolver } from "@nestjs/graphql";
import { TipRanksService } from "./tipranks.service";
import { TipRanksInfo } from "./tipranks.types";

@Resolver()
export class TipRanksResolver {
  constructor(private readonly tipranksService: TipRanksService) {}

  @Query(() => TipRanksInfo)
  async tipRanksInfo(@Args("ticker", { type: () => String }) ticker: string) {
    return this.tipranksService.info(ticker);
  }
}
