import { RMA } from './rma';
import { trueRange } from './trueRange';
import { Candle } from './types';

interface ATRInput { candles: Candle[], period: number }
interface ATRResultItem { time: Candle['time'], value: number }
type ATRResult = ATRResultItem[]

export function ATR({ candles, period }: ATRInput) {
  let result: ATRResult = [];
  const tr = trueRange({candles:[]});
  const rma = RMA({ candles: [], period });

  function calculate(candle): ATRResultItem | undefined {
    const tRange = tr.update(candle);
    if (!tRange) return undefined;

    const tRangeRMA = rma.update({ time: candle.time, close: tRange.value });
    if (!tRangeRMA) return undefined;

    return { time: candle.time, value: tRangeRMA?.value };
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
      }

      const item = calculate(candle);
      if (item) result.push(item);

      return item;
    },
  };
}
