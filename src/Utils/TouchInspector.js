import React from 'react';

const TouchInspector = (props) => {
  const {onMouseDown, onTouchStart, children, ...other} = props;

  const nProps = {
    onMouseDown: evt => {
      onMouseDown(evt);
    },
    onTouchStart: evt => {
      onTouchStart(evt);
    }
  };

  return React.cloneElement(React.Children.only(children), {...other, ...nProps});
};

export default TouchInspector;
