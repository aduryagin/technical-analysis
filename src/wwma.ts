import { Candle } from "./types";

interface WWMAInput { source: { time: number; value: number }[]; period: number }
interface WWMAResultItem { time: Candle['time']; value: number; }
type WWMAResult = WWMAResultItem[]

export function WWMA({ source, period }: WWMAInput) {
  let result: WWMAResult = [];
  const wwalpha = 1 / period;

  function calculate(src): WWMAResultItem {
    return { value: wwalpha * src.value + (1 - wwalpha) * (result[result.length - 1]?.value || 0), time: src.time };
  }

  source.forEach((item) => {
    const res = calculate(item);
    if (res) result.push(res);
  });

  return {
    update: (src: { time: number; value: number }) => {
      if (result.length && result[result.length - 1].time === src.time) {
        result = result.slice(0, -1);
      }

      const item = calculate(src);
      if (item) result.push(item);

      return item;
    },
    result: () => result,
  }
}