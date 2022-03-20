import { Collapse, Typography } from "antd";
import styled from "styled-components";

interface Props {
  children: any;
  title: any;
}

export const CollapseWrapper = styled.div`
  width: 100%;

  .ant-collapse-header {
    padding: 0 !important;
  }

  .ant-collapse-content-box {
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 0 !important;
    padding-top: 5px !important;
  }

  .ant-form-item {
    margin-bottom: 12px;
  }

  .ant-input-number {
    width: 100%;
  }
`;

export default function CollapseBlock({ children, title }: Props) {
  return (
    <CollapseWrapper>
      <Collapse defaultActiveKey={[1]} ghost expandIconPosition="left">
        <Collapse.Panel
          key={1}
          header={
            typeof title === "string" ? (
              <Typography.Title
                style={{ fontSize: 16, marginBottom: 0 }}
                level={4}
              >
                {title}
              </Typography.Title>
            ) : (
              title
            )
          }
        >
          {children}
        </Collapse.Panel>
      </Collapse>
    </CollapseWrapper>
  );
}
