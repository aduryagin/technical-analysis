import { RSI } from "./rsi";
import { Candle, Cross } from "./types";
import { Stochastic } from ".";

export interface RSIStochasticTakeProfitResultItem {
  time: Candle["time"];
  candle: Candle;
  cross: Cross | null;
  rsi: number;
  stochasticD: number;
  stochasticK: number;
}
interface RSIStochasticTakeProfitInput {
  candles: Candle[];
  period: number;
  kSmoothing: number;
}

export function RSIStochasticTakeProfit({
  candles,
  period = 14,
  kSmoothing = 3,
}: RSIStochasticTakeProfitInput) {
  let crossResult: Cross[] = [];
  const result = new Map<Candle["time"], RSIStochasticTakeProfitResultItem>();

  const overboughtRsi = 70;
  const oversoldRsi = 30;

  const rsi = RSI({ candles: [], period });
  const stochastic = Stochastic({ candles: [], kSmoothing });

  function calculate(
    candle: Candle
  ): RSIStochasticTakeProfitResultItem | undefined {
    const rsiResult = rsi.update(candle);
    const stochasticResult = stochastic.update(candle);

    if (!rsiResult || !stochasticResult) return;

    const rsiUp = rsiResult.value > overboughtRsi;
    const rsiDown = rsiResult.value < oversoldRsi;

    // check cross
    let cross: Cross = null;
    const shortTakeProfit =
      stochasticResult.cross?.name === "Stochastic KD" &&
      stochasticResult.cross?.long &&
      rsiDown;
    const longTakeProfit =
      stochasticResult.cross?.name === "Stochastic KD" &&
      !stochasticResult.cross?.long &&
      rsiUp;

    if (shortTakeProfit || longTakeProfit) {
      cross = {
        long: shortTakeProfit,
        time: candle.time,
      };
      crossResult.push(cross);
    }

    return {
      candle,
      time: candle.time,
      cross,
      rsi: rsiResult.value,
      stochasticD: stochasticResult.d,
      stochasticK: stochasticResult.k,
    };
  }

  candles.forEach((item) => {
    const res = calculate(item);
    if (res) result.set(item.time, res);
  });

  return {
    cross: () => crossResult,
    result: (time?: Candle["time"]) => {
      if (time) return result.get(time);
      return result;
    },
    update: (candle: Candle) => {
      const prevResult = Array.from(result.values()).pop();

      // handle bad stream values
      if (result.size && prevResult.time > candle.time) {
        return prevResult;
      }

      if (result.size && prevResult.time === candle.time) {
        if (
          crossResult.length &&
          crossResult[crossResult.length - 1].time === candle.time
        ) {
          crossResult = crossResult.slice(0, -1);
        }

        result.delete(candle.time);
      }

      const item = calculate(candle);
      if (item) result.set(candle.time, item);

      return item;
    },
  };
}
