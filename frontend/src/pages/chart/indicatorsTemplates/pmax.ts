import { TechnicalIndicatorTemplate } from "klinecharts";
import { PMax } from "@aduryagin/technical-indicators";

const pmaxIndicatorTemplate: TechnicalIndicatorTemplate = {
  calcParams: [10, 10, { value: 3, allowDecimal: true }],

  name: "PMAX",
  series: "normal",
  plots: [
    {
      key: "pmax",
      title: "PMax",
      type: "line",
    },
    {
      key: "ema",
      title: "EMA",
      type: "line",
    },
  ],

  // Calculation results
  calcTechnicalIndicator: (kLineDataList: any, { params, plots }: any) => {
    const data = PMax({
      candles: kLineDataList,
      emaPeriod: params[0],
      atrPeriod: params[1],
      multiplier: params[2],
    });

    return kLineDataList.map((candle: any) => data?.result(candle.time));
  },
};

export default pmaxIndicatorTemplate;
