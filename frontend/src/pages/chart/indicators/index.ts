import { extension } from "../../../KLineChart/src";
import ottIndicatorTemplate from "./ott";
import pmaxIndicatorTemplate from "./pmax";
import pmaxRsiIndicatorTemplate from "./pmaxRsi";
import rsiStochTPIndicatorTemplate from "./rsiStochTP";
import { ExtendedTechnicalIndicatorTemplate } from "./types";
import vaderIndicatorTemplate from "./vader";
import volumeIndicatorTemplate from "./volume";
import vwapIndicatorTemplate from "./vwap";
import williamsVixIndicatorTemplate from "./williamsVix";

const standardIndicators = extension.technicalIndicatorExtensions;
export const customIndicators = [
  ottIndicatorTemplate,
  pmaxIndicatorTemplate,
  pmaxRsiIndicatorTemplate,
  rsiStochTPIndicatorTemplate,
  vaderIndicatorTemplate,
  volumeIndicatorTemplate,
  vwapIndicatorTemplate,
  williamsVixIndicatorTemplate,
];

export const INDICATORS: { [key: string]: ExtendedTechnicalIndicatorTemplate } =
  {
    [ottIndicatorTemplate.shortName]: ottIndicatorTemplate,
    ...customIndicators.reduce((accum, item) => {
      return {
        ...accum,
        [item.shortName || item.name]: item,
      };
    }, {}),
    BBI: {
      ...standardIndicators.BBI,
      name: "BBI",
      label: "Bull and Bear Index",
      options: {
        id: "candle_pane",
      },
    },
    DMA: {
      ...standardIndicators.DMA,
      name: "DMA",
    },
    DMI: {
      ...standardIndicators.DMI,
      name: "DMI",
      label: "Directional Movement Index",
    },
    EMA: {
      ...standardIndicators.EMA,
      name: "EMA",
      options: {
        id: "candle_pane",
      },
    },
    MA: {
      ...standardIndicators.MA,
      name: "MA",
      label: "Moving Average",
      options: {
        id: "candle_pane",
      },
    },
    MACD: {
      ...standardIndicators.MACD,
      name: "MACD",
    },
    SMA: {
      ...standardIndicators.SMA,
      name: "SMA",
      options: {
        id: "candle_pane",
      },
    },
    TRIX: {
      ...standardIndicators.TRIX,
      name: "TRIX",
      label: "Tripple EMA",
    },
    BRAR: {
      ...standardIndicators.BRAR,
      name: "BRAR",
      label: "Emotional index",
    },
    MTM: {
      ...standardIndicators.MTM,
      name: "MTM",
      label: "Momentum",
    },
    PSY: {
      ...standardIndicators.PSY,
      name: "PSY",
      label: "Psycological Line",
    },
    ROC: {
      ...standardIndicators.ROC,
      name: "ROC",
      label: "Rate of Change",
    },
    VR: {
      ...standardIndicators.VR,
      name: "VR",
      label: "Volume Ratio",
    },
    AO: {
      ...standardIndicators.AO,
      name: "AO",
      label: "Awesome Oscillator",
    },
    BIAS: {
      ...standardIndicators.BIAS,
      name: "BIAS",
    },
    CCI: {
      ...standardIndicators.CCI,
      name: "CCI",
      label: "Commodity Channel Index",
    },
    RSI: {
      ...standardIndicators.RSI,
      name: "RSI",
      label: "Relative Strength Index",
    },
    KDJ: {
      ...standardIndicators.KDJ,
      name: "KDJ",
    },
    WR: {
      ...standardIndicators.WR,
      name: "WR",
      label: "Williams %R",
    },
    BOLL: {
      ...standardIndicators.BOLL,
      label: "Bollinger Bands",
      name: "BOLL",
      options: {
        id: "candle_pane",
      },
    },
    SAR: {
      ...standardIndicators.SAR,
      label: "Stop and Reverse",
      name: "SAR",
      options: {
        id: "candle_pane",
      },
    },
    VOL: {
      ...standardIndicators.VOL,
      label: "Volume",
      name: "VOL",
    },
    PVT: {
      ...standardIndicators.PVT,
      label: "Price and Volume Trend",
      name: "PVT",
    },
    OBV: {
      ...standardIndicators.OBV,
      label: "On Balance Volume",
      name: "OBV",
    },
  };

export const INDICATORS_GROUPS = [
  {
    label: "Directional Movement",
    group: [
      INDICATORS.BBI,
      INDICATORS.DMA,
      INDICATORS.DMI,
      INDICATORS.EMA,
      INDICATORS.MA,
      INDICATORS.MACD,
      INDICATORS.SMA,
      INDICATORS.TRIX,
    ],
  },
  {
    label: "Momentum",
    group: [
      INDICATORS.BRAR,
      INDICATORS.MTM,
      INDICATORS.PSY,
      INDICATORS.ROC,
      INDICATORS.VR,
    ],
  },
  {
    label: "Oscillators",
    group: [
      INDICATORS.AO,
      INDICATORS.BIAS,
      INDICATORS.RSI,
      INDICATORS.KDJ,
      INDICATORS.WR,
    ],
  },
  {
    label: "Volatility",
    group: [INDICATORS.BOLL, INDICATORS.SAR],
  },
  {
    label: "Volume",
    group: [INDICATORS.VOL, INDICATORS.PVT, INDICATORS.OBV],
  },
  {
    label: "Custom",
    group: customIndicators,
  },
];
