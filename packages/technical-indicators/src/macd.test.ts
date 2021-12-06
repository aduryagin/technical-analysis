import { MACD } from "./macd";

const candles = [
  { time: 1, close: 15.27, high: 22.75, low: 13.03 },
  { time: 2, close: 16.6, high: 17.94, low: 14.4 },
  { time: 3, close: 22.6, high: 24.4, low: 15.9 },
  { time: 4, close: 20.35, high: 23.39, low: 18.21 },
  { time: 5, close: 26.03, high: 29.79, low: 19.54 },
  { time: 6, close: 20.78, high: 28.95, low: 20.74 },
];
const expectedResult = new Map([
  [
    candles[3].time,
    {
      candle: candles[3],
      time: 4,
      histogram: -0.4842592592592595,
      macd: -0.009444444444444144,
      signal: 0.47481481481481536,
      cross: null,
      histogramState: "fallBelow",
    },
  ],
  [
    candles[4].time,
    {
      candle: candles[4],
      time: 5,
      histogram: 0.47179012345679006,
      macd: 1.8901851851851852,
      signal: 1.4183950617283951,
      cross: {
        long: true,
        name: "signal",
        time: 5,
      },
      histogramState: "growAbove",
    },
  ],
  [
    candles[5].time,
    {
      candle: candles[5],
      time: 6,
      histogram: -0.8461111111111108,
      macd: -1.119938271604937,
      signal: -0.27382716049382627,
      cross: {
        long: false,
        name: "signal",
        time: 6,
      },
      histogramState: "fallBelow",
    },
  ],
]);

it("MACD", () => {
  const pmax = MACD({
    candles,
    fastLength: 1,
    slowLength: 2,
    signalSmoothing: 2,
  });
  expect(pmax.result()).toEqual(expectedResult);
});

it("MACD add", () => {
  const macd = MACD({
    candles: [],
    fastLength: 1,
    slowLength: 2,
    signalSmoothing: 2,
  });
  const result = [];

  candles.forEach((item) => {
    const res = macd.update(item);
    if (res)
      result.push({
        ...res,
      });
  });

  expect(result).toEqual(Array.from(expectedResult.values()));
});

it("MACD update", () => {
  const macd = MACD({
    candles,
    fastLength: 1,
    slowLength: 2,
    signalSmoothing: 2,
  });

  expect(macd.update({ time: 6, close: 10, high: 10, low: 10 })).toEqual({
    candle: { time: 6, close: 10, high: 10, low: 10 },
    time: 6,
    histogram: -2.0438888888888895,
    macd: -4.713271604938273,
    signal: -2.669382716049383,
    cross: {
      long: false,
      name: "signal",
      time: 6,
    },
    histogramState: "fallBelow",
  });
  expect(macd.update(candles[5])).toEqual({
    candle: candles[5],
    time: 6,
    histogram: -0.8461111111111108,
    macd: -1.119938271604937,
    signal: -0.27382716049382627,
    cross: {
      long: false,
      name: "signal",
      time: 6,
    },
    histogramState: "fallBelow",
  });
});

it("get result MACD by time", () => {
  const macd = MACD({
    candles,
    fastLength: 1,
    slowLength: 2,
    signalSmoothing: 2,
  });
  expect(macd.result(candles[5].time)).toEqual([...expectedResult.values()][2]);
});
