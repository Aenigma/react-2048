import { isEqual } from 'lodash';
import Random from './randservice';
import { move, preprocMap } from './BoardMovements';
import { gameTileFactory, cloneTable, annotateFlatten } from './gamelogic';

// remove!
import { moveLeft, moveRight, moveDown, moveUp } from './BoardMovements';

// constant values
export const PlayStates = {
  PLAYSTATE_NEW: 'PLAYSTATE_NEW',
  PLAYSTATE_PLAYING: 'PLAYSTATE_PLAYING',
  PLAYSTATE_VICTORY: 'PLAYSTATE_VICTORY',
  PLAYSTATE_LOSS: 'PLAYSTATE_LOSS'
};

const newGridValues = [2, 4];

const addRandom = (rand, board) => {
  const newBoard = cloneTable(board);
  const flattened = annotateFlatten(newBoard);
  const filtered = flattened.filter(e => !e.num);

  const emptyCellIndex = rand.get(0, filtered.length)[1];
  const digitIndex = rand.get(0, newGridValues.length)[1];

  const emptyCell = filtered[emptyCellIndex];
  const digit = newGridValues[digitIndex];
  newBoard[emptyCell.row][emptyCell.col] = gameTileFactory(digit);

  return newBoard;
};

const isFull = (board) => {
  const flattened = annotateFlatten(board);
  const over = flattened.every(e => e.num);

  return over;
};

const initialGameState = () => ({
  board: Array(4).fill(Array(4).fill(null)),
  seed:  new Random().seed,
  playstate: PlayStates.PLAYSTATE_PLAYING,
});

const canMove = (board) => {
  const stdMove = (procs) => move(board, procs);
  const moves = [moveLeft, moveRight, moveDown, moveUp];

  return !moves.every(m => isEqual(m(stdMove), board));
};

const hasWon = (board) => {
  const newBoard = cloneTable(board);
  const flattened = annotateFlatten(newBoard);
  const maxPiece = flattened.reduce((a, b) => Math.max(a, b.num || 0), -Infinity)

  return maxPiece >= 2048;
};

const newGame = () => {
  let { board, seed, ...other } = initialGameState();
  let rand = new Random(seed);
  board = addRandom(rand, board);
  rand = rand.next();
  seed = rand.seed;
  return {
    board,
    seed,
    ...other
  }
};

const getPlaystate = (board) => {
  // N.B.: both hasWon and !canMove can be true; make sure loss supersedes win
  if(!canMove(board)) {
    return PlayStates.PLAYSTATE_LOSS;
  } else if(hasWon(board)) {
    return PlayStates.PLAYSTATE_VICTORY;
  }
  return PlayStates.PLAYSTATE_PLAYING;
};

const game = (state = newGame(), action = {type: ""}) => {
  const direction = action.direction ? action.direction.toLowerCase() : 'LEFT';
  let {seed, board, playstate} = state;
  let rand = new Random(seed);

  switch (action.type) {
    case 'CHEAT':
      board = cloneTable(board);
      board[0][0] = gameTileFactory(2048);
      break;
    case 'MOVE':
      board = move(board, preprocMap[direction]);

      if(isEqual(board, state.board)) {
        console.log('invalid move; no change');
        return state;
      }

      if(!isFull(board)) {
        board = addRandom(rand, board);
        rand = rand.next();
        seed = rand.seed;
      }
      break;
      case 'NEW_GAME':
        return newGame();
      default:
    }

    playstate = getPlaystate(board);
    return { board, seed, playstate };
};

export { game };
