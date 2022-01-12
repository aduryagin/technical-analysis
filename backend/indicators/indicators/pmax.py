from pandas_ta.overlap import ema, hl2
from pandas_ta.volatility import atr
from pandas import DataFrame
from numpy import NaN as npNaN

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