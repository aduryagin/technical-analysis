import { SMA } from "./sma";
import { T3 } from "./t3";
import { Candle, Cross } from "./types";
import { WWMA } from "./wwma";

export interface PMaxRRSIInput {
  candles: Candle[];
  rsi?: { period: number };
  t3?: { period: number; volumeFactor: number };
  atr?: { period: number; multiplier: number };
}
export interface PMaxRRSIResultItem {
  time: Candle["time"];
  rsi: number;
  t3: number;
  pmax: number;
  pmaxReverse: number;
  candle: Candle;
  cross: Cross | null;
}

export function PMaxRSI({ candles, rsi, t3, atr }: PMaxRRSIInput) {
  candles = candles || [];
  rsi = rsi || {
    period: 14,
  };
  t3 = t3 || {
    period: 8,
    volumeFactor: 0.7,
  };
  atr = atr || {
    multiplier: 3,
    period: 10,
  };

  let crossResult: Cross[] = [];
  const result = new Map<Candle["time"], PMaxRRSIResultItem>();
  let candleStack = [...candles];
  const t3Instance = T3({
    candles: [],
    period: t3.period,
    volumeFactor: t3.volumeFactor,
  });
  const AvUp = WWMA({ source: [], period: rsi.period });
  const AvDown = WWMA({ source: [], period: rsi.period });
  const AvUpSMA = SMA({ candles: [], period: rsi.period });
  const AvDownSMA = SMA({ candles: [], period: rsi.period });
  const ATR = SMA({ candles: [], period: atr.period });

  // stacks
  let longStopPrev;
  let longStopStack = [];
  let dirStackPrev = 1;
  let dirStack = [];
  let shortStopPrev;
  let shortStopStack = [];

  function calculate(candle: Candle, index): PMaxRRSIResultItem | undefined {
    if (!candleStack[index - 1]) return undefined;

    const i =
      candle.close >= candleStack[index - 1].close
        ? candle.close - candleStack[index - 1].close
        : 0;
    const i2 =
      candle.close < candleStack[index - 1].close
        ? candleStack[index - 1].close - candle.close
        : 0;

    const avUpResult = AvUp.update({ time: candle.time, value: i });
    const avDownResult = AvDown.update({ time: candle.time, value: i2 });
    const AvgUpSMAResult = AvUpSMA.update({ time: candle.time, close: i });
    const AvgDownSMAResult = AvDownSMA.update({ time: candle.time, close: i2 });
    if (!AvgDownSMAResult) return undefined;

    const k1 =
      candle.high > candleStack[index - 1].close
        ? candle.high - candleStack[index - 1].close
        : 0;
    const k2 =
      candle.high < candleStack[index - 1].close
        ? candleStack[index - 1].close - candle.high
        : 0;
    const k3 =
      candle.low > candleStack[index - 1].close
        ? candle.low - candleStack[index - 1].close
        : 0;
    const k4 =
      candle.low < candleStack[index - 1].close
        ? candleStack[index - 1].close - candle.low
        : 0;
    const AvgUpH = (AvgUpSMAResult.value * (rsi.period - 1) + k1) / rsi.period;
    const AvgDownH =
      (AvgDownSMAResult.value * (rsi.period - 1) + k2) / rsi.period;
    const AvgUpL = (AvgUpSMAResult.value * (rsi.period - 1) + k3) / rsi.period;
    const AvgDownL =
      (AvgDownSMAResult.value * (rsi.period - 1) + k4) / rsi.period;

    const rs = avUpResult.value / avDownResult.value;
    const rsi1 = rs === -1 ? 0 : 100 - 100 / (1 + rs);
    const rsh = AvgUpH / AvgDownH;
    const rsih = rsh === -1 ? 0 : 100 - 100 / (1 + rsh);
    const rsl = AvgUpL / AvgDownL;
    const rsil = rsl === -1 ? 0 : 100 - 100 / (1 + rsl);
    const prevResult = Array.from(result.values()).pop();
    const TR = Math.max(
      rsih - rsil,
      Math.abs(rsih - (prevResult?.rsi || 0)),
      Math.abs(rsil - (prevResult?.rsi || 0))
    );

    const ATRResult = ATR.update({ time: candle.time, close: TR });
    const t3Result = t3Instance.update({ close: rsi1, time: candle.time });

    if (!ATRResult || !t3Result) return undefined;

    let longStop = t3Result.value - atr.multiplier * ATRResult.value;
    longStopPrev = longStopStack.pop() || longStop;
    longStop =
      t3Result.value > longStopPrev
        ? Math.max(longStop, longStopPrev)
        : longStop;
    longStopStack.push(longStop);

    let shortStop = t3Result.value + atr.multiplier * ATRResult.value;
    shortStopPrev = shortStopStack.pop() || shortStop;
    shortStop =
      t3Result.value < shortStopPrev
        ? Math.min(shortStop, shortStopPrev)
        : shortStop;
    shortStopStack.push(shortStop);

    let dir = 1;
    dirStackPrev = dirStack.pop() || dir;
    dir = dirStackPrev;
    dir =
      // eslint-disable-next-line no-nested-ternary
      dir === -1 && t3Result.value > shortStopPrev
        ? 1
        : dir === 1 && t3Result.value < longStopPrev
        ? -1
        : dir;
    dirStack.push(dir);

    const pmax = dir === 1 ? longStop : shortStop;

    // check cross
    let cross: Cross = null;
    if (result.size >= 1) {
      const short = prevResult.pmax < prevResult.t3 && pmax >= t3Result.value;
      const long = prevResult.pmax >= prevResult.t3 && pmax < t3Result.value;
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
      time: candle.time,
      rsi: rsi1,
      t3: t3Result.value,
      pmax,
      pmaxReverse: dir === 1 ? shortStop : longStop,
      cross,
    };
  }

  candleStack.forEach((item, index) => {
    const res = calculate(item, index);
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
        candleStack = candleStack.slice(0, -1);
        longStopStack = [longStopPrev];
        dirStack = [dirStackPrev];
        shortStopStack = [shortStopPrev];
      }

      candleStack.push(candle);
      const item = calculate(candle, candleStack.length - 1);
      if (item) result.set(candle.time, item);

      return item;
    },
  };
}
