import { TechnicalIndicatorTemplate } from "klinecharts";

const worker = new Worker(new URL("./vwapWorker.ts", import.meta.url));

const vwapIndicatorTemplate: TechnicalIndicatorTemplate = {
  name: "VWAP",
  series: "normal",
  plots: [
    {
      key: "value",
      title: "VWAP",
      type: "line",
    },
  ],

  calcTechnicalIndicator: async (kLineDataList: any) => {
    return new Promise((resolve) => {
      worker.postMessage(kLineDataList);

      worker.onmessage = ({ data }) => {
        resolve(data || []);
      };
    });
  },
};

export default vwapIndicatorTemplate;
