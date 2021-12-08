import { SearchOutlined } from "@ant-design/icons";
import { Modal, Layout, Input } from "antd";
import styled from "styled-components";

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
    width: 50px;
  }
`;

interface Props {
  visible: boolean;
  onHide: () => void;
}

export default function SymbolSearchModal({ visible, onHide }: Props) {
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
          <Input prefix={<SearchOutlined />} placeholder="Search" />
          <List>
            {new Array(10).fill(0).map((item, index) => (
              <ListItem key={index}>
                <span>AAPL</span>
                <span>Apple.com</span>
              </ListItem>
            ))}
          </List>
        </Content>
      </Layout>
    </Modal>
  );
}
