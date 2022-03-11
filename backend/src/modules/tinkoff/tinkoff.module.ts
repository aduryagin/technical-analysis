import { forwardRef, Module } from "@nestjs/common";
import { CandleModule } from "../candle/candle.module";
import { SourceModule } from "../source/source.module";
import { WatchListModule } from "../watchList/watchList.module";
import { TinkoffResolver } from "./tinkoff.resolver";
import { TinkoffService } from "./tinkoff.service";

@Module({
  imports: [
    forwardRef(() => WatchListModule),
    forwardRef(() => SourceModule),
    forwardRef(() => CandleModule),
  ],
  providers: [TinkoffService, TinkoffResolver],
  exports: [TinkoffService],
})
export class TinkoffModule {}
