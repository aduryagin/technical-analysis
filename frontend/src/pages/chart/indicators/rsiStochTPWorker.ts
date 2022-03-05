/* eslint-disable no-restricted-globals */

import { RSIStochasticTakeProfit } from "@aduryagin/technical-indicators";

// @ts-ignore
self.onmessage = ({ data: options }) => {
  const data = RSIStochasticTakeProfit(options);

  self.postMessage(
    options.candles.map((candle: any) => ({
      tp: 10,
      ...data?.result(candle.time),
    }))
  );
};
