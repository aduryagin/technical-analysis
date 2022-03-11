import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TinkoffModule } from "../tinkoff/tinkoff.module";
import { Source } from "./source.entity";
import { SourceResolver } from "./source.resolver";
import { SourceService } from "./source.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Source]),
    forwardRef(() => TinkoffModule),
  ],
  providers: [SourceService, SourceResolver],
  exports: [SourceService],
})
export class SourceModule {}
