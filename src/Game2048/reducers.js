import { isEqual } from 'lodash';
import Random from './randservice';
import { move, preprocMap } from './BoardMovements';
import { GameTile, cloneTable, annotateFlatten } from './gamelogic';

// remove!
import { moveLeft, moveRight, moveDown, moveUp } from './BoardMovements';

// constant values
const PLAYSTATE_PLAYING = 0;
const PLAYSTATE_LOSS = 1;

const newGridValues = [2, 4];

const addRandom = (rand, board) => {
  const newBoard = cloneTable(board);
  const flattened = annotateFlatten(newBoard);
  const filtered = flattened.filter(e => !e.num);

  const emptyCellIndex = rand.get(0, filtered.length)[1];
  const digitIndex = rand.get(0, newGridValues.length)[1];

  const emptyCell = filtered[emptyCellIndex];
  const digit = newGridValues[digitIndex];
  newBoard[emptyCell.row][emptyCell.col] = new GameTile(digit);

  return newBoard;
};

const isFull = (board) => {
  const flattened = annotateFlatten(board);
  const over = flattened.every(e => e.num);

  return over;
};

const initialGameState = () => ({
  board: Array(4).fill(Array(4).fill(null)),
  rand:  new Random(),
  playstate: PLAYSTATE_PLAYING,
  hasWon: false,
});

const canMove = (board) => {
  const stdMove = (procs) => move(board, procs);
  const moves = [moveLeft, moveRight, moveDown, moveUp];

  return !moves.every(m => isEqual(m(stdMove), board));
};

const newGame = () => {
  let { board, rand, ...other } = initialGameState();
  board = addRandom(rand, board);
  rand = rand.next();
  return {
    board,
    rand,
    ...other
  }
};

const game = (state = initialGameState(), action = {type: ""}) => {
  console.log(action);
  const direction = action.direction ? action.direction.toLowerCase() : 'LEFT';
  let {rand, board, playstate} = state;

  switch (action.type) {
    case 'MOVE':
      console.log(`MOVEMENT MADE: ${action.type}_${action.direction}`);
      board = move(board, preprocMap[direction]);

      if(isEqual(board, state.board)) {
        console.log('invalid move; no change');
        return state;
      }

      if(!isFull(board)) {
        board = addRandom(rand, board);
        rand = rand.next();
      }

      if(!canMove(board)) {
        playstate = PLAYSTATE_LOSS;
      }
      break;
      case 'NEW_GAME':
        console.log("NEW GAME")
        return newGame();
      default:
    }

    return { board, rand, playstate };
};

export { game };
