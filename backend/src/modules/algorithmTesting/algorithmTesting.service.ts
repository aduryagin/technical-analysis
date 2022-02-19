import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Instrument } from "../watchList/watchList.entity";
import { AlgorithmTrade } from "./algorithmTesting.entity";

@Injectable()
export class AlgorithmTestingService {
  constructor(
    @InjectRepository(AlgorithmTrade)
    private tradeRepository: Repository<AlgorithmTrade>
  ) {}

  trades() {
    return this.tradeRepository.find({
      relations: ["instrument"],
    });
  }

  trade(id: AlgorithmTrade["id"]) {
    return this.tradeRepository.findOne({
      where: {
        id,
      },
      relations: ["instrument"],
    });
  }

  lastActiveTrade(id: Instrument["id"]) {
    return this.tradeRepository.findOne({
      instrument: {
        id: id,
      },
      closed: false,
    });
  }

  removeTrades(id: Instrument["id"]) {
    return this.tradeRepository.delete({
      instrument: {
        id,
      },
    });
  }

  removeTrade(id: Instrument["id"]) {
    return this.tradeRepository.delete(id);
  }

  async addTrade(trade: Partial<AlgorithmTrade>) {
    return this.tradeRepository.save(this.tradeRepository.create(trade));
  }

  async closeTrade(
    id: AlgorithmTrade["id"],
    closePrice: AlgorithmTrade["closePrice"]
  ) {
    const trade = await this.tradeRepository.findOne({
      where: { id },
    });
    trade.closePrice = closePrice;
    trade.closed = true;
    trade.closeDate = new Date().toISOString();

    return this.tradeRepository.save(trade);
  }
}
