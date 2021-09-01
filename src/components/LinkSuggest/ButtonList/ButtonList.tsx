import React, {FC} from 'react';

import "./buttonList.css"

interface Props {
  resultStyles?: any
}

export const ButtonList: FC<Props> = ({ children, resultStyles, ...props }) => (
  <div style={resultStyles} className="mx-auto py-2 sm:py-6">
    <div className="buttonList">
      {children}
    </div>
  </div>
);
