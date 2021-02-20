import { SMA } from './sma';
import { Candle } from './types';

interface EMAInput { candles: Candle[], period: number; }
interface EMAResultItem { time: Candle['time'], value: number; }
type EMAResult = EMAResultItem[]

export function EMA({ candles, period }: EMAInput) {
  let result: EMAResult = [];
  const sma = SMA({ candles: [], period });
  const exponent = 2 / (period + 1);
  let prevPrevEma;
  let prevEma;

  function calculate(candle): EMAResultItem | undefined {
    prevPrevEma = prevEma;

    if (prevEma !== undefined) {
      prevEma = (candle.close - prevEma) * exponent + prevEma;
      return { value: prevEma, time: candle.time };
    }

    prevEma = sma.update(candle)?.value;
    if (prevEma !== undefined) return { value: prevEma, time: candle.time };

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

        prevEma = prevPrevEma;
      }

      const item = calculate(candle);
      if (item) result.push(item);
      return item;
    },
  };
}
