import { ExtendedTechnicalIndicatorTemplate } from "./types";

const worker = new Worker(new URL("./pmaxWorker.ts", import.meta.url));

const pmaxIndicatorTemplate: ExtendedTechnicalIndicatorTemplate = {
  name: "PMAX",
  label: "Profit Maximizer",

  options: {
    id: "candle_pane",
  },

  calcParams: [
    { value: 1, allowDecimal: true, label: "Multiplier" },
    { value: 3, allowDecimal: true, label: "Multiplier" },
    { value: 5, allowDecimal: true, label: "Multiplier" },
  ],

  series: "normal",
  plots: [
    {
      key: "pmax1",
      title: "PMax 1",
      type: "line",
    },
    {
      key: "pmax3",
      title: "PMax 3",
      type: "line",
    },
    {
      key: "pmax5",
      title: "PMax 5",
      type: "line",
    },
  ],

  regeneratePlots: (params) => {
    return params.map((p) => {
      return { key: `pmax${p}`, title: `PMax ${p}: `, type: "line" };
    });
  },

  // Calculation results
  calcTechnicalIndicator: (kLineDataList: any, { params }: any) => {
    return new Promise((resolve) => {
      worker.postMessage({
        candles: kLineDataList,
        emaPeriod: 10,
        atrPeriod: 10,
        params,
      });

      worker.onmessage = ({ data }) => {
        resolve(data || []);
      };
    });
  },
};

export default pmaxIndicatorTemplate;
