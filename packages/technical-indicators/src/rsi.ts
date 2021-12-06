import { averageGain } from "./averageGain";
import { averageLoss } from "./averageLoss";
import { Candle } from "./types";

interface RSIInput {
  candles: Candle[];
  period: number;
}
interface RSIResultItem {
  time: Candle["time"];
  value: number;
  candle: Candle;
}
type RSIResult = RSIResultItem[];

export function RSI({ candles, period }: RSIInput) {
  let result: RSIResult = [];

  const avgGain = averageGain({ candles: [], period });
  const avgLoss = averageLoss({ candles: [], period });

  function calculate(candle: Candle): RSIResultItem {
    let currentRSI;
    let RS;
    const lastAvgLoss = avgLoss.update(candle);
    const lastAvgGain = avgGain.update(candle);

    if (lastAvgGain && lastAvgLoss) {
      if (lastAvgLoss.value === 0) {
        currentRSI = 100;
      } else if (lastAvgGain.value === 0) {
        currentRSI = 0;
      } else {
        RS = lastAvgGain.value / lastAvgLoss.value;
        // eslint-disable-next-line no-restricted-globals
        RS = isNaN(RS) ? 0 : RS;
        currentRSI = parseFloat((100 - 100 / (1 + RS)).toFixed(2));
      }

      return { time: candle.time, value: currentRSI, candle };
    }

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

      const item = calculate(candle);
      if (item) result.push(item);

      return item;
    },
  };
}
