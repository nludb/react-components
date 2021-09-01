import React from 'react';
import './linkSuggest.css';
import { EmbeddingModel, SearchHit, SearchResult } from '@nludb/client';
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
  resultsToButtonProps?: (results: SearchResult) => ButtonProps[]
  /*
   * CSS styles to apply to the results object
   */
  resultStyles?: any
}

function _resultsToButtonProps(results: SearchResult): ButtonProps[] {
  let buttonPropsList: ButtonProps[] = [];

  if (results) {
    for (let result of results.hits) {
      result.metadata = {
        "links": {
          "https://docs.helpscout.com/article/22-get-started-with-workflows": {
            "url": "https://docs.helpscout.com/article/22-get-started-with-workflows", 
            "title": "Get Started With Workflows", 
            "slug": 
            "get-started-with-workflows", 
            "number": "22", 
            "numberAndSlug": 
            "22-get-started-with-workflows"
          }
        }
      }
      let metadata = result.metadata as any;
      if (metadata) {
        if (metadata.links) {
          for (let link in metadata.links) {
            let obj = metadata.links[link];
            if (obj.title) {
              buttonPropsList.push({
                label: obj.title,
                onClick: () => {},
                onHover: () => {},
                hit: {
                  value: obj.title,
                  score: result.score,
                  metadata: obj
                }
              })
            }
          }
        }
      }
    }
  } 
  return buttonPropsList;
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
  resultsToButtonProps,
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
    let buttonPropsList: ButtonProps[] = (resultsToButtonProps || _resultsToButtonProps)(results)
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
