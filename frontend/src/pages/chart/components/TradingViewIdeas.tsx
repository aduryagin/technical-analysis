/* eslint-disable no-nested-ternary */
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  LikeOutlined,
} from "@ant-design/icons";
import { Bullet } from "@antv/g2plot";
import { Empty, List } from "antd";
import { useEffect } from "react";
import { useTradingViewIdeasQuery } from "../../../graphql";
import THEME from "../../../theme";
import { LongIcon, ShortIcon } from "./Icons";

interface Props {
  ticker: string;
}

function TradingViewIdeas({ ticker }: Props) {
  const { data, error, loading } = useTradingViewIdeasQuery({
    fetchPolicy: "no-cache",
    variables: {
      ticker,
    },
  });

  useEffect(() => {
    const ideas = data?.tradingViewIdeas || [];
    const shortIdeas = data?.tradingViewIdeas.filter(
      (item) => item.type === "Short"
    );
    const longIdeas = data?.tradingViewIdeas.filter(
      (item) => item.type === "Long"
    );
    const neutralIdeas = data?.tradingViewIdeas.filter(
      (item) => item.type === ""
    );
    const educationIdeas = data?.tradingViewIdeas.filter(
      (item) => item.type === "Education"
    );

    if (ideas.length) {
      const data1 = [
        {
          title: "Short/Buy",
          measures: [
            (shortIdeas?.length || 0) / ideas.length,
            (neutralIdeas?.length || 0) / ideas.length,
            (educationIdeas?.length || 0) / ideas.length,
            (longIdeas?.length || 0) / ideas.length,
          ],
          ranges: [1],
          target: 0,
        },
      ];

      if (document.querySelector(`#tradingview-ideas-${ticker}`)) {
        const bulletPlot = new Bullet(`tradingview-ideas-${ticker}`, {
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
              THEME.colors.chart.blue,
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
    }
  }, [ticker, data]);

  if (error) return <Empty description={error.message} />;

  return (
    <>
      <div id={`tradingview-ideas-${ticker}`} />
      <List
        loading={loading}
        size="small"
        dataSource={data?.tradingViewIdeas || []}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        rowKey="ticker"
        renderItem={(item) => (
          <List.Item style={{ cursor: "pointer", padding: "8px 0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span style={{ display: "flex" }}>
                <span
                  style={{
                    minWidth: 20,
                    height: 20,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    textAlign: "center",
                    backgroundColor:
                      // eslint-disable-next-line no-nested-ternary
                      item.type === "Long"
                        ? THEME.colors.chart.green
                        : item.type === ""
                        ? THEME.colors.chart.yellow
                        : item.type === "Education"
                        ? THEME.colors.chart.blue
                        : THEME.colors.chart.red,
                    borderRadius: "50%",
                    marginRight: 10,
                  }}
                >
                  {item.type === "Long" ? (
                    <LongIcon />
                  ) : item.type === "Education" || item.type === "" ? null : (
                    <ShortIcon />
                  )}
                </span>
                <span style={{ marginRight: 10, fontWeight: "500" }}>
                  <a href={item.link} target="__blank">
                    {item.title}
                  </a>
                </span>
              </span>
              <span style={{ minWidth: 230 }}>
                <span
                  style={{
                    width: 50,
                    display: "inline-block",
                    marginRight: 10,
                  }}
                >
                  <ClockCircleOutlined style={{ marginRight: 2 }} />
                  {item.timeframe}
                </span>
                <span
                  style={{
                    width: 45,
                    display: "inline-block",
                    marginRight: 10,
                  }}
                >
                  <LikeOutlined style={{ marginRight: 2 }} />
                  {item.likes}
                </span>
                <span
                  style={{
                    width: 35,
                    display: "inline-block",
                    marginRight: 10,
                  }}
                >
                  <CommentOutlined style={{ marginRight: 2 }} />
                  {item.comments}
                </span>
                <span>
                  <CalendarOutlined style={{ marginRight: 2 }} /> {item.date}
                </span>
              </span>
            </div>
          </List.Item>
        )}
      />
    </>
  );
}

export default TradingViewIdeas;
