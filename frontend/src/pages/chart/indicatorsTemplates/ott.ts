import { OTT } from "@aduryagin/technical-indicators";
import { TechnicalIndicatorTemplate } from "../../../KLineChart/types";

const ottIndicatorTemplate: TechnicalIndicatorTemplate = {
  calcParams: [
    { value: 2, allowDecimal: true },
    { value: 1.4, allowDecimal: true },
  ],

  name: "OTT",
  series: "normal",
  plots: [
    {
      key: "ott",
      title: "OTT",
      type: "line",
    },
    {
      key: "var",
      title: "VAR",
      type: "line",
    },
  ],

  // Calculation results
  calcTechnicalIndicator: (kLineDataList: any, { params }: any) => {
    const data = OTT({
      candles: kLineDataList,
      period: params[0],
      percent: params[1],
    });

    return kLineDataList.map((candle: any) => data?.result(candle.time));
  },
};

export default ottIndicatorTemplate;
