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
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  label,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button onClick={onClick} type="button" className="whitespace-nowrap link-suggest-button" {...props}>
      {label}
    </button>
  );
};
