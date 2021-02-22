import { EMA } from "./ema";
import { ATR } from "./atr";
import { Candle } from "./types";

interface PMaxInput {
  candles: Candle[];
  emaPeriod?: number;
  atrPeriod?: number;
  multiplier?: number;
}
interface PMaxResultItem {
  time: Candle["time"];
  ema: number;
  pmax: number;
  pmaxReverse: number;
  pmaxLong: number;
  pmaxShort: number;
  candle: Candle;
}
type PMaxResult = PMaxResultItem[];

export function PMax({
  candles,
  emaPeriod = 10,
  atrPeriod = 10,
  multiplier = 3,
}: PMaxInput) {
  let result: PMaxResult = [];
  const ema = EMA({ candles: [], period: emaPeriod });
  const atr = ATR({ candles: [], period: atrPeriod });

  // stacks
  let longStopPrev;
  let longStopStack = [];
  let dirStackPrev = 1;
  let dirStack = [];
  let shortStopPrev;
  let shortStopStack = [];

  function calculate(candle: Candle): PMaxResultItem | undefined {
    const emaResult = ema.update({
      ...candle,
      close: (candle.low + candle.high) / 2,
    });
    const atrResult = atr.update(candle);

    if (!emaResult || !atrResult) return undefined;

    let longStop = emaResult.value - multiplier * atrResult.value;
    longStopPrev = longStopStack.pop() || longStop;
    longStop =
      emaResult.value > longStopPrev
        ? Math.max(longStop, longStopPrev)
        : longStop;
    longStopStack.push(longStop);

    let shortStop = emaResult.value + multiplier * atrResult.value;
    shortStopPrev = shortStopStack.pop() || shortStop;
    shortStop =
      emaResult.value < shortStopPrev
        ? Math.min(shortStop, shortStopPrev)
        : shortStop;
    shortStopStack.push(shortStop);

    let dir = 1;
    dirStackPrev = dirStack.pop() || dir;
    dir = dirStackPrev;
    dir =
      // eslint-disable-next-line no-nested-ternary
      dir === -1 && emaResult.value > shortStopPrev
        ? 1
        : dir === 1 && emaResult.value < longStopPrev
        ? -1
        : dir;
    dirStack.push(dir);

    return {
      candle,
      time: candle.time,
      ema: emaResult.value,
      pmax: dir === 1 ? longStop : shortStop,
      pmaxReverse: dir === 1 ? shortStop : longStop,
      pmaxLong: longStop,
      pmaxShort: shortStop,
    };
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
        longStopStack = [longStopPrev];
        dirStack = [dirStackPrev];
        shortStopStack = [shortStopPrev];
      }

      const item = calculate(candle);
      if (item) result.push(item);

      return item;
    },
  };
}
