import { TechnicalIndicatorTemplate } from "klinecharts";

const volumeIndicatorTemplate: TechnicalIndicatorTemplate = {
  name: "SVOL",
  series: "volume",
  shouldCheckParamCount: false,
  shouldFormatBigNumber: true,
  precision: 0,
  minValue: 0,
  plots: [
    {
      key: "volume",
      title: "VOLUME: ",
      type: "bar",
      baseValue: 0,
      color: (data, options) => {
        const kLineData: any = data.current.kLineData || {};
        if (kLineData.close > kLineData.open) {
          return options.bar.upColor;
        } else if (kLineData.close < kLineData.open) {
          return options.bar.downColor;
        }
        return options.bar.noChangeColor;
      },
    },
  ],
  calcTechnicalIndicator: async (dataList) => {
    return dataList;
  },
};

export default volumeIndicatorTemplate;
