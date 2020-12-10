import { averageGain } from './averageGain';

it('averageGain', () => {
  const result = averageGain(
    [
      { time: 0, close: 44.3389 },
      { time: 1, close: 44.0902 },
      { time: 2, close: 44.1497 },
      { time: 3, close: 43.6124 },
      { time: 4, close: 44.3278 },
      { time: 5, close: 44.8264 },
      { time: 6, close: 45.0955 },
      { time: 7, close: 45.4245 },
      { time: 8, close: 45.8433 },
      { time: 9, close: 46.0826 },
      { time: 10, close: 45.8931 },
      { time: 11, close: 46.0328 },
      { time: 12, close: 45.614 },
      { time: 13, close: 46.282 },
      { time: 14, close: 46.282 },
      { time: 15, close: 46.0028 },
      { time: 16, close: 46.0328 },
      { time: 17, close: 46.4116 },
      { time: 18, close: 46.2222 },
      { time: 19, close: 45.6439 },
      { time: 20, close: 46.2122 },
      { time: 21, close: 46.2521 },
      { time: 22, close: 45.7137 },
      { time: 23, close: 46.4515 },
      { time: 24, close: 45.7835 },
      { time: 25, close: 45.3548 },
      { time: 26, close: 44.0288 },
      { time: 27, close: 44.1783 },
      { time: 28, close: 44.2181 },
      { time: 29, close: 44.5672 },
      { time: 30, close: 43.4205 },
      { time: 31, close: 42.6628 },
    ],
    14,
  );

  const expected = [
    { time: 14, value: 0.24 },
    { time: 15, value: 0.22 },
    { time: 16, value: 0.21 },
    { time: 17, value: 0.22 },
    { time: 18, value: 0.2 },
    { time: 19, value: 0.19 },
    { time: 20, value: 0.22 },
    { time: 21, value: 0.2 },
    { time: 22, value: 0.19 },
    { time: 23, value: 0.23 },
    { time: 24, value: 0.21 },
    { time: 25, value: 0.2 },
    { time: 26, value: 0.18 },
    { time: 27, value: 0.18 },
    { time: 28, value: 0.17 },
    { time: 29, value: 0.18 },
    { time: 30, value: 0.17 },
    { time: 31, value: 0.16 },
  ];

  expect(
    result.result.map((a) => ({
      time: a.time,
      value: parseFloat(a.value.toFixed(2)),
    })),
  ).toEqual(expected);

  expect(result.update({ time: 31, close: 43.6628 })).toEqual({
    time: 31,
    value: 0.17539812768884025,
  });

  expect(result.update({ time: 32, close: 43.1314 })).toEqual({
    time: 32,
    value: 0.16286968999678025,
  });
});
