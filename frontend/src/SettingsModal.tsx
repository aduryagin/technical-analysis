import { Modal, Menu, Layout, Form, Radio, Input, Button } from "antd";

const { Content, Sider } = Layout;

interface Props {
  visible: boolean;
  onHide: () => void;
}

export default function SettingsModal({ visible, onHide }: Props) {
  return (
    <Modal
      width={700}
      visible={visible}
      bodyStyle={{ padding: 0 }}
      onCancel={onHide}
      title="Settings"
      footer={null}
    >
      <Layout>
        <Sider theme="light">
          <Menu mode="inline" defaultSelectedKeys={["4"]}>
            <Menu.Item key="1">Source</Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ background: "#fff", padding: 10 }}>
          <Form layout="vertical">
            <Form.Item label="Source" name="source" required>
              <Radio.Group>
                <Radio.Button value="alphaVantage">Alpha Vantage</Radio.Button>
                <Radio.Button value="binance">Binance</Radio.Button>
                <Radio.Button value="tinkoff">Tinkoff</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Token" required>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    </Modal>
  );
}
