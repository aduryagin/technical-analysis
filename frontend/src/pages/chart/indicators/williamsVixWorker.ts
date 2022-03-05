/* eslint-disable no-restricted-globals */

import { WilliamsVix } from "@aduryagin/technical-indicators";

// @ts-ignore
self.onmessage = ({ data: options }) => {
  const data = WilliamsVix(options);

  self.postMessage(
    options.candles.map((candle: any) => data?.result(candle.time))
  );
};
