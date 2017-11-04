//@flow
import { moveGridLeft, cloneTable } from './gamelogic.js';

import type { Board } from './gamelogic';
opaque type BoardProcessor<T> = (Board<?T>) => Board<?T>;
opaque type ProcList<T> = Array<BoardProcessor<T>>;

const transpose = <T>(table: Board<?T>): Board<?T> =>
  table.map((row, i) => table.map(col => col[i]));

const flip = <T>(table: Board<?T>): Board<?T> =>
  table.map((row) => row.slice().reverse());

const pipe = <T>(...funcs: Array<(T) => T>): ((T) => T) =>
  funcs.reduce((a,b) => (i: T) => a(b(i)), (i: T): T => i);

export const preprocMap: {
    [string]: ProcList<Board<?*>>
  } = {
  up: [transpose],
  down: [flip, transpose],
  left: [],
  right: [flip]
};

export const moveLeft  = <T>(move: (ProcList<Board<?T>>) => ?Board<?T>) =>
  move(((preprocMap.left: any) : ProcList<Board<?T>>));
export const moveRight = <T>(move: (ProcList<Board<?T>>) => ?Board<?T>) =>
  move(((preprocMap.right: any) : ProcList<Board<?T>>));
export const moveDown  = <T>(move: (ProcList<Board<?T>>) => ?Board<?T>) =>
  move(((preprocMap.down: any) : ProcList<Board<?T>>));
export const moveUp    = <T>(move: (ProcList<Board<?T>>) => ?Board<?T>) =>
  move(((preprocMap.up: any) : ProcList<Board<?T>>));

export const move = <T>(current: Board<?T>, preprocessors :ProcList<?T>) => {
  const procs = ((preprocessors.slice() : any): ProcList<?T>);
  let board = cloneTable(current);
  board = pipe(...procs)(board);
  board = moveGridLeft(board);

  board = pipe(...(procs.reverse(): ProcList<?T>))(board);

  return board;
};
