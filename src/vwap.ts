import { Candle } from "./types";

interface VWAPInput { candles: Candle[]; }
interface VWAPResultItem { time: Candle['time']; value: number; }
type VWAPResult = VWAPResultItem[]

export function VWAP({ candles }: VWAPInput) {
  let result: VWAPResult = [];
  let cumulativeTotal = 0;
  let cumulativeVolume = 0;
  let lastCumulativeTotal = 0;
  let lastCumulativeVolume = 0;

  function calculate(candle): VWAPResultItem {
    lastCumulativeTotal = cumulativeTotal;
    lastCumulativeVolume = cumulativeVolume;
    const typicalPrice = (candle.high + candle.low + candle.close) / 3;
    const total = candle.volume * typicalPrice;
    cumulativeTotal += total;
    cumulativeVolume += candle.volume;

    return { time: candle.time, value: cumulativeTotal / cumulativeVolume };
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

        cumulativeVolume = lastCumulativeVolume;
        cumulativeTotal = lastCumulativeTotal;
      }

      const item = calculate(candle);
      if (item) result.push(item);

      return item;
    },
  };
}
