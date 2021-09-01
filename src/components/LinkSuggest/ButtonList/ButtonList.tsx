import React, {FC} from 'react';

import "./buttonList.css"

interface Props {
}

export const ButtonList: FC<Props> = ({ children, ...props }) => (
  <div className="mx-auto py-2 sm:py-6">
    <div className="buttonList">
      {children}
    </div>
  </div>
);
