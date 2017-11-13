import React from 'react';
import Swipeable from 'react-swipeable'
import Gamepad from 'react-gamepad';

const keyMove = (key, move) => {
  const keyMap = {
    'ArrowUp': 'UP',
    'ArrowDown': 'DOWN',
    'ArrowLeft': 'LEFT',
    'ArrowRight': 'RIGHT'
  };

  if (!key || !keyMap[key] || !keyMap[key]) {
      return;
  }
  move(keyMap[key]);
};

const ArrowKeysMovement = ({children, move, ...passThrough}) => {
  const props = {
    onKeyDown: (ev) => keyMove(ev.key, move)
  };
  return React.cloneElement(React.Children.only(children), {...props, ...passThrough});
};

const MovementInput = ({children, move, undo, redo, newgame}) => (
  <Gamepad
    onLeft={() => move('LEFT')}
    onRight={() => move('RIGHT')}
    onDown={() => move('DOWN')}
    onUp={() => move('UP')}
    onLB={undo}
    onRB={redo}
    onStart={newgame}>
    <Swipeable
      onSwipedLeft={() => move('LEFT')}
      onSwipedRight={() => move('RIGHT')}
      onSwipedDown={() => move('DOWN')}
      onSwipedUp={() => move('UP')}>
      <ArrowKeysMovement move={move}>
        {children}
      </ArrowKeysMovement>
    </Swipeable>
  </Gamepad>);

export default MovementInput;
