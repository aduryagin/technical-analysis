import { Candle } from "../tinkoff/tinkoff.types";

export function candles(candles: Candle[]) {
  const result = new Map<Candle["time"], Candle>();

  candles.forEach((candle) => {
    result.set(candle.time, candle);
  });

  return {
    result: () => {
      return result;
    },
    update: (candle: Candle) => {
      const prevResult = Array.from(result.values()).pop();

      // handle bad stream values
      if (result.size && prevResult.time > candle.time) {
        return prevResult;
      }

      result.set(candle.time, candle);

      return result;
    },
  };
}
