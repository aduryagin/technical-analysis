export function PMax({ candles, emaPeriod, atrPeriod, multiplier, }: {
    candles: any;
    emaPeriod?: number;
    atrPeriod?: number;
    multiplier?: number;
}): {
    result: any[];
    update: (candle: any) => {
        candle: any;
        time: any;
        ema: any;
        pmax: any;
        pmaxReverse: any;
        pmaxLong: number;
        pmaxShort: any;
    };
};
