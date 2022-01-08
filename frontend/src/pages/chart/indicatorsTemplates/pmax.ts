import { TechnicalIndicatorTemplate } from "klinecharts";
import { PMax } from "@aduryagin/technical-indicators";

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
  calcTechnicalIndicator: (kLineDataList: any, { params, plots }: any) => {
    const data = params.reduce((accum, param) => {
      const pmax = PMax({
        candles: kLineDataList,
        emaPeriod: 10,
        atrPeriod: 10,
        multiplier: param,
      });

      return { ...accum, [param]: pmax };
    }, {});

    return kLineDataList.map((candle: any) => {
      return params.reduce((accum, param) => {
        return {
          ...accum,
          [`pmax${param}`]: data[param]?.result(candle.time)?.pmax,
        };
      }, {});
    });
  },
};

export default pmaxIndicatorTemplate;
