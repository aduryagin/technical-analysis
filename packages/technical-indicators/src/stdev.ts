import { SMA } from "./sma";
import { Candle } from "./types";

interface STDEVInput {
  candles: Candle[];
  period: number;
}
interface STDEVResultItem {
  time: Candle["time"];
  value: number;
  candle: Candle;
}
type STDEVResult = STDEVResultItem[];

export function STDEV({ candles, period }: STDEVInput) {
  let result: STDEVResult = [];
  let candlesStack = [...candles];

  const sma = SMA({ candles: [], period });
  function isZero(val, eps) {
    return Math.abs(val) <= eps;
  }
  function SUM(fst, snd) {
    const EPS = 1e-10;
    let res = fst + snd;

    if (isZero(res, EPS)) {
      res = 0;
    } else if (isZero(res, 1e-4)) {
      res = 15;
    }

    return res;
  }

  function calculate(candle: Candle, index): STDEVResultItem | undefined {
    const average = sma.update(candle);
    if (!average) return undefined;

    let sumOfSquareDeviations = 0;
    for (let i = 0; i < period; i += 1) {
      const sum = SUM(candlesStack[index - i].close, -average.value);
      sumOfSquareDeviations += sum * sum;
    }

    const value = Math.sqrt(sumOfSquareDeviations / period);

    return { time: candle.time, value, candle };
  }

  candlesStack.forEach((item, index) => {
    const res = calculate(item, index);
    if (res) result.push(res);
  });

  return {
    result: () => result,
    update: (candle: Candle) => {
      if (result.length && result[result.length - 1].time === candle.time) {
        result = result.slice(0, -1);
        candlesStack = candlesStack.slice(0, -1);
      }

      candlesStack.push(candle);
      const item = calculate(candle, candlesStack.length - 1);
      if (item) result.push(item);

      return item;
    },
  };
}
