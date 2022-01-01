import { Empty, Spin } from "antd";
import { memo, useEffect } from "react";
import styled from "styled-components";
import { Bullet } from "@antv/g2plot";
import { useTipRanksInfoQuery } from "../../../graphql";
import THEME from "../../../theme";

const PriceWrapper = styled("span")`
  margin-right: 5px;
`;
const TitleWrapper = styled("div")`
  margin-right: 5px;
  font-weight: bold;
  line-height: 16px;
`;
const RowWrapper = styled("div")`
  margin-bottom: 7px;
`;

interface Props {
  ticker: string;
}

function TipRanks({ ticker }: Props) {
  const { data, error, loading } = useTipRanksInfoQuery({
    fetchPolicy: "no-cache",
    variables: {
      ticker,
    },
  });

  const info = data?.tipRanksInfo;

  // rating chart
  useEffect(() => {
    const data1 = [
      {
        title: "Score",
        ranges: [3, 7, 10],
        measures: [info?.stockScore],
        target: 0,
      },
    ];

    if (document.querySelector(`#tipranks-rating-${ticker}`)) {
      const bulletPlot = new Bullet(`tipranks-rating-${ticker}`, {
        data: data1,
        height: 20,
        size: {
          range: 20,
          measure: 15,
          target: 0,
        },
        measureField: "measures",
        rangeField: "ranges",
        targetField: "target",
        xField: "title",
        color: {
          range: [
            THEME.colors.chart.red,
            THEME.colors.chart.yellow,
            THEME.colors.chart.green,
          ],
          measure: [THEME.colors.chart.blue],
          target: "rgba(0,0,0,0)",
        },
        label: {
          measure: {
            position: "middle",
            style: {
              fill: "#fff",
            },
          },
        },
        xAxis: {
          line: null,
          label: null,
        },
        yAxis: false,
        tooltip: {
          showContent: false,
        },
      });

      bulletPlot.render();

      return () => bulletPlot.destroy();
    }
  }, [ticker, info]);

  // analysts chart
  useEffect(() => {
    const data1 = [
      {
        title: "Analysts",
        measures: [info?.ratingSell, info?.ratingHold, info?.ratingBuy],
        ranges: [
          (info?.ratingBuy || 0) +
            (info?.ratingHold || 0) +
            (info?.ratingSell || 0),
        ],
        target: 0,
      },
    ];

    if (document.querySelector(`#tipranks-analysts-${ticker}`)) {
      const bulletPlot = new Bullet(`tipranks-analysts-${ticker}`, {
        data: data1,
        height: 20,
        size: {
          range: 20,
          measure: 20,
          target: 0,
        },
        measureField: "measures",
        rangeField: "ranges",
        targetField: "target",
        xField: "title",
        color: {
          range: [],
          measure: [
            THEME.colors.chart.red,
            THEME.colors.chart.yellow,
            THEME.colors.chart.green,
          ],
          target: "rgba(0,0,0,0)",
        },
        label: {
          measure: {
            position: "middle",
            style: {
              fill: "#fff",
            },
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            formatter: ({ measures }) => {
              return !measures ? "" : measures;
            },
          },
        },
        xAxis: {
          line: null,
          label: null,
        },
        yAxis: false,
        tooltip: {
          showContent: false,
        },
      });

      bulletPlot.render();

      return () => bulletPlot.destroy();
    }
  }, [ticker, info]);

  // news sentiment chart
  useEffect(() => {
    const data1 = [
      {
        title: "News",
        measures: [
          info?.newsSentimentBearishPercent,
          info?.newsSentimentBullishPercent,
        ],
        ranges: [1],
        target: 0,
      },
    ];

    if (document.querySelector(`#tipranks-news-${ticker}`)) {
      const bulletPlot = new Bullet(`tipranks-news-${ticker}`, {
        data: data1,
        height: 20,
        size: {
          range: 20,
          measure: 20,
          target: 0,
        },
        measureField: "measures",
        rangeField: "ranges",
        targetField: "target",
        xField: "title",
        color: {
          range: [],
          measure: [THEME.colors.chart.red, THEME.colors.chart.green],
          target: "rgba(0,0,0,0)",
        },
        label: {
          measure: {
            position: "middle",
            style: {
              fill: "#fff",
            },
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            formatter: ({ measures }) => {
              return !measures
                ? ""
                : `${new Intl.NumberFormat("en-US", {
                    maximumSignificantDigits: 2,
                  }).format(measures * 100)}%`;
            },
          },
        },
        xAxis: {
          line: null,
          label: null,
        },
        yAxis: false,
        tooltip: {
          showContent: false,
        },
      });

      bulletPlot.render();

      return () => bulletPlot.destroy();
    }
  }, [ticker, info]);

  if (error) return <Empty description={error.message} />;
  if (loading) return <Spin />;

  return (
    <div>
      <RowWrapper>
        <TitleWrapper>Analysts Price Predictions:</TitleWrapper>
        <PriceWrapper>Low: {info?.priceTargetLow}$</PriceWrapper>
        <PriceWrapper>Average: {info?.priceTarget}$</PriceWrapper>
        <PriceWrapper>High: {info?.priceTargetHigh}$</PriceWrapper>
      </RowWrapper>
      <RowWrapper>
        <TitleWrapper>TipRanks Rating ({info?.stockScore}/10):</TitleWrapper>
        <div id={`tipranks-rating-${ticker}`} />
      </RowWrapper>

      <RowWrapper>
        <TitleWrapper>Analysts:</TitleWrapper>
        <PriceWrapper>Sell: {info?.ratingSell}</PriceWrapper>
        <PriceWrapper>Hold: {info?.ratingHold}</PriceWrapper>
        <PriceWrapper>Buy: {info?.ratingBuy}</PriceWrapper>
        <div id={`tipranks-analysts-${ticker}`} />
      </RowWrapper>
      <RowWrapper>
        <TitleWrapper>Last News:</TitleWrapper>
        <PriceWrapper>Sell: {info?.lastWeekSellNews}</PriceWrapper>
        <PriceWrapper>Neutral: {info?.lastWeekNeutralNews}</PriceWrapper>
        <PriceWrapper>Buy: {info?.lastWeekBuyNews}</PriceWrapper>
        <div id={`tipranks-news-${ticker}`} />
      </RowWrapper>
    </div>
  );
}

export default memo(TipRanks);
