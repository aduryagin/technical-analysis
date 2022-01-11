const HOST = "localhost:3000";

const config = {
  graphqlSubscription: `ws://${HOST}/graphql`,
  graphql: `http://${HOST}/graphql`,
  socket: HOST,
  python: "http://localhost:8000",
};

export default config;
