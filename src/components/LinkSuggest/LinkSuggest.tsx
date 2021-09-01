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
  resultStyles?: any
}

const Link = (params: LinkParams) => {
  return <a href={params.href}>{params.name}</a>
}

const Error = (params: ErrorParams) => {
  return <div>Error: {params.message}</div>
}

const Empty = () => {
  return <div></div>
}

const EmptyResult = () => {
  return <div></div>
}

const Searching = () => {
  return <div className="searching"></div>
}

const Result = (params: ResultParams) => {
  const { buttonPropsList, resultStyles } = params;

  if ((typeof buttonPropsList == 'undefined') || (buttonPropsList === null) || (!buttonPropsList)){
    return <Empty />
  }

  return (
    <ButtonList resultStyles={resultStyles}>
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
  hitToButtonLabel?: (hit: SearchHit) => string | null
  /*
   * What to do when a button is clicked.
   */
  onButtonClick?: (hit: SearchHit) => void
  /*
   * What to do when a button is hovered.
   */
  onButtonHover?: (hit: SearchHit, isHovering: boolean) => void
  /*
   * CSS styles to apply to the results object
   */
  resultStyles?: any
}

function _defaultHitToButtonLabel(hit: SearchHit): string | null {
  if (hit && hit.metadata) {
    if ((hit.metadata as any)['title']) {
      return (hit.metadata as any)['title'];
    }
  }
  return null
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
  hitToButtonLabel,
  onButtonClick,
  onButtonHover,
  resultStyles,
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
    let extractionFn = hitToButtonLabel || _defaultHitToButtonLabel;
    let buttonPropsList = results?.hits.map(hit => {
      return {
        label: extractionFn(hit),
        onClick: onButtonClick,
        onHover: onButtonHover,
        hit: hit  
      }
    }).filter((x) => x.label != null)
    element = <Result resultStyles={resultStyles} buttonPropsList={buttonPropsList as ButtonProps[]} />
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
