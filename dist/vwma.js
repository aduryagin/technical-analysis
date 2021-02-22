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
    exports.VWMA = void 0;
    const sma_1 = require("./sma");
    function VWMA({ candles, period }) {
        let result = [];
        const sma1 = sma_1.SMA({ candles: [], period });
        const sma2 = sma_1.SMA({ candles: [], period });
        function calculate(candle) {
            const sma1Result = sma1.update(Object.assign(Object.assign({}, candle), { close: candle.close * candle.volume }));
            const sma2Result = sma2.update(Object.assign(Object.assign({}, candle), { close: candle.volume }));
            if (!sma1Result || !sma2Result)
                return;
            return { time: candle.time, value: sma1Result.value / sma2Result.value };
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
    exports.VWMA = VWMA;
});
