import { SMA } from "./sma";
export function RMA({ candles, period }) {
    let result = [];
    let prevPrevSum;
    let prevSum;
    let sum = 0;
    const sma = SMA({ candles: [], period });
    const exponent = 1 / period;
    function calculate(candle) {
        var _a;
        if (isNaN(prevSum) || prevSum === undefined) {
            sum = (_a = sma.update(candle)) === null || _a === void 0 ? void 0 : _a.value;
        }
        else {
            sum = exponent * candle.close + (1 - exponent) * (prevSum || 0);
        }
        prevPrevSum = prevSum;
        prevSum = sum;
        if (sum) {
            return { time: candle.time, value: sum };
        }
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
                prevSum = prevPrevSum;
            }
            const item = calculate(candle);
            if (item)
                result.push(item);
            return item;
        },
    };
}
