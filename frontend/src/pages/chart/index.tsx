import { useCallback, useEffect, useRef, useState } from "react";
import { Button, notification, Select, Spin, Typography } from "antd";
import styled from "styled-components";
import Helmet from "react-helmet";
import { init, dispose } from "../../klinechart";
import { findGetParameter, intervalLabels } from "./helpers";
import { CHART_OPTIONS } from "./constants";
import WatchList from "./components/WatchList";
import { MEASURE_GRAPHIC_MARK } from "./graphicMarks";
import {
  Candle,
  CandleDocument,
  Interval,
  useAddShapeMutation,
  useCandlesLazyQuery,
  useRemoveShapeMutation,
  useShapesLazyQuery,
  useUpdateShapeMutation,
} from "../../graphql";
import Indicators from "./components/Indicators";
import { DRAWINGS } from "./drawings";
import { useDebouncedCallback } from "use-debounce";
import williamsVixIndicatorTemplate from "./indicatorsTemplates/williamsVix";
import pmaxIndicatorTemplate from "./indicatorsTemplates/pmax";
import ottIndicatorTemplate from "./indicatorsTemplates/ott";
import rsiStochTPIndicatorTemplate from "./indicatorsTemplates/rsiStochTP";
import pmaxRsiIndicatorTemplate from "./indicatorsTemplates/pmaxRsi";
import vwapIndicatorTemplate from "./indicatorsTemplates/vwap";
import volumeIndicatorTemplate from "./indicatorsTemplates/volume";

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
  const [chart, setChart] = useState<any | null>(null);
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

  // shapes
  const [fetchShapes, { data: shapesData }] = useShapesLazyQuery({
    fetchPolicy: "no-cache",
    onError: notification.error,
  });

  // init chart
  useEffect(() => {
    const instance = init("chart", CHART_OPTIONS);
    setChart(instance);

    instance?.addShapeTemplate(MEASURE_GRAPHIC_MARK as any);
    instance?.addTechnicalIndicatorTemplate([
      williamsVixIndicatorTemplate,
      pmaxIndicatorTemplate,
      ottIndicatorTemplate,
      rsiStochTPIndicatorTemplate,
      pmaxRsiIndicatorTemplate,
      vwapIndicatorTemplate,
      volumeIndicatorTemplate,
    ]);

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
    if (figi) {
      fetchAndSubscribeOnCandles({
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
                // @ts-ignore
                points: e.points?.map(({ __typename, ...point }) => point),
              });
            },
          });
      });
    }
  }, [shapesData, chart, updateShape, removeShape, onUpdateShape]);

  // ticker select handler
  const onTickerSelect = useCallback(
    ({ figi: chartFigi, ticker: chartTicker, interval: chartInterval }) => {
      if (chartFigi === findGetParameter("figi")) return;

      const ticker = chartTicker || findGetParameter("ticker");
      const figi = chartFigi || findGetParameter("figi");
      const interval =
        chartInterval || findGetParameter("interval") || Interval.Day;

      window.document.title = ticker;
      window.history.replaceState(
        "",
        ticker,
        `/?ticker=${ticker}&figi=${figi}&interval=${interval}`
      );

      fetchAndSubscribeOnCandles({
        figi,
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
    },
    [chart, fetchShapes, fetchAndSubscribeOnCandles]
  );

  const [addShape] = useAddShapeMutation({
    onError: notification.error,
  });

  return {
    addShape,
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
    addShape,
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

          <WatchList onTickerSelect={onTickerSelect} />
          <Typography.Title style={{ fontSize: 16, marginBottom: 3 }} level={4}>
            Drawing
          </Typography.Title>
          <div
            style={{
              marginBottom: 10,
              display: "grid",
              gridGap: "10px",
              gridTemplateColumns: "repeat(6, 40px)",
            }}
          >
            {DRAWINGS.map((drawing) => (
              <Button
                key={drawing.name}
                icon={drawing.icon}
                size="large"
                onClick={() => {
                  chart?.createShape({
                    name: drawing.name,
                    onDrawEnd: (e) => {
                      addShape({
                        variables: {
                          input: {
                            name: drawing.name,
                            ticker: ticker as any,
                            points: e.points as any,
                          },
                        },
                      }).then((data) => {
                        chart.removeShape(e.id as any);

                        chart?.createShape({
                          id: data.data?.addShape.id as any,
                          points: data.data?.addShape?.points as any,
                          name: drawing.name,
                          onRemove: (e) => {
                            if (
                              data.data?.addShape.ticker ===
                              findGetParameter("ticker")
                            )
                              removeShape({
                                variables: {
                                  id: e.id as any,
                                },
                              });
                          },
                          onPressedMove: (e) => {
                            onUpdateShape({
                              id: e.id,
                              // @ts-ignore
                              points: e.points?.map(
                                ({ __typename, ...point }: any) => point
                              ),
                            });
                          },
                        });

                        // todo: klinecharts contribute. update id
                        // shape.setShapeOptions({
                        //   id: data.data?.addShape.id,
                        // });
                      });
                    },
                  });
                }}
              />
            ))}
          </div>
          <Indicators chart={chart} />
        </SideBarWrapper>
      </WrapperChart>
    </div>
  );
}
