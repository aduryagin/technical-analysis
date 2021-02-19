export function SMA(candles: any, period: any): {
    result: () => any[];
    update: (candle: any) => {
        time: any;
        value: number;
        candle: any;
    };
};
