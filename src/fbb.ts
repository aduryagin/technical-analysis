import { VWMA } from './vwma';
import { STDEV } from './stdev.ts';

export function FBB({ candles, period, multiplier }) {
  multiplier = multiplier || 3
  period = period || 200

  let result = [];
  const basis = VWMA({ candles: [], period });
  const dev = STDEV({ candles: [], period })

  function calculate(candle) {
    const hlc3 = (candle.high + candle.close + candle.low) / 3
    const basisResult = basis.update({ ...candle, close: hlc3 })
    const devResult = dev.update({ ...candle, close: hlc3 })

    if (!basisResult || !devResult) return;

    const mDev = multiplier * devResult.value
    const upper1 = basisResult.value + (0.236*mDev)
    const upper2 = basisResult.value + (0.382*mDev)
    const upper3 = basisResult.value + (0.5*mDev)
    const upper4 = basisResult.value + (0.618*mDev)
    const upper5 = basisResult.value + (0.764*mDev)
    const upper6 = basisResult.value + (1*mDev)
    const lower1 = basisResult.value - (0.236*mDev)
    const lower2 = basisResult.value - (0.382*mDev)
    const lower3 = basisResult.value - (0.5*mDev)
    const lower4 = basisResult.value - (0.618*mDev)
    const lower5 = basisResult.value - (0.764*mDev)
    const lower6 = basisResult.value - (1*mDev)

    return { time: candle.time, basis: basisResult.value, upper1, upper2, upper3, upper4, upper5, upper6, lower1, lower2, lower3, lower4, lower5, lower6 }
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
