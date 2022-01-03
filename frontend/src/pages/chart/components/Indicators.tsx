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
import IndicatorSettingsForm from "./IndicatorSettingsForm";

interface Props {
  chart: Chart | null;
}

// @ts-ignore
const standardIndicators = extension.technicalIndicatorExtensions;

const indicators = {
  BBI: {
    paneId: null,
    label: "Bull and Bead Index (BBI)",
    name: standardIndicators.BBI.name,
    options: {
      id: "candle_pane",
    },
  },
  DMA: {
    paneId: null,
    label: "DMA",
    name: standardIndicators.DMA.name,
    options: {},
  },
  DMI: {
    paneId: null,
    label: "Directional Movement Index (DMI)",
    name: standardIndicators.DMI.name,
    options: {},
  },
  EMA: {
    paneId: null,
    label: "EMA",
    name: standardIndicators.EMA.name,
    options: {
      id: "candle_pane",
    },
  },
  MA: {
    paneId: null,
    label: "Moving Average (MA)",
    name: standardIndicators.MA.name,
    options: {
      id: "candle_pane",
    },
  },
  MACD: {
    paneId: null,
    label: "MACD",
    name: standardIndicators.MACD.name,
    options: {},
  },
  SMA: {
    paneId: null,
    label: "SMA",
    name: standardIndicators.SMA.name,
    options: {
      id: "candle_pane",
    },
  },
  TRIX: {
    paneId: null,
    label: "Tripple EMA (TRIX)",
    name: standardIndicators.TRIX.name,
    options: {},
  },
  BRAR: {
    paneId: null,
    label: "Emotional index (BRAR)",
    name: standardIndicators.BRAR.name,
    options: {},
  },
  MTM: {
    paneId: null,
    label: "Momentum (MTM)",
    name: standardIndicators.MTM.name,
    options: {},
  },
  PSY: {
    paneId: null,
    label: "Psycological Line (PSY)",
    name: standardIndicators.PSY.name,
    options: {},
  },
  ROC: {
    paneId: null,
    label: "Rate of Change (ROC)",
    name: standardIndicators.ROC.name,
    options: {},
  },
  VR: {
    paneId: null,
    label: "Volume Ratio (VR)",
    name: standardIndicators.VR.name,
    options: {},
  },
  AO: {
    paneId: null,
    label: "Awesome Oscillator (AO)",
    name: standardIndicators.AO.name,
    options: {},
  },
  BIAS: {
    paneId: null,
    label: "BIAS",
    name: standardIndicators.BIAS.name,
    options: {},
  },
  CCI: {
    paneId: null,
    label: "Commodity Channel Index (CCI)",
    name: standardIndicators.CCI.name,
    options: {},
  },
  RSI: {
    paneId: null,
    label: "Relative Strength Index (RSI)",
    name: standardIndicators.RSI.name,
    options: {},
  },
  KDJ: {
    paneId: null,
    label: "KDJ",
    name: standardIndicators.KDJ.name,
    options: {},
  },
  WR: {
    paneId: null,
    label: "Williams %R (WR)",
    name: standardIndicators.WR.name,
    options: {},
  },
  BOLL: {
    paneId: null,
    label: "Bollinger Bands (BOLL)",
    name: standardIndicators.BOLL.name,
    options: {
      id: "candle_pane",
    },
  },
  SAR: {
    paneId: null,
    label: "Stop and Reverse (SAR)",
    name: standardIndicators.SAR.name,
    options: {
      id: "candle_pane",
    },
  },
  VOL: {
    paneId: null,
    label: "Volume (VOL)",
    name: standardIndicators.VOL.name,
    options: {},
  },
  PVT: {
    paneId: null,
    label: "Price and Volume Trend (PVT)",
    name: standardIndicators.PVT.name,
    options: {},
  },
  OBV: {
    paneId: null,
    label: "On Balance Volume (OBV)",
    name: standardIndicators.OBV.name,
    options: {},
  },
};

const indicatorGroups = [
  {
    label: "Directional Movement",
    group: [
      indicators.BBI,
      indicators.DMA,
      indicators.DMI,
      indicators.EMA,
      indicators.MA,
      indicators.MACD,
      indicators.SMA,
      indicators.TRIX,
    ],
  },
  {
    label: "Momentum",
    group: [
      indicators.BRAR,
      indicators.MTM,
      indicators.PSY,
      indicators.ROC,
      indicators.VR,
    ],
  },
  {
    label: "Oscillators",
    group: [
      indicators.AO,
      indicators.BIAS,
      indicators.RSI,
      indicators.KDJ,
      indicators.WR,
    ],
  },
  {
    label: "Volatility",
    group: [indicators.BOLL, indicators.SAR],
  },
  {
    label: "Volume",
    group: [indicators.VOL, indicators.PVT, indicators.OBV],
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
      if (!indicators[name as keyof typeof indicators].paneId) {
        // @ts-ignore
        indicators[name as keyof typeof indicators].paneId =
          chart?.createTechnicalIndicator(
            {
              name: name,
              // @ts-ignore
              calcParams: data?.indicators?.find((item) => item.name === name)
                ?.settings,
            },
            true,
            indicators[name as keyof typeof indicators]?.options || {
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

    return () => {
      Object.keys(indicators).forEach((indicator) => {
        chart?.removeTechnicalIndicator(
          indicators[indicator as keyof typeof indicators].paneId as any,
          indicator
        );
        indicators[indicator as keyof typeof indicators].paneId = null;
      });
    };
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
                    indicators[item.name as keyof typeof indicators].label
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
                          indicators[item.name as keyof typeof indicators]
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
