import {
  Form,
  Input,
  List,
  Modal,
  notification,
  Select,
  Typography,
} from "antd";
import {
  SourcesDocument,
  useAddSourceMutation,
  useRemoveSourceMutation,
  useSourcesQuery,
  useUpdateSourceMutation,
  SourceName,
} from "../../../graphql";
import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";

export default function Sources() {
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [activeSource, setActiveSource] = useState(null);
  const [form] = Form.useForm();
  const [isAdd, setIsAdd] = useState(false);
  const resetSourceData = useCallback(() => {
    setActiveSource(null);
    setIsSettingsModalVisible(false);
    form.setFieldsValue({
      key: "",
      secret: "",
    });
    setIsAdd(false);
  }, []);

  const { data, loading } = useSourcesQuery({
    fetchPolicy: "no-cache",
    onError: notification.error,
  });
  const [addSource, { loading: addingSource }] = useAddSourceMutation({
    onError: notification.error,
    refetchQueries: [SourcesDocument],
  });
  const [removeSource] = useRemoveSourceMutation({
    onError: notification.error,
    refetchQueries: [SourcesDocument],
  });
  const showEditModal = useCallback(
    (source) => {
      setIsSettingsModalVisible(true);
      setActiveSource(source);
      form.setFieldsValue({
        key: source?.key,
        secret: source?.secret,
      });
    },
    [form]
  );

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
        placeholder="Source"
        style={{ width: "100%" }}
        onChange={(source: string) => {
          setIsSettingsModalVisible(true);
          setActiveSource({ name: source });
          setIsAdd(true);
        }}
        options={Object.values(SourceName).map((source) => ({
          label: source,
          value: source,
          disabled: Boolean(
            data?.sources?.find((item) => item.name === source)
          ),
        }))}
      />
      <List
        loading={loading}
        size="small"
        style={{ marginBottom: 2 }}
        dataSource={data?.sources || []}
        rowKey="id"
        renderItem={(item) => (
          <List.Item style={{ cursor: "pointer", padding: "8px 0" }}>
            <div style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
                onClick={() => showEditModal(item)}
              >
                <span>{item.name}</span>
                <span>
                  <EditOutlined style={{ marginRight: 10 }} />
                  <CloseCircleOutlined
                    onClick={(event) => {
                      event.stopPropagation();
                      removeSource({
                        variables: {
                          id: item.id,
                        },
                      }).then(() => {
                        window.location.reload();
                      });
                    }}
                  />
                </span>
              </div>
            </div>
          </List.Item>
        )}
      />

      <Modal
        title={activeSource?.name}
        visible={isSettingsModalVisible}
        okText={isAdd ? "Add" : "Save"}
        confirmLoading={addingSource}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          resetSourceData();
        }}
      >
        <Form
          form={form}
          onFinish={(values) => {
            if (isAdd) {
              addSource({
                variables: {
                  input: {
                    name: activeSource?.name,
                    secret: values?.secret,
                    key: values?.key,
                  },
                },
              }).then(() => window.location.reload());
            } else {
              updateSource({
                variables: {
                  input: {
                    id: activeSource.id,
                    secret: values?.secret,
                    key: values?.key,
                  },
                },
              }).then(() => window.location.reload());
            }
          }}
          initialValues={{
            key: activeSource?.key,
            secret: activeSource?.secret,
          }}
          layout={"vertical"}
        >
          {activeSource?.name === "Binance" && (
            <Form.Item rules={[{ required: true }]} name="key" label="Key">
              <Input />
            </Form.Item>
          )}
          <Form.Item rules={[{ required: true }]} name="secret" label="Secret">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
