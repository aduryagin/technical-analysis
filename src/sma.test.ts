import { SMA } from './sma';

it('sma', () => {
  expect(
    SMA(
      { candles: [
        { time: 0, close: 5 },
        { time: 1, close: 5 },
        { time: 2, close: 5 },
        { time: 3, close: 2 },
        { time: 4, close: 2 },
      ],
      period: 3,
      }).result(),
  ).toEqual([
    {
      time: 2,
      value: 5,
      candle: { time: 2, close: 5 }
    },
    {
      time: 3,
      value: 4,
      candle: { time: 3, close: 2 }
    },
    {
      time: 4,
      value: 3,
      candle: { time: 4, close: 2 }
    },
  ]);
});

it('sma calculate in update', () => {
  const result = [];
  const sma = SMA({candles: [], period: 4 });
  [0.001, 0.003, 0.001, 0.003, 0.004, 0.002, 0.003, 0.003, 0.002].forEach(
    (item, index) => {
      const res = sma.update({ time: index, close: item });
      if (res) result.push(res);
    },
  );

  expect(result).toEqual([
    {
      time: 3,
      value: 0.002,
      candle: { time: 3, close: 0.003 }
    },
    {
      time: 4,
      value: 0.00275,
      candle: { time: 4, close: 0.004 }
    },
    {
      time: 5,
      value: 0.0025,
      candle: { time: 5, close: 0.002 }
    },
    {
      time: 6,
      value: 0.003,
      candle: { time: 6, close: 0.003 }
    },
    {
      time: 7,
      value: 0.003,
      candle: { time: 7, close: 0.003 }
    },
    {
      time: 8,
      value: 0.0025,
      candle: { time: 8, close: 0.002 }
    },
  ]);
});

it('sma update', () => {
  const sma = SMA(
    {candles: [
      { time: 0, close: 5 },
      { time: 1, close: 5 },
      { time: 2, close: 5 },
      { time: 3, close: 2 },
      { time: 4, close: 2 },
    ],
    period: 3,
    });

  expect(sma.update({ time: 4, close: 5 })).toEqual({ time: 4, value: 4, candle: { time: 4, close: 5 } });
  expect(sma.update({ time: 5, close: 5 })).toEqual({ time: 5, value: 4, candle: { time: 5, close: 5 } });
  expect(sma.update({ time: 6, close: 5 })).toEqual({ time: 6, value: 5, candle: { time: 6, close: 5 } });
});
