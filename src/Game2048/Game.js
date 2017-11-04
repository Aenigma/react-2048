import React from 'react';
import GamePresentationWrapper from './PresentationWrapper';
import GamePresentation from './GamePresentation';
import MovementInput from './MovementInput';

const Game = ({board, move}) => (
  <GamePresentationWrapper visible={true} board={board}>
    <MovementInput move={move}>
        <GamePresentation board={board} tabIndex={"0"} shouldAutoFocus={true}/>
    </MovementInput>
  </GamePresentationWrapper>);

export default Game;
