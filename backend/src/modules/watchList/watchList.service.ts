import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Instrument } from "./watchList.entity";

@Injectable()
export class WatchListService {
  constructor(
    @InjectRepository(Instrument)
    private instrumentRepository: Repository<Instrument>
  ) {}

  instruments() {
    return this.instrumentRepository.find();
  }

  getInstrument(instrument: Partial<Instrument>) {
    return this.instrumentRepository.findOne(instrument);
  }

  async addInstrument(instrument: Partial<Instrument>) {
    const exist = await this.instrumentRepository.findOne({
      ticker: instrument.ticker,
    });
    if (exist) return exist;

    return this.instrumentRepository.save(
      this.instrumentRepository.create(instrument)
    );
  }

  async removeInstrument(id: Instrument["id"]) {
    return this.instrumentRepository.delete({
      id,
    });
  }
}
