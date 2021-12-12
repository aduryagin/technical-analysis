import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Binance from "node-binance-api";

@Injectable()
export class BinanceService {
  binance: Binance.default;

  constructor(configService: ConfigService) {
    // @ts-expect-error library types bug
    this.binance = new Binance({
      APIKEY: configService.get("BINANCE_KEY"),
      APISECRET: configService.get("BINANCE_SERVICE"),
    });
  }
}
