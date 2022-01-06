import { TechnicalIndicatorTemplate } from "klinecharts";
import { PMax } from "@aduryagin/technical-indicators";
import { PMaxResultItem } from "@aduryagin/technical-indicators/src/pmax";

const pmaxIndicatorTemplate: TechnicalIndicatorTemplate = {
  calcParams: [10, 10, { value: 3, allowDecimal: true }],

  name: "PMAX",
  precision: 0,
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

    const indicatorResult = Array.from<[number, PMaxResultItem]>(
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

export default pmaxIndicatorTemplate;
