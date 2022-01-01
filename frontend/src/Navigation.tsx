import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";

export function Navigation() {
  const location = useLocation();
  const menuItem = location.pathname.replace("/", "")
    ? location.pathname.replace("/", "")
    : "chart";

  return (
    <Menu mode="horizontal" selectedKeys={[menuItem]}>
      <Menu.Item key="chart">
        <NavLink to="/">Chart</NavLink>{" "}
      </Menu.Item>
      {/* <Menu.Item key="screener">
        <NavLink to="/screener">Screener</NavLink>{' '}
      </Menu.Item> */}
      {/* <Menu.Item key="ideas">
        <NavLink to="/ideas">Ideas</NavLink>{" "}
      </Menu.Item> */}
      {/* <Menu.Item key="portfolio-optimizer">
        <NavLink to="/portfolio-optimizer">Portfolio Optimizer</NavLink>{' '}
      </Menu.Item> */}
      {/* <Menu.Item key="sp500">
        <NavLink to="/sp500">S&P 500</NavLink>
      </Menu.Item>
      <Menu.Item key="nasdaq100">
        <NavLink to="/nasdaq100">Nasdaq 100</NavLink>
      </Menu.Item>
      <Menu.Item key="imoex">
        <NavLink to="/imoex">IMOEX</NavLink>
      </Menu.Item> */}
    </Menu>
  );
}
