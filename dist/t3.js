(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./ema"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.T3 = void 0;
    const ema_1 = require("./ema");
    function T3({ candles, period, volumeFactor }) {
        let result = [];
        const T3e1 = ema_1.EMA({ candles: [], period });
        const T3e2 = ema_1.EMA({ candles: [], period });
        const T3e3 = ema_1.EMA({ candles: [], period });
        const T3e4 = ema_1.EMA({ candles: [], period });
        const T3e5 = ema_1.EMA({ candles: [], period });
        const T3e6 = ema_1.EMA({ candles: [], period });
        function calculate(candle) {
            const T3e1Result = T3e1.update(candle);
            if (!T3e1Result)
                return undefined;
            const T3e2Result = T3e2.update({
                close: T3e1Result.value,
                time: T3e1Result.time,
            });
            if (!T3e2Result)
                return undefined;
            const T3e3Result = T3e3.update({
                close: T3e2Result.value,
                time: T3e2Result.time,
            });
            if (!T3e3Result)
                return undefined;
            const T3e4Result = T3e4.update({
                close: T3e3Result.value,
                time: T3e3Result.time,
            });
            if (!T3e4Result)
                return undefined;
            const T3e5Result = T3e5.update({
                close: T3e4Result.value,
                time: T3e4Result.time,
            });
            if (!T3e5Result)
                return undefined;
            const T3e6Result = T3e6.update({
                close: T3e5Result.value,
                time: T3e5Result.time,
            });
            if (!T3e6Result)
                return undefined;
            const T3c1 = -volumeFactor * volumeFactor * volumeFactor;
            const T3c2 = 3 * volumeFactor * volumeFactor +
                3 * volumeFactor * volumeFactor * volumeFactor;
            const T3c3 = -6 * volumeFactor * volumeFactor -
                3 * volumeFactor -
                3 * volumeFactor * volumeFactor * volumeFactor;
            const T3c4 = 1 +
                3 * volumeFactor +
                volumeFactor * volumeFactor * volumeFactor +
                3 * volumeFactor * volumeFactor;
            const T3 = T3c1 * T3e6Result.value +
                T3c2 * T3e5Result.value +
                T3c3 * T3e4Result.value +
                T3c4 * T3e3Result.value;
            return { value: T3, time: candle.time };
        }
        candles.forEach((item) => {
            const res = calculate(item);
            if (res)
                result.push(res);
        });
        return {
            result: () => result,
            update: (candle) => {
                if (result.length && result[result.length - 1].time === candle.time) {
                    result = result.slice(0, -1);
                }
                const item = calculate(candle);
                if (item)
                    result.push(item);
                return item;
            },
        };
    }
    exports.T3 = T3;
});
