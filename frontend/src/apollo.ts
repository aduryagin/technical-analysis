import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import config from "./config";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: config.graphql,
  }),
});

export default client;
