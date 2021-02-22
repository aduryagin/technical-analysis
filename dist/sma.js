(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SMA = void 0;
    function SMA({ candles, period }) {
        let result = [];
        const list = [0];
        let counter = 1;
        let sum = 0;
        let shifted;
        let prevSum;
        let lastCandle;
        function calculate(candle) {
            const current = candle.close;
            lastCandle = candle;
            if (counter < period) {
                counter += 1;
                list.push(current);
                sum += current;
            }
            else {
                prevSum = sum;
                shifted = list.shift();
                sum = sum - shifted + current;
                list.push(current);
                return { time: candle.time, value: sum / period, candle };
            }
            return undefined;
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
                    list.pop();
                    if (counter < period) {
                        counter -= 1;
                        sum -= lastCandle.close;
                    }
                    else {
                        sum = prevSum;
                        list.unshift(shifted);
                    }
                }
                const item = calculate(candle);
                if (item)
                    result.push(item);
                return item;
            },
        };
    }
    exports.SMA = SMA;
});
