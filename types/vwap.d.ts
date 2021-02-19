export function VWAP(candles: any): {
    result: () => any[];
    update: (candle: any) => {
        time: any;
        value: number;
    };
};
