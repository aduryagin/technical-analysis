import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  _FieldSet: any;
};

export type Candle = {
  __typename?: 'Candle';
  close: Scalars['Float'];
  high: Scalars['Float'];
  low: Scalars['Float'];
  open: Scalars['Float'];
  time: Scalars['Float'];
  volume: Scalars['Float'];
};

export type Instrument = {
  __typename?: 'Instrument';
  description: Scalars['String'];
  source: Source;
  ticker: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  candles: Array<Candle>;
  findInstrument: Array<Instrument>;
};


export type QueryCandlesArgs = {
  interval: Scalars['String'];
  ticker: Scalars['String'];
};


export type QueryFindInstrumentArgs = {
  ticker: Scalars['String'];
};

export enum Source {
  Binance = 'BINANCE'
}

export type Subscription = {
  __typename?: 'Subscription';
  candle: Candle;
};


export type SubscriptionCandleArgs = {
  interval: Scalars['String'];
  ticker: Scalars['String'];
};

export type CandlesQueryVariables = Exact<{
  ticker: Scalars['String'];
  interval: Scalars['String'];
}>;


export type CandlesQuery = { __typename?: 'Query', candles: Array<{ __typename?: 'Candle', time: number, close: number, open: number, high: number, low: number, volume: number }> };

export type FindInstrumentQueryVariables = Exact<{
  ticker: Scalars['String'];
}>;


export type FindInstrumentQuery = { __typename?: 'Query', findInstrument: Array<{ __typename?: 'Instrument', ticker: string, source: Source, description: string }> };

export type CandleSubscriptionVariables = Exact<{
  ticker: Scalars['String'];
  interval: Scalars['String'];
}>;


export type CandleSubscription = { __typename?: 'Subscription', candle: { __typename?: 'Candle', time: number, close: number, open: number, high: number, low: number, volume: number } };


export const CandlesDocument = gql`
    query candles($ticker: String!, $interval: String!) {
  candles(ticker: $ticker, interval: $interval) {
    time
    close
    open
    high
    low
    volume
  }
}
    `;

/**
 * __useCandlesQuery__
 *
 * To run a query within a React component, call `useCandlesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCandlesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCandlesQuery({
 *   variables: {
 *      ticker: // value for 'ticker'
 *      interval: // value for 'interval'
 *   },
 * });
 */
export function useCandlesQuery(baseOptions: Apollo.QueryHookOptions<CandlesQuery, CandlesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CandlesQuery, CandlesQueryVariables>(CandlesDocument, options);
      }
export function useCandlesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CandlesQuery, CandlesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CandlesQuery, CandlesQueryVariables>(CandlesDocument, options);
        }
export type CandlesQueryHookResult = ReturnType<typeof useCandlesQuery>;
export type CandlesLazyQueryHookResult = ReturnType<typeof useCandlesLazyQuery>;
export type CandlesQueryResult = Apollo.QueryResult<CandlesQuery, CandlesQueryVariables>;
export const FindInstrumentDocument = gql`
    query findInstrument($ticker: String!) {
  findInstrument(ticker: $ticker) {
    ticker
    source
    description
  }
}
    `;

/**
 * __useFindInstrumentQuery__
 *
 * To run a query within a React component, call `useFindInstrumentQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindInstrumentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindInstrumentQuery({
 *   variables: {
 *      ticker: // value for 'ticker'
 *   },
 * });
 */
export function useFindInstrumentQuery(baseOptions: Apollo.QueryHookOptions<FindInstrumentQuery, FindInstrumentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindInstrumentQuery, FindInstrumentQueryVariables>(FindInstrumentDocument, options);
      }
export function useFindInstrumentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindInstrumentQuery, FindInstrumentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindInstrumentQuery, FindInstrumentQueryVariables>(FindInstrumentDocument, options);
        }
export type FindInstrumentQueryHookResult = ReturnType<typeof useFindInstrumentQuery>;
export type FindInstrumentLazyQueryHookResult = ReturnType<typeof useFindInstrumentLazyQuery>;
export type FindInstrumentQueryResult = Apollo.QueryResult<FindInstrumentQuery, FindInstrumentQueryVariables>;
export const CandleDocument = gql`
    subscription candle($ticker: String!, $interval: String!) {
  candle(ticker: $ticker, interval: $interval) {
    time
    close
    open
    high
    low
    volume
  }
}
    `;

/**
 * __useCandleSubscription__
 *
 * To run a query within a React component, call `useCandleSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCandleSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCandleSubscription({
 *   variables: {
 *      ticker: // value for 'ticker'
 *      interval: // value for 'interval'
 *   },
 * });
 */
export function useCandleSubscription(baseOptions: Apollo.SubscriptionHookOptions<CandleSubscription, CandleSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CandleSubscription, CandleSubscriptionVariables>(CandleDocument, options);
      }
export type CandleSubscriptionHookResult = ReturnType<typeof useCandleSubscription>;
export type CandleSubscriptionResult = Apollo.SubscriptionResult<CandleSubscription>;