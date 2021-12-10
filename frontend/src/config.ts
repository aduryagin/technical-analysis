const HOST = "localhost:3000";

const config = {
  graphqlSubscription: `ws://${HOST}/graphql`,
  graphql: `http://${HOST}/graphql`,
  socket: HOST,
};

export default config;
