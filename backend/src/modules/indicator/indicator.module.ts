import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Indicator } from "./indicator.entity";
import { IndicatorResolver } from "./indicator.resolver";
import { IndicatorService } from "./indicator.service";

@Module({
  imports: [TypeOrmModule.forFeature([Indicator])],
  providers: [IndicatorService, IndicatorResolver],
  exports: [],
})
export class IndicatorModule {}
