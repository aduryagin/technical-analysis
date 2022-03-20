import { useCallback, useEffect, useRef, useState } from "react";
import { Button, notification, Select, Spin, Typography } from "antd";
import styled from "styled-components";
import Helmet from "react-helmet";
import { init, dispose } from "../../KLineChart/src";
import { findGetParameter, intervalLabels } from "./helpers";
import { CHART_OPTIONS } from "./constants";
import WatchList from "./components/WatchList";
import { MEASURE_GRAPHIC_MARK } from "./graphicMarks";
import {
  Candle,
  CandleDocument,
  Interval,
  SourceName,
  useCandlesLazyQuery,
  useRemoveShapeMutation,
  useShapesLazyQuery,
  useUpdateShapeMutation,
} from "../../graphql";
import Indicators from "./components/Indicators";
import { useDebouncedCallback } from "use-debounce";
import AlgorithmTesting from "./components/AlgorithmTesing";
import { customIndicators } from "./indicators";
import Sources from "./components/Sources";
import Drawing from "./components/Drawing";

const WrapperChart = styled.div`
  display: flex;
`;
const SideBarWrapper = styled.div`
  padding: 10px 15px 0;
  width: 100%;
  height: calc(100vh - 64px);
  overflow-y: auto;
`;

// constants
const WATCH_LIST_WIDTH = 320;

function useChart() {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const unsubscribeFromCandle = useRef<() => void>(() => {});
  const [chart, setChart] = useState<any | null>(null);
  const source = findGetParameter("source");
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
    ({ figi, ticker, source, interval, instance }) => {
      const chartInstance = instance || chart;

      chartInstance?.clearData();

      fetchCandles({
        variables: {
          figi,
          ticker,
          interval,
          source,
        },
      });

      unsubscribeFromCandle.current();
      unsubscribeFromCandle.current = subscribeToMore({
        document: CandleDocument,
        variables: { figi, ticker, source, interval },
        updateQuery: (
          prev,
          {
            subscriptionData,
          }: {
            subscriptionData: {
              data: { candle: { instrument: any; candle: Candle } };
            };
          }
        ) => {
          if (
            (subscriptionData.data.candle.instrument.source ===
              SourceName.Tinkoff &&
              subscriptionData.data.candle.instrument.figi === figi) ||
            (subscriptionData.data.candle.instrument.source ===
              SourceName.Binance &&
              subscriptionData.data.candle.instrument.ticker === ticker)
          )
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
            ticker,
            source,
            interval,
            to: new Date(timestamp).toISOString(),
          },
        });
      });
    },
    [chart, fetchCandles, loadMoreCandles, subscribeToMore]
  );

  // shapes
  const [fetchShapes, { data: shapesData }] = useShapesLazyQuery({
    fetchPolicy: "no-cache",
    onError: notification.error,
  });

  // init chart
  const setStyleOptions = useCallback(({ instance, ticker, interval }) => {
    instance?.setStyleOptions({
      candle: {
        tooltip: {
          labels: [""],
          values: [
            {
              label: "",
              value: `${ticker} (${intervalLabels[interval as Interval]
                .replace(/\(.*\)/g, "")
                .trim()})`,
            },
          ],
        },
      },
    });
  }, []);

  useEffect(() => {
    const instance = init("chart", CHART_OPTIONS);
    setChart(instance);

    instance?.addShapeTemplate(MEASURE_GRAPHIC_MARK as any);
    instance?.addTechnicalIndicatorTemplate(customIndicators);

    setStyleOptions({ instance, ticker, interval });

    instance?.setOffsetRightSpace(600);

    const resizeCallback = () => {
      instance?.resize?.();
    };
    window.addEventListener("resize", resizeCallback);

    // initial candles
    if (figi || ticker) {
      fetchAndSubscribeOnCandles({
        ticker,
        source,
        figi,
        interval,
        instance,
      });
    }

    // initial shapes
    if (ticker) {
      fetchShapes({
        variables: {
          ticker,
        },
      });
    }

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
    if (data?.candles?.[data?.candles?.length - 1]?.close <= 5) {
      chart?.setPriceVolumePrecision(5, 0);
    } else chart?.setPriceVolumePrecision(2, 0);
  }, [data, chart]);

  const [removeShape] = useRemoveShapeMutation({
    onError: notification.error,
  });

  // update shapes

  const [updateShape] = useUpdateShapeMutation({
    onError: notification.error,
  });
  const onUpdateShape = useDebouncedCallback(({ id, points }) => {
    updateShape({
      variables: {
        input: {
          id,
          points,
        },
      },
    });
  }, 100);
  useEffect(() => {
    if (shapesData?.shapes.length) {
      shapesData?.shapes.forEach((shape) => {
        const existShape = chart?.getShape(shape.id as any);

        if (!existShape)
          chart?.createShape({
            id: shape.id as any,
            name: shape.name,
            points: shape.points as any,
            onRemove: (e) => {
              if (shape.ticker === findGetParameter("ticker"))
                removeShape({
                  variables: {
                    id: e.id as any,
                  },
                });
            },
            onPressedMove: (e) => {
              onUpdateShape({
                id: shape.id,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                points: e.points?.map(({ __typename, ...point }) => point),
              });
            },
          });
      });
    }
  }, [shapesData, chart, updateShape, removeShape, onUpdateShape]);

  // ticker select handler
  const onTickerSelect = useCallback(
    ({
      figi: chartFigi,
      ticker: chartTicker,
      interval: chartInterval,
      source: chartSource,
    }) => {
      if (
        chartSource === SourceName.Tinkoff &&
        chartFigi === findGetParameter("figi")
      )
        return;
      if (
        chartSource === SourceName.Binance &&
        chartTicker === findGetParameter("ticker")
      )
        return;

      const source = chartSource || findGetParameter("source");
      const ticker = chartTicker || findGetParameter("ticker");
      const figi =
        source === SourceName.Tinkoff
          ? chartFigi || findGetParameter("figi")
          : null;
      const interval =
        chartInterval || findGetParameter("interval") || Interval.Day;

      window.document.title = ticker;
      window.history.replaceState(
        "",
        ticker,
        `/?ticker=${ticker}&interval=${interval}&source=${source}${
          figi ? `&figi=${figi}` : ""
        }`
      );

      fetchAndSubscribeOnCandles({
        figi,
        ticker,
        source,
        interval,
      });

      if (!chartInterval) {
        chart?.removeShape();
      }
      fetchShapes({
        variables: {
          ticker,
        },
      });

      setStyleOptions({ instance: chart, ticker, interval });
    },
    [chart, fetchShapes, fetchAndSubscribeOnCandles]
  );

  return {
    removeShape,
    updateShape,
    onUpdateShape,
    onTickerSelect,
    loading,
    chart,
    interval,
    ticker,
  };
}

export default function Chart() {
  const {
    loading,
    onTickerSelect,
    removeShape,
    onUpdateShape,
    interval,
    ticker,
    chart,
  } = useChart();

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
              height: "calc(100vh - 64px)",
            }}
          />
        </Spin>
        <SideBarWrapper>
          <Sources />
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
          <WatchList onTickerSelect={onTickerSelect} />
          <Drawing
            removeShape={removeShape}
            onUpdateShape={onUpdateShape}
            chart={chart}
            ticker={ticker}
          />
          <Indicators chart={chart} />
          <AlgorithmTesting onTickerSelect={onTickerSelect} />
        </SideBarWrapper>
      </WrapperChart>
    </div>
  );
}
