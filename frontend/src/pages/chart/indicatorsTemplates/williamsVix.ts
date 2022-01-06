import { TechnicalIndicatorTemplate } from "klinecharts";
import { WilliamsVix } from "@aduryagin/technical-indicators";
import { WilliamsVixResultItem } from "@aduryagin/technical-indicators/src/williamsVix";
import THEME from "../../../theme";

const williamsVixIndicatorTemplate: TechnicalIndicatorTemplate = {
  calcParams: [
    22,
    20,
    2,
    50,
    { value: 0.85, allowDecimal: true },
    { value: 1.01, allowDecimal: true },
  ],

  name: "WVX",
  precision: 0,
  series: "normal",
  plots: [
    {
      key: "wvf",
      title: "Williams Vix",
      type: "bar",
      color: (data) => {
        return data.current?.technicalIndicatorData?.isBuyZone
          ? THEME.colors.chart.green
          : "rgba(0,0,0,0.3)";
      },
      isStroke: (data) => {
        return !data.current?.technicalIndicatorData?.isBuyZone;
      },
    },
  ],

  // Calculation results
  calcTechnicalIndicator: (kLineDataList: any, { params, plots }: any) => {
    const data = WilliamsVix({
      candles: kLineDataList,
      lookBackPeriodStDevHigh: params[0],
      bbLength: params[1],
      bbStandardDeviationUp: params[2],
      lookBackPeriodPercentileHigh: params[3],
      highestPercentile: params[4],
      lowestPercentile: params[5],
    });

    const indicatorResult = Array.from<[number, WilliamsVixResultItem]>(
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

export default williamsVixIndicatorTemplate;
