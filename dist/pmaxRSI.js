(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./sma", "./t3", "./wwma"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PMaxRSI = void 0;
    const sma_1 = require("./sma");
    const t3_1 = require("./t3");
    const wwma_1 = require("./wwma");
    function PMaxRSI({ candles, rsi, t3, atr }) {
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
        let crossResult = [];
        let result = [];
        let candleStack = [...candles];
        const t3Instance = t3_1.T3({
            candles: [],
            period: t3.period,
            volumeFactor: t3.volumeFactor,
        });
        const AvUp = wwma_1.WWMA({ source: [], period: rsi.period });
        const AvDown = wwma_1.WWMA({ source: [], period: rsi.period });
        const AvUpSMA = sma_1.SMA({ candles: [], period: rsi.period });
        const AvDownSMA = sma_1.SMA({ candles: [], period: rsi.period });
        const ATR = sma_1.SMA({ candles: [], period: atr.period });
        // stacks
        let longStopPrev;
        let longStopStack = [];
        let dirStackPrev = 1;
        let dirStack = [];
        let shortStopPrev;
        let shortStopStack = [];
        function calculate(candle, index) {
            var _a, _b;
            if (!candleStack[index - 1])
                return undefined;
            const i = candle.close >= candleStack[index - 1].close
                ? candle.close - candleStack[index - 1].close
                : 0;
            const i2 = candle.close < candleStack[index - 1].close
                ? candleStack[index - 1].close - candle.close
                : 0;
            const avUpResult = AvUp.update({ time: candle.time, value: i });
            const avDownResult = AvDown.update({ time: candle.time, value: i2 });
            const AvgUpSMAResult = AvUpSMA.update({ time: candle.time, close: i });
            const AvgDownSMAResult = AvDownSMA.update({ time: candle.time, close: i2 });
            if (!AvgDownSMAResult)
                return undefined;
            const k1 = candle.high > candleStack[index - 1].close
                ? candle.high - candleStack[index - 1].close
                : 0;
            const k2 = candle.high < candleStack[index - 1].close
                ? candleStack[index - 1].close - candle.high
                : 0;
            const k3 = candle.low > candleStack[index - 1].close
                ? candle.low - candleStack[index - 1].close
                : 0;
            const k4 = candle.low < candleStack[index - 1].close
                ? candleStack[index - 1].close - candle.low
                : 0;
            const AvgUpH = (AvgUpSMAResult.value * (rsi.period - 1) + k1) / rsi.period;
            const AvgDownH = (AvgDownSMAResult.value * (rsi.period - 1) + k2) / rsi.period;
            const AvgUpL = (AvgUpSMAResult.value * (rsi.period - 1) + k3) / rsi.period;
            const AvgDownL = (AvgDownSMAResult.value * (rsi.period - 1) + k4) / rsi.period;
            const rs = avUpResult.value / avDownResult.value;
            const rsi1 = rs === -1 ? 0 : 100 - 100 / (1 + rs);
            const rsh = AvgUpH / AvgDownH;
            const rsih = rsh === -1 ? 0 : 100 - 100 / (1 + rsh);
            const rsl = AvgUpL / AvgDownL;
            const rsil = rsl === -1 ? 0 : 100 - 100 / (1 + rsl);
            const TR = Math.max(rsih - rsil, Math.abs(rsih - (((_a = result[result.length - 1]) === null || _a === void 0 ? void 0 : _a.rsi) || 0)), Math.abs(rsil - (((_b = result[result.length - 1]) === null || _b === void 0 ? void 0 : _b.rsi) || 0)));
            const ATRResult = ATR.update({ time: candle.time, close: TR });
            const t3Result = t3Instance.update({ close: rsi1, time: candle.time });
            if (!ATRResult || !t3Result)
                return undefined;
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
            let cross = null;
            if (result.length >= 1) {
                const prevResult = result[result.length - 1];
                const short = prevResult.pmax < prevResult.rsi && pmax >= rsi1;
                const long = prevResult.pmax >= prevResult.rsi && pmax < rsi1;
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
            if (res)
                result.push(res);
        });
        return {
            cross: () => crossResult,
            result: () => result,
            update: (candle) => {
                if (result.length && result[result.length - 1].time === candle.time) {
                    if (crossResult.length &&
                        crossResult[crossResult.length - 1].time === candle.time) {
                        crossResult = crossResult.slice(0, -1);
                    }
                    result = result.slice(0, -1);
                    candleStack = candleStack.slice(0, -1);
                    longStopStack = [longStopPrev];
                    dirStack = [dirStackPrev];
                    shortStopStack = [shortStopPrev];
                }
                candleStack.push(candle);
                const item = calculate(candle, candleStack.length - 1);
                if (item)
                    result.push(item);
                return item;
            },
        };
    }
    exports.PMaxRSI = PMaxRSI;
});
