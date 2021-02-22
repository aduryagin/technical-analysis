(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./averageGain", "./averageLoss"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RSI = void 0;
    const averageGain_1 = require("./averageGain");
    const averageLoss_1 = require("./averageLoss");
    function RSI({ candles, period }) {
        let result = [];
        const avgGain = averageGain_1.averageGain({ candles: [], period });
        const avgLoss = averageLoss_1.averageLoss({ candles: [], period });
        function calculate(candle) {
            let currentRSI;
            let RS;
            const lastAvgLoss = avgLoss.update(candle);
            const lastAvgGain = avgGain.update(candle);
            if (lastAvgGain && lastAvgLoss) {
                if (lastAvgLoss.value === 0) {
                    currentRSI = 100;
                }
                else if (lastAvgGain.value === 0) {
                    currentRSI = 0;
                }
                else {
                    RS = lastAvgGain.value / lastAvgLoss.value;
                    // eslint-disable-next-line no-restricted-globals
                    RS = isNaN(RS) ? 0 : RS;
                    currentRSI = parseFloat((100 - 100 / (1 + RS)).toFixed(2));
                }
                return { time: candle.time, value: currentRSI, candle };
            }
            return undefined;
        }
        candles.forEach((candle) => {
            const item = calculate(candle);
            if (item)
                result.push(item);
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
    exports.RSI = RSI;
});
