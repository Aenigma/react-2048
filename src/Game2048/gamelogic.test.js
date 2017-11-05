import { moveGridLeft, annotateFlatten } from './gamelogic';
import uuid from 'uuid/v4';

const asTile = num => ( num ? {num, id: uuid()} : null);
const asTiles = nums => nums.map(asTile);

const asNums = tiles => tiles.map((t) => t ? t.num : 0);

const createInitial = (val = 2) => (Array(4).fill(Array(4).fill( val !== 0 ? asTile(val) : null)));
describe('annotateFlatten', () => {
  it('handles null correctly', () => {
    const board = createInitial(0);
    const flattened = annotateFlatten(board);

    expect(flattened[0].row).toEqual(0);
    expect(flattened[0].col).toEqual(0);
    expect(flattened[0].num).toBeUndefined();

    expect(flattened[15].row).toEqual(3);
    expect(flattened[15].col).toEqual(3);
    expect(flattened[15].num).toBeUndefined();
  });

  it('preserves values correctly', () => {
    const board = createInitial(2);
    const flattened = annotateFlatten(board);

    expect(flattened[0].row).toEqual(0);
    expect(flattened[0].col).toEqual(0);
    expect(flattened[0].num).toEqual(2);

    expect(flattened[15].row).toEqual(3);
    expect(flattened[15].col).toEqual(3);
    expect(flattened[15].num).toEqual(2);
  });

  it('preserves keys correctly', () => {
    const board = createInitial(2);
    const flattened = annotateFlatten(board);

    expect(flattened[15].id).toEqual(board[0][0].id);
    expect(flattened[15].id).toEqual(board[3][3].id);
  });
});

describe('moveGridLeft', () => {
  it('does not alter the original table', () => {
    const board = createInitial(2);
    const nboard = moveGridLeft(board);

    expect(nboard).not.toEqual(board);
  });

  it('should combine neighboring like numbers', () => {
    const board = createInitial(0);
    board[0] = asTiles([2, 2, 0, 0]);
    board[1] = asTiles([0, 2, 2, 0]);
    board[2] = asTiles([0, 0, 2, 2]);

    const nboard = moveGridLeft(board);

    expect(asNums(nboard[0])).toEqual([4, 0, 0, 0]);
    expect(asNums(nboard[1])).toEqual([4, 0, 0, 0]);
    expect(asNums(nboard[2])).toEqual([4, 0, 0, 0]);
  });

  it('should combine like numbers with gaps', () => {
    const board = createInitial(0);
    board[0] = asTiles([2, 0, 2, 0]);
    board[1] = asTiles([2, 0, 0, 2]);
    board[2] = asTiles([0, 2, 0, 2]);

    const nboard = moveGridLeft(board);

    expect(asNums(nboard[0])).toEqual([4, 0, 0, 0]);
    expect(asNums(nboard[1])).toEqual([4, 0, 0, 0]);
    expect(asNums(nboard[2])).toEqual([4, 0, 0, 0]);
  });

  it('should combine correctly when there are 3 like numbers', () => {
    const board = createInitial(0);
    board[0] = asTiles([2, 2, 2, 0]);
    board[1] = asTiles([0, 2, 2, 2]);

    const nboard = moveGridLeft(board);

    expect(asNums(nboard[0])).toEqual([4, 2, 0, 0]);
    expect(asNums(nboard[1])).toEqual([4, 2, 0, 0]);
  });

  it('should combine 4 like numbers correctly', () => {
    const board = createInitial(0);
    board[0] = asTiles([2, 2, 2, 2]);

    const nboard = moveGridLeft(board);

    expect(asNums(nboard[0])).toEqual([4, 4, 0, 0]);
  });

  it('should not cascade', () => {
    const board = createInitial(0);
    board[0] = asTiles([4, 2, 2, 0]);
    board[1] = asTiles([4, 0, 2, 2]);
    board[2] = asTiles([8, 4, 2, 2]);

    const nboard = moveGridLeft(board);

    expect(asNums(nboard[0])).toEqual([4, 4, 0, 0]);
    expect(asNums(nboard[1])).toEqual([4, 4, 0, 0]);
    expect(asNums(nboard[2])).toEqual([8, 4, 4, 0]);
  });

  it('should preserve keys when moving', () => {
    const board = createInitial(0);
    const tile0 = {num: 2, id: '0'};
    const tile1 = {num: 4, id: '1'};
    const expectedOutput = [tile0, tile1, null, null];
    board[0] = [tile0, tile1, null, null];
    board[1] = [null, tile0, tile1, null];
    board[2] = [null, null, tile0, tile1];
    board[3] = [tile0, null, null, tile1];

    const nboard = moveGridLeft(board);
    expect(nboard[0]).toEqual(expectedOutput);
    expect(nboard[1]).toEqual(expectedOutput);
    expect(nboard[2]).toEqual(expectedOutput);
    expect(nboard[3]).toEqual(expectedOutput);
  });

  it('should preserve key of right when combining', () => {
    const board = createInitial(0);
    const tile0 = {num: 2, id: '0'};
    const tile1 = {num: 2, id: '1'};
    const tile2 = asTile(4);
    const resTile0 = {num: 4, id: '0'};
    const resTile1 = {num: 4, id: '1'};
    const expectedOutput0 = [resTile1, null, null, null];
    const expectedOutput1 = [resTile0, resTile1, null, null];
    const expectedOutput2 = [tile2, resTile1, null, null];
    board[0] = [tile0, tile1, null, null];
    board[1] = [tile0, null, null, tile1];
    board[2] = [asTile(2), tile0, asTile(2), tile1];
    board[3] = [tile2, tile0, tile1, null];

    const nboard = moveGridLeft(board);
    expect(nboard[0]).toEqual(expectedOutput0);
    expect(nboard[1]).toEqual(expectedOutput0);
    expect(nboard[2]).toEqual(expectedOutput1);
    expect(nboard[3]).toEqual(expectedOutput2
    );
  });
});
