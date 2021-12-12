import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { BinanceModule } from "./modules/binance/binance.module";

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: "schema.gql",
      installSubscriptionHandlers: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    BinanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
