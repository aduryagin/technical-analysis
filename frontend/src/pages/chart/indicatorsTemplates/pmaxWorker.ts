/* eslint-disable no-restricted-globals */

import { PMax } from "@aduryagin/technical-indicators";

// @ts-ignore
self.onmessage = ({ data: options }) => {
  const data = options.params.reduce((accum, param) => {
    const pmax = PMax({
      ...options,
      multiplier: param,
    });

    return { ...accum, [param]: pmax };
  }, {});

  self.postMessage(
    options.candles.map((candle: any) => {
      return options.params.reduce((accum, param) => {
        return {
          ...accum,
          [`pmax${param}`]: data[param]?.result(candle.time)?.pmax,
        };
      }, {});
    })
  );
};
