import { List, Switch, Typography } from "antd";
import { useState } from "react";
import { Instrument, useTradesSubscription } from "../../../graphql";
import AlgorithmTrade from "./AlgorithmTrade";
import CollapseBlock from "./CollapseBlock";

interface Props {
  onTickerSelect: (instrument: Instrument) => void;
}

export default function AlgorithmTesting({ onTickerSelect }: Props) {
  const { data } = useTradesSubscription({ fetchPolicy: "no-cache" });
  const [onlyActive, setOnlyActive] = useState(true);

  return (
    <CollapseBlock
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography.Title style={{ fontSize: 16, marginBottom: 3 }} level={4}>
            Algorithm Testing
          </Typography.Title>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              userSelect: "none",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            Only Active
            <Switch
              checked={onlyActive}
              onChange={(checked) => setOnlyActive(checked)}
              size="small"
              style={{ marginLeft: 10 }}
            />
          </label>
        </div>
      }
    >
      <List
        size="small"
        style={{ marginBottom: 2 }}
        dataSource={
          data?.trades?.filter((item) => (onlyActive ? !item.closed : true)) ||
          []
        }
        rowKey="id"
        renderItem={(item) => (
          <List.Item style={{ cursor: "pointer", padding: "8px 0" }}>
            <AlgorithmTrade
              onClick={() => {
                onTickerSelect(item.instrument);
              }}
              item={item}
            />
          </List.Item>
        )}
      />
    </CollapseBlock>
  );
}
