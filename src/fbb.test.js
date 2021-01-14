import { FBB } from "./fbb";

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
    "basis": 19.52880532186486,
    "lower1": 19.147285775722214,
    "lower2": 18.911260971752615,
    "lower3": 18.72050119868129,
    "lower4": 18.52974142560997,
    "lower5": 18.293716621640367,
    "lower6": 17.912197075497723,
    "upper1": 19.910324868007503,
    "upper2": 20.146349671977102,
    "upper3": 20.337109445048426,
    "upper4": 20.527869218119747,
    "upper5": 20.76389402208935,
    "upper6": 21.145413568231994,
  },
  {
    "time": 3,
    "basis": 18.788493358035023,
    "lower1": 18.738097548685435,
    "lower2": 18.706920480189503,
    "lower3": 18.68172257551471,
    "lower4": 18.656524670839914,
    "lower5": 18.625347602343982,
    "lower6": 18.574951792994394,
    "upper1": 18.83888916738461,
    "upper2": 18.870066235880543,
    "upper3": 18.895264140555337,
    "upper4": 18.92046204523013,
    "upper5": 18.951639113726063,
    "upper6": 19.00203492307565,
  },
  {
    "time": 4,
    "basis": 18.837286678115166,
    "lower1": 18.779596597319397,
    "lower2": 18.743906971064387,
    "lower3": 18.715061930666504,
    "lower4": 18.686216890268618,
    "lower5": 18.650527264013608,
    "lower6": 18.59283718321784,
    "upper1": 18.894976758910936,
    "upper2": 18.930666385165946,
    "upper3": 18.95951142556383,
    "upper4": 18.988356465961715,
    "upper5": 19.024046092216725,
    "upper6": 19.081736173012494,
  },
];

it('FBB', () => {
  const fbb = FBB({
    candles,
    period: 3
  });
  expect(fbb.result).toEqual(expected);
});

it('FBB update', () => {
  const fbb = FBB({
    candles,
    period: 3
  });

  const firstResult = fbb.update({ ...candles[4], close: 12.50 });
  expect(firstResult).toEqual({
    time: 4,
    "basis": 18.39763084115271,
    "lower1": 17.73407109607403,
    "lower2": 17.32356379615247,
    "lower3": 16.991783923613127,
    "lower4": 16.660004051073784,
    "lower5": 16.249496751152225,
    "lower6": 15.585937006073543,
    "upper1": 19.061190586231394,
    "upper2": 19.471697886152953,
    "upper3": 19.803477758692296,
    "upper4": 20.13525763123164,
    "upper5": 20.545764931153197,
    "upper6": 21.20932467623188,
  });

  const secondResult = fbb.update(candles[4]);
  expect(secondResult).toEqual(expected[2]);
});

it('FBB add', () => {
  const fbb = FBB({
    candles: [],
    period: 3
  });

  const result = [];
  candles.forEach((item) => {
    const res = fbb.update(item);
    if (res) result.push(res);
  });

  expect(result).toEqual(expected);
});