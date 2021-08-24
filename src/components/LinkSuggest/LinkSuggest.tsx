import React from 'react';
import './linkSuggest.css';
import { EmbeddingModel, SearchResult } from '@nludb/client';
import { useNLUDB, useEmbeddingIndex } from '@nludb/react-hooks';

export interface State {
  element: React.ReactFragment,
  isSearching: boolean,
  error: Error | null
}

export interface Actions {
  reset: () => void;
  search: (query: string) => void;
}

export interface LinkParams {
  name: string,
  href: string
}

export interface ErrorParams {
  message: string
}

export interface ResultParams {
  result: SearchResult | null
}

const Link = (params: LinkParams) => {
  return <a href={params.href}>{params.name}</a>
}

const Error = (params: ErrorParams) => {
  return <div>Error: {params.message}</div>
}

const Empty = () => {
  return <div>Empty</div>
}

const EmptyResult = () => {
  return <div>Empty</div>
}

const Searching = () => {
  return <div>Searching</div>
}

const Result = (params: ResultParams) => {
  const { result } = params;

  if (result === null) {
    return <Empty />
  }

  if (result && result.hits && (result.hits.length === 0)) {
    return <EmptyResult />
  }

  return <div>Has some!</div>
}


export interface LinkSuggestProps {
  /**
   * The endpoint of the NLUDB API, such as https://api.nludb.com/api/v1/
   */
  nludbEndpoint: string,
  /*
   * NLUDB API Key
   */
  nludbKey: string,
  /*
   * The maximum number of links you want suggested per search.
   */
  desiredResponses: number,
  /*
   * The name of the index performing suggestions.
   */
  indexName: string
  /*
   * Query
   */
  query: string
}

/**
 * Primary UI component for user interaction
 */
export const LinkSuggest = ({
  desiredResponses = 4,
  query,
  nludbKey,
  nludbEndpoint,
  indexName,
  ...props
}: LinkSuggestProps) => {

  const [nludb, nludbError] = useNLUDB({
    apiKey: nludbKey,
    apiEndpoint: nludbEndpoint
  })

  const [{results, isSearching, error: indexError}, {reset, search, insert}] = useEmbeddingIndex({
    nludb,
    name: indexName,
    model: EmbeddingModel.QA,
    upsert: true,
    verbose: false
  })

  let element = <Empty />
  if (indexError) {
    element = <Error message="Unable to create Index" />
  } else if (isSearching) {
    element = <Searching />
  } else {
    // TODO: Add a state to mean "no search was requested"
    element = <Result result={results} />
  }

  /*
   *Return some state for reporting and actions.
   */
  const state: State = { element, isSearching, error: indexError };
  const actions: Actions = {
    reset,
    search: (query: string | null | undefined): void => {
      if ((typeof query == 'undefined') || (query === null)) {
        reset()
      } else {
        search({query, k:desiredResponses})
      }
    }
  };

  actions.search(query);

  return element;
};
