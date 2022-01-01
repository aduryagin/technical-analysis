import { Module } from "@nestjs/common";
import { TradingViewResolver } from "./tradingview.resolver";
import { TradingViewService } from "./tradingview.service";

@Module({
  imports: [],
  providers: [TradingViewResolver, TradingViewService],
  exports: [],
})
export class TradingViewModule {}
