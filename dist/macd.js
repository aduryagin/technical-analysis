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
    exports.MACD = void 0;
    const ema_1 = require("./ema");
    function MACD({ candles, fastLength = 12, slowLength = 26, signalSmoothing = 9, }) {
        let crossResult = [];
        const result = new Map();
        const fastMa = ema_1.EMA({ candles: [], period: fastLength });
        const slowMa = ema_1.EMA({ candles: [], period: slowLength });
        const signalMa = ema_1.EMA({ candles: [], period: signalSmoothing });
        const histogramHistory = [];
        function calculate(candle) {
            const fastMaResult = fastMa.update(candle);
            const slowMaResult = slowMa.update(candle);
            if (!fastMaResult || !slowMaResult)
                return;
            const macd = fastMaResult.value - slowMaResult.value;
            const signalMaResult = signalMa.update(Object.assign(Object.assign({}, candle), { close: macd }));
            if (!signalMaResult)
                return;
            const hist = macd - signalMaResult.value;
            if (!histogramHistory[0]) {
                histogramHistory[0] = hist;
                return;
            }
            let histogramState = histogramHistory[0] < hist ? "growBelow" : "fallBelow";
            if (hist >= 0)
                histogramState = histogramHistory[0] < hist ? "growAbove" : "fallAbove";
            histogramHistory[0] = hist;
            // check cross
            let cross = null;
            if (result.size >= 1) {
                const prevResult = Array.from(result.values()).pop();
                const longSignal = prevResult.signal >= prevResult.macd && signalMaResult.value < macd;
                const shortSignal = prevResult.signal <= prevResult.macd && signalMaResult.value > macd;
                if (longSignal || shortSignal) {
                    cross = {
                        long: longSignal,
                        name: "signal",
                        time: candle.time,
                    };
                    crossResult.push(cross);
                }
                else {
                    const long = (prevResult.histogramState === "fallAbove" &&
                        histogramState === "growAbove") ||
                        (prevResult.histogramState === "fallBelow" &&
                            histogramState === "growBelow");
                    const short = (prevResult.histogramState === "growAbove" &&
                        histogramState === "fallAbove") ||
                        (prevResult.histogramState === "growBelow" &&
                            histogramState === "fallBelow");
                    if (long || short) {
                        cross = {
                            long: long,
                            name: "histogram",
                            time: candle.time,
                        };
                        crossResult.push(cross);
                    }
                }
            }
            return {
                macd,
                histogram: hist,
                signal: signalMaResult.value,
                histogramState,
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
                    histogramHistory[0] = Array.from(result.values()).slice(-2)[0];
                }
                const item = calculate(candle);
                if (item)
                    result.set(candle.time, item);
                return item;
            },
        };
    }
    exports.MACD = MACD;
});
