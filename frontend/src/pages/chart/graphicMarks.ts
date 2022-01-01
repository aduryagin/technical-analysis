// @ts-ignore
import { checkCoordinateOnSegment } from "klinecharts/lib/shape/shapeHelper";

export const MEASURE_GRAPHIC_MARK = {
  name: "measure",
  totalStep: 3,
  checkEventCoordinateOnShape: ({ dataSource, eventCoordinate }: any) => {
    return checkCoordinateOnSegment(
      dataSource[0],
      dataSource[1],
      eventCoordinate
    );
  },
  createShapeDataSource: ({ coordinates, points }: any) => {
    if (coordinates.length === 2) {
      const startPrice = points[0].value;
      const endPrice = points[1].value;
      const priceDiff = endPrice - startPrice;
      const percent = priceDiff / (startPrice / 100);
      const numberFormatter = new Intl.NumberFormat("en-US", {
        maximumSignificantDigits: 2,
      });

      return [
        {
          type: "arrows",
          dataSource: [
            [
              {
                x: coordinates[0].x + (coordinates[1].x - coordinates[0].x) / 2,
                y: coordinates[0].y,
              },
              {
                x: coordinates[0].x + (coordinates[1].x - coordinates[0].x) / 2,
                y: coordinates[1].y,
              },
            ],
            [
              {
                x: coordinates[0].x,
                y: coordinates[0].y + (coordinates[1].y - coordinates[0].y) / 2,
              },
              {
                x: coordinates[1].x,
                y: coordinates[0].y + (coordinates[1].y - coordinates[0].y) / 2,
              },
            ],
          ],
        },
        {
          type: "area",
          dataSource: [
            [
              { ...coordinates[0] },
              { x: coordinates[1].x, y: coordinates[0].y },
              { ...coordinates[1] },
              { x: coordinates[0].x, y: coordinates[1].y },
            ],
          ],
        },
        {
          type: "measure",
          dataSource: [
            {
              x: coordinates[0].x + (coordinates[1].x - coordinates[0].x) / 2,
              y: coordinates[1].y,
              text: `${numberFormatter.format(
                priceDiff
              )} (${numberFormatter.format(percent)}%)`,
            },
          ],
        },
      ];
    }
    return [];
  },
  drawExtend: ({ ctx, dataSource }: any) => {
    const arrowsDataSource = dataSource?.[0]?.dataSource;
    const polygonDataSource = dataSource?.[1]?.dataSource;
    const measureDataSource = dataSource?.[2]?.dataSource;

    if (!arrowsDataSource) return;

    // fill rectangle
    const rectangleWidth =
      polygonDataSource[0][1].x - polygonDataSource[0][0].x;
    const rectangleHeight =
      polygonDataSource[0][2].y - polygonDataSource[0][0].y;
    const isShort = rectangleHeight > 0;
    ctx.fillStyle = isShort ? "rgba(255,82,82,0.1)" : "rgba(33,150,243,0.1)";
    ctx.fillRect(
      polygonDataSource[0][0].x,
      polygonDataSource[0][0].y,
      rectangleWidth,
      rectangleHeight
    );

    // arrows
    ctx.beginPath();
    const minRectangleSize = 10;
    const strokeStyle = isShort ? "rgba(255,82,82,1)" : "rgba(33,150,243,1)";

    // vertical arrow
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(arrowsDataSource[0][0].x, arrowsDataSource[0][0].y);
    ctx.lineTo(arrowsDataSource[0][1].x, arrowsDataSource[0][1].y);

    // draw arrows if rectangle is not small
    if (Math.abs(rectangleHeight) > minRectangleSize) {
      ctx.lineTo(
        arrowsDataSource[0][1].x + (isShort ? -5 : 5),
        arrowsDataSource[0][1].y + (isShort ? -5 : 5)
      );
      ctx.moveTo(arrowsDataSource[0][1].x, arrowsDataSource[0][1].y);
      ctx.lineTo(
        arrowsDataSource[0][1].x + (isShort ? 5 : -5),
        arrowsDataSource[0][1].y + (isShort ? -5 : 5)
      );
    }
    ctx.stroke();

    // horizontal
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(arrowsDataSource[1][0].x, arrowsDataSource[1][0].y);
    ctx.lineTo(arrowsDataSource[1][1].x, arrowsDataSource[1][1].y);

    // draw arrows if rectangle is not small
    if (Math.abs(rectangleWidth) > minRectangleSize) {
      const isLeft = rectangleWidth < 0;
      ctx.lineTo(
        arrowsDataSource[1][1].x + (isLeft ? 5 : -5),
        arrowsDataSource[1][1].y + 5
      );
      ctx.moveTo(arrowsDataSource[1][1].x, arrowsDataSource[1][1].y);
      ctx.lineTo(
        arrowsDataSource[1][1].x + (isLeft ? 5 : -5),
        arrowsDataSource[1][1].y - 5
      );
    }
    ctx.stroke();

    // measure box
    ctx.fillStyle = isShort ? "rgba(255,82,82,1)" : "rgba(33,150,243,1)";
    const textSize = ctx.measureText(measureDataSource[0].text);
    const measureBoxX = measureDataSource[0].x - textSize.width / 2 - 10;
    const measureBoxY = measureDataSource[0].y + (isShort ? 10 : -40);
    const measureBoxWidth = textSize.width + 20;
    const measureBoxHeight = 30;
    ctx.fillRect(measureBoxX, measureBoxY, measureBoxWidth, measureBoxHeight);
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "middle";
    ctx.font = ctx.font.replace(/\d+px/, "12px");
    ctx.fillText(
      measureDataSource[0].text,
      measureDataSource[0].x,
      measureBoxY + measureBoxHeight / 2
    );
  },
};
