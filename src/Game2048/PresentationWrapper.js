import React from 'react';
import { annotateFlatten } from './gamelogic';
import './Game.css';

const GamePresentationWrapper = ({visible, board, children}) => {
  return (
    <div className={!visible ? 'Game-overlay' : ''} style={visible ? {} : { position: "absolute"}}>
      <div style={visible ? {} : { visibility: 'hidden'}}>
        Score: {annotateFlatten(board).reduce((a, b) => a + (b.num || 0), 0)}
      </div>
      {children}
    </div>);
};

export default GamePresentationWrapper;
