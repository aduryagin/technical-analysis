import Axios from "axios";
import config from "../../../config";
import { Candle } from "../../candle/candle.types";
import { Instrument } from "../../watchList/watchList.entity";
import { candles as candlesStorage } from "../algorithmTesting.helpers";

export async function algorithm({
  isNewCandle,
  candles,
}: {
  isNewCandle: boolean;
  instrument: Instrument;
  candle: Candle;
  candles: ReturnType<ReturnType<typeof candlesStorage>["result"]>;
}): Promise<{ isShort: boolean; isLong: boolean }> {
  // pmax
  let isLong = false;
  let isShort = false;

  try {
    const { data } = await Axios.post(
      `${config.python}/indicator-calculator`,
      {
        indicator: { name: "pmax" },
        candles: [...candles.values()],
      },
      {
        transformResponse: (data) => {
          return JSON.parse(data);
        },
      }
    );

    if (isNewCandle) {
      const previousIndicatorValue = data[data.length - 3];
      const indicatorValue = data[data.length - 2];

      if (
        previousIndicatorValue.PMaxDirection === 1 &&
        indicatorValue.PMaxDirection === -1
      )
        isShort = true;

      if (
        previousIndicatorValue.PMaxDirection === -1 &&
        indicatorValue.PMaxDirection === 1
      )
        isLong = true;
    }
  } catch {}
  return { isShort, isLong };
}
