import { T3 } from "./t3";

const candles = [
  {
    time: 0,
    close: 100,
  },
  {
    time: 1,
    close: 19.03,
  },
  {
    time: 2,
    close: 53.45,
  },
  {
    time: 3,
    close: 55.87,
  },
  {
    time: 4,
    close: 42.74,
  },
  {
    time: 5,
    close: 24.30,
  },
  {
    time: 6,
    close: 24.30,
  },
  {
    time: 7,
    close: 18.54,
  },
  {
    time: 8,
    close: 15.30,
  },
  {
    time: 9,
    close: 11.91,
  },
];
const expectedResult = [
  { time: 6, value: 26.09 },
  { time: 7, value: 20.40 },
  { time: 8, value: 16.42 },
  { time: 9, value: 13.08 },
];

it('t3', () => {
  const t3 = T3({ candles, period: 2, volumeFactor: 0.7 });
  expect(t3.result().map((item) => ({ ...item, value: parseFloat(item.value.toFixed(2)) }))).toEqual(expectedResult);
});

it('t3 add', () => {
  const t3 = T3({ candles: [], period: 2, volumeFactor: 0.7 });
  const result = [];

  candles.forEach((item) => {
    const res = t3.update(item);
    if (res)
      result.push({
        ...res,
        value: parseFloat(res.value.toFixed(2)),
      });
  });

  expect(result).toEqual(expectedResult);
});

it('t3 update', () => {
  const t3 = T3({ candles, period: 2, volumeFactor: 0.7 });

  expect(t3.update({ time: 9, close: 10 })).toEqual({
    time: 9,
    value: 12.013676791929882,
  });

  expect(
    t3.update({ time: 9, close: 11.91 }),
  ).toEqual({
    time: 9,
    value: 13.075374789186384,
  });
});