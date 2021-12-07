import { useEffect, useState } from "react";
import { init, dispose } from "klinecharts";
import { Button, Select } from "antd";
import { FunctionOutlined, SettingOutlined } from "@ant-design/icons";
import { CHART_ID, CHART_OPTIONS } from "./constants";
import styled from "styled-components";
import SettingsModal from "./SettingsModal";

const { Option, OptGroup } = Select;

const Header = styled.div`
  display: flex;
`;

function useChart() {
  useEffect(() => {
    const chart = init(CHART_ID, CHART_OPTIONS);

    return () => {
      if (chart) dispose(chart);
    };
  }, []);
}

function useSettings() {
  const [isVisibleSettings, showSettings] = useState(false);

  return { showSettings, isVisibleSettings };
}

export default function Chart() {
  useChart();
  const { showSettings, isVisibleSettings } = useSettings();

  return (
    <>
      <Header>
        <Button style={{ fontWeight: 600 }}>AAPL</Button>
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
      <div
        id={CHART_ID}
        style={{
          width: "100vw",
          height: "calc(100vh-32px)",
        }}
      />
    </>
  );
}
