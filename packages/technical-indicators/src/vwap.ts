import { Candle } from "./types";

interface VWAPInput {
  candles: Candle[];
}
interface VWAPResultItem {
  time: Candle["time"];
  value: number;
}

export function VWAP({ candles }: VWAPInput) {
  const result = new Map<Candle["time"], VWAPResultItem>();
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
    if (res) result.set(item.time, res);
  });

  return {
    result: (time?: Candle["time"]) => {
      if (time) return result.get(time);
      return result;
    },
    update: (candle: Candle) => {
      const prevResult = Array.from(result.values()).pop();

      if (result.size && prevResult.time > candle.time) {
        return prevResult;
      }

      if (result.size && prevResult.time === candle.time) {
        cumulativeVolume = lastCumulativeVolume;
        cumulativeTotal = lastCumulativeTotal;
      }

      const item = calculate(candle);
      if (item) result.set(item.time, item);

      return item;
    },
  };
}
