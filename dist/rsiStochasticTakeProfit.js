(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./rsi", "."], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RSIStochasticTakeProfit = void 0;
    const rsi_1 = require("./rsi");
    const _1 = require(".");
    function RSIStochasticTakeProfit({ candles, }) {
        let crossResult = [];
        const result = new Map();
        const overboughtRsi = 70;
        const oversoldRsi = 30;
        const rsi = rsi_1.RSI({ candles: [], period: 14 });
        const stochastic = _1.Stochastic({ candles: [], kSmoothing: 3 });
        function calculate(candle) {
            var _a, _b, _c, _d;
            const rsiResult = rsi.update(candle);
            const stochasticResult = stochastic.update(candle);
            if (!rsiResult || !stochasticResult)
                return;
            const rsiUp = rsiResult.value > overboughtRsi;
            const rsiDown = rsiResult.value < oversoldRsi;
            // check cross
            let cross = null;
            const shortTakeProfit = ((_a = stochasticResult.cross) === null || _a === void 0 ? void 0 : _a.name) === "Stochastic KD" && ((_b = stochasticResult.cross) === null || _b === void 0 ? void 0 : _b.long) &&
                rsiDown;
            const longTakeProfit = ((_c = stochasticResult.cross) === null || _c === void 0 ? void 0 : _c.name) === "Stochastic KD" &&
                !((_d = stochasticResult.cross) === null || _d === void 0 ? void 0 : _d.long) &&
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
                // handle bad stream values
                if (result.size && prevResult.time > candle.time) {
                    return prevResult;
                }
                if (result.size && prevResult.time === candle.time) {
                    if (crossResult.length &&
                        crossResult[crossResult.length - 1].time === candle.time) {
                        crossResult = crossResult.slice(0, -1);
                    }
                    result.delete(candle.time);
                }
                const item = calculate(candle);
                if (item)
                    result.set(candle.time, item);
                return item;
            },
        };
    }
    exports.RSIStochasticTakeProfit = RSIStochasticTakeProfit;
});
