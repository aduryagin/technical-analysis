from pandas import DataFrame


def rvi(open, close, length=14):
    volatility = (close - open) ** 2 + (close - close.shift(1)) ** 2
    dVol = volatility.diff()

    up = dVol.clip(lower=0)
    down = (-dVol).clip(lower=0)

    avg_up = up.rolling(length).mean()
    avg_down = down.rolling(length).mean()

    rs = avg_up / avg_down
    rvi = 100 - (100 / (1 + rs))

    df = DataFrame(
        {
            f"RVI_{length}": rvi,
            f"RVIup_{length}": avg_up,
            f"RVIdown_{length}": avg_down,
        },
        index=close.index,
    )

    df.name = "rvi"
    df.category = "momentum"

    return df


def rvi_method(self, open, close, length=14):
    result = rvi(open=open, close=close, length=length)
    return self._post_process(result)
