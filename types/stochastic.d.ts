export function stochastic({ candles, signalPeriod, period }: {
    candles: any;
    signalPeriod: any;
    period: any;
}): {
    result: any[];
    update: (candle: any) => {
        k: number;
        d: number;
        time: any;
    };
};
