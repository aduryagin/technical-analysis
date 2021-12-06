import { Candle } from "./types";

interface AverageLossInput {
  candles: Candle[];
  period: number;
}
interface AverageLossResultItem {
  time: Candle["time"];
  value: number;
}
type AverageLossResult = AverageLossResultItem[];

export function averageLoss({ candles, period }: AverageLossInput) {
  let counter = 1;
  let lossSum = 0;
  let loss = 0;
  let candlesStack = [...candles];
  let result: AverageLossResult = [];

  function calculate(candle, lastCandle): AverageLossResultItem | undefined {
    const currentValue = candle.close;
    const lastValue = lastCandle.close;

    loss = lastValue - currentValue;
    loss = loss > 0 ? loss : 0;
    if (loss > 0) {
      lossSum += loss;
    }

    if (counter < period) {
      counter += 1;
    } else if (result.length === 0) {
      return { time: candle.time, value: lossSum / period };
    } else {
      return {
        time: candle.time,
        value: (result[result.length - 1].value * (period - 1) + loss) / period,
      };
    }

    return undefined;
  }

  candlesStack.forEach((candle, index) => {
    if (index !== 0) {
      const item = calculate(candle, candlesStack[index - 1]);
      if (item) result.push(item);
    }
  });

  return {
    result: () => result,
    update: (candle: Candle) => {
      if (result.length && result[result.length - 1].time === candle.time) {
        lossSum -= loss;
        result = result.slice(0, -1);
        candlesStack = candlesStack.slice(0, -1);
      }

      if (candlesStack.length) {
        const item = calculate(candle, candlesStack[candlesStack.length - 1]);
        candlesStack.push(candle);
        if (item) result.push(item);
        return item;
      }

      candlesStack.push(candle);
      return undefined;
    },
  };
}
