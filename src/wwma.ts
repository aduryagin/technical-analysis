export function WWMA({ source, period }) {
  let result = [];
  const wwalpha = 1 / period;

  function calculate(src) {
    return { value: wwalpha * src.value + (1 - wwalpha) * (result[result.length - 1]?.value || 0), time: src.time };
  }

  source.forEach((item) => {
    const res = calculate(item);
    if (res) result.push(res);
  });

  return {
    update: (src) => {
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