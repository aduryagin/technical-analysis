import { Button, Form, InputNumber, notification } from "antd";
import { Chart } from "klinecharts";
import {
  IndicatorsQueryHookResult,
  useUpdateIndicatorMutation,
} from "../../../graphql";
import { INDICATORS } from "./Indicators";

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
        layout={"vertical"}
      >
        {INDICATORS[indicator.name].calcParams?.map(
          (param: any, index: number) => (
            <Form.Item
              name={`${indicator.name}${index}`}
              label={
                INDICATORS[indicator.name]?.calcParamsLabels?.[index] ||
                `Param ${index}`
              }
              key={`${indicator.name}${index}`}
              initialValue={
                indicator?.settings?.[index] || param?.value || param
              }
            >
              <InputNumber step={param?.allowDecimal ? 0.1 : 1} />
            </Form.Item>
          )
        )}
        {INDICATORS[indicator.name].calcParams && (
          <Button
            onClick={() => {
              const params = INDICATORS[indicator.name].calcParams;
              const formValues = params.reduce(
                (accum: any, item: any, index: any) => ({
                  [`${indicator.name}${index}`]: item?.value || item,
                  ...accum,
                }),
                {}
              );
              form.setFieldsValue(formValues);

              chart?.overrideTechnicalIndicator({
                name: indicator.name,
                calcParams: params,
              });

              if (indicator.id)
                updateSettings({
                  variables: {
                    input: {
                      id: indicator.id,
                      settings: Object.values(formValues).reverse() as number[],
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
