import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import config from "./config";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const wsLink = new WebSocketLink({
  uri: config.graphqlSubscription,
  options: {
    reconnect: true,
  },
});

const httpLink = new HttpLink({
  uri: config.graphql,
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export default client;
