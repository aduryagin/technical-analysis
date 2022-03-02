from pandas_ta.overlap import wma
from pandas_ta.momentum import stoch
from pandas import DataFrame

def rel_vol(value, length):
  min_value = value.rolling(length).min()
  max_value = value.rolling(length).max()
  return stoch(close=value, high=max_value, low=min_value, k=length, smooth_k=1)


def vader(high, low, close, volume):
    price   = close
    length  = 10
    DER_avg = 5
    vlookbk = 20

    vola        = rel_vol(volume, vlookbk)['STOCHk_20_3_1']

    R           = (high.rolling(2).max() - low.rolling(2).min()) / 2  # R is the 2-bar average bar range
    sr          = price.diff() / R                                    # calc ratio of change to R
    sr[sr > 1]  = 1                                                   # ensure ratio is restricted to +1/-1 in case of big moves
    sr[sr < -1] = -1                                              
    c           = sr * vola                                           # add volume accel

    c_plus               = c.copy()                                   # calc directional vol-accel energy
    c_plus[c_plus < 0]   = 0
    c_minus              = c.copy()
    c_minus[c_minus > 0] = 0
    c_minus              *= -1

    dem     = wma(c_plus, length) / wma(vola, length)         # average directional energy ratio
    sup     = wma(c_minus, length) / wma(vola, length)

    adp     = 100 * wma(dem, DER_avg)
    asp     = 100 * wma(sup, DER_avg)

    df = DataFrame(
        {
            f"VaderSupply": asp,
            f"VaderDemand": adp,
        },
        index=close.index,
    )

    df.name = f"vader"
    df.category = "volume"

    return df

def vader_method(self, high, low, close, volume):
    result = vader(high=high, low=low, close=close, volume=volume)
    return self._post_process(result)