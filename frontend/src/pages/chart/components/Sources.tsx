import {
  Collapse,
  Form,
  Input,
  List,
  notification,
  Select,
  Typography,
} from "antd";
import { CollapseWrapper } from "./Indicators";
import {
  SourcesDocument,
  useAddSourceMutation,
  useRemoveSourceMutation,
  useSourcesQuery,
  useUpdateSourceMutation,
} from "../../../graphql";
import { CloseCircleOutlined } from "@ant-design/icons";

export default function Sources() {
  const { data, loading } = useSourcesQuery({
    fetchPolicy: "no-cache",
    onError: notification.error,
  });
  const [addSource, { loading: addingSource }] = useAddSourceMutation({
    onError: notification.error,
    refetchQueries: [SourcesDocument],
  });
  const [removeSource, { loading: removingingSource }] =
    useRemoveSourceMutation({
      onError: notification.error,
      refetchQueries: [SourcesDocument],
    });
  const [updateSource] = useUpdateSourceMutation({
    onError: notification.error,
  });

  return (
    <>
      <Typography.Title style={{ fontSize: 16, marginBottom: 3 }} level={4}>
        Sources
      </Typography.Title>
      <Select
        value={null}
        showSearch
        loading={addingSource || removingingSource}
        placeholder="Source"
        style={{ width: "100%" }}
        onChange={(source: string) => {
          addSource({
            variables: {
              input: {
                name: source,
              },
            },
          });
        }}
        options={[
          {
            label: "Tinkoff",
            value: "Tinkoff",
            disabled: Boolean(
              data?.sources?.find((item) => item.name === "Tinkoff")
            ),
          },
          {
            label: "Binance",
            value: "Binance",
            disabled: Boolean(
              data?.sources?.find((item) => item.name === "Binance")
            ),
          },
        ]}
      />
      <List
        loading={loading}
        size="small"
        style={{ marginBottom: 2 }}
        dataSource={data?.sources || []}
        rowKey="id"
        renderItem={(item) => (
          <List.Item style={{ cursor: "pointer", padding: "8px 0" }}>
            <CollapseWrapper>
              <Collapse ghost expandIconPosition="left">
                <Collapse.Panel
                  header={item.name}
                  key={item.name}
                  extra={
                    <CloseCircleOutlined
                      onClick={() => {
                        removeSource({
                          variables: {
                            id: item.id,
                          },
                        });
                      }}
                    />
                  }
                >
                  <Form
                    initialValues={{
                      key: item.key,
                      secret: item.secret,
                    }}
                    onFieldsChange={(changed) => {
                      updateSource({
                        variables: {
                          input: {
                            id: item.id,
                            [changed[0].name[0] as "secret"]: changed[0].value,
                          },
                        },
                      });
                    }}
                    layout={"vertical"}
                  >
                    {item.name === "Binance" && (
                      <Form.Item name="key" label="Key">
                        <Input />
                      </Form.Item>
                    )}
                    <Form.Item name="secret" label="Secret">
                      <Input />
                    </Form.Item>
                  </Form>
                </Collapse.Panel>
              </Collapse>
            </CollapseWrapper>
          </List.Item>
        )}
      />
    </>
  );
}
