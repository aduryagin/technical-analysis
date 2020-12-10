/* eslint-disable no-restricted-globals */
import { SMA } from './sma';

export function RMA(candles, period) {
  let result = [];
  let prevPrevSum;
  let prevSum;
  let sum = 0;
  const sma = SMA([], period);
  const exponent = 1 / period;

  function calculate(candle) {
    if (isNaN(prevSum) || prevSum === undefined) {
      sum = sma.update(candle)?.value;
    } else {
      sum = exponent * candle.close + (1 - exponent) * (prevSum || 0);
    }

    prevPrevSum = prevSum;
    prevSum = sum;

    return sum ? { time: candle.time, value: sum } : sum;
  }

  candles.forEach((item) => {
    const res = calculate(item);
    if (res) result.push(res);
  });

  return {
    result,
    update: (candle) => {
      if (result.length && result[result.length - 1].time === candle.time) {
        result = result.slice(0, -1);
        prevSum = prevPrevSum;
      }

      const item = calculate(candle);
      if (item) result.push(item);
      return item;
    },
  };
}
