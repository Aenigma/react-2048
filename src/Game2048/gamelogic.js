// @flow
import uuid from 'uuid/v4';

export class GameTile {
  /*::
   id: string;
   num: number;
  */
  constructor(num/*: number*/, id/*:string*/=uuid()) {
    this.id = id;
    this.num = num;
  }
}

export const gameTileFactory = (num) => ({num, id: uuid()});

const canReduce = (one/*: ?GameTile*/, two/*: ?GameTile*/) => {
  if(!one || !one.num || !two || !two.num) {
    return false;
  }

  return one.num === two.num;
};

/*::
export type Board<T> = Array<Array<?T>>;
export type Board2048 = Board<?GameTile>;
*/


export const cloneTable = /*:: <T>*/(table/*: Board<T>*/) /*:Board<T>*/ => table.map(row => row.slice());

// flatten and annotate
export function annotateFlatten(table/*:Array<Array<?GameTile>>*/) {
  const copiedBoard = table.map((row, i) => row.map((col, j) => {
      let ncol = Object.assign({}, {
        row: i,
        col: j
      }, col);
      return ncol;
    })
  );
  return [].concat.apply([], copiedBoard);
}

export function moveGridLeft(table: Array<Array<any>>) {
  return table.map(moveRowLeft);
}

function shiftLeft(row) {
  for (let i = 0; i < row.length - 1; i++) {
    for (let j = i; j < row.length - 1; j++) {
      if(!row[j]) {
        const tmp = row[j];
        row[j] = row[j+1];
        row[j+1] = tmp;
      }
    }
  }
}

function reduceLeft(row) {
  for(let i = 0; i < row.length - 1; i++) {
    if (canReduce(row[i], row[i + 1])) {
      const old = row[i + 1] || { id: "0", num: 0 };
      row[i] = { id: old.id, num: old.num * 2 };
      row[i + 1] = null;
    }
  }
}

function moveRowLeft(row) {
  const res = row.slice();

  shiftLeft(res);
  reduceLeft(res);
  shiftLeft(res);
  return res;
}
