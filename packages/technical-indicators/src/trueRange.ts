import { Candle } from "./types";

interface trueRangeInput {
  candles: Candle[];
}
interface trueRangeResultItem {
  time: Candle["time"];
  value: number;
}
type trueRangeResult = trueRangeResultItem[];

export function trueRange({ candles }: trueRangeInput) {
  let result: trueRangeResult = [];
  let previousClose;
  let prevPrevClose;
  let trueRangeResult;

  function calculate(candle: Candle): trueRangeResultItem {
    if (previousClose === undefined) {
      previousClose = candle.close;
      return { time: candle.time, value: candle.high - candle.low };
    }

    trueRangeResult = Math.max(
      candle.high - candle.low,
      isNaN(Math.abs(candle.high - previousClose))
        ? 0
        : Math.abs(candle.high - previousClose),
      isNaN(Math.abs(candle.low - previousClose))
        ? 0
        : Math.abs(candle.low - previousClose)
    );
    prevPrevClose = previousClose;
    previousClose = candle.close;

    return { time: candle.time, value: trueRangeResult };
  }

  candles.forEach((item) => {
    const res = calculate(item);
    if (res) result.push(res);
  });

  return {
    result: () => result,
    update: (candle) => {
      if (result.length && result[result.length - 1].time === candle.time) {
        result = result.slice(0, -1);
        previousClose = prevPrevClose;
      }

      const item = calculate(candle);
      if (item) result.push(item);

      return item;
    },
  };
}
