import { PMax } from "./pmax";

const candles = [
  { time: 1, close: 15.27, high: 22.75, low: 13.03 },
  { time: 2, close: 16.6, high: 17.94, low: 14.4 },
  { time: 3, close: 22.6, high: 24.4, low: 15.9 },
  { time: 4, close: 20.35, high: 23.39, low: 18.21 },
  { time: 5, close: 26.03, high: 29.79, low: 19.54 },
  { time: 6, close: 20.78, high: 28.95, low: 20.74 },
  { time: 7, close: 14.64, high: 20.99, low: 13.5 },
  { time: 8, close: 13.1, high: 15.47, low: 13.04 },
  { time: 9, close: 15.73, high: 15.75, low: 11.54 },
  { time: 10, close: 15.92, high: 18.48, low: 14.35 },
];
const expectedResult = new Map([
  [
    candles[2].time,
    {
      candle: candles[2],
      time: 3,
      ema: 18.07,
      pmax: 10.816666666666666,
      pmaxLong: 10.816666666666666,
      pmaxShort: 25.323333333333334,
      pmaxReverse: 25.323333333333334,
      cross: null,
    },
  ],
  [
    candles[3].time,
    {
      candle: candles[3],
      time: 4,
      ema: 19.435000000000002,
      pmax: 12.872777777777781,
      pmaxLong: 12.872777777777781,
      pmaxShort: 25.323333333333334,
      pmaxReverse: 25.323333333333334,
      cross: null,
    },
  ],
  [
    candles[4].time,
    {
      candle: candles[4],
      time: 5,
      ema: 22.05,
      pmax: 14.25851851851852,
      pmaxLong: 14.25851851851852,
      pmaxShort: 25.323333333333334,
      pmaxReverse: 25.323333333333334,
      cross: null,
    },
  ],
  [
    candles[5].time,
    {
      candle: candles[5],
      time: 6,
      ema: 23.447499999999998,
      pmax: 15.51651234567901,
      pmaxLong: 15.51651234567901,
      pmaxShort: 25.323333333333334,
      pmaxReverse: 25.323333333333334,
      cross: null,
    },
  ],
  [
    candles[6].time,
    {
      candle: candles[6],
      time: 7,
      ema: 20.346249999999998,
      pmax: 15.51651234567901,
      pmaxLong: 15.51651234567901,
      pmaxShort: 25.323333333333334,
      pmaxReverse: 25.323333333333334,
      cross: null,
    },
  ],
  [
    candles[7].time,
    {
      candle: candles[7],
      time: 8,
      ema: 17.300624999999997,
      pmax: 15.51651234567901,
      pmaxLong: 15.51651234567901,
      pmaxShort: 23.29995284636488,
      pmaxReverse: 23.29995284636488,
      cross: null,
    },
  ],
  [
    candles[8].time,
    {
      candle: candles[8],
      time: 9,
      ema: 15.472812499999998,
      pmax: 20.87569773090992,
      pmaxLong: 10.069927269090075,
      pmaxShort: 20.87569773090992,
      pmaxReverse: 10.069927269090075,
      cross: {
        long: false,
        time: 9,
      },
    },
  ],
  [
    candles[9].time,
    {
      candle: candles[9],
      time: 10,
      ema: 15.943906249999998,
      pmax: 20.87569773090992,
      pmaxLong: 10.965316096060048,
      pmaxShort: 20.87569773090992,
      pmaxReverse: 10.965316096060048,
      cross: null,
    },
  ],
]);

it("PMax", () => {
  const pmax = PMax({ candles, emaPeriod: 3, atrPeriod: 3, multiplier: 1 });
  expect(pmax.result()).toEqual(expectedResult);
});

it("PMax add", () => {
  const atr = PMax({ candles: [], emaPeriod: 3, atrPeriod: 3, multiplier: 1 });
  const result = [];

  candles.forEach((item) => {
    const res = atr.update(item);
    if (res)
      result.push({
        ...res,
      });
  });

  expect(result).toEqual(Array.from(expectedResult.values()));
});

it("PMax update", () => {
  const pmax = PMax({ candles, emaPeriod: 3, atrPeriod: 3, multiplier: 1 });

  expect(pmax.update({ time: 10, close: 10, high: 10, low: 10 })).toEqual({
    candle: { time: 10, close: 10, high: 10, low: 10 },
    time: 10,
    ema: 12.736406249999998,
    pmax: 18.24832973727328,
    pmaxLong: 10.069927269090075,
    pmaxReverse: 10.069927269090075,
    pmaxShort: 18.24832973727328,
    cross: null,
  });
  expect(
    pmax.update({ time: 10, close: 15.92, high: 18.48, low: 14.35 })
  ).toEqual({
    candle: { time: 10, close: 15.92, high: 18.48, low: 14.35 },
    time: 10,
    ema: 15.943906249999998,
    pmax: 20.87569773090992,
    pmaxLong: 10.965316096060048,
    pmaxReverse: 10.965316096060048,
    pmaxShort: 20.87569773090992,
    cross: null,
  });
});

it("get result PMax by time", () => {
  const pmax = PMax({ candles, emaPeriod: 3, atrPeriod: 3, multiplier: 1 });
  expect(pmax.result(candles[9].time)).toEqual([...expectedResult.values()][7]);
});
