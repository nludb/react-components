import React from 'react';
import './button.css';
import { ArrowDownIcon } from '@heroicons/react/solid'

export interface ButtonProps {
  /**
   * Button contents
   */
  type: "accept" | "edit";
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  type,
  onClick,
  ...props
}: ButtonProps) => {
  let content = null;
  if (type == "accept") {
    content = <ArrowDownIcon className="h-5 w-5 text-yellow-800" />
  } else if (type == "edit") {
    content = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 transform rotate-90">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
      </svg>
    )
  }
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-yellow-100 hover:bg-yelow-300 focus:outline-none">
      {content}
    </button>
  )
};
