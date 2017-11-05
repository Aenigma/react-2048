import React from 'react';
import GamePresentationWrapper from './PresentationWrapper';
import GamePresentation from './GamePresentation';
import MovementInput from './MovementInput';

const Game = ({board, move, undo, redo, newgame}) => (
  <GamePresentationWrapper visible={true} board={board}>
    <MovementInput move={move} undo={undo} redo={redo} newgame={newgame}>
        <GamePresentation board={board} tabIndex={"0"} shouldAutoFocus={true}/>
    </MovementInput>
  </GamePresentationWrapper>);

export default Game;
