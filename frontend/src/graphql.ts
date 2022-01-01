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

export type AddIndicatorInput = {
  name: Scalars['String'];
};

export type Candle = {
  __typename?: 'Candle';
  close: Scalars['Float'];
  high: Scalars['Float'];
  low: Scalars['Float'];
  open: Scalars['Float'];
  time: Scalars['String'];
  timestamp: Scalars['Float'];
  volume: Scalars['Float'];
};

export type CandleSubscriptionData = {
  __typename?: 'CandleSubscriptionData';
  candle: Candle;
  instrument: Instrument;
};

export type Indicator = {
  __typename?: 'Indicator';
  id?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
};

export type Instrument = {
  __typename?: 'Instrument';
  figi: Scalars['String'];
  id?: Maybe<Scalars['Float']>;
  price?: Maybe<Scalars['Float']>;
  pricePercentChange?: Maybe<Scalars['Float']>;
  ticker: Scalars['String'];
};

export enum Interval {
  Day = 'DAY',
  Hour = 'HOUR',
  Min1 = 'MIN1',
  Min2 = 'MIN2',
  Min3 = 'MIN3',
  Min5 = 'MIN5',
  Min10 = 'MIN10',
  Min15 = 'MIN15',
  Min30 = 'MIN30',
  Month = 'MONTH',
  Week = 'WEEK'
}

export type Mutation = {
  __typename?: 'Mutation';
  addIndicator: Indicator;
  removeIndicator: Scalars['Boolean'];
  unwatch: Scalars['Boolean'];
  watch: Instrument;
};


export type MutationAddIndicatorArgs = {
  input: AddIndicatorInput;
};


export type MutationRemoveIndicatorArgs = {
  id: Scalars['Float'];
};


export type MutationUnwatchArgs = {
  id: Scalars['Float'];
};


export type MutationWatchArgs = {
  input: WatchInput;
};

export type Query = {
  __typename?: 'Query';
  candles: Array<Candle>;
  indicators: Array<Indicator>;
  searchInstrument: Array<Instrument>;
  tipRanksInfo: TipRanksInfo;
  tradingViewIdeas: Array<TradingViewIdea>;
};


export type QueryCandlesArgs = {
  figi: Scalars['String'];
  interval: Interval;
  to?: InputMaybe<Scalars['String']>;
};


export type QuerySearchInstrumentArgs = {
  ticker: Scalars['String'];
};


export type QueryTipRanksInfoArgs = {
  ticker: Scalars['String'];
};


export type QueryTradingViewIdeasArgs = {
  ticker: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  candle: CandleSubscriptionData;
  watchList: Array<Instrument>;
};


export type SubscriptionCandleArgs = {
  figi: Scalars['String'];
  interval: Interval;
};

export type TipRanksInfo = {
  __typename?: 'TipRanksInfo';
  lastWeekBuyNews: Scalars['Float'];
  lastWeekNeutralNews: Scalars['Float'];
  lastWeekSellNews: Scalars['Float'];
  newsSentimentBearishPercent: Scalars['Float'];
  newsSentimentBullishPercent: Scalars['Float'];
  priceTarget: Scalars['Float'];
  priceTargetHigh: Scalars['Float'];
  priceTargetLow: Scalars['Float'];
  ratingBuy: Scalars['Float'];
  ratingHold: Scalars['Float'];
  ratingSell: Scalars['Float'];
  stockScore: Scalars['Float'];
};

export type TradingViewIdea = {
  __typename?: 'TradingViewIdea';
  comments: Scalars['Float'];
  date: Scalars['String'];
  likes: Scalars['Float'];
  link: Scalars['String'];
  pureDate: Scalars['String'];
  timeframe: Scalars['String'];
  title: Scalars['String'];
  type: Scalars['String'];
};

export type WatchInput = {
  figi: Scalars['String'];
  ticker: Scalars['String'];
};

export type CandlesQueryVariables = Exact<{
  figi: Scalars['String'];
  interval: Interval;
  to?: InputMaybe<Scalars['String']>;
}>;


export type CandlesQuery = { __typename?: 'Query', candles: Array<{ __typename?: 'Candle', time: string, close: number, open: number, high: number, low: number, volume: number, timestamp: number }> };

export type SearchInstrumentQueryVariables = Exact<{
  ticker: Scalars['String'];
}>;


export type SearchInstrumentQuery = { __typename?: 'Query', searchInstrument: Array<{ __typename?: 'Instrument', ticker: string, id?: number | null | undefined, figi: string }> };

export type WatchListSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type WatchListSubscription = { __typename?: 'Subscription', watchList: Array<{ __typename?: 'Instrument', ticker: string, id?: number | null | undefined, figi: string, price?: number | null | undefined, pricePercentChange?: number | null | undefined }> };

export type WatchMutationVariables = Exact<{
  input: WatchInput;
}>;


export type WatchMutation = { __typename?: 'Mutation', watch: { __typename?: 'Instrument', id?: number | null | undefined } };

export type UnwatchMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type UnwatchMutation = { __typename?: 'Mutation', unwatch: boolean };

export type CandleSubscriptionVariables = Exact<{
  figi: Scalars['String'];
  interval: Interval;
}>;


export type CandleSubscription = { __typename?: 'Subscription', candle: { __typename?: 'CandleSubscriptionData', candle: { __typename?: 'Candle', time: string, close: number, open: number, high: number, low: number, volume: number, timestamp: number }, instrument: { __typename?: 'Instrument', id?: number | null | undefined, ticker: string, figi: string } } };

export type TradingViewIdeasQueryVariables = Exact<{
  ticker: Scalars['String'];
}>;


export type TradingViewIdeasQuery = { __typename?: 'Query', tradingViewIdeas: Array<{ __typename?: 'TradingViewIdea', title: string, link: string, timeframe: string, type: string, date: string, likes: number, comments: number, pureDate: string }> };

export type TipRanksInfoQueryVariables = Exact<{
  ticker: Scalars['String'];
}>;


export type TipRanksInfoQuery = { __typename?: 'Query', tipRanksInfo: { __typename?: 'TipRanksInfo', priceTarget: number, priceTargetHigh: number, priceTargetLow: number, ratingBuy: number, ratingHold: number, ratingSell: number, stockScore: number, newsSentimentBullishPercent: number, newsSentimentBearishPercent: number, lastWeekBuyNews: number, lastWeekSellNews: number, lastWeekNeutralNews: number } };

export type IndicatorsQueryVariables = Exact<{ [key: string]: never; }>;


export type IndicatorsQuery = { __typename?: 'Query', indicators: Array<{ __typename?: 'Indicator', name: string, id?: number | null | undefined }> };

export type AddIndicatorMutationVariables = Exact<{
  input: AddIndicatorInput;
}>;


export type AddIndicatorMutation = { __typename?: 'Mutation', addIndicator: { __typename?: 'Indicator', id?: number | null | undefined } };

export type RemoveIndicatorMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type RemoveIndicatorMutation = { __typename?: 'Mutation', removeIndicator: boolean };


export const CandlesDocument = gql`
    query candles($figi: String!, $interval: Interval!, $to: String) {
  candles(figi: $figi, interval: $interval, to: $to) {
    time
    close
    open
    high
    low
    volume
    timestamp
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
 *      figi: // value for 'figi'
 *      interval: // value for 'interval'
 *      to: // value for 'to'
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
export const SearchInstrumentDocument = gql`
    query searchInstrument($ticker: String!) {
  searchInstrument(ticker: $ticker) {
    ticker
    id
    figi
  }
}
    `;

/**
 * __useSearchInstrumentQuery__
 *
 * To run a query within a React component, call `useSearchInstrumentQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchInstrumentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchInstrumentQuery({
 *   variables: {
 *      ticker: // value for 'ticker'
 *   },
 * });
 */
export function useSearchInstrumentQuery(baseOptions: Apollo.QueryHookOptions<SearchInstrumentQuery, SearchInstrumentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchInstrumentQuery, SearchInstrumentQueryVariables>(SearchInstrumentDocument, options);
      }
export function useSearchInstrumentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchInstrumentQuery, SearchInstrumentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchInstrumentQuery, SearchInstrumentQueryVariables>(SearchInstrumentDocument, options);
        }
export type SearchInstrumentQueryHookResult = ReturnType<typeof useSearchInstrumentQuery>;
export type SearchInstrumentLazyQueryHookResult = ReturnType<typeof useSearchInstrumentLazyQuery>;
export type SearchInstrumentQueryResult = Apollo.QueryResult<SearchInstrumentQuery, SearchInstrumentQueryVariables>;
export const WatchListDocument = gql`
    subscription watchList {
  watchList {
    ticker
    id
    figi
    price
    pricePercentChange
  }
}
    `;

/**
 * __useWatchListSubscription__
 *
 * To run a query within a React component, call `useWatchListSubscription` and pass it any options that fit your needs.
 * When your component renders, `useWatchListSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWatchListSubscription({
 *   variables: {
 *   },
 * });
 */
export function useWatchListSubscription(baseOptions?: Apollo.SubscriptionHookOptions<WatchListSubscription, WatchListSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<WatchListSubscription, WatchListSubscriptionVariables>(WatchListDocument, options);
      }
export type WatchListSubscriptionHookResult = ReturnType<typeof useWatchListSubscription>;
export type WatchListSubscriptionResult = Apollo.SubscriptionResult<WatchListSubscription>;
export const WatchDocument = gql`
    mutation watch($input: WatchInput!) {
  watch(input: $input) {
    id
  }
}
    `;
export type WatchMutationFn = Apollo.MutationFunction<WatchMutation, WatchMutationVariables>;

/**
 * __useWatchMutation__
 *
 * To run a mutation, you first call `useWatchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWatchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [watchMutation, { data, loading, error }] = useWatchMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useWatchMutation(baseOptions?: Apollo.MutationHookOptions<WatchMutation, WatchMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WatchMutation, WatchMutationVariables>(WatchDocument, options);
      }
export type WatchMutationHookResult = ReturnType<typeof useWatchMutation>;
export type WatchMutationResult = Apollo.MutationResult<WatchMutation>;
export type WatchMutationOptions = Apollo.BaseMutationOptions<WatchMutation, WatchMutationVariables>;
export const UnwatchDocument = gql`
    mutation unwatch($id: Float!) {
  unwatch(id: $id)
}
    `;
export type UnwatchMutationFn = Apollo.MutationFunction<UnwatchMutation, UnwatchMutationVariables>;

/**
 * __useUnwatchMutation__
 *
 * To run a mutation, you first call `useUnwatchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnwatchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unwatchMutation, { data, loading, error }] = useUnwatchMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUnwatchMutation(baseOptions?: Apollo.MutationHookOptions<UnwatchMutation, UnwatchMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnwatchMutation, UnwatchMutationVariables>(UnwatchDocument, options);
      }
export type UnwatchMutationHookResult = ReturnType<typeof useUnwatchMutation>;
export type UnwatchMutationResult = Apollo.MutationResult<UnwatchMutation>;
export type UnwatchMutationOptions = Apollo.BaseMutationOptions<UnwatchMutation, UnwatchMutationVariables>;
export const CandleDocument = gql`
    subscription candle($figi: String!, $interval: Interval!) {
  candle(figi: $figi, interval: $interval) {
    candle {
      time
      close
      open
      high
      low
      volume
      timestamp
    }
    instrument {
      id
      ticker
      figi
    }
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
 *      figi: // value for 'figi'
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
export const TradingViewIdeasDocument = gql`
    query tradingViewIdeas($ticker: String!) {
  tradingViewIdeas(ticker: $ticker) {
    title
    link
    timeframe
    type
    date
    likes
    comments
    pureDate
  }
}
    `;

/**
 * __useTradingViewIdeasQuery__
 *
 * To run a query within a React component, call `useTradingViewIdeasQuery` and pass it any options that fit your needs.
 * When your component renders, `useTradingViewIdeasQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTradingViewIdeasQuery({
 *   variables: {
 *      ticker: // value for 'ticker'
 *   },
 * });
 */
export function useTradingViewIdeasQuery(baseOptions: Apollo.QueryHookOptions<TradingViewIdeasQuery, TradingViewIdeasQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TradingViewIdeasQuery, TradingViewIdeasQueryVariables>(TradingViewIdeasDocument, options);
      }
export function useTradingViewIdeasLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TradingViewIdeasQuery, TradingViewIdeasQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TradingViewIdeasQuery, TradingViewIdeasQueryVariables>(TradingViewIdeasDocument, options);
        }
export type TradingViewIdeasQueryHookResult = ReturnType<typeof useTradingViewIdeasQuery>;
export type TradingViewIdeasLazyQueryHookResult = ReturnType<typeof useTradingViewIdeasLazyQuery>;
export type TradingViewIdeasQueryResult = Apollo.QueryResult<TradingViewIdeasQuery, TradingViewIdeasQueryVariables>;
export const TipRanksInfoDocument = gql`
    query tipRanksInfo($ticker: String!) {
  tipRanksInfo(ticker: $ticker) {
    priceTarget
    priceTargetHigh
    priceTargetLow
    ratingBuy
    ratingHold
    ratingSell
    stockScore
    newsSentimentBullishPercent
    newsSentimentBearishPercent
    lastWeekBuyNews
    lastWeekSellNews
    lastWeekNeutralNews
  }
}
    `;

/**
 * __useTipRanksInfoQuery__
 *
 * To run a query within a React component, call `useTipRanksInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useTipRanksInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTipRanksInfoQuery({
 *   variables: {
 *      ticker: // value for 'ticker'
 *   },
 * });
 */
export function useTipRanksInfoQuery(baseOptions: Apollo.QueryHookOptions<TipRanksInfoQuery, TipRanksInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TipRanksInfoQuery, TipRanksInfoQueryVariables>(TipRanksInfoDocument, options);
      }
export function useTipRanksInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TipRanksInfoQuery, TipRanksInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TipRanksInfoQuery, TipRanksInfoQueryVariables>(TipRanksInfoDocument, options);
        }
export type TipRanksInfoQueryHookResult = ReturnType<typeof useTipRanksInfoQuery>;
export type TipRanksInfoLazyQueryHookResult = ReturnType<typeof useTipRanksInfoLazyQuery>;
export type TipRanksInfoQueryResult = Apollo.QueryResult<TipRanksInfoQuery, TipRanksInfoQueryVariables>;
export const IndicatorsDocument = gql`
    query indicators {
  indicators {
    name
    id
  }
}
    `;

/**
 * __useIndicatorsQuery__
 *
 * To run a query within a React component, call `useIndicatorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useIndicatorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIndicatorsQuery({
 *   variables: {
 *   },
 * });
 */
export function useIndicatorsQuery(baseOptions?: Apollo.QueryHookOptions<IndicatorsQuery, IndicatorsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IndicatorsQuery, IndicatorsQueryVariables>(IndicatorsDocument, options);
      }
export function useIndicatorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IndicatorsQuery, IndicatorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IndicatorsQuery, IndicatorsQueryVariables>(IndicatorsDocument, options);
        }
export type IndicatorsQueryHookResult = ReturnType<typeof useIndicatorsQuery>;
export type IndicatorsLazyQueryHookResult = ReturnType<typeof useIndicatorsLazyQuery>;
export type IndicatorsQueryResult = Apollo.QueryResult<IndicatorsQuery, IndicatorsQueryVariables>;
export const AddIndicatorDocument = gql`
    mutation addIndicator($input: AddIndicatorInput!) {
  addIndicator(input: $input) {
    id
  }
}
    `;
export type AddIndicatorMutationFn = Apollo.MutationFunction<AddIndicatorMutation, AddIndicatorMutationVariables>;

/**
 * __useAddIndicatorMutation__
 *
 * To run a mutation, you first call `useAddIndicatorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddIndicatorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addIndicatorMutation, { data, loading, error }] = useAddIndicatorMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddIndicatorMutation(baseOptions?: Apollo.MutationHookOptions<AddIndicatorMutation, AddIndicatorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddIndicatorMutation, AddIndicatorMutationVariables>(AddIndicatorDocument, options);
      }
export type AddIndicatorMutationHookResult = ReturnType<typeof useAddIndicatorMutation>;
export type AddIndicatorMutationResult = Apollo.MutationResult<AddIndicatorMutation>;
export type AddIndicatorMutationOptions = Apollo.BaseMutationOptions<AddIndicatorMutation, AddIndicatorMutationVariables>;
export const RemoveIndicatorDocument = gql`
    mutation removeIndicator($id: Float!) {
  removeIndicator(id: $id)
}
    `;
export type RemoveIndicatorMutationFn = Apollo.MutationFunction<RemoveIndicatorMutation, RemoveIndicatorMutationVariables>;

/**
 * __useRemoveIndicatorMutation__
 *
 * To run a mutation, you first call `useRemoveIndicatorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveIndicatorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeIndicatorMutation, { data, loading, error }] = useRemoveIndicatorMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveIndicatorMutation(baseOptions?: Apollo.MutationHookOptions<RemoveIndicatorMutation, RemoveIndicatorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveIndicatorMutation, RemoveIndicatorMutationVariables>(RemoveIndicatorDocument, options);
      }
export type RemoveIndicatorMutationHookResult = ReturnType<typeof useRemoveIndicatorMutation>;
export type RemoveIndicatorMutationResult = Apollo.MutationResult<RemoveIndicatorMutation>;
export type RemoveIndicatorMutationOptions = Apollo.BaseMutationOptions<RemoveIndicatorMutation, RemoveIndicatorMutationVariables>;