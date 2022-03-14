import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BinanceModule } from "../binance/binance.module";
import { CandleModule } from "../candle/candle.module";
import { TinkoffModule } from "../tinkoff/tinkoff.module";
import { WatchListModule } from "../watchList/watchList.module";
import { AlgorithmTrade } from "./algorithmTesting.entity";
import { AlgorithmTestingResolver } from "./algorithmTesting.resolver";
import { AlgorithmTestingService } from "./algorithmTesting.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([AlgorithmTrade]),
    forwardRef(() => TinkoffModule),
    forwardRef(() => BinanceModule),
    forwardRef(() => CandleModule),
    forwardRef(() => WatchListModule),
  ],
  providers: [AlgorithmTestingResolver, AlgorithmTestingService],
  exports: [AlgorithmTestingResolver],
})
export class AlgorithmTestingModule {}
