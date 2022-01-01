import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Indicator } from "./indicator.entity";

@Injectable()
export class IndicatorService {
  constructor(
    @InjectRepository(Indicator)
    private indicatorRepository: Repository<Indicator>
  ) {}

  indicators() {
    return this.indicatorRepository.find();
  }

  async addIndicator(indicator: Partial<Indicator>) {
    const exist = await this.indicatorRepository.findOne({
      name: indicator.name,
    });
    if (exist) return exist;

    return this.indicatorRepository.save(
      this.indicatorRepository.create(indicator)
    );
  }

  async removeIndicator(id: Indicator["id"]) {
    return this.indicatorRepository.delete({
      id,
    });
  }
}
