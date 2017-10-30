import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { isEqual, debounce } from 'lodash';
import { Random } from 'lcg';

import GamePresentationWrapper from './PresentationWrapper';
import GamePresentation from './GamePresentation';
import MovementInput from './MovementInput';
import { move, moveLeft, moveRight, moveDown, moveUp } from './BoardMovements';
import { GameTile, cloneTable, annotateFlatten } from './gamelogic.js';

// possible values to generate on the grid
const newGridValues = [2, 4];

const addRandom = (rand, board) => {
  const newBoard = cloneTable(board);
  const flattened = annotateFlatten(newBoard);
  const filtered = flattened.filter(e => !e.num);

  const emptyCellIndex = rand.getIntegerBetween(0, filtered.length - 1);
  const digitIndex = rand.getIntegerBetween(0, newGridValues.length - 1);

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

const canMove = (board) => {
  const stdMove = (procs) => move(board, procs);
  const moves = [moveLeft, moveRight, moveDown, moveUp];

  return !moves.every(m => isEqual(m(stdMove), board));
};

const EMPTY = Array(4).fill(Array(4).fill(null));
class Game extends Component {
  componentDidMount() {
    if(!this.props.visible) {
      return;
    }
    ReactDOM.findDOMNode(this).children[1].focus(); // hack
    this.newGame();
  }

  newGame() {
    this.setState({
      board: addRandom(this.rand, EMPTY)
    });
    this.rand = this.rand.next();
  }

  constructor(props) {
    super(props);
    const move = this.move.bind(this);
    this.rand = new Random(Math.random());
    this.move = debounce(move, 150);
    this.state = {board: EMPTY};
  }

  move(preprocessors) {
    let board = move(this.state.board, preprocessors);

    if(isEqual(board, this.state.board)) {
      console.log('invalid move; no change');
      return;
    }

    if(!isFull(board)) {
      board = addRandom(this.rand, board);
      this.rand = this.rand.next();
    }

    this.setState({board: board}, () => {
      if (!canMove(board)) {
        alert("It looks like you lost!");
        this.newGame();
      }
    });
  }

  render() {
    return (
      <GamePresentationWrapper
        visible={this.props.visible}
        board={this.state.board}>
        <MovementInput move={this.move}>
            <GamePresentation board={this.state.board}
              tabIndex={this.props.tabIndex}/>
        </MovementInput>
      </GamePresentationWrapper>);
  }
}

Game.defaultProps = {
  tabIndex: "0",
  visible: true,
};

export default Game;
