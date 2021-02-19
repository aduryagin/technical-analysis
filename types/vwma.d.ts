export function VWMA({ candles, period }: {
    candles: any;
    period: any;
}): {
    result: () => any[];
    update: (candle: any) => {
        time: any;
        value: number;
    };
};
