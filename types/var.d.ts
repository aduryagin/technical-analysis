export function VAR({ candles, period }: {
    candles: any;
    period: any;
}): {
    update: (candle: any) => {
        value: number;
        time: any;
    };
    result: () => any[];
};
