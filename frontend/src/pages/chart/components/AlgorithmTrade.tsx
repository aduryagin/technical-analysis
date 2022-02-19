import { CloseCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { format } from "date-fns";
import { TradesSubscription, useCloseTradeMutation } from "../../../graphql";
import THEME from "../../../theme";
import { formatNumber } from "../helpers";
import { LongIcon, ShortIcon } from "./Icons";

interface Props {
  item: TradesSubscription["trades"][0];
  onClick: () => void;
}

export default function AlgorithmTrade({ item, onClick }: Props) {
  const [closeTrade] = useCloseTradeMutation();

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <span
          onClick={onClick}
          style={{
            width: 20,
            height: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            textAlign: "center",
            backgroundColor:
              item.type === "LONG"
                ? THEME.colors.chart.green
                : THEME.colors.chart.red,
            borderRadius: "50%",
            marginRight: 10,
          }}
        >
          {item.type === "LONG" ? <LongIcon /> : <ShortIcon />}
        </span>
        <span onClick={onClick} style={{ width: 50 }}>
          {item.instrument.ticker}
        </span>
        <span onClick={onClick} style={{ width: 50 }}>
          {format(new Date(item.date), "HH:mm")}
        </span>
        <span style={{ width: 70 }}>{item.price}</span>
        <span
          onClick={onClick}
          style={{
            textAlign: "right",
            marginRight: 10,
            width: 65,
            color:
              (item.pricePercentChange || 0) >= 0
                ? THEME.colors.green
                : THEME.colors.red,
          }}
        >
          {formatNumber(item.pricePercentChange)}%
        </span>
        {item.closed ? (
          <CloseCircleOutlined style={{ opacity: 0.4, cursor: "default" }} />
        ) : (
          <Tooltip title="Close">
            <CloseCircleOutlined
              style={{ opacity: 1 }}
              onClick={() => {
                closeTrade({ variables: { id: item.id } });
              }}
            />
          </Tooltip>
        )}
      </div>
    </div>
  );
}
