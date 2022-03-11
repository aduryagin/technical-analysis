import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Source } from "./source.entity";

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(Source)
    private sourceRepository: Repository<Source>
  ) {}

  sources() {
    return this.sourceRepository.find();
  }

  find(name: string) {
    return this.sourceRepository.findOne({
      name,
    });
  }

  async addSource(source: Partial<Source>) {
    const exist = await this.sourceRepository.findOne({
      name: source.name,
    });
    if (exist) return exist;

    return this.sourceRepository.save(this.sourceRepository.create(source));
  }

  async updateSource(source: Partial<Source>) {
    const exist = await this.sourceRepository.findOne({
      name: source.name,
    });
    if (exist) return exist;

    return this.sourceRepository.save({ ...exist, ...source });
  }

  async removeSource(id: Source["id"]) {
    return this.sourceRepository.delete({
      id,
    });
  }
}
