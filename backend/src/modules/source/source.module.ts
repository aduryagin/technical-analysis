import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Source } from "./source.entity";
import { SourceResolver } from "./source.resolver";
import { SourceService } from "./source.service";

@Module({
  imports: [TypeOrmModule.forFeature([Source])],
  providers: [SourceService, SourceResolver],
  exports: [],
})
export class SourceModule {}
