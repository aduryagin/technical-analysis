import { Candle, Cross } from "./types";
import { VAR } from "./var";

export interface OTTInput {
  candles: Candle[];
  period?: number;
  percent?: number;
}
export interface OTTResultItem {
  time: Candle["time"];
  var: number;
  ott: number;
  cross: Cross | null;
  candle: Candle;
}

export function OTT({ candles, period, percent }: OTTInput) {
  period = period || 2;
  percent = percent || 1.4;

  const result = new Map<Candle["time"], OTTResultItem>();
  let crossResult: Cross[] = [];
  const varInstance = VAR({ candles: [], period });

  // stacks
  let longStopPrev;
  const longStopStack = [];
  let dirStackPrev = 1;
  const dirStack = [];
  let shortStopPrev;
  const shortStopStack = [];
  let ottStack = [];

  function calculate(candle: Candle): OTTResultItem | undefined {
    // calculate
    const varResult = varInstance.update(candle);
    if (!varResult) return undefined;

    const fark = varResult.value * percent * 0.01;

    let longStop = varResult.value - fark;
    longStopPrev = longStopStack.pop() || longStop;
    longStop =
      varResult.value > longStopPrev
        ? Math.max(longStop, longStopPrev)
        : longStop;
    longStopStack.push(longStop);

    let shortStop = varResult.value + fark;
    shortStopPrev = shortStopStack.pop() || shortStop;
    shortStop =
      varResult.value < shortStopPrev
        ? Math.min(shortStop, shortStopPrev)
        : shortStop;
    shortStopStack.push(shortStop);

    let dir = 1;
    dirStackPrev = dirStack.pop() || dir;
    dir = dirStackPrev;
    dir =
      // eslint-disable-next-line no-nested-ternary
      dir === -1 && varResult.value > shortStopPrev
        ? 1
        : dir === 1 && varResult.value < longStopPrev
        ? -1
        : dir;
    dirStack.push(dir);

    const MT = dir === 1 ? longStop : shortStop;
    ottStack.push(
      varResult.value > MT
        ? (MT * (200 + percent)) / 200
        : (MT * (200 - percent)) / 200
    );
    const OTT = ottStack[ottStack.length - 3] || 0;

    // check cross
    let cross: Cross = null;
    if (result.size >= 1) {
      const prevResult = Array.from(result.values()).pop();

      const short = prevResult.var >= prevResult.ott && varResult.value < OTT;
      const long = prevResult.var < prevResult.ott && varResult.value >= OTT;
      if (short || long) {
        cross = {
          long,
          time: candle.time,
        };
        crossResult.push(cross);
      }
    }

    return {
      candle,
      var: varResult.value,
      ott: OTT,
      time: candle.time,
      cross,
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
      if (result.size && prevResult.time === candle.time) {
        if (
          crossResult.length &&
          crossResult[crossResult.length - 1].time === candle.time
        ) {
          crossResult = crossResult.slice(0, -1);
        }

        result.delete(candle.time);
        ottStack = ottStack.slice(0, -1);
      }

      const item = calculate(candle);
      if (item) result.set(candle.time, item);

      return item;
    },
  };
}
