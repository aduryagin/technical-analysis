export function T3({ candles, period, volumeFactor }: {
    candles: any;
    period: any;
    volumeFactor: any;
}): {
    result: () => any[];
    update: (candle: any) => {
        value: number;
        time: any;
    };
};
