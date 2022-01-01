import { forwardRef, Module } from "@nestjs/common";
import { WatchListModule } from "../watchList/watchList.module";
import { TinkoffResolver } from "./tinkoff.resolver";
import { TinkoffService } from "./tinkoff.service";

@Module({
  imports: [forwardRef(() => WatchListModule)],
  providers: [TinkoffService, TinkoffResolver],
  exports: [TinkoffService],
})
export class TinkoffModule {}
