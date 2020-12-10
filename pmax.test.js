import { PMax } from './pmax';

const candles = [
  { time: 1, close: 15.27, high: 22.75, low: 13.03 },
  { time: 2, close: 16.6, high: 17.94, low: 14.4 },
  { time: 3, close: 22.6, high: 24.4, low: 15.9 },
  { time: 4, close: 20.35, high: 23.39, low: 18.21 },
  { time: 5, close: 26.03, high: 29.79, low: 19.54 },
  { time: 6, close: 20.78, high: 28.95, low: 20.74 },
  { time: 7, close: 14.64, high: 20.99, low: 13.5 },
  { time: 8, close: 13.1, high: 15.47, low: 13.04 },
  { time: 9, close: 15.73, high: 15.75, low: 11.54 },
  { time: 10, close: 15.92, high: 18.48, low: 14.35 },
];
const expectedResult = [
  { candle: candles[2], time: 3, ema: 18.07, pmax: 10.82 },
  { candle: candles[3], time: 4, ema: 19.44, pmax: 12.87 },
  { candle: candles[4], time: 5, ema: 22.05, pmax: 14.26 },
  { candle: candles[5], time: 6, ema: 23.45, pmax: 15.52 },
  { candle: candles[6], time: 7, ema: 20.35, pmax: 15.52 },
  { candle: candles[7], time: 8, ema: 17.3, pmax: 15.52 },
  { candle: candles[8], time: 9, ema: 15.47, pmax: 20.88 },
  { candle: candles[9], time: 10, ema: 15.94, pmax: 20.88 },
];

it('PMax', () => {
  expect(
    PMax({ candles, emaPeriod: 3, atrPeriod: 3, multiplier: 1 }).result.map(
      (item) => ({
        ...item,
        time: item.time,
        pmax: parseFloat(item.pmax.toFixed(2)),
        ema: parseFloat(item.ema.toFixed(2)),
      }),
    ),
  ).toEqual(expectedResult);
});

it('PMax add', () => {
  const atr = PMax({ candles: [], emaPeriod: 3, atrPeriod: 3, multiplier: 1 });
  const result = [];

  candles.forEach((item) => {
    const res = atr.update(item);
    if (res)
      result.push({
        ...res,
        ema: parseFloat(res.ema.toFixed(2)),
        pmax: parseFloat(res.pmax.toFixed(2)),
      });
  });

  expect(result).toEqual(expectedResult);
});

it('PMax update', () => {
  const pmax = PMax({ candles, emaPeriod: 3, atrPeriod: 3, multiplier: 1 });

  expect(pmax.update({ time: 10, close: 10, high: 10, low: 10 })).toEqual({
    candle: { time: 10, close: 10, high: 10, low: 10 },
    time: 10,
    ema: 12.736406249999998,
    pmax: 18.24832973727328,
  });
  expect(
    pmax.update({ time: 10, close: 15.92, high: 18.48, low: 14.35 }),
  ).toEqual({
    candle: { time: 10, close: 15.92, high: 18.48, low: 14.35 },
    time: 10,
    ema: 15.943906249999998,
    pmax: 20.87569773090992,
  });
});
