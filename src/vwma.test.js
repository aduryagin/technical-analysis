import { VWMA } from "./vwma";
import { SMA } from "./sma";

const candles = [
  {
    time: 0,
    open: 22,
    high: 22.75,
    low: 18.51,
    close: 18.60,
    volume: 12995569
  },
  {
    time: 1,
    open: 18.90,
    high: 19.44,
    low: 18,
    close: 18.80,
    volume: 4233345
  },
  {
    time: 2,
    open: 20.55,
    high: 20.66,
    low: 17.99,
    close: 18.01,
    volume: 3435271
  },
  {
    time: 3,
    open: 18.55,
    high: 19.48,
    low: 18.02,
    close: 18.68,
    volume: 2590873
  },
  {
    time: 4,
    open: 19.25,
    high: 19.29,
    low: 18.68,
    close: 18.76,
    volume: 1608629
  },
]

const expected = [
  {
    "time": 2,
    "value": 18.542889550688788,
  },
  {
    "time": 3,
    "value": 18.505173537395482,
  },
  {
    "time": 4,
    "value": 18.395388885825422,
  },
];

it('VWMA', () => {
  const vwma = VWMA({
    candles,
    period: 3
  });
  expect(vwma.result()).toEqual(expected);
});

it('VWMA update', () => {
  const vwma = VWMA({
    candles,
    period: 3
  });

  const firstResult = vwma.update({ ...candles[4], close: 12.50 });
  expect(firstResult).toEqual({
    time: 4,
    value: 17.076421374938064,
  });

  const secondResult = vwma.update(candles[4]);
  expect(secondResult).toEqual(expected[2]);
});

it('vwma add', () => {
  const vwma = VWMA({
    candles: [],
    period: 3
  });

  const result = [];
  candles.forEach((item) => {
    const res = vwma.update(item);
    if (res) result.push(res);
  });

  expect(result).toEqual(expected);
});