import { RMA } from "./rma";

const candles = [
  { time: 1, close: 15.27 },
  { time: 2, close: 16.6 },
  { time: 3, close: 22.6 },
  { time: 4, close: 20.35 },
  { time: 5, close: 26.03 },
  { time: 6, close: 20.78 },
  { time: 7, close: 14.64 },
  { time: 8, close: 13.1 },
  { time: 9, close: 15.73 },
  { time: 10, close: 15.92 },
];
const expectedResult = [
  { time: 3, value: 18.16 },
  { time: 4, value: 18.89 },
  { time: 5, value: 21.27 },
  { time: 6, value: 21.11 },
  { time: 7, value: 18.95 },
  { time: 8, value: 17 },
  { time: 9, value: 16.58 },
  { time: 10, value: 16.36 },
];

it("rma", () => {
  expect(
    RMA({ candles, period: 3 })
      .result()
      .map((item) => ({
        time: item.time,
        value: parseFloat(item.value.toFixed(2)),
      }))
  ).toEqual(expectedResult);
});

it("rma add", () => {
  const rma = RMA({ candles: [], period: 3 });
  const result = [];

  candles.forEach((item) => {
    const res = rma.update(item);
    if (res) result.push({ ...res, value: parseFloat(res.value.toFixed(2)) });
  });

  expect(result).toEqual(expectedResult);
});

it("rma update", () => {
  const rma = RMA({ candles, period: 3 });
  expect(rma.update({ time: 10, close: 18 })).toEqual({
    time: 10,
    value: 17.051245237006558,
  });
  expect(rma.update({ time: 10, close: 15.92 })).toEqual({
    time: 10,
    value: 16.357911903673227,
  });
});
