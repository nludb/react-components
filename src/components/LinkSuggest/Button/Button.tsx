import { SearchHit } from '@nludb/client';
import React from 'react';
import './button.css';

export interface ButtonProps {
  /**
   * Button contents
   */
  label: string;

  /**
   * Optional click handler
   */
  onClick?: (hit: SearchHit) => void;

  /**
   * Optional hover handler
   */
   onHover?: (hit: SearchHit, isHovering: boolean) => void;

  /**
   * The Search Hit corresponding to this button
   */
  hit: SearchHit
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  label,
  onClick,
  onHover,
  hit,
  ...props
}: ButtonProps) => {
  const doClick = () => {
    onClick && onClick(hit)
  }
  const yesHover = () => {
    onHover && onHover(hit, true);
  }
  const noHover = () => {
    onHover && onHover(hit, true);
  }

  return (
    <button onClick={doClick} onMouseEnter={yesHover} onMouseLeave={noHover} type="button" className="whitespace-nowrap link-suggest-button" {...props}>
      {label}
    </button>
  );
};
