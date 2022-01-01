import { Injectable } from "@nestjs/common";
import Axios from "axios";
import cheerio from "cheerio";
import { format } from "date-fns";
import { Instrument } from "../watchList/watchList.entity";
import { TradingViewIdea } from "./tradingview.types";

@Injectable()
export class TradingViewService {
  async ideas(ticker: Instrument["ticker"]): Promise<TradingViewIdea[]> {
    const { status, data } = await Axios.get(
      `https://www.tradingview.com/symbols/${ticker}/`
    );

    if (status !== 200) return [];

    const $ = cheerio.load(data);
    const cards = $(".tv-feed-layout__card-item").toArray();
    const result = [];

    cards.forEach((card) => {
      const link = `https://tradingview.com${$(card)
        .find(".tv-widget-idea__title-row a")
        .attr("href")
        .trim()}`;
      const title = $(card).find(".tv-widget-idea__title-row").text().trim();
      const timeframe = $(
        $(card).find(".tv-widget-idea__timeframe").toArray()[1]
      ).text();
      const type = $(card).find(".tv-idea-label").text().trim();
      const pureDate = new Date(
        parseInt($(card).find(".tv-card-stats__time").attr("data-timestamp")) *
          1000
      );
      const date = format(pureDate, "d LLL");
      const likes = $(card)
        .find(".tv-social-row__start .tv-card-social-item__count")
        .text();
      const comments = $(card)
        .find(".tv-social-row__end .tv-card-social-item__count")
        .text();

      result.push({
        title,
        link,
        timeframe,
        type,
        date,
        likes,
        comments,
        pureDate,
      });
    });

    return result.sort((a, b) => b.pureDate - a.pureDate);
  }
}
