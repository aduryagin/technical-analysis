import { List, notification, Select, Typography } from "antd";
import WatchListItem from "./WatchListItem";
import {
  Instrument,
  useSearchInstrumentLazyQuery,
  useWatchListSubscription,
  useWatchMutation,
} from "../../../graphql";

interface Props {
  onTickerSelect: (instrument: Instrument) => void;
}

function WatchList({ onTickerSelect }: Props) {
  const { data, loading } = useWatchListSubscription({
    fetchPolicy: "no-cache",
  });
  const [
    searchInstrument,
    { data: searchInstrumentData, loading: searchInstrumentLoading },
  ] = useSearchInstrumentLazyQuery({
    fetchPolicy: "no-cache",
    onError: notification.error,
  });
  const [watch, { loading: watchLoading }] = useWatchMutation();

  return (
    <>
      <Typography.Title style={{ fontSize: 16, marginBottom: 3 }} level={4}>
        Watch list
      </Typography.Title>
      <Select
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        value={null}
        showSearch
        style={{ width: "100%" }}
        loading={searchInstrumentLoading || watchLoading}
        onSelect={(value) => {
          const instrument = searchInstrumentData?.searchInstrument.find(
            (item) => item.figi === value
          );

          if (instrument) {
            watch({
              variables: {
                input: {
                  ticker: instrument.ticker,
                  figi: instrument.figi,
                },
              },
            });

            onTickerSelect(instrument);
          }
        }}
        onSearch={(value) => {
          if (value)
            searchInstrument({
              variables: {
                ticker: value,
              },
            });
        }}
        placeholder="Ticker"
        showArrow={false}
        filterOption={false}
      >
        {searchInstrumentData?.searchInstrument.map((item) => (
          <Select.Option value={item.figi} key={item.figi}>
            {item.ticker}
          </Select.Option>
        ))}
      </Select>
      <List
        size="small"
        style={{ marginBottom: 2 }}
        loading={loading}
        dataSource={data?.watchList}
        rowKey="ticker"
        renderItem={(item) => (
          <List.Item style={{ cursor: "pointer", padding: "8px 0" }}>
            <WatchListItem item={item} onClick={onTickerSelect} />
          </List.Item>
        )}
      />
    </>
  );
}

export default WatchList;