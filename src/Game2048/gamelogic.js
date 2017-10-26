// @flow
import uuid from 'uuid/v4';

export class GameTile {
  id: string;
  num: number;
  constructor(num: number, id:string=uuid()) {
    this.id = uuid();
    this.num = num;
  }

  canReduce(other: ?GameTile) {
    if(!other || !other.num) {
      return false;
    }

    return this.num === other.num;
  }

  clone(): GameTile {
    return new GameTile(this.num, this.id);
  }
}

export function displayTiles(grid: Array<Array<?GameTile>>): Array<Array<number>> {
    return grid.map(row => row.map(e => e ? e.num : 0));
}

/*
const example = [
  [1,1,1,1],
  [2,0,2,4],
  [2,1,1,0],
  [0,0,0,0]
];

const sample: Array<Array<?GameTile>> = example.map(r => r.map(i => { return i ? new GameTile(i) : null; }));
window.sample = sample;
window.moveGridLeft = moveGridLeft;
window.moveRowLeft = moveRowLeft;
*/

export function moveGridLeft(table: Array<Array<?GameTile>>) {
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

function reduceLeft(row, offset) {
  for(let i = offset; i < row.length - 1; i++) {
    if (row[i] && row[i].canReduce(row[i + 1])) {
      const old = row[i];
      row[i] = new GameTile(old.num * 2, old.id);
      row[i + 1] = null;
    }
  }
}

function moveRowLeft(row) {
  const res = row.slice();

  shiftLeft(res);
  for (let i = 0; i < res.length; i++) {
    reduceLeft(res, i);
  }
  shiftLeft(res);
  return res;
}
