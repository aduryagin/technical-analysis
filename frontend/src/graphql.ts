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

export type AddShapeInput = {
  name: Scalars['String'];
  points: Array<SharePointInput>;
  ticker: Scalars['String'];
};

export type AddSourceInput = {
  key?: InputMaybe<Scalars['String']>;
  name: SourceName;
  secret?: InputMaybe<Scalars['String']>;
};

export type AlgorithmTrade = {
  __typename?: 'AlgorithmTrade';
  closeDate?: Maybe<Scalars['String']>;
  closePrice?: Maybe<Scalars['Float']>;
  closed: Scalars['Boolean'];
  date: Scalars['String'];
  id: Scalars['Float'];
  instrument: Instrument;
  interval: Scalars['String'];
  price: Scalars['Float'];
  pricePercentChange: Scalars['Float'];
  type: Scalars['String'];
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
  settings?: Maybe<Array<Scalars['Float']>>;
};

export type Instrument = {
  __typename?: 'Instrument';
  figi?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Float']>;
  price?: Maybe<Scalars['Float']>;
  pricePercentChange?: Maybe<Scalars['Float']>;
  source: Scalars['String'];
  ticker?: Maybe<Scalars['String']>;
};

export enum Interval {
  Day = 'DAY',
  Day3 = 'DAY3',
  Hour = 'HOUR',
  Hour2 = 'HOUR2',
  Hour4 = 'HOUR4',
  Hour6 = 'HOUR6',
  Hour8 = 'HOUR8',
  Hour12 = 'HOUR12',
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
  addShape: Shape;
  addSource: Source;
  closeTrade: Scalars['Boolean'];
  removeIndicator: Scalars['Boolean'];
  removeShape: Scalars['Boolean'];
  removeSource: Scalars['Boolean'];
  unwatch: Scalars['Boolean'];
  updateIndicator: Indicator;
  updateShape: Shape;
  updateSource: Source;
  watch: Instrument;
};


export type MutationAddIndicatorArgs = {
  input: AddIndicatorInput;
};


export type MutationAddShapeArgs = {
  input: AddShapeInput;
};


export type MutationAddSourceArgs = {
  input: AddSourceInput;
};


export type MutationCloseTradeArgs = {
  id: Scalars['Float'];
};


export type MutationRemoveIndicatorArgs = {
  id: Scalars['Float'];
};


export type MutationRemoveShapeArgs = {
  id: Scalars['Float'];
};


export type MutationRemoveSourceArgs = {
  id: Scalars['Float'];
};


export type MutationUnwatchArgs = {
  id: Scalars['Float'];
};


export type MutationUpdateIndicatorArgs = {
  input: UpdateIndicatorInput;
};


export type MutationUpdateShapeArgs = {
  input: UpdateShapeInput;
};


export type MutationUpdateSourceArgs = {
  input: UpdateSourceInput;
};


export type MutationWatchArgs = {
  input: WatchInput;
};

export type Query = {
  __typename?: 'Query';
  candles: Array<Candle>;
  indicators: Array<Indicator>;
  searchInstrument: Array<Instrument>;
  shapes: Array<Shape>;
  sources: Array<Source>;
  tipRanksInfo: TipRanksInfo;
  tradingViewIdeas: Array<TradingViewIdea>;
};


export type QueryCandlesArgs = {
  figi?: InputMaybe<Scalars['String']>;
  interval: Interval;
  source?: InputMaybe<SourceName>;
  ticker?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['String']>;
};


export type QuerySearchInstrumentArgs = {
  ticker: Scalars['String'];
};


export type QueryShapesArgs = {
  ticker: Scalars['String'];
};


export type QueryTipRanksInfoArgs = {
  ticker: Scalars['String'];
};


export type QueryTradingViewIdeasArgs = {
  ticker: Scalars['String'];
};

export type Shape = {
  __typename?: 'Shape';
  id: Scalars['Float'];
  name: Scalars['String'];
  points: Array<ShapePoint>;
  ticker: Scalars['String'];
};

export type ShapePoint = {
  __typename?: 'ShapePoint';
  dataIndex?: Maybe<Scalars['Float']>;
  timestamp?: Maybe<Scalars['Float']>;
  value: Scalars['Float'];
};

export type SharePointInput = {
  dataIndex?: InputMaybe<Scalars['Float']>;
  timestamp?: InputMaybe<Scalars['Float']>;
  value?: InputMaybe<Scalars['Float']>;
};

export type Source = {
  __typename?: 'Source';
  id?: Maybe<Scalars['Float']>;
  key?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  secret?: Maybe<Scalars['String']>;
};

export enum SourceName {
  Binance = 'Binance',
  Tinkoff = 'Tinkoff'
}

export type Subscription = {
  __typename?: 'Subscription';
  candle: CandleSubscriptionData;
  trades: Array<AlgorithmTrade>;
  watchList: Array<Instrument>;
};


export type SubscriptionCandleArgs = {
  figi?: InputMaybe<Scalars['String']>;
  interval: Interval;
  source?: InputMaybe<SourceName>;
  ticker?: InputMaybe<Scalars['String']>;
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

export type UpdateIndicatorInput = {
  id: Scalars['Float'];
  settings: Array<Scalars['Float']>;
};

export type UpdateShapeInput = {
  id: Scalars['Float'];
  points: Array<SharePointInput>;
};

export type UpdateSourceInput = {
  id: Scalars['Float'];
  key?: InputMaybe<Scalars['String']>;
  secret?: InputMaybe<Scalars['String']>;
};

export type WatchInput = {
  figi?: InputMaybe<Scalars['String']>;
  source: Scalars['String'];
  ticker: Scalars['String'];
};

export type CandlesQueryVariables = Exact<{
  interval: Interval;
  to?: InputMaybe<Scalars['String']>;
  figi?: InputMaybe<Scalars['String']>;
  ticker?: InputMaybe<Scalars['String']>;
  source?: InputMaybe<SourceName>;
}>;


export type CandlesQuery = { __typename?: 'Query', candles: Array<{ __typename?: 'Candle', time: string, close: number, open: number, high: number, low: number, volume: number, timestamp: number }> };

export type SearchInstrumentQueryVariables = Exact<{
  ticker: Scalars['String'];
}>;


export type SearchInstrumentQuery = { __typename?: 'Query', searchInstrument: Array<{ __typename?: 'Instrument', ticker?: string | null | undefined, id?: number | null | undefined, figi?: string | null | undefined, source: string }> };

export type WatchListSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type WatchListSubscription = { __typename?: 'Subscription', watchList: Array<{ __typename?: 'Instrument', ticker?: string | null | undefined, id?: number | null | undefined, figi?: string | null | undefined, price?: number | null | undefined, pricePercentChange?: number | null | undefined, source: string }> };

export type WatchMutationVariables = Exact<{
  input: WatchInput;
}>;


export type WatchMutation = { __typename?: 'Mutation', watch: { __typename?: 'Instrument', id?: number | null | undefined } };

export type UnwatchMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type UnwatchMutation = { __typename?: 'Mutation', unwatch: boolean };

export type CandleSubscriptionVariables = Exact<{
  interval: Interval;
  ticker?: InputMaybe<Scalars['String']>;
  figi?: InputMaybe<Scalars['String']>;
  source?: InputMaybe<SourceName>;
}>;


export type CandleSubscription = { __typename?: 'Subscription', candle: { __typename?: 'CandleSubscriptionData', candle: { __typename?: 'Candle', time: string, close: number, open: number, high: number, low: number, volume: number, timestamp: number }, instrument: { __typename?: 'Instrument', id?: number | null | undefined, ticker?: string | null | undefined, figi?: string | null | undefined, source: string } } };

export type TradingViewIdeasQueryVariables = Exact<{
  ticker: Scalars['String'];
}>;


export type TradingViewIdeasQuery = { __typename?: 'Query', tradingViewIdeas: Array<{ __typename?: 'TradingViewIdea', title: string, link: string, timeframe: string, type: string, date: string, likes: number, comments: number, pureDate: string }> };

export type TipRanksInfoQueryVariables = Exact<{
  ticker: Scalars['String'];
}>;


export type TipRanksInfoQuery = { __typename?: 'Query', tipRanksInfo: { __typename?: 'TipRanksInfo', priceTarget: number, priceTargetHigh: number, priceTargetLow: number, ratingBuy: number, ratingHold: number, ratingSell: number, stockScore: number, newsSentimentBullishPercent: number, newsSentimentBearishPercent: number, lastWeekBuyNews: number, lastWeekSellNews: number, lastWeekNeutralNews: number } };

export type IndicatorsQueryVariables = Exact<{ [key: string]: never; }>;


export type IndicatorsQuery = { __typename?: 'Query', indicators: Array<{ __typename?: 'Indicator', name: string, id?: number | null | undefined, settings?: Array<number> | null | undefined }> };

export type AddIndicatorMutationVariables = Exact<{
  input: AddIndicatorInput;
}>;


export type AddIndicatorMutation = { __typename?: 'Mutation', addIndicator: { __typename?: 'Indicator', id?: number | null | undefined } };

export type RemoveIndicatorMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type RemoveIndicatorMutation = { __typename?: 'Mutation', removeIndicator: boolean };

export type UpdateIndicatorMutationVariables = Exact<{
  input: UpdateIndicatorInput;
}>;


export type UpdateIndicatorMutation = { __typename?: 'Mutation', updateIndicator: { __typename?: 'Indicator', id?: number | null | undefined } };

export type SourcesQueryVariables = Exact<{ [key: string]: never; }>;


export type SourcesQuery = { __typename?: 'Query', sources: Array<{ __typename?: 'Source', id?: number | null | undefined, name: string, key?: string | null | undefined, secret?: string | null | undefined }> };

export type AddSourceMutationVariables = Exact<{
  input: AddSourceInput;
}>;


export type AddSourceMutation = { __typename?: 'Mutation', addSource: { __typename?: 'Source', id?: number | null | undefined } };

export type RemoveSourceMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type RemoveSourceMutation = { __typename?: 'Mutation', removeSource: boolean };

export type UpdateSourceMutationVariables = Exact<{
  input: UpdateSourceInput;
}>;


export type UpdateSourceMutation = { __typename?: 'Mutation', updateSource: { __typename?: 'Source', id?: number | null | undefined } };

export type ShapesQueryVariables = Exact<{
  ticker: Scalars['String'];
}>;


export type ShapesQuery = { __typename?: 'Query', shapes: Array<{ __typename?: 'Shape', id: number, name: string, ticker: string, points: Array<{ __typename?: 'ShapePoint', dataIndex?: number | null | undefined, timestamp?: number | null | undefined, value: number }> }> };

export type RemoveShapeMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type RemoveShapeMutation = { __typename?: 'Mutation', removeShape: boolean };

export type UpdateShapeMutationVariables = Exact<{
  input: UpdateShapeInput;
}>;


export type UpdateShapeMutation = { __typename?: 'Mutation', updateShape: { __typename?: 'Shape', id: number } };

export type AddShapeMutationVariables = Exact<{
  input: AddShapeInput;
}>;


export type AddShapeMutation = { __typename?: 'Mutation', addShape: { __typename?: 'Shape', id: number, ticker: string, points: Array<{ __typename?: 'ShapePoint', dataIndex?: number | null | undefined, timestamp?: number | null | undefined, value: number }> } };

export type TradesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TradesSubscription = { __typename?: 'Subscription', trades: Array<{ __typename?: 'AlgorithmTrade', id: number, price: number, type: string, closed: boolean, pricePercentChange: number, date: string, instrument: { __typename?: 'Instrument', id?: number | null | undefined, ticker?: string | null | undefined, figi?: string | null | undefined, source: string } }> };

export type CloseTradeMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type CloseTradeMutation = { __typename?: 'Mutation', closeTrade: boolean };


export const CandlesDocument = gql`
    query candles($interval: Interval!, $to: String, $figi: String, $ticker: String, $source: SourceName) {
  candles(
    interval: $interval
    to: $to
    figi: $figi
    ticker: $ticker
    source: $source
  ) {
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
 *      interval: // value for 'interval'
 *      to: // value for 'to'
 *      figi: // value for 'figi'
 *      ticker: // value for 'ticker'
 *      source: // value for 'source'
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
    source
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
    source
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
    subscription candle($interval: Interval!, $ticker: String, $figi: String, $source: SourceName) {
  candle(interval: $interval, ticker: $ticker, figi: $figi, source: $source) {
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
      source
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
 *      interval: // value for 'interval'
 *      ticker: // value for 'ticker'
 *      figi: // value for 'figi'
 *      source: // value for 'source'
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
    settings
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
export const UpdateIndicatorDocument = gql`
    mutation updateIndicator($input: UpdateIndicatorInput!) {
  updateIndicator(input: $input) {
    id
  }
}
    `;
export type UpdateIndicatorMutationFn = Apollo.MutationFunction<UpdateIndicatorMutation, UpdateIndicatorMutationVariables>;

/**
 * __useUpdateIndicatorMutation__
 *
 * To run a mutation, you first call `useUpdateIndicatorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateIndicatorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateIndicatorMutation, { data, loading, error }] = useUpdateIndicatorMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateIndicatorMutation(baseOptions?: Apollo.MutationHookOptions<UpdateIndicatorMutation, UpdateIndicatorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateIndicatorMutation, UpdateIndicatorMutationVariables>(UpdateIndicatorDocument, options);
      }
export type UpdateIndicatorMutationHookResult = ReturnType<typeof useUpdateIndicatorMutation>;
export type UpdateIndicatorMutationResult = Apollo.MutationResult<UpdateIndicatorMutation>;
export type UpdateIndicatorMutationOptions = Apollo.BaseMutationOptions<UpdateIndicatorMutation, UpdateIndicatorMutationVariables>;
export const SourcesDocument = gql`
    query sources {
  sources {
    id
    name
    key
    secret
  }
}
    `;

/**
 * __useSourcesQuery__
 *
 * To run a query within a React component, call `useSourcesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSourcesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSourcesQuery({
 *   variables: {
 *   },
 * });
 */
export function useSourcesQuery(baseOptions?: Apollo.QueryHookOptions<SourcesQuery, SourcesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SourcesQuery, SourcesQueryVariables>(SourcesDocument, options);
      }
export function useSourcesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SourcesQuery, SourcesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SourcesQuery, SourcesQueryVariables>(SourcesDocument, options);
        }
export type SourcesQueryHookResult = ReturnType<typeof useSourcesQuery>;
export type SourcesLazyQueryHookResult = ReturnType<typeof useSourcesLazyQuery>;
export type SourcesQueryResult = Apollo.QueryResult<SourcesQuery, SourcesQueryVariables>;
export const AddSourceDocument = gql`
    mutation addSource($input: AddSourceInput!) {
  addSource(input: $input) {
    id
  }
}
    `;
export type AddSourceMutationFn = Apollo.MutationFunction<AddSourceMutation, AddSourceMutationVariables>;

/**
 * __useAddSourceMutation__
 *
 * To run a mutation, you first call `useAddSourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddSourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addSourceMutation, { data, loading, error }] = useAddSourceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddSourceMutation(baseOptions?: Apollo.MutationHookOptions<AddSourceMutation, AddSourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddSourceMutation, AddSourceMutationVariables>(AddSourceDocument, options);
      }
export type AddSourceMutationHookResult = ReturnType<typeof useAddSourceMutation>;
export type AddSourceMutationResult = Apollo.MutationResult<AddSourceMutation>;
export type AddSourceMutationOptions = Apollo.BaseMutationOptions<AddSourceMutation, AddSourceMutationVariables>;
export const RemoveSourceDocument = gql`
    mutation removeSource($id: Float!) {
  removeSource(id: $id)
}
    `;
export type RemoveSourceMutationFn = Apollo.MutationFunction<RemoveSourceMutation, RemoveSourceMutationVariables>;

/**
 * __useRemoveSourceMutation__
 *
 * To run a mutation, you first call `useRemoveSourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveSourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeSourceMutation, { data, loading, error }] = useRemoveSourceMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveSourceMutation(baseOptions?: Apollo.MutationHookOptions<RemoveSourceMutation, RemoveSourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveSourceMutation, RemoveSourceMutationVariables>(RemoveSourceDocument, options);
      }
export type RemoveSourceMutationHookResult = ReturnType<typeof useRemoveSourceMutation>;
export type RemoveSourceMutationResult = Apollo.MutationResult<RemoveSourceMutation>;
export type RemoveSourceMutationOptions = Apollo.BaseMutationOptions<RemoveSourceMutation, RemoveSourceMutationVariables>;
export const UpdateSourceDocument = gql`
    mutation updateSource($input: UpdateSourceInput!) {
  updateSource(input: $input) {
    id
  }
}
    `;
export type UpdateSourceMutationFn = Apollo.MutationFunction<UpdateSourceMutation, UpdateSourceMutationVariables>;

/**
 * __useUpdateSourceMutation__
 *
 * To run a mutation, you first call `useUpdateSourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSourceMutation, { data, loading, error }] = useUpdateSourceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSourceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSourceMutation, UpdateSourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSourceMutation, UpdateSourceMutationVariables>(UpdateSourceDocument, options);
      }
export type UpdateSourceMutationHookResult = ReturnType<typeof useUpdateSourceMutation>;
export type UpdateSourceMutationResult = Apollo.MutationResult<UpdateSourceMutation>;
export type UpdateSourceMutationOptions = Apollo.BaseMutationOptions<UpdateSourceMutation, UpdateSourceMutationVariables>;
export const ShapesDocument = gql`
    query shapes($ticker: String!) {
  shapes(ticker: $ticker) {
    id
    name
    ticker
    points {
      dataIndex
      timestamp
      value
    }
  }
}
    `;

/**
 * __useShapesQuery__
 *
 * To run a query within a React component, call `useShapesQuery` and pass it any options that fit your needs.
 * When your component renders, `useShapesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShapesQuery({
 *   variables: {
 *      ticker: // value for 'ticker'
 *   },
 * });
 */
export function useShapesQuery(baseOptions: Apollo.QueryHookOptions<ShapesQuery, ShapesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ShapesQuery, ShapesQueryVariables>(ShapesDocument, options);
      }
export function useShapesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ShapesQuery, ShapesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ShapesQuery, ShapesQueryVariables>(ShapesDocument, options);
        }
export type ShapesQueryHookResult = ReturnType<typeof useShapesQuery>;
export type ShapesLazyQueryHookResult = ReturnType<typeof useShapesLazyQuery>;
export type ShapesQueryResult = Apollo.QueryResult<ShapesQuery, ShapesQueryVariables>;
export const RemoveShapeDocument = gql`
    mutation removeShape($id: Float!) {
  removeShape(id: $id)
}
    `;
export type RemoveShapeMutationFn = Apollo.MutationFunction<RemoveShapeMutation, RemoveShapeMutationVariables>;

/**
 * __useRemoveShapeMutation__
 *
 * To run a mutation, you first call `useRemoveShapeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveShapeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeShapeMutation, { data, loading, error }] = useRemoveShapeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveShapeMutation(baseOptions?: Apollo.MutationHookOptions<RemoveShapeMutation, RemoveShapeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveShapeMutation, RemoveShapeMutationVariables>(RemoveShapeDocument, options);
      }
export type RemoveShapeMutationHookResult = ReturnType<typeof useRemoveShapeMutation>;
export type RemoveShapeMutationResult = Apollo.MutationResult<RemoveShapeMutation>;
export type RemoveShapeMutationOptions = Apollo.BaseMutationOptions<RemoveShapeMutation, RemoveShapeMutationVariables>;
export const UpdateShapeDocument = gql`
    mutation updateShape($input: UpdateShapeInput!) {
  updateShape(input: $input) {
    id
  }
}
    `;
export type UpdateShapeMutationFn = Apollo.MutationFunction<UpdateShapeMutation, UpdateShapeMutationVariables>;

/**
 * __useUpdateShapeMutation__
 *
 * To run a mutation, you first call `useUpdateShapeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateShapeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateShapeMutation, { data, loading, error }] = useUpdateShapeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateShapeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateShapeMutation, UpdateShapeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateShapeMutation, UpdateShapeMutationVariables>(UpdateShapeDocument, options);
      }
export type UpdateShapeMutationHookResult = ReturnType<typeof useUpdateShapeMutation>;
export type UpdateShapeMutationResult = Apollo.MutationResult<UpdateShapeMutation>;
export type UpdateShapeMutationOptions = Apollo.BaseMutationOptions<UpdateShapeMutation, UpdateShapeMutationVariables>;
export const AddShapeDocument = gql`
    mutation addShape($input: AddShapeInput!) {
  addShape(input: $input) {
    id
    ticker
    points {
      dataIndex
      timestamp
      value
    }
  }
}
    `;
export type AddShapeMutationFn = Apollo.MutationFunction<AddShapeMutation, AddShapeMutationVariables>;

/**
 * __useAddShapeMutation__
 *
 * To run a mutation, you first call `useAddShapeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddShapeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addShapeMutation, { data, loading, error }] = useAddShapeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddShapeMutation(baseOptions?: Apollo.MutationHookOptions<AddShapeMutation, AddShapeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddShapeMutation, AddShapeMutationVariables>(AddShapeDocument, options);
      }
export type AddShapeMutationHookResult = ReturnType<typeof useAddShapeMutation>;
export type AddShapeMutationResult = Apollo.MutationResult<AddShapeMutation>;
export type AddShapeMutationOptions = Apollo.BaseMutationOptions<AddShapeMutation, AddShapeMutationVariables>;
export const TradesDocument = gql`
    subscription trades {
  trades {
    id
    price
    type
    closed
    pricePercentChange
    date
    instrument {
      id
      ticker
      figi
      source
    }
  }
}
    `;

/**
 * __useTradesSubscription__
 *
 * To run a query within a React component, call `useTradesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTradesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTradesSubscription({
 *   variables: {
 *   },
 * });
 */
export function useTradesSubscription(baseOptions?: Apollo.SubscriptionHookOptions<TradesSubscription, TradesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<TradesSubscription, TradesSubscriptionVariables>(TradesDocument, options);
      }
export type TradesSubscriptionHookResult = ReturnType<typeof useTradesSubscription>;
export type TradesSubscriptionResult = Apollo.SubscriptionResult<TradesSubscription>;
export const CloseTradeDocument = gql`
    mutation closeTrade($id: Float!) {
  closeTrade(id: $id)
}
    `;
export type CloseTradeMutationFn = Apollo.MutationFunction<CloseTradeMutation, CloseTradeMutationVariables>;

/**
 * __useCloseTradeMutation__
 *
 * To run a mutation, you first call `useCloseTradeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCloseTradeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [closeTradeMutation, { data, loading, error }] = useCloseTradeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCloseTradeMutation(baseOptions?: Apollo.MutationHookOptions<CloseTradeMutation, CloseTradeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CloseTradeMutation, CloseTradeMutationVariables>(CloseTradeDocument, options);
      }
export type CloseTradeMutationHookResult = ReturnType<typeof useCloseTradeMutation>;
export type CloseTradeMutationResult = Apollo.MutationResult<CloseTradeMutation>;
export type CloseTradeMutationOptions = Apollo.BaseMutationOptions<CloseTradeMutation, CloseTradeMutationVariables>;