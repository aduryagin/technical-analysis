import { Interval } from "../../graphql";

export function findGetParameter(parameterName: string) {
  let result = null;
  let tmp = [];
  // eslint-disable-next-line no-restricted-globals
  location.search
    .substr(1)
    .split("&")
    .forEach((item) => {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}

export const intervalLabels = {
  [Interval.Min1]: "1 Min (Tinkoff, Binance)",
  [Interval.Min2]: "2 Min (Tinkoff)",
  [Interval.Min3]: "3 Min (Tinkoff, Binance)",
  [Interval.Min5]: "5 Min (Tinkoff, Binance)",
  [Interval.Min10]: "10 Min (Tinkoff)",
  [Interval.Min15]: "15 Min (Tinkoff, Binance)",
  [Interval.Min30]: "30 Min (Tinkoff, Binance)",
  [Interval.Hour]: "Hour (Tinkoff)",
  [Interval.Hour2]: "2 Hour (Binance)",
  [Interval.Hour4]: "4 Hour (Binance)",
  [Interval.Hour6]: "6 Hour (Binance)",
  [Interval.Hour8]: "8 Hour (Binance)",
  [Interval.Hour12]: "12 Hour (Binance)",
  [Interval.Day]: "Day (Tinkoff, Binance)",
  [Interval.Day3]: "3 Day (Binance)",
  [Interval.Week]: "Week (Tinkoff, Binance)",
  [Interval.Month]: "Month (Tinkoff, Binance)",
};

export function formatNumber(number: number) {
  return Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 2,
  }).format(number);
}
