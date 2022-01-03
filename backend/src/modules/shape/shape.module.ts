import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Shape } from "./shape.entity";
import { ShapeResolver } from "./shape.resolver";
import { ShapeService } from "./shape.service";

@Module({
  imports: [TypeOrmModule.forFeature([Shape])],
  providers: [ShapeResolver, ShapeService],
  exports: [],
})
export class ShapeModule {}
