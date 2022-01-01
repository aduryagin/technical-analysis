import { COLORS } from "../../constants";

export const VOLUME_TI = {
  name: "Volume",
  minValue: 0,
  series: "volume",
  precision: 0,
  shouldFormatBigNumber: true,
  plots: [
    {
      key: "volume",
      title: "Volume",
      type: "bar",
      color: (data, options) => {
        const kLineData = data.currentData.kLineData || {};
        if (kLineData.close > kLineData.open) {
          return options.bar.upColor;
        }
        if (kLineData.close < kLineData.open) {
          return options.bar.downColor;
        }
        return options.bar.noChangeColor;
      },
    },
  ],
  calcTechnicalIndicator: (dataList) => {
    return dataList;
  },
};

export const PMAX_TI = {
  name: "PMax",
  series: "normal",
  plots: [
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
    {
      key: "pmax8",
      title: "PMax 8",
      type: "line",
    },
    {
      key: "ema",
      title: "EMA",
      type: "line",
    },
  ],
  calcTechnicalIndicator: (dataList) => {
    return dataList;
  },
};

export const PMAX_RSI_TI = {
  name: "RSI + PMax",
  precision: 0,
  series: "normal",
  plots: [
    {
      key: "pmaxRSI",
      title: "PMax",
      type: "line",
    },
    {
      key: "pmaxRSIT3",
      title: "T3",
      type: "line",
    },
    {
      key: "rsi",
      title: "RSI",
      type: "line",
    },
    {
      key: "rsiOverbought",
      title: "Overbought",
      type: "line",
    },
    {
      key: "rsiOversold",
      title: "Oversold",
      type: "line",
    },
  ],
  calcTechnicalIndicator: (dataList) => {
    return dataList;
  },
};

export const STOCHASTIC_TI = {
  name: "Stochastic",
  precision: 0,
  series: "normal",
  plots: [
    {
      key: "stochasticOverbought",
      title: "Overbought",
      type: "line",
    },
    {
      key: "stochasticOversold",
      title: "Oversold",
      type: "line",
    },
    {
      key: "stochasticMiddle",
      title: "Middle",
      type: "line",
    },
    {
      key: "stochasticK",
      title: "K",
      type: "line",
    },
    {
      key: "stochasticD",
      title: "D",
      type: "line",
    },
  ],
  calcTechnicalIndicator: (dataList) => {
    return dataList;
  },
};

export const WILLIAMS_VIX_TI = {
  name: "Williams Vix",
  precision: 0,
  series: "normal",
  plots: [
    {
      key: "williamsVix",
      title: "Williams Vix",
      type: "bar",
      color: ({ currentData: { kLineData } }) => {
        return kLineData.williamsVixIsBuyZone
          ? COLORS.chart.green
          : "rgba(0,0,0,0.3)";
      },
      isStroke: ({ currentData: { kLineData } }) => {
        return !kLineData.williamsVixIsBuyZone;
      },
    },
  ],
  calcTechnicalIndicator: (dataList) => {
    return dataList;
  },
};
