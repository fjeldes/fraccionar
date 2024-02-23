import { gql } from "graphql-request";
import { Query } from "~/utils/types";

export const EXCHANGE_RATES = gql`
  query FraccionalChallenge($first: Int, $last: Int, $pairAt: String!) {
    exchange_rates: exchange_ratesCollection(
      first: $first
      last: $last
      filter: {
        pair_left: { eq: CLF }
        pair_right: { eq: CLP }
        pair_at: { eq: $pairAt }
      }
      orderBy: { pair_at: DescNullsLast }
    ) {
      edges {
        node {
          id
          pair_at # Datetime (ISO)
          pair_left
          pair_right
          pair_numeric
        }
      }
    }
  }
`;

export const EXCHANGE_RATES_MONTH = gql`
  query FraccionalChallenge($first: Int = 10, $after: Cursor) {
    exchange_rates: exchange_ratesCollection(
      first: $first
      after: $after
      filter: { pair_left: { eq: CLF }, pair_right: { eq: CLP } }
      orderBy: { pair_at: DescNullsLast }
    ) {
      edges {
        node {
          id
          pair_at # Datetime (ISO)
          pair_left
          pair_right
          pair_numeric
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const getUf = (data: Query) => {
  if (
    data &&
    data.exchange_rates &&
    data.exchange_rates.edges &&
    data.exchange_rates.edges.length > 0 &&
    data.exchange_rates.edges[0] !== undefined
  ) {
    return parseFloat(data.exchange_rates.edges[0].node.pair_numeric);
  }
  return null;
};

export const getUfArray = (data: Query) => {
  if (
    data &&
    data.exchange_rates &&
    data.exchange_rates.edges &&
    data.exchange_rates.edges.length > 0
  ) {
    return data.exchange_rates.edges;
  }
  return null;
};

export const getUfPairAt = (data: Query) => {
  if (
    data &&
    data.exchange_rates &&
    data.exchange_rates.edges &&
    data.exchange_rates.edges.length > 0 &&
    data.exchange_rates.edges[0] !== undefined
  ) {
    return data.exchange_rates.edges[0].node.pair_at;
  }
  return null;
};
