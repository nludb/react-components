import React from 'react';
import './linkSuggest.css';
import { EmbeddingModel, SearchHit } from '@nludb/client';
import { useNLUDB, useEmbeddingIndex } from '@nludb/react-hooks';
import { ButtonList } from './ButtonList/ButtonList'
import { Button, ButtonProps } from './Button/Button'

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
  buttonPropsList?: ButtonProps[] | null
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
  const { buttonPropsList } = params;

  if ((typeof buttonPropsList == 'undefined') || (buttonPropsList === null) || (!buttonPropsList)){
    return <Empty />
  }

  return (
    <ButtonList>
      {buttonPropsList.map(props => <Button {...props} />)}
    </ButtonList>
  )
}

export interface LinkAndLabel {
  link: string
  label: string
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
  /*
   * Extracts the link and label from a search result
   */
  hitToButtonProps?: (hit: SearchHit) => ButtonProps
}

function _defaultHitToButtonProps(hit: SearchHit): ButtonProps {
  const metadata = {
    "url": "https://www.google.com",
    "title": "Google",
    "slug": "google",
    "number": "23",
    "numberAndSlug": "23-google"
  }
  return {
    label: metadata.title,
    onClick: () => {
      alert(metadata.url)
    }
  }
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
  hitToButtonProps,
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
    let extractionFn = hitToButtonProps || _defaultHitToButtonProps;
    let buttonPropsList = results?.hits.map(extractionFn)
    element = <Result buttonPropsList={buttonPropsList} />
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
        search({
          query, 
          k:desiredResponses, 
          includeMetadata: true
        })
      }
    }
  };

  actions.search(query);

  return element;
};
