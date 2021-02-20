import { SMA } from './sma';
import { Candle } from './types';

interface VWMAInput { candles: Candle[]; period: number }
interface VWMAResultItem { time: Candle['time']; value: number; }
type VWMAResult = VWMAResultItem[]

export function VWMA({ candles, period }: VWMAInput) {
  let result: VWMAResult = [];
  const sma1 = SMA({candles: [], period});
  const sma2 = SMA({candles: [], period});

  function calculate(candle): VWMAResultItem | undefined {
    const sma1Result = sma1.update({...candle, close: candle.close * candle.volume })
    const sma2Result = sma2.update({...candle, close: candle.volume })

    if (!sma1Result || !sma2Result) return;

    return { time: candle.time, value: sma1Result.value / sma2Result.value }
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
      }

      const item = calculate(candle);
      if (item) result.push(item);

      return item;
    },
  };
}
