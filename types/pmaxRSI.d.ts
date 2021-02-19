export function PMaxRSI({ candles, rsi, t3, atr, }: {
    candles: any;
    rsi: any;
    t3: any;
    atr: any;
}): {
    result: () => any[];
    update: (candle: any) => {
        candle: any;
        time: any;
        rsi: number;
        t3: number;
        pmax: number;
        pmaxReverse: number;
    };
};
