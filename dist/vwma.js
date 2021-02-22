import { SMA } from "./sma";
export function VWMA({ candles, period }) {
    let result = [];
    const sma1 = SMA({ candles: [], period });
    const sma2 = SMA({ candles: [], period });
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
