(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./sma", "./stdev"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.bollingerBands = void 0;
    const sma_1 = require("./sma");
    const stdev_1 = require("./stdev");
    function bollingerBands({ candles, period, stdDev }) {
        let result = [];
        const sma = sma_1.SMA({ candles: [], period });
        const stdev = stdev_1.STDEV({ candles: [], period });
        function calculate(candle) {
            const basis = sma.update(candle);
            const sd = stdev.update(candle);
            if (!basis)
                return undefined;
            const dev = stdDev * sd.value;
            const upper = basis.value + dev;
            const lower = basis.value - dev;
            const bbr = (candle.close - lower) / (upper - lower);
            return { time: candle.time, value: bbr, candle };
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
    exports.bollingerBands = bollingerBands;
});
