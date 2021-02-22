import { STDEV } from "./stdev";

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
const expectedResult = [
  { candle: candles[2], time: 3, value: 3.19 },
  { candle: candles[3], time: 4, value: 2.47 },
  { candle: candles[4], time: 5, value: 2.34 },
  { candle: candles[5], time: 6, value: 2.58 },
  { candle: candles[6], time: 7, value: 4.65 },
  { candle: candles[7], time: 8, value: 3.32 },
  { candle: candles[8], time: 9, value: 1.08 },
  { candle: candles[9], time: 10, value: 1.29 },
];

it("stdev", () => {
  expect(
    STDEV({
      candles,
      period: 3,
    })
      .result()
      .map((item) => ({
        ...item,
        value: parseFloat(item.value.toFixed(2)),
      }))
  ).toEqual(expectedResult);
});

it("stdev add", () => {
  const stdev = STDEV({ candles: [], period: 3 });
  const result = [];

  candles.forEach((item) => {
    const res = stdev.update(item);
    if (res)
      result.push({
        ...res,
        value: parseFloat(res.value.toFixed(2)),
      });
  });

  expect(result).toEqual(expectedResult);
});

it("stdev update", () => {
  const sd = STDEV({ candles, period: 3 });

  expect(sd.update({ time: 10, close: 10, high: 10, low: 10 })).toEqual({
    candle: { time: 10, close: 10, high: 10, low: 10 },
    time: 10,
    value: 2.3418843315207147,
  });
  expect(
    sd.update({ time: 10, close: 15.92, high: 18.48, low: 14.35 })
  ).toEqual({
    candle: { time: 10, close: 15.92, high: 18.48, low: 14.35 },
    time: 10,
    value: 1.2869170740788063,
  });
});
