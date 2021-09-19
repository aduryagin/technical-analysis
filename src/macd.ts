import { EMA } from "./ema";
import { Candle, Cross } from "./types";

export interface MACDInput {
  candles: Candle[];
  fastLength?: number;
  slowLength?: number;
  signalSmoothing?: number;
}
export type MACDCross = Cross & { name: "histogram" | "signal" };
export interface MACDResultItem {
  time: Candle["time"];
  histogram: number;
  macd: number;
  signal: number;
  candle: Candle;
  cross: MACDCross | null;
  histogramState: "growAbove" | "fallAbove" | "growBelow" | "fallBelow";
}

export function MACD({
  candles,
  fastLength = 12,
  slowLength = 26,
  signalSmoothing = 9,
}: MACDInput) {
  let crossResult: MACDCross[] = [];
  const result = new Map<Candle["time"], MACDResultItem>();
  const fastMa = EMA({ candles: [], period: fastLength });
  const slowMa = EMA({ candles: [], period: slowLength });
  const signalMa = EMA({ candles: [], period: signalSmoothing });
  const histogramHistory = [];

  function calculate(candle: Candle): MACDResultItem | undefined {
    const fastMaResult = fastMa.update(candle);
    const slowMaResult = slowMa.update(candle);

    if (!fastMaResult || !slowMaResult) return;

    const macd = fastMaResult.value - slowMaResult.value;
    const signalMaResult = signalMa.update({
      ...candle,
      close: macd,
    });

    if (!signalMaResult) return;

    const hist = macd - signalMaResult.value;
    if (!histogramHistory[0]) {
      histogramHistory[0] = hist;
      return;
    }

    let histogramState: MACDResultItem["histogramState"] =
      histogramHistory[0] < hist ? "growBelow" : "fallBelow";
    if (hist >= 0)
      histogramState = histogramHistory[0] < hist ? "growAbove" : "fallAbove";

    histogramHistory[0] = hist;

    // check cross
    let cross: MACDCross = null;
    if (result.size >= 1) {
      const prevResult = Array.from(result.values()).pop();
      const longSignal =
        prevResult.signal >= prevResult.macd && signalMaResult.value < macd;
      const shortSignal =
        prevResult.signal <= prevResult.macd && signalMaResult.value > macd;
      if (longSignal || shortSignal) {
        cross = {
          long: longSignal,
          name: "signal",
          time: candle.time,
        };
        crossResult.push(cross);
      } else {
        const long =
          (prevResult.histogramState === "fallAbove" &&
            histogramState === "growAbove") ||
          (prevResult.histogramState === "fallBelow" &&
            histogramState === "growBelow");
        const short =
          (prevResult.histogramState === "growAbove" &&
            histogramState === "fallAbove") ||
          (prevResult.histogramState === "growBelow" &&
            histogramState === "fallBelow");

        if (long || short) {
          cross = {
            long: long,
            name: "histogram",
            time: candle.time,
          };
          crossResult.push(cross);
        }
      }
    }

    return {
      macd,
      histogram: hist,
      signal: signalMaResult.value,
      histogramState,
      candle,
      time: candle.time,
      cross,
    };
  }

  candles.forEach((item) => {
    const res = calculate(item);
    if (res) result.set(item.time, res);
  });

  return {
    cross: () => crossResult,
    result: (time?: Candle["time"]) => {
      if (time) return result.get(time);
      return result;
    },
    update: (candle: Candle) => {
      const prevResult = Array.from(result.values()).pop();

      // handle bad stream values
      if (result.size && prevResult.time > candle.time) {
        return prevResult;
      }

      if (result.size && prevResult.time === candle.time) {
        if (
          crossResult.length &&
          crossResult[crossResult.length - 1].time === candle.time
        ) {
          crossResult = crossResult.slice(0, -1);
        }

        result.delete(candle.time);
        histogramHistory[0] = Array.from(result.values()).slice(-2)[0];
      }

      const item = calculate(candle);
      if (item) result.set(candle.time, item);

      return item;
    },
  };
}
