import { SearchOutlined } from "@ant-design/icons";
import { Modal, Layout, Input, notification } from "antd";
import styled from "styled-components";
import { useFindInstrumentLazyQuery } from "./graphql";

const { Content } = Layout;

const List = styled.div`
  height: 250px;
  overflow-y: scroll;
  margin-top: 10px;
`;
const ListItem = styled.div`
  border-bottom: solid 1px #d9d9d9;
  height: 35px;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;

  &:hover {
    background: #dadada2e;
  }

  > span:first-child {
    font-weight: 600;
    font-size: 16px;
    margin-right: 10px;
    width: auto;
  }
`;

interface Props {
  visible: boolean;
  onHide: () => void;
}

export default function TickerSearchModal({ visible, onHide }: Props) {
  // const [tickerSearch, setTickerSearch] = useState("");
  const [findInstrument, { data, loading }] = useFindInstrumentLazyQuery({
    fetchPolicy: "cache-first",
    onError: notification.error,
  });

  return (
    <Modal
      width={700}
      visible={visible}
      bodyStyle={{ padding: 0 }}
      onCancel={onHide}
      title="Symbol Search"
      footer={null}
    >
      <Layout>
        <Content style={{ background: "#fff", padding: 10 }}>
          <Input.Search
            onChange={(event) => {
              findInstrument({
                variables: {
                  ticker: event.target.value,
                },
              });
            }}
            loading={loading}
            prefix={<SearchOutlined />}
            placeholder="Search"
          />
          <List>
            {data?.findInstrument.map((item) => (
              <ListItem key={item.ticker}>
                <span>{item.ticker}</span>
                <span>{item.description}</span>
                <span>{item.source}</span>
              </ListItem>
            ))}
          </List>
        </Content>
      </Layout>
    </Modal>
  );
}
