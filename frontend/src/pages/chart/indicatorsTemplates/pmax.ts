import { TechnicalIndicatorTemplate } from "../../../KLineChart/types";

const worker = new Worker(new URL("./pmaxWorker.ts", import.meta.url));

const pmaxIndicatorTemplate: TechnicalIndicatorTemplate = {
  calcParams: [
    { value: 1, allowDecimal: true },
    { value: 3, allowDecimal: true },
    { value: 5, allowDecimal: true },
  ],

  name: "PMAX",
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
