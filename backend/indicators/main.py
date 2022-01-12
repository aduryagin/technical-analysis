from sanic import Sanic
import pandas as pd
import pandas_ta
import numpy as np
from sanic.response import json
from cors import add_cors_headers
from options import setup_options
from datetime import datetime

app = Sanic(__name__)

app.register_listener(setup_options, "before_server_start")
app.register_middleware(add_cors_headers, "response")

@app.route('/indicator-calculator', methods=["POST"])
async def test(request):
  candles = request.json['candles']
  indicator = request.json['indicator']

  df = pd.DataFrame({
      "Open": float(candle['open']),
      "High": float(candle['high']),
      "Low": float(candle['low']),
      "Close": float(candle['close']),
      "Volume": float(candle['volume']),
      "Date": datetime.fromtimestamp(candle['timestamp'] / 1000),
    }
  for candle in candles)
  df.set_index(pd.DatetimeIndex(df['Date']), inplace=True, drop=True)

  indicator = df.ta(kind=indicator)
  result = pd.merge(left=df, right=indicator, left_index=True, right_index=True)
  result['Date'] = result['Date'].apply(lambda x: x.value / 1000000)

  return json(result.to_dict('records'))

if __name__ == '__main__':
  app.run(debug=True)