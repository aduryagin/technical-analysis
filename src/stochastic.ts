import { SMA } from "./sma";
import { Candle } from "./types";

interface StochasticInput {
  candles: Candle[];
  signalPeriod: number;
  period: number;
}
interface StochasticResultItem {
  time: Candle["time"];
  k: number;
  d: number;
}
type StochasticResult = StochasticResultItem[];

export function stochastic({ candles, signalPeriod, period }: StochasticInput) {
  let result: StochasticResult = [];
  const sma = SMA({ candles: [], period: signalPeriod });
  const pastHighPeriods = [];
  const pastLowPeriods = [];
  let k;
  let d;
  let index = 1;
  let lastCandle;

  function calculate(candle): StochasticResultItem {
    lastCandle = candle;
    pastHighPeriods.push(candle.high);
    pastLowPeriods.push(candle.low);

    if (index >= period) {
      const periodLow = Math.min(...pastLowPeriods.slice(-period));
      const periodHigh = Math.max(...pastHighPeriods.slice(-period));
      k = ((candle.close - periodLow) / (periodHigh - periodLow)) * 100;
      // eslint-disable-next-line no-restricted-globals
      k = isNaN(k) ? 0 : k;
      d = sma.update({ time: candle.time, close: k })?.value;

      return { k, d, time: candle.time };
    }
    index += 1;

    return undefined;
  }

  candles.forEach((candle) => {
    const item = calculate(candle);
    if (item) result.push(item);
  });

  return {
    result: () => result,
    update: (candle: Candle) => {
      if (result.length && result[result.length - 1].time === candle.time) {
        result = result.slice(0, -1);
      }

      if (lastCandle && lastCandle.time === candle.time) {
        pastLowPeriods.pop();
        pastHighPeriods.pop();

        if (index < period) {
          index -= 1;
        }
      }

      const item = calculate(candle);
      if (item) result.push(item);

      return item;
    },
  };
}
