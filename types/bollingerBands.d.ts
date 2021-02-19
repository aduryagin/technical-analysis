export function bollingerBands({ candles, period, stdDev }: {
    candles: any;
    period: any;
    stdDev: any;
}): {
    result: () => any[];
    update: (candle: any) => {
        time: any;
        value: number;
        candle: any;
    };
};
