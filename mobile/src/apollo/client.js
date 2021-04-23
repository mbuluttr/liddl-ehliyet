import { ApolloClient, InMemoryCache } from "@apollo/client";
import { env } from "../../environments";

export const client = new ApolloClient({
  uri: env.GRAPHQL_API,
  cache: new InMemoryCache(),
});
