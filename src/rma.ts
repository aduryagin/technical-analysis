import { SMA } from './sma';
import { Candle } from './types';

interface RMAInput { candles: Candle[]; period: number }
interface RMAResultItem { time: Candle['time']; value: number }
type RMAResult = RMAResultItem[]

export function RMA({ candles, period }: RMAInput) {
  let result: RMAResult = [];
  let prevPrevSum;
  let prevSum;
  let sum = 0;
  const sma = SMA({ candles: [], period });
  const exponent = 1 / period;

  function calculate(candle: Candle): RMAResultItem | undefined {
    if (isNaN(prevSum) || prevSum === undefined) {
      sum = sma.update(candle)?.value;
    } else {
      sum = exponent * candle.close + (1 - exponent) * (prevSum || 0);
    }

    prevPrevSum = prevSum;
    prevSum = sum;

    // @ts-ignore
    return sum ? { time: candle.time, value: sum } : sum;
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
        prevSum = prevPrevSum;
      }

      const item = calculate(candle);
      if (item) result.push(item);
      return item;
    },
  };
}
