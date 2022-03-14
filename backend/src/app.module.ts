import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AlgorithmTestingModule } from "./modules/algorithmTesting/algorithmTesting.module";
import { BinanceModule } from "./modules/binance/binance.module";
import { CandleModule } from "./modules/candle/candle.module";
import { IndicatorModule } from "./modules/indicator/indicator.module";
import { ShapeModule } from "./modules/shape/shape.module";
import { SourceModule } from "./modules/source/source.module";
import { TinkoffModule } from "./modules/tinkoff/tinkoff.module";
import { TipRanksModule } from "./modules/tipranks/tipranks.module";
import { TradingViewModule } from "./modules/tradingview/tradingview.module";
import { WatchListModule } from "./modules/watchList/watchList.module";

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: "schema.gql",
      installSubscriptionHandlers: true,
    }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "database.sqlite",
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TinkoffModule,
    WatchListModule,
    TradingViewModule,
    TipRanksModule,
    IndicatorModule,
    ShapeModule,
    AlgorithmTestingModule,
    SourceModule,
    CandleModule,
    BinanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
