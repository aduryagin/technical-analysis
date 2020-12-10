export function EMA(candles: any, period: any): {
    result: any[];
    update: (candle: any) => {
        value: any;
        time: any;
    };
};
