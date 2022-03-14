import { Module } from "@nestjs/common";
import { BinanceModule } from "../binance/binance.module";
import { SourceModule } from "../source/source.module";
import { TinkoffModule } from "../tinkoff/tinkoff.module";
import { WatchListModule } from "../watchList/watchList.module";
import { CandleResolver } from "./candle.resolver";
import { CandleService } from "./candle.service";

@Module({
  imports: [TinkoffModule, SourceModule, WatchListModule, BinanceModule],
  providers: [CandleResolver, CandleService],
  exports: [CandleService],
})
export class CandleModule {}
