import { trueRange } from './trueRange';

const candles = [
  {
    time: 0,
    high: 3,
    low: 1,
    close: 2,
  },
  {
    time: 1,
    high: 5,
    low: 3,
    close: 4,
  },
  {
    time: 2,
    high: 10,
    low: 5,
    close: 9,
  },
];
const expectedResult = [
  { time: 0, value: 2 },
  { time: 1, value: 3 },
  { time: 2, value: 6 },
];

it('trueRange', () => {
  const range = trueRange({candles});
  expect(range.result()).toEqual(expectedResult);
});

it('trueRange add', () => {
  const range = trueRange({candles:[]});
  const result = [];
  candles.forEach((item) => {
    const res = range.update(item);
    if (res) result.push(res);
  });

  expect(result).toEqual(expectedResult);
});

it('trueRange update', () => {
  const range = trueRange({candles:[]});
  const result = [];
  candles.forEach((item) => {
    const res = range.update(item);
    if (res) result.push(res);
  });

  expect(result).toEqual(expectedResult);

  expect(range.update({ time: 2, high: 11, low: 5, cloose: 9 })).toEqual({
    time: 2,
    value: 7,
  });

  expect(range.update({ time: 2, high: 10, low: 5, cloose: 9 })).toEqual({
    time: 2,
    value: 6,
  });
});
