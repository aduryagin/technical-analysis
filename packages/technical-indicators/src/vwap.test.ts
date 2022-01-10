import { VWAP } from "./vwap";

const inputVWAP = {
  high: [
    127.36, 127.31, 127.21, 127.15, 127.08, 127.19, 127.09, 127.08, 127.18,
    127.16, 127.31, 127.35, 127.34, 127.29, 127.36,
  ],
  low: [
    126.99, 127.1, 127.11, 126.93, 126.98, 126.99, 126.82, 126.95, 127.05,
    127.05, 127.08, 127.2, 127.25, 127.17, 127.25,
  ],
  close: [
    127.28, 127.11, 127.15, 127.04, 126.98, 127.07, 126.93, 127.05, 127.11,
    127.15, 127.3, 127.28, 127.28, 127.29, 127.25,
  ],
  volume: [
    89329, 16137, 23945, 20679, 27252, 20915, 17372, 17600, 13896, 6700, 13848,
    9925, 5540, 10803, 19400,
  ],
};
const expectedResult = new Map(
  [
    127.21, 127.2043897559403, 127.19555952224567, 127.1741269460546,
    127.14941792318422, 127.14244637011556, 127.12667351484882,
    127.11912676668281, 127.11880099814533, 127.11883264716504,
    127.12458386414268, 127.1300213017865, 127.13315151386719,
    127.13744596137772, 127.14668471941644,
  ].map((item, index) => [
    index,
    {
      time: index,
      value: item,
    },
  ])
);
const candles = inputVWAP.high.map((item, index) => ({
  time: index,
  high: item,
  close: inputVWAP.close[index],
  low: inputVWAP.low[index],
  volume: inputVWAP.volume[index],
}));

it("vwap", () => {
  expect(VWAP({ candles }).result()).toEqual(expectedResult);
});

it("vwap add", () => {
  const vwap = VWAP({ candles: [] });
  const result = [];
  candles.forEach((candle) => {
    result.push(vwap.update(candle));
  });

  expect(
    result.map((item) => ({
      ...item,
      value: item.value,
    }))
  ).toEqual(Array.from(expectedResult.values()));
});

it("vwap update", () => {
  const vwap = VWAP({ candles: [] });
  const result = [];
  candles.forEach((candle) => {
    result.push(vwap.update(candle));
  });

  expect(
    result.map((item) => ({
      ...item,
      value: item.value,
    }))
  ).toEqual(Array.from(expectedResult.values()));

  expect(
    vwap.update({ time: 14, close: 200, high: 200, low: 200, volume: 20000 })
      .value
  ).toEqual(131.77924515540604);

  expect(vwap.update(candles[candles.length - 1]).value).toEqual(
    127.14668471941644
  );
});
