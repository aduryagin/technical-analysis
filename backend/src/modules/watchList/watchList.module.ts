import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TinkoffModule } from "../tinkoff/tinkoff.module";
import { Instrument } from "./watchList.entity";
import { WatchListResolver } from "./watchList.resolver";
import { WatchListService } from "./watchList.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Instrument]),
    forwardRef(() => TinkoffModule),
  ],
  providers: [WatchListResolver, WatchListService],
  exports: [WatchListService],
})
export class WatchListModule {}
