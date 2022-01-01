import { Layout, ConfigProvider } from "antd";
import styled from "styled-components";
import { ApolloProvider } from "@apollo/client";
import "antd/dist/antd.css";
// import { BrowserRouter, Switch, Route } from "react-router-dom";
import ruRu from "antd/es/locale/ru_RU";
import client from "./apollo";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigation } from "./Navigation";
import Chart from "./pages/chart";
// import client from "../../apollo";
// import Home from "../../pages/home";
// import Earnings from "../../pages/earnings";
// import SP500 from "../../pages/sp500";
// import Imoex from "../../pages/imoex";
// import Chart from "../../pages/chart";
// import Screener from '../../pages/screener';
// import Nasdaq100 from "../../pages/nasdaq100";
// import { Navigation } from "./Navigation";
// import PortfolioOptimizer from "../../pages/portfolio-optimizer";
// import DebugCandles from "../../pages/debugCandles";

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
`;

const ContentStyled = styled(Content)`
  background: #fff;
  padding: 0;
  margin-top: 20px;
`;

function App() {
  return (
    <ConfigProvider locale={ruRu}>
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
