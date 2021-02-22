import { OTT } from "./ott";

const candles = [
  {
    time: 0,
    open: 22,
    high: 22.75,
    low: 18.51,
    close: 18.6,
  },
  {
    time: 1,
    open: 18.9,
    high: 19.44,
    low: 18,
    close: 18.8,
  },
  {
    time: 2,
    open: 20.55,
    high: 20.66,
    low: 17.99,
    close: 18.01,
  },
  {
    time: 3,
    open: 18.55,
    high: 19.48,
    low: 18.02,
    close: 18.68,
  },
  {
    time: 4,
    open: 19.25,
    high: 19.29,
    low: 18.68,
    close: 18.76,
  },
  {
    time: 5,
    open: 18.75,
    high: 18.88,
    low: 18.25,
    close: 18.32,
  },
  {
    time: 6,
    open: 18.33,
    high: 18.47,
    low: 16.9,
    close: 17,
  },
  {
    time: 7,
    open: 17.1,
    high: 17.25,
    low: 16.25,
    close: 17,
  },
  {
    time: 8,
    open: 16.86,
    high: 17.37,
    low: 16,
    close: 16.18,
  },
  {
    time: 9,
    open: 16,
    high: 16.14,
    low: 14.75,
    close: 15.5,
  },
];

const expected = [
  {
    candle: candles[0],
    var: 12.4,
    ott: 0,
    time: candles[0].time,
  },
  {
    candle: candles[1],
    var: 16.666666666666668,
    ott: 0,
    time: candles[1].time,
  },
  {
    candle: candles[2],
    var: 17.48999262662356,
    ott: 12.3119848,
    time: candles[2].time,
  },
  {
    candle: candles[3],
    var: 18.221461456326484,
    ott: 16.548366666666666,
    time: candles[3].time,
  },
  {
    candle: candles[4],
    var: 18.552598233754054,
    ott: 17.365848658959788,
    time: candles[4].time,
  },
  {
    candle: candles[5],
    var: 18.415889871791453,
    ott: 18.092125522909477,
    time: candles[5].time,
  },
  {
    candle: candles[6],
    var: 17.68979250164199,
    ott: 18.420911891490867,
    time: candles[6].time,
  },
  {
    candle: candles[7],
    var: 17.336052757210197,
    ott: 18.420911891490867,
    time: candles[7].time,
  },
  {
    candle: candles[8],
    var: 16.79198837059993,
    ott: 17.81188744948832,
    time: candles[8].time,
  },
  {
    candle: candles[9],
    var: 16.25796651075196,
    ott: 17.45570619334046,
    time: candles[9].time,
  },
];

it("OTT", () => {
  const ott = OTT({ candles });
  expect(ott.result()).toEqual(expected);
});

it("OTT update", () => {
  const ott = OTT({ candles });
  const firstResult = ott.update({ ...candles[9], close: 12.5 });
  expect(firstResult).toEqual({
    ott: 17.45570619334046,
    time: 9,
    var: 14.610227615544966,
    candle: { ...candles[9], close: 12.5 },
  });

  const secondResult = ott.update(candles[9]);
  expect(secondResult).toEqual(expected[9]);
});

it("OTT add", () => {
  const ott = OTT({ candles: [] });

  const result = [];
  candles.forEach((item) => {
    const res = ott.update(item);
    if (res) result.push(res);
  });

  expect(result).toEqual(expected);
});
