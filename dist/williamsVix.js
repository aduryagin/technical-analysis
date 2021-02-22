import { highest } from "./highest";
import { lowest } from "./lowest";
import { SMA } from "./sma";
import { STDEV } from "./stdev";
export function WilliamsVix({ candles, lookBackPeriodStDevHigh = 22, bbLength = 20, bbStandardDeviationUp = 2, lookBackPeriodPercentileHigh = 50, highestPercentile = 0.85, lowestPercentile = 1.01, }) {
    let result = [];
    const highestInstance = highest({
        candles: [],
        period: lookBackPeriodStDevHigh,
    });
    const lowestInstance = lowest({
        candles: [],
        period: lookBackPeriodStDevHigh,
    });
    const stDevInstance = STDEV({ candles: [], period: bbLength });
    const smaInstance = SMA({ candles: [], period: bbLength });
    const rangeHighInstance = highest({
        candles: [],
        period: lookBackPeriodPercentileHigh,
    });
    const rangeLowInstance = highest({
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
        return {
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
