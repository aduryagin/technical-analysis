import { highest } from "./highest";

const candles = [
  { close: 200, time: 0 },
  { close: 5, time: 1 },
  { close: 6, time: 2 },
  { close: 100, time: 3 },
  { close: 2, time: 4 },
];

const expected = [
  { time: 1, value: 200 },
  { time: 2, value: 6 },
  { time: 3, value: 100 },
  { time: 4, value: 100 },
];

it("highest", () => {
  const instance = highest({
    candles,
    period: 2,
  });

  expect(instance.result()).toEqual(expected);
});

it("highest update", () => {
  const instance = highest({
    candles,
    period: 2,
  });
  const firstResult = instance.update({ close: 101, time: 4 });
  expect(firstResult).toEqual({ value: 101, time: 4 });

  const secondResult = instance.update({ close: 2, time: 4 });
  expect(secondResult).toEqual({ value: 100, time: 4 });
});

it("highest add", () => {
  const instance = highest({ candles: [], period: 2 });

  const result = [];
  candles.forEach((item) => {
    const res = instance.update(item);
    if (res) result.push(res);
  });

  expect(result).toEqual(expected);
});
