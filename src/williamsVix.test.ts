import { WilliamsVix } from "./williamsVix";

const candles = [
  {
    time: 0,
    open: 22,
    high: 22.75,
    low: 18.51,
    close: 18.6,
  },
  {
    time: 1,
    open: 18.9,
    high: 19.44,
    low: 18,
    close: 18.8,
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
];

const expected = [
  {
    time: 1,
    candle: candles[1],
    rangeHigh: 0,
    rangeLow: 0,
    isBuyZone: true,
    wvf: 4.255319148936174,
    upperBand: 0,
  },
  {
    time: 2,
    candle: candles[2],
    isBuyZone: true,
    rangeHigh: 3.662234042553201,
    rangeLow: 4.351595744680862,
    wvf: 4.308510638297884,
    upperBand: 4.335106382978739,
  },
  {
    time: 3,
    candle: candles[3],
    isBuyZone: false,
    rangeHigh: 3.662234042553201,
    rangeLow: 4.351595744680862,
    wvf: 3.533190578158459,
    upperBand: 4.696170668367596,
  },
];

it("williamsVix", () => {
  const instance = WilliamsVix({
    candles,
    lookBackPeriodStDevHigh: 2,
    bbLength: 2,
    bbStandardDeviationUp: 2,
    lookBackPeriodPercentileHigh: 2,
  });
  expect(instance.result()).toEqual(expected);
});

it("williamsVix update", () => {
  const instance = WilliamsVix({
    candles,
    lookBackPeriodStDevHigh: 2,
    bbLength: 2,
    bbStandardDeviationUp: 2,
    lookBackPeriodPercentileHigh: 2,
  });

  const firstResult = instance.update({ ...candles[3], close: 12.5 });
  expect(firstResult).toEqual({
    candle: {
      ...candles[3],
      close: 12.5,
    },
    isBuyZone: false,
    rangeHigh: 3.662234042553201,
    rangeLow: 4.351595744680862,
    time: 3,
    upperBand: 6.49052831169446,
    wvf: -0.055524708495269345,
  });

  const secondResult = instance.update(candles[3]);
  expect(secondResult).toEqual(expected[2]);
});

it("williamsVix add", () => {
  const instance = WilliamsVix({
    candles: [],
    lookBackPeriodStDevHigh: 2,
    bbLength: 2,
    bbStandardDeviationUp: 2,
    lookBackPeriodPercentileHigh: 2,
  });

  const result = [];
  candles.forEach((item) => {
    const res = instance.update(item);
    if (res) result.push(res);
  });

  expect(result).toEqual(expected);
});
