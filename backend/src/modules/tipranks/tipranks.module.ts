import { Module } from "@nestjs/common";
import { TipRanksResolver } from "./tipranks.resolver";
import { TipRanksService } from "./tipranks.service";

@Module({
  imports: [],
  providers: [TipRanksService, TipRanksResolver],
  exports: [],
})
export class TipRanksModule {}
