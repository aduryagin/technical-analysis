import { TechnicalIndicatorTemplate } from "klinecharts";
import { PMaxRSI } from "@aduryagin/technical-indicators";
import { PMaxRRSIResultItem } from "@aduryagin/technical-indicators/src/pmaxRSI";

const pmaxRsiIndicatorTemplate: TechnicalIndicatorTemplate = {
  calcParams: [14, 8, { value: 0.7, allowDecimal: true }, 3, 10],

  name: "PMAXRSI",
  precision: 0,
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

    const indicatorResult = Array.from<[number, PMaxRRSIResultItem]>(
      data?.result() as any
    )?.map((item) => ({
      ...item[1],
    }));

    return [
      ...Array(kLineDataList.length - indicatorResult.length).fill({}),
      ...indicatorResult,
    ];
  },
};

export default pmaxRsiIndicatorTemplate;
