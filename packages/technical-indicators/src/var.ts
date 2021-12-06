import { Candle } from "./types";

interface VARInput {
  candles: Candle[];
  period: number;
}
interface VARResultItem {
  time: Candle["time"];
  value: number;
}
type VARResult = VARResultItem[];

function sum(arr, length) {
  return arr.slice(-length).reduce((acc, item) => {
    return (acc += item);
  }, 0);
}

export function VAR({ candles, period }: VARInput) {
  let result: VARResult = [];
  let candlesStack = [...candles];
  let vud1 = [];
  let vdd1 = [];
  const valpha = 2 / (period + 1);

  function calculate(candle, index): VARResultItem {
    const prevCandlePrice = candlesStack[index - 1]?.close || 0;
    vud1.push(
      candle.close > prevCandlePrice ? candle.close - prevCandlePrice : 0
    );
    vdd1.push(
      candle.close < prevCandlePrice ? prevCandlePrice - candle.close : 0
    );
    const vUD = sum(vud1, 9);
    const vDD = sum(vdd1, 9);
    const vCMO = (vUD - vDD) / (vUD + vDD) || 0;
    const VAR =
      valpha * Math.abs(vCMO) * candle.close +
      (1 - valpha * Math.abs(vCMO)) * (result[result.length - 1]?.value || 0);

    return { value: VAR, time: candle.time };
  }

  candlesStack.forEach((item, index) => {
    const res = calculate(item, index);
    if (res) result.push(res);
  });

  return {
    update: (candle: Candle) => {
      if (result.length && result[result.length - 1].time === candle.time) {
        result = result.slice(0, -1);
        candlesStack = candlesStack.slice(0, -1);
        vud1 = vud1.slice(0, -1);
        vdd1 = vdd1.slice(0, -1);
      }

      candlesStack.push(candle);
      const item = calculate(candle, candlesStack.length - 1);
      if (item) result.push(item);

      return item;
    },
    result: () => result,
  };
}
