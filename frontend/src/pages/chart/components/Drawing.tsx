import { Button, notification, Typography } from "antd";
import { useAddShapeMutation } from "../../../graphql";
import { DRAWINGS } from "../drawings";
import { findGetParameter } from "../helpers";

interface Props {
  chart: any | null;
  removeShape: any;
  onUpdateShape: any;
  ticker: any;
}

export default function Drawing({
  chart,
  removeShape,
  onUpdateShape,
  ticker,
}: Props) {
  const [addShape] = useAddShapeMutation({
    onError: notification.error,
  });

  return (
    <>
      <Typography.Title style={{ fontSize: 16, marginBottom: 3 }} level={4}>
        Drawing
      </Typography.Title>
      <div
        style={{
          marginBottom: 10,
          display: "grid",
          gridGap: "10px",
          gridTemplateColumns: "repeat(6, 40px)",
        }}
      >
        {DRAWINGS.map((drawing) => (
          <Button
            key={drawing.name}
            icon={drawing.icon}
            size="large"
            onClick={() => {
              chart?.createShape({
                name: drawing.name,
                onDrawEnd: (e) => {
                  addShape({
                    variables: {
                      input: {
                        name: drawing.name,
                        ticker: ticker as any,
                        points: e.points as any,
                      },
                    },
                  }).then((data) => {
                    chart.removeShape(e.id as any);

                    chart?.createShape({
                      id: data.data?.addShape.id as any,
                      points: data.data?.addShape?.points as any,
                      name: drawing.name,
                      onRemove: (e) => {
                        if (
                          data.data?.addShape.ticker ===
                          findGetParameter("ticker")
                        )
                          removeShape({
                            variables: {
                              id: e.id as any,
                            },
                          });
                      },
                      onPressedMove: (e) => {
                        onUpdateShape({
                          id: e.id,
                          points: e.points?.map(
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            ({ __typename, ...point }: any) => point
                          ),
                        });
                      },
                    });

                    // todo: klinecharts contribute. update id
                    // shape.setShapeOptions({
                    //   id: data.data?.addShape.id,
                    // });
                  });
                },
              });
            }}
          />
        ))}
      </div>
    </>
  );
}
