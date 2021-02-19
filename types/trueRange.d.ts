export function trueRange(candles: any): {
    result: () => any[];
    update: (candle: any) => {
        time: any;
        value: number;
    };
};
