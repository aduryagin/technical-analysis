import { RSI } from "./rsi";

const inputRSI = [
  44.34,
  44.09,
  44.15,
  43.61,
  44.33,
  44.83,
  45.1,
  45.42,
  45.84,
  46.08,
  45.89,
  46.03,
  45.61,
  46.28,
  46.28,
  46.0,
  46.03,
  46.41,
  46.22,
  45.64,
  46.21,
  46.25,
  45.71,
  46.45,
  45.78,
  45.35,
  44.03,
  44.18,
  44.22,
  44.57,
  43.42,
  42.66,
  43.13,
].map((item, index) => ({ time: index, close: item }));

const expectedResult = [
  70.46,
  66.25,
  66.48,
  69.35,
  66.29,
  57.92,
  62.88,
  63.21,
  56.01,
  62.34,
  54.67,
  50.39,
  40.02,
  41.49,
  41.9,
  45.5,
  37.32,
  33.09,
  37.79,
].map((item, index) => ({
  value: item,
  time: index + 14,
  candle: inputRSI[index + 14],
}));

it("rsi", () => {
  expect(RSI({ candles: inputRSI, period: 14 }).result()).toEqual(
    expectedResult
  );
});

it("rsi update", () => {
  const rsi = RSI({ candles: inputRSI, period: 14 });
  const firstResult = rsi.update({ time: 32, close: 45 });
  expect(firstResult).toEqual({
    time: 32,
    value: 51.37,
    candle: { close: 45, time: 32 },
  });

  const secondResult = rsi.update({ time: 32, close: 43.13 });
  expect(secondResult).toEqual({
    time: 32,
    value: 37.79,
    candle: { close: 43.13, time: 32 },
  });
});

it("rsi add when update", () => {
  const rsi = RSI({ candles: [], period: 14 });
  const result = [];

  inputRSI.forEach((item) => {
    const rsiResult = rsi.update(item);

    if (rsiResult) result.push(rsiResult);
  });

  expect(result).toEqual(expectedResult);
});
