import { Module } from "@nestjs/common";
import { SourceModule } from "../source/source.module";
import { TinkoffModule } from "../tinkoff/tinkoff.module";
import { WatchListModule } from "../watchList/watchList.module";
import { CandleResolver } from "./candle.resolver";
import { CandleService } from "./candle.service";

@Module({
  imports: [TinkoffModule, SourceModule, WatchListModule],
  providers: [CandleResolver, CandleService],
  exports: [CandleService],
})
export class CandleModule {}
