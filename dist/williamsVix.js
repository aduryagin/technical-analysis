(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./highest", "./lowest", "./sma", "./stdev"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WilliamsVix = void 0;
    const highest_1 = require("./highest");
    const lowest_1 = require("./lowest");
    const sma_1 = require("./sma");
    const stdev_1 = require("./stdev");
    function WilliamsVix({ candles, lookBackPeriodStDevHigh = 22, bbLength = 20, bbStandardDeviationUp = 2, lookBackPeriodPercentileHigh = 50, highestPercentile = 0.85, lowestPercentile = 1.01, }) {
        const result = new Map();
        let crossResult = [];
        const highestInstance = highest_1.highest({
            candles: [],
            period: lookBackPeriodStDevHigh,
        });
        const lowestInstance = lowest_1.lowest({
            candles: [],
            period: lookBackPeriodStDevHigh,
        });
        const stDevInstance = stdev_1.STDEV({ candles: [], period: bbLength });
        const smaInstance = sma_1.SMA({ candles: [], period: bbLength });
        const rangeHighInstance = highest_1.highest({
            candles: [],
            period: lookBackPeriodPercentileHigh,
        });
        const rangeLowInstance = highest_1.highest({
            candles: [],
            period: lookBackPeriodPercentileHigh,
        });
        function calculate(candle) {
            const lowestResult = lowestInstance.update(candle);
            const highestResult = highestInstance.update(candle);
            if (!lowestResult || !highestResult)
                return;
            const wvf = ((highestResult.value - candle.low) / highestResult.value) * 100;
            const sDevResult = stDevInstance.update(Object.assign(Object.assign({}, candle), { close: wvf }));
            const sDev = bbStandardDeviationUp * ((sDevResult === null || sDevResult === void 0 ? void 0 : sDevResult.value) || 0);
            const smaResult = smaInstance.update(Object.assign(Object.assign({}, candle), { close: wvf }));
            const midLine = (smaResult === null || smaResult === void 0 ? void 0 : smaResult.value) || 0;
            const upperBand = midLine + sDev;
            const rangeHighResult = rangeHighInstance.update(Object.assign(Object.assign({}, candle), { close: wvf }));
            const rangeHigh = ((rangeHighResult === null || rangeHighResult === void 0 ? void 0 : rangeHighResult.value) || 0) * highestPercentile;
            const rangeLowResult = rangeLowInstance.update(Object.assign(Object.assign({}, candle), { close: wvf }));
            const rangeLow = ((rangeLowResult === null || rangeLowResult === void 0 ? void 0 : rangeLowResult.value) || 0) * lowestPercentile;
            const isBuyZone = wvf >= upperBand || wvf >= rangeHigh;
            // check cross
            let cross = null;
            if (result.size >= 1) {
                const prevResult = Array.from(result.values()).pop();
                const long = prevResult.isBuyZone && !isBuyZone;
                if (long) {
                    cross = {
                        long,
                        time: candle.time,
                    };
                    crossResult.push(cross);
                }
            }
            return {
                cross,
                time: candle.time,
                candle,
                rangeHigh,
                rangeLow,
                isBuyZone,
                wvf,
                upperBand,
            };
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
    exports.WilliamsVix = WilliamsVix;
});
