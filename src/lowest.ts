import { Candle } from "./types";

interface LowestInput {
  candles: Candle[];
  period: number;
}
interface LowestResultItem {
  time: Candle["time"];
  value: number;
}
type LowestResult = LowestResultItem[];

export function lowest({ candles, period }: LowestInput) {
  let result: LowestResult = [];
  let candlesStack = [...candles];
  let low = null;
  let prevLow = null;

  function calculate(candle: Candle, index: number): LowestResultItem {
    if (index + 1 < period) return;

    prevLow = low;
    low = Math.min(
      ...candlesStack
        .slice(index + 1 - period, index + 1)
        .reduce((accum, item) => [...accum, item.close], [])
    );

    return { time: candle.time, value: low };
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
        low = prevLow;
      }

      candlesStack.push(candle);

      const item = calculate(candle, candlesStack.length - 1);
      if (item) result.push(item);

      return item;
    },
  };
}
