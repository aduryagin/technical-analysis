import config from "../../../config";
import { ExtendedTechnicalIndicatorTemplate } from "./types";

const vwapIndicatorTemplate: ExtendedTechnicalIndicatorTemplate = {
  name: "VWAP",
  label: "VWAP",

  options: {
    id: "candle_pane",
  },

  series: "normal",
  plots: [
    {
      key: "VWAP_D",
      title: "VWAP",
      type: "line",
    },
  ],

  calcTechnicalIndicator: async (kLineDataList: any) => {
    return new Promise(async (resolve) => {
      if (kLineDataList.length) {
        const response = await fetch(`${config.python}/indicator-calculator`, {
          method: "post",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            candles: kLineDataList,
            indicator: { name: "vwap" },
          }),
        });

        const data = await response.json();

        return resolve(data);
      }
    });
  },
};

export default vwapIndicatorTemplate;
