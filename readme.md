# Technical indicators

Technical indicators with possibility of update/add last item (candle) of result. This may be usefull when use realtime (for example WebSockets) data.

## Indicators
* ATR 
* Average gain
* Average loss
* Bollinger bands
* EMA
* PMax - https://www.tradingview.com/script/sU9molfV/
* RMA
* RSI
* SMA
* Standard deviation
* Stochastic
* True range
* VWAP

## Example
```js script
const candles = [
    { time: 0, close: 12.2 },
    { time: 1, close: 12.4 },
    { time: 2, close: 13 }
  ];
  const period = 1;
  const rsi = RSI(candles, period);
  console.log(rsi);
  /*
    {
      result: [
        { time: 1, value: 100, candle: { time: 1, close: 12.4 } },
        { time: 2, value: 100, candle: { time: 2, close: 13 } }
      ],
      update: [Function: update]
    }
  */
  const rsiResult = rsi.update({ time: 2, close: 1 });
  console.log(rsiResult);
  /*
    { time: 2, value: 0, candle: { time: 2, close: 1 } }
  */
```