import config from "../../../config";
import { ExtendedTechnicalIndicatorTemplate } from "./types";

const volumeIndicatorTemplate: ExtendedTechnicalIndicatorTemplate = {
  name: "SVOL",
  label: "Volume Range",
  series: "volume",
  shouldCheckParamCount: false,
  shouldFormatBigNumber: true,
  precision: 0,
  minValue: 0,

  options: {},

  calcParams: [
    { value: 610, allowDecimal: true, label: "MA Period" },
    { value: 610, allowDecimal: true, label: "STD Period" },
    { value: 4, allowDecimal: true, label: "Extra High Volume Threshold" },
    { value: 2.5, allowDecimal: true, label: "High Volume Threshold" },
    { value: 1, allowDecimal: true, label: "Medium Volume Threshold" },
    { value: -0.5, allowDecimal: true, label: "Normal Volume Threshold" },
  ],

  plots: [
    {
      key: "Volume",
      title: "VOLUME: ",
      type: "bar",
      baseValue: 0,
      color: (data) => {
        const kLineData: any = data.current.technicalIndicatorData || {};

        if (kLineData.Volume >= kLineData.extra_high) {
          return "#ff0000";
        } else if (kLineData.Volume >= kLineData.high) {
          return "#ff7800";
        } else if (kLineData.Volume >= kLineData.medium) {
          return "#ffcf03";
        } else if (kLineData.Volume >= kLineData.normal) {
          return "#a0d6dc";
        }

        return "#1f9cac";
      },
    },
    {
      key: "extra_high",
      title: "extra high",
      type: "line",
    },
    {
      key: "high",
      title: "high",
      type: "line",
    },
    {
      key: "medium",
      title: "medium",
      type: "line",
    },
    {
      key: "normal",
      title: "normal",
      type: "line",
    },
  ],

  calcTechnicalIndicator: async (kLineDataList, options) => {
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
              name: "heatmap_volume",
              parameters: {
                ma_length: options.params[0],
                std_length: options.params[1],
                extra_high_volume_threshold: options.params[2],
                high_volume_threshold: options.params[3],
                medium_volume_threshold: options.params[4],
                normal_volume_threshold: options.params[5],
              },
            },
          }),
        });

        const data = await response.json();

        return resolve(data);
      }
    });
  },
};

export default volumeIndicatorTemplate;
