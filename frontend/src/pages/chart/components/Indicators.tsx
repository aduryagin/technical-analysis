import { CloseCircleOutlined } from "@ant-design/icons";
import { Collapse, List, notification, Select, Typography } from "antd";
import { extension, Chart } from "klinecharts";
import { useCallback, useEffect } from "react";
import styled from "styled-components";
import {
  IndicatorsDocument,
  useAddIndicatorMutation,
  useIndicatorsQuery,
  useRemoveIndicatorMutation,
} from "../../../graphql";
import ottIndicatorTemplate from "../indicatorsTemplates/ott";
import pmaxIndicatorTemplate from "../indicatorsTemplates/pmax";
import pmaxRsiIndicatorTemplate from "../indicatorsTemplates/pmaxRsi";
import rsiStochTPIndicatorTemplate from "../indicatorsTemplates/rsiStochTP";
import williamsVixIndicatorTemplate from "../indicatorsTemplates/williamsVix";
import IndicatorSettingsForm from "./IndicatorSettingsForm";

interface Props {
  chart: Chart | null;
}

// @ts-ignore
const standardIndicators = extension.technicalIndicatorExtensions;

export const INDICATORS: { [key: string]: any } = {
  PMAXRSI: {
    ...pmaxRsiIndicatorTemplate,
    paneId: null,
    label: "RSI & PMax (PMAXRSI)",
    options: {
      height: 180,
    },
    calcParamsLabels: [
      "RSI Period",
      "T3 Period",
      "T3 Volume Factor",
      "ATR Multiplier",
      "ATR Period",
    ],
  },
  RSTP: {
    ...rsiStochTPIndicatorTemplate,
    paneId: null,
    label: "RSI & Stoch Take Profit (RSTP)",
    options: {
      height: 25,
    },
    calcParamsLabels: ["Period", "K Smoothing"],
  },
  OTT: {
    ...ottIndicatorTemplate,
    paneId: null,
    label: "Optimized Trend Tracker (OTT)",
    options: {
      id: "candle_pane",
    },
    calcParamsLabels: ["Period", "Percent"],
  },
  PMAX: {
    ...pmaxIndicatorTemplate,
    paneId: null,
    label: "PMax",
    options: {
      id: "candle_pane",
    },
    calcParamsLabels: ["Multiplier", "Multiplier", "Multiplier"],
  },
  WVX: {
    ...williamsVixIndicatorTemplate,
    paneId: null,
    label: "Williams VIX (WVX)",
    options: {},
    calcParamsLabels: [
      "Look Back Period StDev High",
      "BB Length",
      "BB Standard Deviation Up",
      "Lookback Period Percentile High",
      "Highest Percentile",
      "Lowest Percentile",
    ],
  },
  BBI: {
    ...standardIndicators.BBI,
    paneId: null,
    label: "Bull and Bead Index (BBI)",
    options: {
      id: "candle_pane",
    },
  },
  DMA: {
    ...standardIndicators.DMA,
    paneId: null,
    label: "DMA",
    options: {},
  },
  DMI: {
    ...standardIndicators.DMI,
    paneId: null,
    label: "Directional Movement Index (DMI)",
    options: {},
  },
  EMA: {
    ...standardIndicators.EMA,
    paneId: null,
    label: "EMA",
    options: {
      id: "candle_pane",
    },
  },
  MA: {
    ...standardIndicators.MA,
    paneId: null,
    label: "Moving Average (MA)",
    options: {
      id: "candle_pane",
    },
  },
  MACD: {
    ...standardIndicators.MACD,
    paneId: null,
    label: "MACD",
    options: {},
  },
  SMA: {
    paneId: null,
    label: "SMA",
    ...standardIndicators.SMA,
    options: {
      id: "candle_pane",
    },
  },
  TRIX: {
    paneId: null,
    label: "Tripple EMA (TRIX)",
    ...standardIndicators.TRIX,
    options: {},
  },
  BRAR: {
    paneId: null,
    label: "Emotional index (BRAR)",
    ...standardIndicators.BRAR,
    options: {},
  },
  MTM: {
    paneId: null,
    label: "Momentum (MTM)",
    ...standardIndicators.MTM,
    options: {},
  },
  PSY: {
    paneId: null,
    label: "Psycological Line (PSY)",
    ...standardIndicators.PSY,
    options: {},
  },
  ROC: {
    paneId: null,
    label: "Rate of Change (ROC)",
    ...standardIndicators.ROC,
    options: {},
  },
  VR: {
    paneId: null,
    label: "Volume Ratio (VR)",
    ...standardIndicators.VR,
    options: {},
  },
  AO: {
    paneId: null,
    label: "Awesome Oscillator (AO)",
    ...standardIndicators.AO,
    options: {},
  },
  BIAS: {
    paneId: null,
    label: "BIAS",
    ...standardIndicators.BIAS,
    options: {},
  },
  CCI: {
    paneId: null,
    label: "Commodity Channel Index (CCI)",
    ...standardIndicators.CCI,
    options: {},
  },
  RSI: {
    paneId: null,
    label: "Relative Strength Index (RSI)",
    ...standardIndicators.RSI,
    options: {},
  },
  KDJ: {
    paneId: null,
    label: "KDJ",
    ...standardIndicators.KDJ,
    options: {},
  },
  WR: {
    paneId: null,
    label: "Williams %R (WR)",
    ...standardIndicators.WR,
    options: {},
  },
  BOLL: {
    paneId: null,
    label: "Bollinger Bands (BOLL)",
    ...standardIndicators.BOLL,
    options: {},
  },
  SAR: {
    paneId: null,
    label: "Stop and Reverse (SAR)",
    ...standardIndicators.SAR,
    options: {
      id: "candle_pane",
    },
  },
  VOL: {
    paneId: null,
    label: "Volume (VOL)",
    ...standardIndicators.VOL,
    options: {},
  },
  PVT: {
    paneId: null,
    label: "Price and Volume Trend (PVT)",
    ...standardIndicators.PVT,
    options: {},
  },
  OBV: {
    paneId: null,
    label: "On Balance Volume (OBV)",
    ...standardIndicators.OBV,
    options: {},
  },
};

const indicatorGroups = [
  {
    label: "Directional Movement",
    group: [
      INDICATORS.BBI,
      INDICATORS.DMA,
      INDICATORS.DMI,
      INDICATORS.EMA,
      INDICATORS.MA,
      INDICATORS.MACD,
      INDICATORS.SMA,
      INDICATORS.TRIX,
    ],
  },
  {
    label: "Momentum",
    group: [
      INDICATORS.BRAR,
      INDICATORS.MTM,
      INDICATORS.PSY,
      INDICATORS.ROC,
      INDICATORS.VR,
    ],
  },
  {
    label: "Oscillators",
    group: [
      INDICATORS.AO,
      INDICATORS.BIAS,
      INDICATORS.RSI,
      INDICATORS.KDJ,
      INDICATORS.WR,
    ],
  },
  {
    label: "Volatility",
    group: [INDICATORS.BOLL, INDICATORS.SAR],
  },
  {
    label: "Volume",
    group: [INDICATORS.VOL, INDICATORS.PVT, INDICATORS.OBV],
  },
  {
    label: "Custom",
    group: [
      INDICATORS.WVX,
      INDICATORS.PMAX,
      INDICATORS.OTT,
      INDICATORS.RSTP,
      INDICATORS.PMAXRSI,
    ],
  },
];

const CollapseWrapper = styled.div`
  width: 100%;

  .ant-collapse-header {
    padding: 0 !important;
  }

  .ant-collapse-content-box {
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 0 !important;
  }

  .ant-form-item {
    margin-bottom: 12px;
  }

  .ant-input-number {
    width: 100%;
  }
`;

export default function Indicators({ chart }: Props) {
  const { data, loading } = useIndicatorsQuery({
    fetchPolicy: "no-cache",
    onError: notification.error,
  });

  const addIndicatorToChart = useCallback(
    (name: string) => {
      if (!INDICATORS[name as keyof typeof INDICATORS].paneId) {
        // @ts-ignore
        INDICATORS[name as keyof typeof INDICATORS].paneId =
          chart?.createTechnicalIndicator(
            {
              name: name,
              // @ts-ignore
              calcParams: data?.indicators?.find((item) => item.name === name)
                ?.settings,
            },
            true,
            INDICATORS[name as keyof typeof INDICATORS]?.options || {
              id: "candle_pane",
            }
          );
      }
    },
    [chart, data]
  );

  useEffect(() => {
    data?.indicators?.forEach((indicator) => {
      addIndicatorToChart(indicator.name);
    });

    // return () => {
    //   Object.keys(indicators).forEach((indicator) => {
    //     chart?.removeTechnicalIndicator(
    //       indicators[indicator as keyof typeof indicators].paneId as any,
    //       indicator
    //     );
    //     indicators[indicator as keyof typeof indicators].paneId = null;
    //   });
    // };
  }, [addIndicatorToChart, chart, data?.indicators]);

  const [addIndicator, { loading: addingIndicator }] = useAddIndicatorMutation({
    onError: notification.error,
    refetchQueries: [IndicatorsDocument],
  });
  const [removeIndicator, { loading: removingingIndicator }] =
    useRemoveIndicatorMutation({
      onError: notification.error,
      refetchQueries: [IndicatorsDocument],
    });

  return (
    <>
      <Typography.Title style={{ fontSize: 16, marginBottom: 3 }} level={4}>
        Indicators
      </Typography.Title>
      <Select
        // @ts-ignore
        value={null}
        showSearch
        loading={addingIndicator || removingingIndicator}
        onChange={(indicator: string) => {
          addIndicator({
            variables: {
              input: {
                name: indicator,
              },
            },
          });

          addIndicatorToChart(indicator);

          // hack for update
          chart?.resize();
        }}
        placeholder="Indicator"
        style={{ width: "100%" }}
      >
        {indicatorGroups.map(({ label, group }) => (
          <Select.OptGroup label={label} key={label}>
            {group.map((item) => (
              <Select.Option key={item.name} value={item.name}>
                {item.label}
              </Select.Option>
            ))}
          </Select.OptGroup>
        ))}
      </Select>
      <List
        size="small"
        style={{ marginBottom: 2 }}
        loading={loading}
        dataSource={data?.indicators || []}
        rowKey="id"
        renderItem={(item) => (
          <List.Item style={{ cursor: "pointer", padding: "8px 0" }}>
            <CollapseWrapper>
              <Collapse ghost expandIconPosition="left">
                <Collapse.Panel
                  header={
                    INDICATORS[item.name as keyof typeof INDICATORS].label
                  }
                  key={item.name}
                  extra={
                    <CloseCircleOutlined
                      onClick={() => {
                        removeIndicator({
                          variables: {
                            id: item.id as number,
                          },
                        });

                        const paneId =
                          INDICATORS[item.name as keyof typeof INDICATORS]
                            .paneId;

                        if (paneId)
                          chart?.removeTechnicalIndicator(paneId, item.name);
                      }}
                    />
                  }
                >
                  <IndicatorSettingsForm chart={chart} indicator={item} />
                </Collapse.Panel>
              </Collapse>
            </CollapseWrapper>
          </List.Item>
        )}
      />
    </>
  );
}
