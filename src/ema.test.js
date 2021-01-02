import { EMA } from './ema';

const close = [
  127.75,
  129.02,
  132.75,
  145.4,
  148.98,
  137.52,
  147.38,
  139.05,
  137.23,
  149.3,
  162.45,
  178.95,
  200.35,
  221.9,
  243.23,
  243.52,
  286.42,
  280.27,
];
const period = 9;
const expectedOutput = [
  138.3422222222222,
  140.53377777777777,
  144.91702222222222,
  151.72361777777778,
  161.4488942222222,
  173.53911537777776,
  187.4772923022222,
  198.68583384177776,
  216.23266707342222,
  229.04013365873777,
];

it('ema', () => {
  expect(
    EMA({
      candles: close.map((item, index) => ({ close: item, time: index })),
      period,
    }).result,
  ).toEqual(
    expectedOutput.map((item, index) => ({
      time: index + period - 1,
      value: item,
    })),
  );
});

it('ema add', () => {
  const result = [];
  const ema = EMA({ candles: [], period });
  close.forEach((item, index) => {
    const res = ema.update({ close: item, time: index });
    if (res) result.push(res);
  });

  expect(result).toEqual(
    expectedOutput.map((item, index) => ({
      time: index + period - 1,
      value: item,
    })),
  );
});

it('ema update', () => {
  const result = [];
  const ema = EMA({ candles: [], period });
  close.forEach((item, index) => {
    const res = ema.update({ close: item, time: index });
    if (res) result.push(res);
  });

  expect(result).toEqual(
    expectedOutput.map((item, index) => ({
      time: index + period - 1,
      value: item,
    })),
  );

  expect(ema.update({ close: 200, time: 17 })).toEqual({
    time: 17,
    value: 212.98613365873777,
  });

  expect(ema.update({ close: close[close.length - 1], time: 17 })).toEqual({
    time: 17,
    value: expectedOutput[expectedOutput.length - 1],
  });
});
