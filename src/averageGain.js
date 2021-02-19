export function averageGain(candles, period) {
  let counter = 1;
  let gainSum = 0;
  let gain = 0;
  let candlesStack = [...candles];
  let result = [];

  function calculate(candle, lastCandle) {
    const currentValue = candle.close;
    const lastValue = lastCandle.close;

    gain = currentValue - lastValue;
    gain = gain > 0 ? gain : 0;
    if (gain > 0) {
      gainSum += gain;
    }

    if (counter < period) {
      counter += 1;
    } else if (result.length === 0) {
      return { time: candle.time, value: gainSum / period };
    } else {
      return {
        time: candle.time,
        value: (result[result.length - 1].value * (period - 1) + gain) / period,
      };
    }

    return undefined;
  }

  candlesStack.forEach((candle, index) => {
    if (index !== 0) {
      const item = calculate(candle, candlesStack[index - 1]);
      if (item) result.push(item);
    }
  });

  return {
    result: () => result,
    update: (candle) => {
      if (result.length && result[result.length - 1].time === candle.time) {
        gainSum -= gain;
        result = result.slice(0, -1);
        candlesStack = candlesStack.slice(0, -1);
      }

      if (candlesStack.length) {
        const item = calculate(candle, candlesStack[candlesStack.length - 1]);
        candlesStack.push(candle);
        if (item) result.push(item);
        return item;
      }

      candlesStack.push(candle);
      return undefined;
    },
  };
}
