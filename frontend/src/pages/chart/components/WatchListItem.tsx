import {
  BarChartOutlined,
  CloseCircleOutlined,
  CloudOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { notification, Popover } from "antd";
import {
  Instrument,
  SourceName,
  useUnwatchMutation,
  WatchListSubscriptionHookResult,
} from "../../../graphql";
import THEME from "../../../theme";
import TipRanksInfo from "./TipRanksInfo";
import TradingViewIdeas from "./TradingViewIdeas";

interface Props {
  item: NonNullable<WatchListSubscriptionHookResult["data"]>["watchList"][0];
  onClick: (instrument: Partial<Instrument>) => void;
}

export default function WatchListItem({ item, onClick }: Props) {
  const [unwatch] = useUnwatchMutation({
    onError: notification.error,
  });

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <span style={{ width: 61 }}>
          <a
            style={{ marginRight: 5 }}
            target="__blank"
            href={`/?ticker=${item.ticker}&source=${item.source}${
              item.figi ? `&figi=${item.figi}` : ""
            }`}
          >
            <LinkOutlined />
          </a>
          <a
            style={{ marginRight: 7 }}
            target="__blank"
            href={`https://www.tradingview.com/symbols/${item.ticker}`}
          >
            <Popover
              placement="left"
              content={<TradingViewIdeas ticker={item.ticker} />}
            >
              <CloudOutlined />
            </Popover>
          </a>
          {item.source === SourceName.Tinkoff && (
            <a
              style={{ marginRight: 7 }}
              target="__blank"
              href={`https://www.tipranks.com/stocks/${item.ticker}`}
            >
              <Popover
                placement="left"
                content={<TipRanksInfo ticker={item.ticker} />}
              >
                <BarChartOutlined />
              </Popover>
            </a>
          )}
        </span>
        <span
          style={{ width: 80 }}
          onClick={() => {
            onClick(item);
          }}
        >
          {item.ticker}
        </span>
        <span
          style={{ width: 70 }}
          onClick={() => {
            onClick(item);
          }}
        >
          {item.price}
        </span>
        <span
          style={{
            marginRight: 10,
            textAlign: "right",
            width: 55,
            color:
              (item.pricePercentChange || 0) >= 0
                ? THEME.colors.green
                : THEME.colors.red,
          }}
          onClick={() => {
            onClick(item);
          }}
        >
          {new Intl.NumberFormat("en-US", {
            maximumSignificantDigits: 2,
          }).format(item.pricePercentChange as number)}
          %
        </span>
        <CloseCircleOutlined
          onClick={() => {
            if (item.id)
              unwatch({
                variables: {
                  id: item.id,
                },
              });
          }}
        />
      </div>
    </div>
  );
}
