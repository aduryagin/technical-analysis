import { ATR } from './atr';

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
  { time: 3, value: 7.25 },
  { time: 4, value: 6.56 },
  { time: 5, value: 7.79 },
  { time: 6, value: 7.93 },
  { time: 7, value: 7.78 },
  { time: 8, value: 6 },
  { time: 9, value: 5.4 },
  { time: 10, value: 4.98 },
];

it('ATR', () => {
  expect(
    ATR({ candles, period: 3 }).result().map((item) => ({
      time: item.time,
      value: parseFloat(item.value.toFixed(2)),
    })),
  ).toEqual(expectedResult);
});

it('ATR add', () => {
  const atr = ATR({ candles: [], period: 3 });
  const result = [];

  candles.forEach((item) => {
    const res = atr.update(item);
    if (res) result.push({ ...res, value: parseFloat(res.value.toFixed(2)) });
  });

  expect(result).toEqual(expectedResult);
});

it('ATR update', () => {
  const atr = ATR({ candles, period: 3 });

  expect(atr.update({ time: 10, close: 10, high: 10, low: 10 })).toEqual({
    time: 10,
    value: 5.5119234872732825,
  });
  expect(
    atr.update({ time: 10, close: 15.92, high: 18.48, low: 14.35 }),
  ).toEqual({ time: 10, value: 4.978590153939949 });
});
