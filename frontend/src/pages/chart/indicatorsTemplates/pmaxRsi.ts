import { TechnicalIndicatorTemplate } from "klinecharts";
import { PMaxRSI } from "@aduryagin/technical-indicators";

const pmaxRsiIndicatorTemplate: TechnicalIndicatorTemplate = {
  calcParams: [14, 8, { value: 0.7, allowDecimal: true }, 3, 10],

  name: "PMAXRSI",
  series: "normal",
  plots: [
    {
      key: "rsi",
      title: "RSI",
      type: "line",
    },
    {
      key: "t3",
      title: "T3",
      type: "line",
    },
    {
      key: "pmax",
      title: "PMax",
      type: "line",
    },
  ],

  // Calculation results
  calcTechnicalIndicator: (kLineDataList: any, { params, plots }: any) => {
    const data = PMaxRSI({
      candles: kLineDataList,
      rsi: {
        period: params[0],
      },
      t3: {
        period: params[1],
        volumeFactor: params[2],
      },
      atr: {
        multiplier: params[3],
        period: params[4],
      },
    });

    return kLineDataList.map((candle: any) => data?.result(candle.time));
  },
};

export default pmaxRsiIndicatorTemplate;
