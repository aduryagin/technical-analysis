(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./ema", "./atr"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PMax = void 0;
    const ema_1 = require("./ema");
    const atr_1 = require("./atr");
    function PMax({ candles, emaPeriod = 10, atrPeriod = 10, multiplier = 3, }) {
        let crossResult = [];
        const result = new Map();
        const ema = ema_1.EMA({ candles: [], period: emaPeriod });
        const atr = atr_1.ATR({ candles: [], period: atrPeriod });
        // stacks
        let longStopPrev;
        let longStopStack = [];
        let dirStackPrev = 1;
        let dirStack = [];
        let shortStopPrev;
        let shortStopStack = [];
        function calculate(candle) {
            const emaResult = ema.update(Object.assign(Object.assign({}, candle), { close: (candle.low + candle.high) / 2 }));
            const atrResult = atr.update(candle);
            if (!emaResult || !atrResult)
                return undefined;
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
            const pmax = dir === 1 ? longStop : shortStop;
            // check cross
            let cross = null;
            if (result.size >= 1) {
                const prevResult = Array.from(result.values()).pop();
                const short = prevResult.pmax < prevResult.ema && pmax >= emaResult.value;
                const long = prevResult.pmax >= prevResult.ema && pmax < emaResult.value;
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
                ema: emaResult.value,
                pmax,
                pmaxReverse: dir === 1 ? shortStop : longStop,
                pmaxLong: longStop,
                pmaxShort: shortStop,
                cross,
            };
        }
        candles.forEach((item) => {
            const res = calculate(item);
            if (res)
                result.set(item.time, res);
        });
        return {
            cross: () => crossResult,
            result: (time) => {
                if (time)
                    return result.get(time);
                return result;
            },
            update: (candle) => {
                const prevResult = Array.from(result.values()).pop();
                if (result.size && prevResult.time === candle.time) {
                    if (crossResult.length &&
                        crossResult[crossResult.length - 1].time === candle.time) {
                        crossResult = crossResult.slice(0, -1);
                    }
                    result.delete(candle.time);
                    longStopStack = [longStopPrev];
                    dirStack = [dirStackPrev];
                    shortStopStack = [shortStopPrev];
                }
                const item = calculate(candle);
                if (item)
                    result.set(candle.time, item);
                return item;
            },
        };
    }
    exports.PMax = PMax;
});
