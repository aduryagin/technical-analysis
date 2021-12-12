import { MutableRefObject, useEffect, useRef, useState } from "react";
import { init, dispose, Chart as ChartType } from "klinecharts";
import { Button, notification, Select } from "antd";
import { FunctionOutlined, SettingOutlined } from "@ant-design/icons";
import { CHART_ID, CHART_OPTIONS } from "./constants";
import styled from "styled-components";
import SettingsModal from "./SettingsModal";
import TickerSearchModal from "./TickerSearchModal";
import { useCandlesQuery, useCandleSubscription } from "./graphql";

const { Option, OptGroup } = Select;

const Header = styled.div`
  display: flex;
`;

function useChart() {
  const chart = useRef<ChartType | null>(null);

  useEffect(() => {
    chart.current = init(CHART_ID, CHART_OPTIONS);

    return () => {
      if (chart.current) dispose(chart.current);
    };
  }, []);

  return { chart };
}

function useSettings() {
  const [isVisibleSettings, showSettings] = useState(false);
  return { showSettings, isVisibleSettings };
}

function useTickerSearch() {
  const [isVisibleTickerSearch, showTickerSearch] = useState(false);
  return { showTickerSearch, isVisibleTickerSearch };
}

function useCandles({ chart }: { chart: MutableRefObject<ChartType | null> }) {
  const variables = {
    ticker: "BTCUSDT",
    interval: "1m",
  };
  const { data, loading } = useCandlesQuery({
    fetchPolicy: "no-cache",
    onError: notification.error,
    variables,
  });

  useEffect(() => {
    if (chart.current && data?.candles?.length) {
      chart.current.applyNewData(
        data.candles.map((item) => ({
          open: item.open,
          close: item.close,
          high: item.high,
          low: item.low,
          timestamp: item.time,
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const { data: candlesSubscriptionData } = useCandleSubscription({
    variables,
  });

  useEffect(() => {
    const candle = candlesSubscriptionData?.candle;
    if (candle)
      chart.current?.updateData({
        open: candle.open,
        close: candle.close,
        high: candle.high,
        low: candle.low,
        timestamp: candle.time,
      });
  }, [candlesSubscriptionData, chart]);

  return { loading };
}

export default function Chart() {
  const { chart } = useChart();
  useCandles({ chart });

  const { showSettings, isVisibleSettings } = useSettings();
  const { showTickerSearch, isVisibleTickerSearch } = useTickerSearch();

  return (
    <>
      <Header>
        <Button
          style={{ fontWeight: 600 }}
          onClick={() => showTickerSearch(true)}
        >
          AAPL
        </Button>
        <Select style={{ width: 120 }} defaultValue="1m">
          <OptGroup label="Minutes">
            <Option value="1m">1 minute</Option>
            <Option value="5m">5 minutes</Option>
            <Option value="15m">15 minutes</Option>
            <Option value="30m">30 minutes</Option>
          </OptGroup>
          <OptGroup label="Hours">
            <Option value="1h">1 hour</Option>
            <Option value="5h">5 hours</Option>
          </OptGroup>
          <OptGroup label="Days">
            <Option value="1d">1 day</Option>
            <Option value="1w">1 week</Option>
            <Option value="m">1 month</Option>
          </OptGroup>
        </Select>
        <Button icon={<FunctionOutlined />}>Indicators</Button>
        <Button onClick={() => showSettings(true)} icon={<SettingOutlined />}>
          Settings
        </Button>
      </Header>
      <SettingsModal
        onHide={() => showSettings(false)}
        visible={isVisibleSettings}
      />
      <TickerSearchModal
        onHide={() => showTickerSearch(false)}
        visible={isVisibleTickerSearch}
      />
      <div
        id={CHART_ID}
        style={{
          width: "100vw",
          height: "calc(100vh - 32px)",
        }}
      />
    </>
  );
}
