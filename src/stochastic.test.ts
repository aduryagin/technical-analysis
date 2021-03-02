import { Stochastic } from "./stochastic";

const high = [
  127.009,
  127.616,
  126.591,
  127.347,
  128.173,
  128.432,
  127.367,
  126.422,
  126.9,
  126.85,
  125.646,
  125.716,
  127.158,
  127.715,
  127.686,
  128.223,
  128.273,
  128.093,
  128.273,
  127.735,
  128.77,
  129.287,
  130.063,
  129.118,
  129.287,
  128.472,
  128.093,
  128.651,
  129.138,
  128.641,
];
const low = [
  125.357,
  126.163,
  124.93,
  126.094,
  126.82,
  126.482,
  126.034,
  124.83,
  126.392,
  125.716,
  124.562,
  124.572,
  125.069,
  126.86,
  126.631,
  126.8,
  126.711,
  126.8,
  126.134,
  125.925,
  126.989,
  127.815,
  128.472,
  128.064,
  127.606,
  127.596,
  126.999,
  126.9,
  127.487,
  127.397,
];
const close = [
  125.357,
  126.163,
  124.93,
  126.094,
  126.82,
  126.482,
  126.034,
  124.83,
  126.392,
  125.716,
  124.562,
  124.572,
  125.069,
  127.288,
  127.178,
  128.014,
  127.109,
  127.725,
  127.059,
  127.327,
  128.71,
  127.875,
  128.581,
  128.601,
  127.934,
  128.113,
  127.596,
  127.596,
  128.69,
  128.273,
];
const period = 14;
const signalPeriod = 3;

const candles = high.map((item, index) => ({
  time: index,
  high: item,
  low: low[index],
  close: close[index],
}));

const expected = new Map([
  [
    13,
    {
      d: undefined,
      k: 70.43927648578827,
      time: 13,
      cross: null,
    },
  ],
  [
    14,
    {
      d: undefined,
      k: 67.59689922480636,
      cross: null,
      time: 14,
    },
  ],
  [
    15,
    {
      d: 75.74504737295463,
      k: 89.19896640826927,
      time: 15,
      cross: null,
    },
  ],
  [
    16,
    {
      d: 74.2032730404826,
      k: 65.81395348837218,
      time: 16,
      cross: {
        long: false,
        name: "KD",
        time: 16,
      },
    },
  ],
  [
    17,
    {
      d: 78.91472868217079,
      k: 81.73126614987092,
      time: 17,
      cross: {
        long: true,
        name: "KD",
        time: 17,
      },
    },
  ],
  [
    18,
    {
      d: 70.68906115417757,
      k: 64.52196382428956,
      time: 18,
      cross: {
        long: false,
        name: "KD",
        time: 18,
      },
    },
  ],
  [
    19,
    {
      d: 73.58714959436897,
      k: 74.50821880894642,
      time: 19,
      cross: {
        long: true,
        name: "KD",
        time: 19,
      },
    },
  ],
  [
    20,
    {
      d: 79.20144237330932,
      k: 98.57414448669196,
      time: 20,
      cross: null,
    },
  ],
  [
    21,
    {
      d: 81.06625513734681,
      k: 70.11640211640204,
      time: 21,
      cross: {
        long: false,
        name: "KD",
        time: 21,
      },
    },
  ],
  [
    22,
    {
      d: 80.58333011353209,
      k: 73.05944373750224,
      time: 22,
      cross: null,
    },
  ],
  [
    23,
    {
      d: 72.19961995045314,
      k: 73.42301399745516,
      time: 23,
      cross: {
        long: true,
        name: "Stochastic",
        time: 23,
      },
    },
  ],
  [
    24,
    {
      d: 69.23664028547631,
      k: 61.22746312147157,
      time: 24,
      cross: {
        long: false,
        name: "KD",
        time: 24,
      },
    },
  ],
  [
    25,
    {
      d: 65.20120696381794,
      k: 60.95314377252715,
      time: 25,
      cross: null,
    },
  ],
  [
    26,
    {
      d: 54.187477954516474,
      k: 40.38182696955075,
      time: 26,
      cross: null,
    },
  ],
  [
    27,
    {
      d: 47.238932570542865,
      k: 40.38182696955075,
      time: 27,
      cross: null,
    },
  ],
  [
    28,
    {
      d: 49.19445787014681,
      k: 66.81971967133897,
      time: 28,
      cross: {
        long: true,
        name: "KD",
        time: 28,
      },
    },
  ],
  [
    29,
    {
      d: 54.647978089254224,
      k: 56.74238762687298,
      time: 29,
      cross: null,
    },
  ],
]);

it("Stochastic", () => {
  expect(Stochastic({ candles, signalPeriod, period }).result()).toEqual(
    expected
  );
});

it("Stochastic add", () => {
  const stoch = Stochastic({ candles: [], signalPeriod, period });
  const result = [];

  candles.forEach((item) => {
    const res = stoch.update(item);
    if (res) result.push(res);
  });

  expect(result).toEqual([...expected.values()]);
});

it("Stochastic update", () => {
  const stoch = Stochastic({
    candles,
    signalPeriod,
    period,
  });
  expect(stoch.result()).toEqual(expected);

  expect(
    stoch.update({
      ...candles[candles.length - 1],
      high: candles[candles.length - 1].high + 10,
      low: candles[candles.length - 1].low + 10,
      close: candles[candles.length - 1].close + 10,
    })
  ).toEqual({
    d: 68.10251827318741,
    k: 97.10600817867258,
    time: 29,
    cross: null,
  });

  expect(stoch.update(candles[candles.length - 1])).toEqual({
    ...Array.from(expected.values()).pop(),
  });
});

it("get result Stochastic by time", () => {
  const stochastic = Stochastic({ candles, signalPeriod, period });
  expect(stochastic.result(candles[candles.length - 1].time)).toEqual(
    [...expected.values()].pop()
  );
});
