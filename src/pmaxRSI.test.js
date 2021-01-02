import { PMaxRSI } from "./pmaxRSI";

const candles = [
  {
    time: 0,
    open: 22,
    high: 22.75,
    low: 18.51,
    close: 18.60,
  },
  {
    time: 1,
    open: 18.90,
    high: 19.44,
    low: 18,
    close: 18.80,
  },
  {
    time: 2,
    open: 20.55,
    high: 20.66,
    low: 17.99,
    close: 18.01,
  },
  {
    time: 3,
    open: 18.55,
    high: 19.48,
    low: 18.02,
    close: 18.68,
  },
  {
    time: 4,
    open: 19.25,
    high: 19.29,
    low: 18.68,
    close: 18.76,
  },
  {
    time: 5,
    open: 18.75,
    high: 18.88,
    low: 18.25,
    close: 18.32,
  },
  {
    time: 6,
    open: 18.33,
    high: 18.47,
    low: 16.90,
    close: 17,
  },
  {
    time: 7,
    open: 17.10,
    high: 17.25,
    low: 16.25,
    close: 17,
  },
  {
    time: 8,
    open: 16.86,
    high: 17.37,
    low: 16,
    close: 16.18,
  },
  {
    time: 9,
    open: 16,
    high: 16.14,
    low: 14.75,
    close: 15.50,
  },
]

const expected = [
  {
    time: 8,
    rsi: 2.209112589431399,
    t3: -0.25963042368900346,
    pmax: -37.71384287790147,
    candle: candles[8],
  },
  {
    time: 9,
    rsi: 1.0557255113670294,
    t3: -1.235768703344199,
    pmax: -26.058273716008635,
    candle: candles[9],
  },
];

it('pmaxRSI', () => {
  const pmax = PMaxRSI({
    candles,
    rsi: {
      period: 2
    },
    t3: {
      period: 2,
      volumeFactor: 1,
    },
    atr: {
      multiplier: 1,
      period: 2,
    }
  });
  expect(pmax.result).toEqual(expected);
});

it('pmaxRSI update', () => {
  const pmax = PMaxRSI({
    candles,
    rsi: {
      period: 2
    },
    t3: {
      period: 2,
      volumeFactor: 1,
    },
    atr: {
      multiplier: 1,
      period: 2,
    }
  });

  const firstResult = pmax.update({ ...candles[9], close: 12.50 });
  expect(firstResult).toEqual({
    time: 9,
    pmax: -26.57528701050358,
    rsi: 0.319587441666215,
    t3: -1.7527819978391435,
    candle: { ...candles[9], close: 12.50 },
  });

  const secondResult = pmax.update(candles[9]);
  expect(secondResult).toEqual(expected[1]);
});

it('pmaxRSI add', () => {
  const pmax = PMaxRSI({
    candles: [],
    rsi: {
      period: 2
    },
    t3: {
      period: 2,
      volumeFactor: 1,
    },
    atr: {
      multiplier: 1,
      period: 2,
    }
  });

  const result = [];
  candles.forEach((item) => {
    const res = pmax.update(item);
    if (res) result.push(res);
  });

  expect(result).toEqual(expected);
});