import { GraphQLClient } from "graphql-request";

const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_FRACCIONAL as string;

const graphQLClient = new GraphQLClient(endpoint);

graphQLClient.setHeader(
  "apiKey",
  process.env.NEXT_PUBLIC_API_KEY_FRACCIONAL as string
);

export default graphQLClient;
