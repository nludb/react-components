import React from 'react';

import "./buttonList.css"

export const ButtonList = ({children}) => (
    <div className="mx-auto py-2 sm:py-6">
      <div className="buttonList">
        {children}
      </div>
    </div>
);
