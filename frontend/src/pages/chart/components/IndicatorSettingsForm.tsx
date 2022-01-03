import { Button, Form, InputNumber, notification } from "antd";
import { Chart, extension } from "klinecharts";
import {
  IndicatorsQueryHookResult,
  useUpdateIndicatorMutation,
} from "../../../graphql";

// @ts-ignore
const standardIndicators = extension.technicalIndicatorExtensions;

interface Props {
  indicator: NonNullable<IndicatorsQueryHookResult["data"]>["indicators"][0];
  chart: Chart | null;
}

export default function IndicatorSettingsForm({ indicator, chart }: Props) {
  const [form] = Form.useForm();
  const [updateSettings] = useUpdateIndicatorMutation({
    onError: notification.error,
  });

  return (
    <div style={{ textAlign: "right" }}>
      <Form
        form={form}
        onFieldsChange={(_changed, allFields) => {
          const params = allFields.map((param) => param.value || 0);

          chart?.overrideTechnicalIndicator({
            name: indicator.name,
            calcParams: params,
          });

          if (indicator.id)
            updateSettings({
              variables: {
                input: {
                  id: indicator.id,
                  settings: params,
                },
              },
            });
        }}
        layout={"horizontal"}
      >
        {standardIndicators[indicator.name].calcParams?.map(
          (param: any, index: number) => (
            <Form.Item
              name={`${indicator.name}${index}`}
              label={`Param ${index}`}
              key={`${indicator.name}${index}`}
              initialValue={
                indicator?.settings?.[index] || param?.value || param
              }
            >
              <InputNumber step={param?.allowDecimal ? 0.1 : 1} />
            </Form.Item>
          )
        )}
        {standardIndicators[indicator.name].calcParams && (
          <Button
            onClick={() => {
              const params = standardIndicators[indicator.name].calcParams;
              form.setFieldsValue(
                params.reduce(
                  (accum: any, item: any, index: any) => ({
                    [`${indicator.name}${index}`]: item,
                    ...accum,
                  }),
                  {}
                )
              );

              chart?.overrideTechnicalIndicator({
                name: indicator.name,
                calcParams: params,
              });

              if (indicator.id)
                updateSettings({
                  variables: {
                    input: {
                      id: indicator.id,
                      settings: params,
                    },
                  },
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
