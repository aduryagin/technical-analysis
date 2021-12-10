import { ApolloProvider } from "@apollo/client";
import "antd/dist/antd.css";
import client from "./apollo";
import Chart from "./Chart";

function App() {
  return (
    <ApolloProvider client={client}>
      <Chart />
    </ApolloProvider>
  );
}

export default App;
