import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Shape } from "./shape.entity";

@Injectable()
export class ShapeService {
  constructor(
    @InjectRepository(Shape)
    private shapeRepository: Repository<Shape>
  ) {}

  shapes(shape: Partial<Shape>) {
    return this.shapeRepository.find({
      ticker: shape.ticker,
    });
  }

  async addShape(shape: Partial<Shape>) {
    return this.shapeRepository.save(this.shapeRepository.create(shape));
  }

  async updateShape(shape: Partial<Shape>) {
    const exist = await this.shapeRepository.findOne({
      id: shape.id,
    });

    return this.shapeRepository.save({ ...exist, ...shape });
  }

  async removeShape(id: Shape["id"]) {
    return this.shapeRepository.delete({
      id,
    });
  }
}
