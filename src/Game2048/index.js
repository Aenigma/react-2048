import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FlipMove from 'react-flip-move';
import { Swipeable, defineSwipe } from 'react-touch';
import { isEqual, debounce } from 'lodash';
import uuid from 'uuid/v4';
//import PropTypes from 'prop-types';
import './Game.css';
import {moveGridLeft, GameTile, flip, transpose, pipe} from './gamelogic.js';

const cloneTable = table => table.map(row => row.slice());

// flatten and annotate
function annotateFlatten(table) {
  const copiedBoard = table.map((row, i) => row.map((col, j) => {
      let ncol = Object.assign({
        row: i,
        col: j
      }, col);
      return ncol;
    })
  );
  return [].concat.apply([], copiedBoard);
}

const preprocMap = {
  up: [transpose],
  down: [flip, transpose],
  left: [],
  right: [flip]
};

const swipe = defineSwipe({swipeDistance: 30});

const colors = ['#FF', '#AA9988', '#A86D00', '#228899', '#3F757F', '#775555',
'#885511', '#664400', '#4C473D', '#664200', '#882211', '#114488', '#2B2B2B',
'#332100', '#101111', '#001122'];

class Game extends Component {
  componentDidMount() {
    if(!this.props.visible) {
      return;
    }
    ReactDOM.findDOMNode(this).children[0].focus(); // hack
    this.isAnimating = false;
    this.addRandom();
  }

  constructor(props) {
    super(props);
    const move = this.move.bind(this);
    this.state = {
      board: Array(4).fill(Array(4).fill(null))
    };
    this.move = debounce(move, 100);
    this.handleKey = this.handleKey.bind(this);
  }

  genItem(item) {
    let inner;
    let key;
    let color = null;

    if (item.num) {
      key = item.id;
      inner = item.num;
      color = colors[Math.floor(Math.log2(inner))];
    } else {
      key = uuid();
      inner = null;
    }

    return (
      <div className="Game-item" key={key}
        data-game-numeral={inner} style={{backgroundColor: color}}>
        {inner}
      </div>);
  }

  genTable() {
    return (
      <FlipMove className="Game"
        onKeyDown={this.handleKey} tabIndex={this.props.tabIndex}
        duration={100} easing="linear" enterAnimation="none" leaveAnimation="none">
          {annotateFlatten(this.state.board).map(this.genItem)}
      </FlipMove>
    );
  }

  addRandom() {
    const possibleValues = [2, 4];
    const newBoard = cloneTable(this.state.board);
    const flattened = annotateFlatten(newBoard);
    const filtered = flattened.filter(e => !e.num);
    const emptyCell = filtered[Math.floor(Math.random() * filtered.length)];

    const digit = possibleValues[Math.floor(Math.random() * possibleValues.length)];
    newBoard[emptyCell.row][emptyCell.col] = new GameTile(digit);
    this.setState({board: newBoard});
  }

  move(preprocessors) {
    const procs = preprocessors.slice();
    let board = cloneTable(this.state.board);
    board = pipe(...procs)(board);
    board = moveGridLeft(board);
    board = pipe(...procs.reverse())(board);

    if(isEqual(board, this.state.board)) {
      console.log('invalid move; no change');
      return;
    }

    this.setState({board: board}, () => {
      const flattened = annotateFlatten(board);
      // is every element non-null?
      const isOver = flattened.every(e => e.num);

      if (!isOver) { // check if it was a valid move, first
        this.addRandom();
      }
    });
  }

  handleKey(ev) {
    const keyMap = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right'
    }

    if (ev.key && keyMap[ev.key] && preprocMap[keyMap[ev.key]]) {
      this.move(preprocMap[keyMap[ev.key]]);
    }
  }

  render() {
    return (
      <div className={!this.props.visible ? 'Game-overlay' : ''}
        style={this.props.visible ? {} : { position: "absolute"}}>
        <div style={this.props.visible ? {} : { visibility: 'hidden'}}>
          Score: {annotateFlatten(this.state.board).reduce((a, b) => a + (b.num || 0), 0)}
        </div>
        <Swipeable config={swipe}
          onSwipeLeft={() => this.move(preprocMap.left)}
          onSwipeRight={() => this.move(preprocMap.right)}
          onSwipeDown={() => this.move(preprocMap.down)}
          onSwipeUp={() => this.move(preprocMap.up)}>
          {this.genTable()}
        </Swipeable>
      </div>);
  }
}

Game.defaultProps = {
  tabIndex: "0",
  visible: true,
};

export default Game;
