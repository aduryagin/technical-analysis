from sanic import Sanic
import pandas as pd
import pandas_ta
import numpy as np
from sanic.response import json
from cors import add_cors_headers
from options import setup_options
from datetime import datetime
from pandas_ta.custom import create_dir, import_dir

# custom indicators
ta_dir = "./indicators"
create_dir(ta_dir)
import_dir(ta_dir)

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

  if indicator['name'] == "pmax":
    indicator_result = df.ta.pmax(high=df["High"], low=df["Low"], close=df["Close"], multiplier=3)
  elif indicator['name'] == "heatmap_volume":
    indicator_result = df.ta.heatmap_volume(volume=df["Volume"], **indicator['parameters'])
  elif indicator['name'] == "vader":
    indicator_result = df.ta.vader(high=df["High"], low=df["Low"], close=df["Close"], volume=df["Volume"])
  else:
    indicator_result = df.ta(kind=indicator['name'])

  result = pd.merge(left=df, right=indicator_result, left_index=True, right_index=True)
  result['Date'] = result['Date'].apply(lambda x: x.value / 1000000)

  return json(result.replace({np.nan: None}).to_dict('records'))

if __name__ == '__main__':
  app.run(debug=True)