export function RSI(candles: any, period: any): {
    result: any[];
    update: (candle: any) => {
        time: any;
        value: number;
        candle: any;
    };
};
