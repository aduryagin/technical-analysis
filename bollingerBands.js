import { SMA } from './sma';
import { STDEV } from './stdev';

export function bollingerBands({ candles, period, stdDev }) {
  let result = [];

  const sma = SMA([], period);
  const stdev = STDEV({ candles: [], period });

  function calculate(candle) {
    const basis = sma.update(candle);
    const sd = stdev.update(candle);
    if (!basis) return undefined;

    const dev = stdDev * sd.value;
    const upper = basis.value + dev;
    const lower = basis.value - dev;
    const bbr = (candle.close - lower) / (upper - lower);

    return { time: candle.time, value: bbr, candle };
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
      }

      const item = calculate(candle);
      if (item) result.push(item);

      return item;
    },
  };
}
