import config from "../../../config";
import { ExtendedTechnicalIndicatorTemplate } from "./types";

const vaderIndicatorTemplate: ExtendedTechnicalIndicatorTemplate = {
  name: "VADER",
  label: "Vader",

  options: {},

  plots: [
    {
      key: "VaderDemand",
      title: "VaderDemand",
      type: "line",
    },
    {
      key: "VaderSupply",
      title: "VaderSupply",
      type: "line",
    },
  ],

  calcTechnicalIndicator: async (kLineDataList) => {
    return new Promise(async (resolve) => {
      if (kLineDataList.length) {
        const response = await fetch(`${config.python}/indicator-calculator`, {
          method: "post",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            candles: kLineDataList,
            indicator: {
              name: "vader",
            },
          }),
        });

        const data = await response.json();

        return resolve(data);
      }
    });
  },
};

export default vaderIndicatorTemplate;
