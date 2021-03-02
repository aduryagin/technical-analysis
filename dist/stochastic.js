(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./sma"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Stochastic = void 0;
    const sma_1 = require("./sma");
    function Stochastic({ candles, signalPeriod = 3, period = 14, }) {
        const crossResult = [];
        const result = new Map();
        const sma = sma_1.SMA({ candles: [], period: signalPeriod });
        const pastHighPeriods = [];
        const pastLowPeriods = [];
        let k;
        let d;
        let index = 1;
        let lastCandle;
        function calculate(candle) {
            var _a;
            lastCandle = candle;
            pastHighPeriods.push(candle.high);
            pastLowPeriods.push(candle.low);
            if (index >= period) {
                const periodLow = Math.min(...pastLowPeriods.slice(-period));
                const periodHigh = Math.max(...pastHighPeriods.slice(-period));
                k = ((candle.close - periodLow) / (periodHigh - periodLow)) * 100;
                // eslint-disable-next-line no-restricted-globals
                k = isNaN(k) ? 0 : k;
                d = (_a = sma.update({ time: candle.time, close: k })) === null || _a === void 0 ? void 0 : _a.value;
                // check cross
                let cross = null;
                if (result.size >= 1) {
                    const prevResult = Array.from(result.values()).pop();
                    const shortStoch = prevResult.d >= 80 && d < 80;
                    const longStoch = prevResult.d <= 20 && d > 20;
                    const shortKD = prevResult.k > prevResult.d && d >= k;
                    const longKD = prevResult.k < prevResult.d && d <= k;
                    const shortStochKD = k >= 80 && shortKD;
                    const longStochKD = k <= 20 && longKD;
                    if (shortStoch ||
                        longStoch ||
                        shortKD ||
                        longKD ||
                        shortStochKD ||
                        longStochKD) {
                        let name = "Stochastic";
                        if (shortKD || longKD)
                            name = "KD";
                        else if (shortStochKD || longStochKD)
                            name = "Stochastic KD";
                        cross = {
                            name,
                            long: longStoch || longKD || longStochKD,
                            time: candle.time,
                        };
                        crossResult.push(cross);
                    }
                }
                return { k, d, time: candle.time, cross };
            }
            index += 1;
            return undefined;
        }
        candles.forEach((candle) => {
            const item = calculate(candle);
            if (item)
                result.set(candle.time, item);
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
                    result.delete(candle.time);
                }
                if (lastCandle && lastCandle.time === candle.time) {
                    pastLowPeriods.pop();
                    pastHighPeriods.pop();
                    if (index < period) {
                        index -= 1;
                    }
                }
                const item = calculate(candle);
                if (item)
                    result.set(candle.time, item);
                return item;
            },
        };
    }
    exports.Stochastic = Stochastic;
});
