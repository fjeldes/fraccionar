import { gql } from 'graphql-request';

export const EXCHANGE_RATES = gql`
query FraccionalChallenge($first: Int = 1, $pairAt: String!) {
  exchange_rates: exchange_ratesCollection(
    first: $first
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
query FraccionalChallenge($first: Int = 10, $after:Cursor) {
  exchange_rates: exchange_ratesCollection(
    first: $first
    after: $after
    filter: {
      pair_left: { eq: CLF }
      pair_right: { eq: CLP }
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
      cursor

    },
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;
