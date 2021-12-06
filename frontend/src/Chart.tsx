import { useEffect } from 'react'
import { init, dispose } from 'klinecharts';
import { CHART_ID, CHART_OPTIONS } from './constants';

export default function Chart() {
  useEffect(() => {
    const chart = init(CHART_ID, CHART_OPTIONS);

    return () => {
      if (chart)
        dispose(chart)
    }
  }, []);

  return <div
    id={CHART_ID}
    style={{
      width: '100vw',
      height: '100vh',
    }}
  />
}