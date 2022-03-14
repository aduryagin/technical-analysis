import { forwardRef, Module } from "@nestjs/common";
import { CandleModule } from "../candle/candle.module";
import { SourceModule } from "../source/source.module";
import { BinanceService } from "./binance.service";

@Module({
  imports: [forwardRef(() => SourceModule), forwardRef(() => CandleModule)],
  providers: [BinanceService],
  exports: [BinanceService],
})
export class BinanceModule {}
