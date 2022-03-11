import { Layout, ConfigProvider } from "antd";
import styled from "styled-components";
import { ApolloProvider } from "@apollo/client";
import "antd/dist/antd.min.css";
import client from "./apollo";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigation } from "./Navigation";
import Chart from "./pages/chart";
const { Header, Content } = Layout;

export const ContainerStyled = styled.div<{ withoutPadding: boolean }>`
  max-width: 1280px;
  margin: auto;
  ${({ withoutPadding }) => (withoutPadding ? "" : "padding: 0 25px;")}
  width: auto;
`;

const HeaderStyled = styled(Header)`
  background: #fff;
  padding: 0;
  box-shadow: 0 2px 8px #f0f1f2;
  position: relative;
`;

const ContentStyled = styled(Content)`
  background: #fff;
  padding: 0;
`;

function App() {
  return (
    <ConfigProvider>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <HeaderStyled>
            <ContainerStyled withoutPadding>
              <Navigation />
            </ContainerStyled>
          </HeaderStyled>
          <ContentStyled>
            <Routes>
              <Route path="/" element={<Chart />} />
              {/* <Route path="/screener" exact component={Screener} /> */}
              {/* <ContainerStyled>
                <Route path="/ideas" component={Home} />
                <Route path="/earnings" component={Earnings} />
                <Route path="/sp500" component={SP500} />
                <Route
                  path="/portfolio-optimizer"
                  component={PortfolioOptimizer}
                />
                <Route path="/nasdaq100" component={Nasdaq100} />
                <Route path="/imoex" component={Imoex} />
              </ContainerStyled> */}
            </Routes>
          </ContentStyled>
        </BrowserRouter>
      </ApolloProvider>
    </ConfigProvider>
  );
}

export default App;
