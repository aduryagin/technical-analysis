import { TechnicalIndicatorTemplate } from "../../../KLineChart/types";
import config from "../../../config";

const vwapIndicatorTemplate: TechnicalIndicatorTemplate = {
  name: "VWAP",
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
