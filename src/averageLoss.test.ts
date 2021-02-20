import { averageLoss } from './averageLoss';

it('averageLoss', () => {
  const result = averageLoss(
    [
      { time: 1, close: 1 },
      { time: 2, close: 2 },
      { time: 3, close: 3 },
      { time: 4, close: 4 },
      { time: 5, close: 5 },
      { time: 6, close: 6 },
      { time: 7, close: 7 },
      { time: 8, close: 8 },
      { time: 9, close: 9 },
      { time: 10, close: 8 },
    ],
    6,
  );

  const expected = [
    { time: 7, value: 0 },
    { time: 8, value: 0 },
    { time: 9, value: 0 },
    { time: 10, value: 0.17 },
  ];

  expect(
    result.result().map((a) => ({
      time: a.time,
      value: parseFloat(a.value.toFixed(2)),
    })),
  ).toEqual(expected);

  expect(result.update({ time: 10, close: 7 })).toEqual({
    time: 10,
    value: 0.3333333333333333,
  });

  expect(result.update({ time: 11, close: 9 })).toEqual({
    time: 11,
    value: 0.27777777777777773,
  });
});

it('averageLoss empty input', () => {
  const loss = averageLoss([], 2);

  expect(loss.update({ time: 0, close: 10 })).toEqual(undefined);
  expect(loss.update({ time: 1, close: 9 })).toEqual(undefined);
  expect(loss.update({ time: 2, close: 8 })).toEqual({ time: 2, value: 1 });
});
