import { useCallback, useEffect, useRef, useState } from "react";
import { Button, notification, Select, Spin, Typography } from "antd";
import styled from "styled-components";
import Helmet from "react-helmet";
import { init, dispose, Chart as KChart } from "klinecharts";
import { findGetParameter, intervalLabels } from "./helpers";
import { CHART_OPTIONS } from "./constants";
import WatchList from "./components/WatchList";
import {
  HorizontalLineDrawingIcon,
  VerticalLineDrawingIcon,
  DiagonalLineDrawingIcon,
  RulerDrawingIcon,
} from "./icons";
import { MEASURE_GRAPHIC_MARK } from "./graphicMarks";
import {
  Candle,
  CandleDocument,
  Interval,
  useCandlesLazyQuery,
} from "../../graphql";
import Indicators from "./components/Indicators";

const WrapperChart = styled.div`
  display: flex;
`;
const SideBarWrapper = styled.div`
  padding: 0 15px;
  width: 100%;
`;

// constants
const WATCH_LIST_WIDTH = 320;

function useChart() {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const unsubscribeFromCandle = useRef<() => void>(() => {});
  const [chart, setChart] = useState<KChart | null>(null);
  const figi = findGetParameter("figi");
  const ticker = findGetParameter("ticker");
  const interval = findGetParameter("interval") || Interval.Day;

  const [fetchCandles, { data, loading, subscribeToMore }] =
    useCandlesLazyQuery({
      fetchPolicy: "no-cache",
      onError: notification.error,
    });
  const [loadMoreCandles, { data: moreCandles }] = useCandlesLazyQuery({
    fetchPolicy: "no-cache",
    onError: notification.error,
  });

  const fetchAndSubscribeOnCandles = useCallback(
    ({ figi, interval, instance }) => {
      const chartInstance = instance || chart;

      chartInstance?.clearData();

      fetchCandles({
        variables: {
          figi,
          interval,
        },
      });

      unsubscribeFromCandle.current();
      unsubscribeFromCandle.current = subscribeToMore({
        document: CandleDocument,
        variables: { figi, interval },
        updateQuery: (
          prev,
          {
            subscriptionData,
          }: { subscriptionData: { data: { candle: { candle: Candle } } } }
        ) => {
          chartInstance?.updateData(subscriptionData.data.candle.candle);

          // don't update the data
          return { ...prev, candles: [...(prev.candles || [])] };
        },
      });

      chartInstance?.loadMore((timestamp: any) => {
        if (typeof timestamp !== "number") return;

        loadMoreCandles({
          variables: {
            figi,
            interval,
            to: new Date(timestamp).toISOString(),
          },
        });
      });
    },
    [chart, fetchCandles, loadMoreCandles, subscribeToMore]
  );

  // init chart
  useEffect(() => {
    const instance = init("chart", CHART_OPTIONS);
    setChart(instance);

    instance?.addShapeTemplate(MEASURE_GRAPHIC_MARK as any);

    instance?.setStyleOptions({
      candle: {
        tooltip: {
          labels: [""],
          values: [
            {
              label: "",
              value: `${ticker} (${intervalLabels[interval as Interval]})`,
            },
          ],
        },
      },
    });

    instance?.setOffsetRightSpace(600);

    const resizeCallback = () => {
      instance?.resize?.();
    };
    window.addEventListener("resize", resizeCallback);

    // initial candles
    if (figi)
      fetchAndSubscribeOnCandles({
        figi,
        interval,
        instance,
      });

    return () => {
      dispose("chart");
      setChart(null);
      window.removeEventListener("resize", resizeCallback);
    };
    // eslint-disable-next-line
  }, []);

  // update candles
  useEffect(() => {
    if (moreCandles?.candles?.length)
      chart?.applyMoreData(moreCandles?.candles || []);
  }, [moreCandles, chart]);

  useEffect(() => {
    if (data?.candles?.length) chart?.applyNewData(data?.candles || []);
  }, [data, chart]);

  // ticker select handler
  const onTickerSelect = useCallback(
    ({ figi: chartFigi, ticker: chartTicker, interval: chartInterval }) => {
      const ticker = chartTicker || findGetParameter("ticker");
      const figi = chartFigi || findGetParameter("figi");
      const interval =
        chartInterval || findGetParameter("interval") || Interval.Day;

      fetchAndSubscribeOnCandles({
        figi,
        interval,
      });

      window.document.title = ticker;
      window.history.replaceState(
        "",
        ticker,
        `/?ticker=${ticker}&figi=${figi}&interval=${interval}`
      );

      chart?.setStyleOptions({
        candle: {
          tooltip: {
            labels: [""],
            values: [
              {
                label: "",
                value: `${ticker} (${intervalLabels[interval as Interval]})`,
              },
            ],
          },
        },
      });
      chart?.removeShape();
    },
    [chart, fetchAndSubscribeOnCandles]
  );

  return {
    onTickerSelect,
    loading,
    chart,
    interval,
    ticker,
  };
}

export default function Chart() {
  const { loading, onTickerSelect, interval, ticker, chart } = useChart();

  return (
    <div>
      <Helmet>
        <title>{ticker || "Chart"}</title>
      </Helmet>
      <WrapperChart>
        <Spin spinning={loading} size="large">
          <div
            id="chart"
            style={{
              width: `calc(100vw - ${WATCH_LIST_WIDTH}px)`,
              height: "calc(100vh - 86px)",
            }}
          />
        </Spin>
        <SideBarWrapper>
          <Typography.Title style={{ fontSize: 16, marginBottom: 3 }} level={4}>
            Interval
          </Typography.Title>
          <Select
            size="small"
            defaultValue={interval}
            disabled={!window.location.search}
            options={Object.keys(intervalLabels).map((item) => ({
              label: intervalLabels[item as Interval] as string,
              value: item,
            }))}
            style={{ width: "100%", marginBottom: 10 }}
            onChange={(value) => {
              onTickerSelect({
                interval: value,
              });
            }}
          >
            1m
          </Select>
          <Typography.Title style={{ fontSize: 16, marginBottom: 3 }} level={4}>
            Drawing
          </Typography.Title>
          <div style={{ marginBottom: 10 }}>
            <Button
              style={{ marginRight: 10 }}
              icon={<HorizontalLineDrawingIcon />}
              size="large"
              onClick={() => chart?.createShape("horizontalStraightLine")}
            />
            <Button
              style={{ marginRight: 10 }}
              icon={<VerticalLineDrawingIcon />}
              size="large"
              onClick={() => chart?.createShape("verticalStraightLine")}
            />
            <Button
              style={{ marginRight: 10 }}
              icon={<DiagonalLineDrawingIcon />}
              onClick={() => chart?.createShape("straightLine")}
              size="large"
            />
            <Button
              icon={<RulerDrawingIcon />}
              onClick={() => chart?.createShape("measure")}
              size="large"
            />
          </div>
          <WatchList onTickerSelect={onTickerSelect} />
          <Indicators chart={chart} />
        </SideBarWrapper>
      </WrapperChart>
    </div>
  );
}
