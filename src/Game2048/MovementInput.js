import React from 'react';
import { Swipeable, defineSwipe } from 'react-touch';
import Gamepad from 'react-gamepad';
import { moveLeft, moveRight, moveDown, moveUp } from './BoardMovements';

const keyMove = (key, move) => {
  const keyMap = {
    'ArrowUp': moveUp,
    'ArrowDown': moveDown,
    'ArrowLeft': moveLeft,
    'ArrowRight': moveRight
  };

  if (!key || !keyMap[key] || !keyMap[key]) {
      return;
  }
  keyMap[key](move);
};


const ArrowKeysMovement = ({move, children, ...passThrough}) => {
  const props = {
    onKeyDown: (ev) => keyMove(ev.key, move)
  };
  return React.cloneElement(React.Children.only(children), {...props, ...passThrough});
};

const swipe = defineSwipe({swipeDistance: 30});
const MovementInput = ({move, children}) => {
  return (
    <Gamepad
      onLeft={() => moveLeft(move)}
      onRight={() => moveRight(move)}
      onDown={() => moveDown(move)}
      onUp={() => moveUp(move)}>
      <Swipeable config={swipe}
        onSwipeLeft={() => moveLeft(move)}
        onSwipeRight={() => moveRight(move)}
        onSwipeDown={() => moveDown(move)}
        onSwipeUp={() => moveUp(move)}
        __passThrough={{potato: "YES!"}}>
        <Swipeable config={swipe}>
        <ArrowKeysMovement move={move}>
          {children}
        </ArrowKeysMovement>
      </Swipeable>
      </Swipeable>
    </Gamepad>);
};

export default MovementInput;
