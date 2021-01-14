export function FBB({ candles, period, multiplier }: {
    candles: any;
    period: any;
    multiplier: any;
}): {
    result: any[];
    update: (candle: any) => {
        time: any;
        basis: number;
        upper1: number;
        upper2: number;
        upper3: number;
        upper4: number;
        upper5: number;
        upper6: number;
        lower1: number;
        lower2: number;
        lower3: number;
        lower4: number;
        lower5: number;
        lower6: number;
    };
};
