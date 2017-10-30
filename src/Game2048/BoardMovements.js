import { moveGridLeft, cloneTable } from './gamelogic.js';

const transpose = (table/*: Array<Array<any>>*/) =>
  table.map((row, i) => table.map(col => col[i]));

const flip = (table/*: Array<Array<any>>*/) =>
  table.map((row) => row.slice().reverse());

const pipe = (...funcs /*: Array<(any) => any> */) =>
  funcs.reduce((a,b) => (i) => a(b(i)), (i) => i);

export const preprocMap = {
  up: [transpose],
  down: [flip, transpose],
  left: [],
  right: [flip]
};

export const moveLeft = (move) => move(preprocMap.left);
export const moveRight = (move) => move(preprocMap.right);
export const moveDown = (move) => move(preprocMap.down);
export const moveUp = (move) => move(preprocMap.up);

export const move = (current, preprocessors) => {
  const procs = preprocessors.slice();
  let board = cloneTable(current);
  board = pipe(...procs)(board);
  board = moveGridLeft(board);
  board = pipe(...procs.reverse())(board);

  return board;
};
