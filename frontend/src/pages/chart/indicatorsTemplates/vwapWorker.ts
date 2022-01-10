/* eslint-disable no-restricted-globals */

import { VWAP } from "@aduryagin/technical-indicators";

// @ts-ignore
self.onmessage = ({ data: candles }) => {
  const data = VWAP({
    candles,
  });

  self.postMessage(candles.map((candle: any) => data?.result(candle.time)));
};
