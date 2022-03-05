import { ExtendedTechnicalIndicatorTemplate } from "./types";

const worker = new Worker(new URL("./pmaxRsiWorker.ts", import.meta.url));

const pmaxRsiIndicatorTemplate: ExtendedTechnicalIndicatorTemplate = {
  name: "PMAXRSI",
  label: "RSI & PMax",

  options: {
    height: 180,
  },

  calcParams: [
    { value: 14, label: "RSI Period" },
    { value: 8, label: "T3 Period" },
    { value: 0.7, allowDecimal: true, label: "T3 Volume Factor" },
    { value: 3, allowDecimal: true, label: "ATR Multiplier" },
    { value: 10, label: "ATR Period" },
  ],

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
    {
      key: "overbought",
      title: "Overbought",
      type: "line",
    },
    {
      key: "oversold",
      title: "Oversold",
      type: "line",
    },
    {
      key: "middle",
      title: "Middle",
      type: "line",
    },
  ],

  // Calculation results
  calcTechnicalIndicator: (kLineDataList: any, { params }: any) => {
    return new Promise((resolve) => {
      worker.postMessage({
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

      worker.onmessage = ({ data }) => {
        resolve(data || []);
      };
    });
  },
};

export default pmaxRsiIndicatorTemplate;
