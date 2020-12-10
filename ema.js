import { SMA } from './sma';

export function EMA(candles, period) {
  let result = [];
  const sma = SMA([], period);
  const exponent = 2 / (period + 1);
  let prevPrevEma;
  let prevEma;

  function calculate(candle) {
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
    result,
    update: (candle) => {
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
