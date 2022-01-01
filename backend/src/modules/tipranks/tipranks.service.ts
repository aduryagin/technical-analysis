import { Injectable } from "@nestjs/common";
import Axios from "axios";
import { Instrument } from "../watchList/watchList.entity";
import { TipRanksInfo } from "./tipranks.types";

@Injectable()
export class TipRanksService {
  async info(ticker: Instrument["ticker"]): Promise<TipRanksInfo> {
    const { data } = await Axios.get(
      `https://www.tipranks.com/api/stocks/getData/?name=${ticker}`
    );
    const { data: newsData } = await Axios.get(
      `https://www.tipranks.com/api/stocks/getNewsSentiments/?ticker=${ticker}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
          cookie:
            "rbzid=TnM16lp8vVEAtCPBPWwFDes37DEsNngsh3pkQ1X+ERE2IfTRh8h5QvnRlyjpkFU5vDouhXZ9t5TuE+i70ou9JhG9cLNK8TfSUtW3WCV8wLMMhFafVMbznhuvO7/GyFSPzbztz/TZ68wnvwrbJXIlyq1nyJmRdu64sYpsXJTcDAtIs4rK5Xw2LLU9XtARsGikBBkryHRsM9x/LI8pGtwQsOO3Xs27lEquNvUMSaLn638q5jN+gMs8nomvr8LGd7/IhknSWAQy1vc0RG7IICeHsabzsueM+PjUunmj+jC5jbU=",
        },
      }
    );

    return {
      priceTarget: parseFloat(data?.ptConsensus?.[1]?.priceTarget),
      priceTargetHigh: parseFloat(data?.ptConsensus?.[1]?.high),
      priceTargetLow: parseFloat(data?.ptConsensus?.[1]?.low),
      stockScore: data?.tipranksStockScore?.score,
      ratingBuy: data?.latestRankedConsensus?.nB,
      ratingHold: data?.latestRankedConsensus?.nH,
      ratingSell: data?.latestRankedConsensus?.nS,
      newsSentimentBullishPercent: newsData?.sentiment?.bullishPercent || 0,
      newsSentimentBearishPercent: newsData?.sentiment?.bearishPercent || 0,
      lastWeekBuyNews: newsData?.counts?.[0]?.buy || 0,
      lastWeekSellNews: newsData?.counts?.[0]?.sell || 0,
      lastWeekNeutralNews: newsData?.counts?.[0]?.neutral || 0,
    };
  }
}
