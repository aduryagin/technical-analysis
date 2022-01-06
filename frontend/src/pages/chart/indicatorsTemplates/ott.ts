import { TechnicalIndicatorTemplate } from "klinecharts";
import { OTT } from "@aduryagin/technical-indicators";
import { OTTResultItem } from "@aduryagin/technical-indicators/src/ott";

const ottIndicatorTemplate: TechnicalIndicatorTemplate = {
  calcParams: [
    { value: 2, allowDecimal: true },
    { value: 1.4, allowDecimal: true },
  ],

  name: "OTT",
  precision: 0,
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
  calcTechnicalIndicator: (kLineDataList: any, { params, plots }: any) => {
    const data = OTT({
      candles: kLineDataList,
      period: params[0],
      percent: params[1],
    });

    const indicatorResult = Array.from<[number, OTTResultItem]>(
      data?.result() as any
    )?.map((item) => ({
      ...item[1],
    }));

    return [
      ...Array(kLineDataList.length - indicatorResult.length).fill({}),
      ...indicatorResult,
    ];
  },
};

export default ottIndicatorTemplate;
