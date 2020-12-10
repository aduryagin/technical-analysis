import { VWAP } from './vwap';

const inputVWAP = {
  high: [
    127.36,
    127.31,
    127.21,
    127.15,
    127.08,
    127.19,
    127.09,
    127.08,
    127.18,
    127.16,
    127.31,
    127.35,
    127.34,
    127.29,
    127.36,
  ],
  low: [
    126.99,
    127.1,
    127.11,
    126.93,
    126.98,
    126.99,
    126.82,
    126.95,
    127.05,
    127.05,
    127.08,
    127.2,
    127.25,
    127.17,
    127.25,
  ],
  close: [
    127.28,
    127.11,
    127.15,
    127.04,
    126.98,
    127.07,
    126.93,
    127.05,
    127.11,
    127.15,
    127.3,
    127.28,
    127.28,
    127.29,
    127.25,
  ],
  volume: [
    89329,
    16137,
    23945,
    20679,
    27252,
    20915,
    17372,
    17600,
    13896,
    6700,
    13848,
    9925,
    5540,
    10803,
    19400,
  ],
};
const expectedResult = [
  127.21,
  127.2,
  127.2,
  127.17,
  127.15,
  127.14,
  127.13,
  127.12,
  127.12,
  127.12,
  127.12,
  127.13,
  127.13,
  127.14,
  127.15,
].map((item, index) => ({
  time: index,
  value: item,
}));
const candles = inputVWAP.high.map((item, index) => ({
  time: index,
  high: item,
  close: inputVWAP.close[index],
  low: inputVWAP.low[index],
  volume: inputVWAP.volume[index],
}));

it('vwap', () => {
  expect(
    VWAP(candles).result.map((item) => ({
      ...item,
      value: parseFloat(item.value.toFixed(2)),
    })),
  ).toEqual(expectedResult);
});

it('vwap add', () => {
  const vwap = VWAP([]);
  const result = [];
  candles.forEach((candle) => {
    result.push(vwap.update(candle));
  });

  expect(
    result.map((item) => ({
      ...item,
      value: parseFloat(item.value.toFixed(2)),
    })),
  ).toEqual(expectedResult);
});

it('vwap update', () => {
  const vwap = VWAP([]);
  const result = [];
  candles.forEach((candle) => {
    result.push(vwap.update(candle));
  });

  expect(
    result.map((item) => ({
      ...item,
      value: parseFloat(item.value.toFixed(2)),
    })),
  ).toEqual(expectedResult);

  expect(
    vwap.update({ time: 14, close: 200, high: 200, low: 200, volume: 20000 })
      .value,
  ).toEqual(131.77924515540604);

  expect(vwap.update(candles[candles.length - 1]).value).toEqual(
    127.14668471941644,
  );
});
