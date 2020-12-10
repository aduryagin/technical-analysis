export function RMA(candles: any, period: any): {
    result: any[];
    update: (candle: any) => number | {
        time: any;
        value: number;
    };
};
