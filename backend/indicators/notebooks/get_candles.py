import tinvest
from datetime import datetime, timedelta
import pandas as pd
import pytz
import os
from dateutil.relativedelta import relativedelta
import requests

tz = pytz.timezone("Europe/Moscow")

def day_candles(ticker, now=datetime.now(tz), days_period=10):
  from_pure_date = now - relativedelta(days=days_period)
  from_date = from_pure_date.isoformat()
  to_date = now.isoformat()
  
  response = requests.post(
    url="https://www.tinkoff.ru/api/trading/symbols/candles",
    json={
      "ticker": ticker,
      "from": from_date,
      "to": to_date,
      "resolution": "D",
    },
  )
  if response.status_code == 200:
    data = response.json()
    return data['payload']['candles']

def get_candles(
  stock,
  interval=tinvest.CandleResolution.min1,
  periods=3,
  now=datetime.now(tz),
):
  token = os.environ['TINKOFF_SECRET']
  client = tinvest.SyncClient(
    token,
    use_sandbox=False,
  )

  end_date = now
  periods_with_candles = 0
  df = pd.DataFrame()
  delta = timedelta(days=1)
  if interval == tinvest.CandleResolution.hour:
      delta = timedelta(weeks=1)
  elif interval in [
      tinvest.CandleResolution.day,
      tinvest.CandleResolution.week,
      tinvest.CandleResolution.month,
  ]:
      delta = timedelta(years=1)

  error = False
  new_df = None

  while periods_with_candles < periods:
      start_date = end_date - delta

      filename = f"./candles/{stock['bbGlobal']}_{start_date.strftime('%Y-%m-%d')}_{end_date.strftime('%Y-%m-%d')}_{interval}"
      if os.path.exists(filename):
        new_df = pd.read_csv(filename)
      else:
        try:
          response = client.get_market_candles(
              figi=stock['bbGlobal'],
              from_=start_date,
              to=end_date,
              interval=interval,
          )

          payload = response.payload

          if len(payload.candles) > 0:
              new_df = pd.DataFrame(
                  {
                      "Volume": float(c.dict()["v"]),
                      "High": float(c.dict()["h"]),
                      "Low": float(c.dict()["l"]),
                      "Open": float(c.dict()["o"]),
                      "Close": float(c.dict()["c"]),
                      "Date": c.dict()["time"] + timedelta(hours=3),
                  }
                  for c in payload.candles
              )
              new_df.to_csv(filename)
        except:
          error = True
          break

      if isinstance(new_df, pd.DataFrame):
        df = pd.concat(
            [
                new_df,
                df,
            ],
            ignore_index=True,
        )
        periods_with_candles += 1

      end_date = start_date

  if not error:
    df.set_index("Date", inplace=True)

    # remove duplicates
    df = df[~df.index.duplicated(keep="last")]

  return df
