import React from 'react';
import './suggestion.css';
import { LightBulbIcon } from '@heroicons/react/solid'
import { Button } from "../Button/Button"

export interface SuggestionProps {
  /**
   * Suggestion contents
   */
   suggestion: string;
  /**
   * Optional editHandler
   */
  editSuggestion?: () => void;

  /**
   * Optional acceptHandler
   */
   acceptSuggestion?: () => void;

   /**
    * Is the system in the process of making a suggestion?
    */
   makingSuggestion?: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const Suggestion = ({
  suggestion,
  editSuggestion,
  acceptSuggestion,
  makingSuggestion,
  ...props
}: SuggestionProps) => {
  if ((makingSuggestion !== true) && (suggestion == null)) {
    return null
  }

  const suggestionElem = <p className="w-full text-yellow-800 pl-12 bg-yellow-100 rounded-full py-3 pr-36">{suggestion || "Looking for suggestion..."}</p>

  const body = (
    <React.Fragment>
      {suggestionElem}
      {(suggestion && editSuggestion) && <Button type="edit" onClick={editSuggestion} /> }
      {(suggestion && acceptSuggestion) && <Button type="accept" onClick={acceptSuggestion} /> }
    </React.Fragment>
  )

  return (
    <div className="relative flex mb-2">
      <span className="absolute inset-y-0 flex inline-flex h-12 w-12 items-center ml-4">
        <LightBulbIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
      </span>
      {body}
    </div>
  )
};
