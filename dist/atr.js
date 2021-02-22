(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./rma", "./trueRange"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ATR = void 0;
    const rma_1 = require("./rma");
    const trueRange_1 = require("./trueRange");
    function ATR({ candles, period }) {
        let result = [];
        const tr = trueRange_1.trueRange({ candles: [] });
        const rma = rma_1.RMA({ candles: [], period });
        function calculate(candle) {
            const tRange = tr.update(candle);
            if (!tRange)
                return undefined;
            const tRangeRMA = rma.update({ time: candle.time, close: tRange.value });
            if (!tRangeRMA)
                return undefined;
            return { time: candle.time, value: tRangeRMA === null || tRangeRMA === void 0 ? void 0 : tRangeRMA.value };
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
    exports.ATR = ATR;
});
