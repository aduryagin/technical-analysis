from pandas_ta.overlap import sma
from pandas_ta.statistics import stdev
from pandas import DataFrame

def heatmap_volume(
  volume,
  ma_length = 610,
  std_length = 610,
  extra_high_volume_threshold = 4,
  high_volume_threshold = 2.5,
  medium_volume_threshold = 1,
  normal_volume_threshold = -0.5
):
  ts1 = 0
  ts2 = 0
  ts3 = 0
  ts4 = 0
  if len(volume) >= ma_length:
    mean = sma(volume, length=ma_length)
    std = stdev(volume, length=std_length)

    ts1 = std * extra_high_volume_threshold + mean
    ts2 = std * high_volume_threshold + mean
    ts3 = std * medium_volume_threshold + mean
    ts4 = std * normal_volume_threshold + mean
  
  df = DataFrame(
    {
      f"HeatmapVolume": volume,
      f"extra_high": ts1,
      f"high": ts2,
      f"medium": ts3,
      f"normal": ts4,
    },
    index=volume.index,
  )

  df.name = "heatmap volume"
  df.category = "volume"

  return df

def heatmap_volume_method(self, volume, **args):
    result = heatmap_volume(volume, **args)
    return self._post_process(result)