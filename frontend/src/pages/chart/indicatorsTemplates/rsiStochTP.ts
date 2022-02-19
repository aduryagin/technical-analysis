import { TechnicalIndicatorTemplate } from "../../../KLineChart/types";
import THEME from "../../../theme";

const worker = new Worker(new URL("./rsiStochTPWorker.ts", import.meta.url));

const rsiStochTPIndicatorTemplate: TechnicalIndicatorTemplate = {
  calcParams: [
    { value: 14, allowDecimal: true },
    { value: 3, allowDecimal: true },
  ],

  name: "RSTP",
  series: "normal",
  plots: [
    {
      key: "tp",
      title: "RSI & Stochastic Take Profit Signal",
      type: "bar",
      color: (data) => {
        if (data.current?.technicalIndicatorData?.cross?.long === true)
          return THEME.colors.chart.green;
        if (data.current?.technicalIndicatorData?.cross?.long === false)
          return THEME.colors.chart.red;

        return "rgba(0,0,0,0.3)";
      },
      isStroke: (data) => {
        return data.current?.technicalIndicatorData?.cross?.long === undefined;
      },
    },
  ],

  // Calculation results
  calcTechnicalIndicator: (kLineDataList: any, { params }: any) => {
    return new Promise((resolve) => {
      worker.postMessage({
        candles: kLineDataList,
        period: params[0],
        kSmoothing: params[1],
      });

      worker.onmessage = ({ data }) => {
        resolve(data || []);
      };
    });
  },
};

export default rsiStochTPIndicatorTemplate;
