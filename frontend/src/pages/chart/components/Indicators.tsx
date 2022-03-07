import { CloseCircleOutlined } from "@ant-design/icons";
import { Collapse, List, notification, Select, Typography } from "antd";
import { useCallback, useEffect } from "react";
import styled from "styled-components";
import {
  IndicatorsDocument,
  useAddIndicatorMutation,
  useIndicatorsQuery,
  useRemoveIndicatorMutation,
} from "../../../graphql";
import { INDICATORS, INDICATORS_GROUPS } from "../indicators";
import IndicatorSettingsForm from "./IndicatorSettingsForm";

interface Props {
  chart: any | null;
}

export const CollapseWrapper = styled.div`
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

const paneIds = {};

export default function Indicators({ chart }: Props) {
  const { data, loading } = useIndicatorsQuery({
    fetchPolicy: "no-cache",
    onError: notification.error,
  });

  const indicatorInfo = useCallback((name) => {
    return Object.values(INDICATORS).find(
      (indicator) => indicator.name === name
    );
  }, []);
  const formatIndicatorName = useCallback((name) => {
    const indicatorName = indicatorInfo(name);
    return `${indicatorName.label || ""}${
      indicatorName.label ? ` (${indicatorName.name})` : indicatorName.name
    }`;
  }, []);

  const addIndicatorToChart = useCallback(
    (name: string) => {
      if (!paneIds[name]) {
        paneIds[name] = chart?.createTechnicalIndicator(
          {
            name: indicatorInfo(name).name,
            // @ts-ignore
            calcParams: data?.indicators?.find((item) => item.name === name)
              ?.settings,
          },
          true,
          indicatorInfo(name)?.options || {}
        );
      }
    },
    [chart, data]
  );

  useEffect(() => {
    data?.indicators?.forEach((indicator) => {
      addIndicatorToChart(indicator.name);
    });

    // hack for update
    chart?.resize();

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
        {INDICATORS_GROUPS.map(({ label, group }) => (
          <Select.OptGroup label={label} key={label}>
            {group.map((item) => (
              <Select.Option key={item.name} value={item.name}>
                {formatIndicatorName(item.name)}
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
                  header={formatIndicatorName(item.name)}
                  key={item.name}
                  extra={
                    <CloseCircleOutlined
                      onClick={() => {
                        removeIndicator({
                          variables: {
                            id: item.id as number,
                          },
                        });

                        const paneId = paneIds[item.name];

                        if (paneId) {
                          chart?.removeTechnicalIndicator(
                            paneId,
                            indicatorInfo(item.name).name
                          );
                          delete paneIds[item.name];
                        }
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
