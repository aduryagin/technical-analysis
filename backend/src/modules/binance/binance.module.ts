import { Module } from "@nestjs/common";
import { BinanceResolver } from "./binance.resolver";
import { BinanceService } from "./binance.service";

@Module({
  imports: [],
  providers: [BinanceResolver, BinanceService],
  exports: [],
})
export class BinanceModule {}
