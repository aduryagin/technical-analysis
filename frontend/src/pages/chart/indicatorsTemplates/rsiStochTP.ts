import { TechnicalIndicatorTemplate } from "klinecharts";
import { RSIStochasticTakeProfit } from "@aduryagin/technical-indicators";
import { RSIStochasticTakeProfitResultItem } from "@aduryagin/technical-indicators/src/rsiStochasticTakeProfit";
import THEME from "../../../theme";

const rsiStochTPIndicatorTemplate: TechnicalIndicatorTemplate = {
  calcParams: [
    { value: 14, allowDecimal: true },
    { value: 3, allowDecimal: true },
  ],

  name: "RSTP",
  precision: 0,
  series: "normal",
  plots: [
    {
      key: "tp",
      title: "RSI & Stochastic Take Profit Signal",
      type: "bar",
      color: (data) => {
        if (data.current?.technicalIndicatorData?.cross?.long === true)
          return THEME.colors.chart.green;
        if (data.current?.technicalIndicatorData?.cross?.long === false)
          return THEME.colors.chart.red;

        return "rgba(0,0,0,0.3)";
      },
      isStroke: (data) => {
        return data.current?.technicalIndicatorData?.cross?.long === undefined;
      },
    },
  ],

  // Calculation results
  calcTechnicalIndicator: (kLineDataList: any, { params, plots }: any) => {
    const data = RSIStochasticTakeProfit({
      candles: kLineDataList,
      period: params[0],
      kSmoothing: params[1],
    });

    const indicatorResult = Array.from<
      [number, RSIStochasticTakeProfitResultItem]
    >(data?.result() as any)?.map((item) => ({
      ...item[1],
      tp: 10,
    }));

    return [
      ...Array(kLineDataList.length - indicatorResult.length).fill({}),
      ...indicatorResult,
    ];
  },
};

export default rsiStochTPIndicatorTemplate;
