import { TechnicalIndicatorTemplate } from "klinecharts";
import { WilliamsVix } from "@aduryagin/technical-indicators";
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

    return kLineDataList.map((candle: any) => data?.result(candle.time));
  },
};

export default williamsVixIndicatorTemplate;
