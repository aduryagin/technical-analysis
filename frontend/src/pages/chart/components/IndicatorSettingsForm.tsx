import { Button, Form, InputNumber } from "antd";
import { Chart, extension } from "klinecharts";

// @ts-ignore
const standardIndicators = extension.technicalIndicatorExtensions;

interface Props {
  name: string;
  chart: Chart | null;
}

export default function IndicatorSettingsForm({ name, chart }: Props) {
  const [form] = Form.useForm();

  return (
    <div style={{ textAlign: "right" }}>
      <Form
        form={form}
        onFieldsChange={(_changed, allFields) => {
          chart?.overrideTechnicalIndicator({
            name,
            calcParams: allFields.map((param) => param.value),
          });
        }}
        layout={"horizontal"}
      >
        {standardIndicators[name].calcParams?.map(
          (param: any, index: number) => (
            <Form.Item
              name={`${name}${index}`}
              label={`Param ${index}`}
              key={`${name}${index}`}
              initialValue={param?.value || param}
            >
              <InputNumber step={param?.allowDecimal ? 0.1 : 1} />
            </Form.Item>
          )
        )}
        {standardIndicators[name].calcParams && (
          <Button
            onClick={() => {
              form.resetFields();
              chart?.overrideTechnicalIndicator({
                name,
                calcParams: standardIndicators[name].calcParams,
              });
            }}
          >
            Reset Settings
          </Button>
        )}
      </Form>
    </div>
  );
}
