import React from 'react';
import Game from './Game';
import GamePresentation from './GamePresentation';
import GamePresentationWrapper from './PresentationWrapper';

const EMPTYBOARD = Array(4).fill(Array(4).fill(null));
const Game2048 = ({board, move, undo, redo, newgame, actions}) => (
  <div className="center">
    <GamePresentationWrapper visible={false} board={EMPTYBOARD}>
      <GamePresentation board={EMPTYBOARD} tabIndex={"-1"} shouldAutoFocus={false}/>
    </GamePresentationWrapper>
    <Game board={board} move={move} undo={undo} redo={redo} newgame={newgame} actions={actions}/>
  </div>
);

export default Game2048;
