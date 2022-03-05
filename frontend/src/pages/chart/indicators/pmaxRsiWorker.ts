/* eslint-disable no-restricted-globals */

import { PMaxRSI } from "@aduryagin/technical-indicators";

// @ts-ignore
self.onmessage = ({ data: options }) => {
  const data = PMaxRSI(options);

  self.postMessage(
    options.candles.map((candle: any) => ({
      ...data?.result(candle.time),
      overbought: 70,
      oversold: 30,
      middle: 50,
    }))
  );
};
