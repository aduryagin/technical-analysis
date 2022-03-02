from pandas_ta.overlap import ema, hl2
from pandas_ta.volatility import atr
from pandas import DataFrame
from numpy import NaN as npNaN
import arrow

def pmax(high, low, close, multiplier=3):
  length = 10

  # Calculate Results
  hl2_ = hl2(high, low)
  mavg = ema(hl2_, length)
  matr = multiplier * atr(high, low, close, length)

  m = close.size
  direction = [1] * m
  trend, long, short = [npNaN] * m, [npNaN] * m, [npNaN] * m

  long_stop = mavg - matr
  short_stop = mavg + matr

  for i in range(1, m):
      long_stop_prev = long_stop.iloc[i - 1]
      long_stop_item = (
          long_stop.iloc[i]
          if mavg.iloc[i] <= long_stop_prev
          else max(long_stop.iloc[i], long_stop_prev)
      )
      long_stop.iloc[i] = long_stop_item

      short_stop_prev = short_stop.iloc[i - 1]
      short_stop_item = (
          short_stop.iloc[i]
          if mavg.iloc[i] >= short_stop_prev
          else min(short_stop.iloc[i], short_stop_prev)
      )
      short_stop.iloc[i] = short_stop_item

      direction_item = direction[i - 1]

      if direction_item == -1 and mavg.iloc[i] > short_stop_prev:
          direction_item = 1
      elif direction_item == 1 and mavg.iloc[i] < long_stop_prev:
          direction_item = -1

      direction[i] = direction_item
      trend[i] = long_stop_item if direction_item == 1 else short_stop_item
      long[i] = long_stop_item if direction_item == 1 else npNaN
      short[i] = short_stop_item if direction_item == -1 else npNaN

  # Prepare DataFrame to return
  # _props = f"_{length}_{multiplier}"
  df = DataFrame(
      {
          f"PMax": trend,
          f"Close": close,
          f"High": high,
          f"Low": low,
          f"PMaxMAvg": mavg,
          f"PMaxLong": long,
          f"PMaxShort": short,
          f"PMaxDirection": direction,
      },
      index=close.index,
  )

  df.name = f"PMax"
  df.category = "overlap"

  return df

def get_trades(companies, candles_storage):
  trades = {}
  pmax_multiplier = 3

  for company in companies:
      figi = company["bbGlobal"]

      candles = candles_storage[figi]
      pmax_result = pmax(high=candles['High'], low=candles['Low'], close=candles['Close'], multiplier=pmax_multiplier)

      index = 0
      trades[figi] = []

      for (date, pmax_value, mavg, close, high, low) in zip(pmax_result.index, pmax_result['PMax'], pmax_result['PMaxMAvg'], pmax_result['Close'], pmax_result['High'], pmax_result['Low']):
        is_sell = False
        is_buy = False

        if index == 0:
          index += 1
          continue

        if (
            pmax_result['PMax'][index - 1] >= pmax_result['PMaxMAvg'][index - 1]
            and pmax_result['PMax'][index - 2] < pmax_result['PMaxMAvg'][index - 2]
        ):
            is_sell = True
        elif (
            pmax_result['PMax'][index - 1] <= pmax_result['PMaxMAvg'][index - 1]
            and pmax_result['PMax'][index - 2] > pmax_result['PMaxMAvg'][index - 2]
        ):
            is_buy = True

        last_trade = trades[figi][-1] if len(trades[figi]) > 0 else False
        
        if is_sell or is_buy:
          local_date = arrow.get(date)

          if last_trade:
            one_percent = last_trade['price_in'] / 100
            last_trade['price_out'] = close
            last_trade['time_out'] = local_date
            last_trade['profit'] = ((last_trade['price_in'] - last_trade['price_out']) / one_percent) if last_trade['type'] == 'short' else (last_trade['price_out'] - last_trade['price_in']) / one_percent
            last_trade['run_up'] = ((last_trade['price_in'] - last_trade['best_price']) / one_percent) if last_trade['type'] == 'short' else (last_trade['best_price'] - last_trade['price_in']) / one_percent

          trades[figi].append({
            "figi": figi,
            "run_up": 0,
            "profit": 0,
            "time": local_date,
            "type": "short" if is_sell else "long",
            "price_in": close,
            "best_price": close
          })
        else:
          if last_trade:
            if (last_trade["type"] == "short" and low < last_trade["best_price"]) or (last_trade["type"] == "long" and high > last_trade["best_price"]):
              last_trade["best_price"] = low if last_trade["type"] == "short" else high

        index += 1

  return trades