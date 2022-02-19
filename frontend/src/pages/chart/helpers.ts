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
  [Interval.Min1]: "1 Min",
  [Interval.Min2]: "2 Min",
  [Interval.Min3]: "3 Min",
  [Interval.Min5]: "5 Min",
  [Interval.Min10]: "10 Min",
  [Interval.Min15]: "15 Min",
  [Interval.Min30]: "30 Min",
  [Interval.Hour]: "Hour",
  [Interval.Day]: "Day",
  [Interval.Week]: "Week",
  [Interval.Month]: "Month",
};

export function formatNumber(number: number) {
  return Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 2,
  }).format(number);
}
