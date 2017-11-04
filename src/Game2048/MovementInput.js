import React from 'react';
import { Swipeable, defineSwipe } from 'react-touch';
import Gamepad from 'react-gamepad';

const swipe = defineSwipe({swipeDistance: 30});
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

const MovementInput = ({children, move}) => (
  <Gamepad
    onLeft={() => move('LEFT')}
    onRight={() => move('RIGHT')}
    onDown={() => move('DOWN')}
    onUp={() => move('UP')}>
    <Swipeable config={swipe}
      onSwipeLeft={() => move('LEFT')}
      onSwipeRight={() => move('RIGHT')}
      onSwipeDown={() => move('DOWN')}
      onSwipeUp={() => move('UP')}>
      <ArrowKeysMovement move={move}>
        {children}
      </ArrowKeysMovement>
    </Swipeable>
  </Gamepad>);

export default MovementInput;
