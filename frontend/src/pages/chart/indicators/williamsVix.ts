import THEME from "../../../theme";
import { ExtendedTechnicalIndicatorTemplate } from "./types";

const worker = new Worker(new URL("./williamsVixWorker.ts", import.meta.url));

const williamsVixIndicatorTemplate: ExtendedTechnicalIndicatorTemplate = {
  name: "WVX",
  label: "Williams VIX",

  calcParams: [
    { value: 22, label: "Look Back Period StDev High" },
    { value: 20, label: "BB Length" },
    { value: 2, label: "BB Standard Deviation Up" },
    { value: 50, label: "Lookback Period Percentile High" },
    { value: 0.85, allowDecimal: true, label: "Highest Percentile" },
    { value: 1.01, allowDecimal: true, label: "Lowest Percentile" },
  ],

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
  calcTechnicalIndicator: (kLineDataList: any, { params }: any) => {
    return new Promise((resolve) => {
      worker.postMessage({
        candles: kLineDataList,
        lookBackPeriodStDevHigh: params[0],
        bbLength: params[1],
        bbStandardDeviationUp: params[2],
        lookBackPeriodPercentileHigh: params[3],
        highestPercentile: params[4],
        lowestPercentile: params[5],
      });

      worker.onmessage = ({ data }) => {
        resolve(data || []);
      };
    });
  },
};

export default williamsVixIndicatorTemplate;
