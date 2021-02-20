import { Candle } from "./types";

interface SMAInput { candles: Candle[]; period: number }
interface SMAResultItem { time: Candle['time']; value: number; candle: Candle }
type SMAResult = SMAResultItem[]

export function SMA({ candles, period }: SMAInput) {
  let result: SMAResult = [];
  const list = [0];
  let counter = 1;
  let sum = 0;
  let shifted;
  let prevSum;
  let lastCandle;

  function calculate(candle: Candle): SMAResultItem | undefined {
    const current = candle.close;
    lastCandle = candle;

    if (counter < period) {
      counter += 1;
      list.push(current);
      sum += current;
    } else {
      prevSum = sum;
      shifted = list.shift();
      sum = sum - shifted + current;
      list.push(current);
      return { time: candle.time, value: sum / period, candle };
    }

    return undefined;
  }

  candles.forEach((item) => {
    const res = calculate(item);
    if (res) result.push(res);
  });

  return {
    result: () => result,
    update: (candle: Candle) => {
      if (result.length && result[result.length - 1].time === candle.time) {
        result = result.slice(0, -1);
        list.pop();

        if (counter < period) {
          counter -= 1;
          sum -= lastCandle.close;
        } else {
          sum = prevSum;
          list.unshift(shifted);
        }
      }

      const item = calculate(candle);
      if (item) result.push(item);

      return item;
    },
  };
}
