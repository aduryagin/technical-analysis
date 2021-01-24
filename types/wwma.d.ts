export function WWMA({ source, period }: {
    source: any;
    period: any;
}): {
    update: (src: any) => {
        value: number;
        time: any;
    };
    result: any[];
};
