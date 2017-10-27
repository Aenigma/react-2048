import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FlipMove from 'react-flip-move';
import {isEqual} from 'lodash';
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

class Game extends Component {
  componentDidMount() {
    if(!this.props.visible) {
      return;
    }
    ReactDOM.findDOMNode(this).children[0].focus(); // hack
    this.addRandom();
  }

  constructor(props) {
    super(props);
    this.state = {
      board: Array(4).fill(Array(4).fill(null))
    };

    this.tick = this.tick.bind(this);
  }

  genItem(item) {
    let inner;
    let key;

    if (item.num) {
      key = item.id;
      inner = (
        <div className="Game-numeral">
          {item.num}
        </div>);
    } else {
      inner = (<div className="Game-numeral"/>);
      key = uuid();
    }

    return (
      <div className="Game-item" key={key}>
        {inner}
      </div>);
  }

  genTable() {
    return (
      <FlipMove className="Game"
        onKeyDown={this.tick} tabIndex={this.props.tabIndex}
        duration={100} easing="linear" enterAnimation="none" leaveAnimation="none">
          {annotateFlatten(this.state.board).map(this.genItem)}
      </FlipMove>
    );
  }

  addRandom() {
    const newBoard = cloneTable(this.state.board);
    const flattened = annotateFlatten(newBoard);
    const filtered = flattened.filter(e => !e.num);
    const emptyCell = filtered[Math.floor(Math.random() * filtered.length)];

    newBoard[emptyCell.row][emptyCell.col] = new GameTile(2);
    this.setState({board: newBoard});
  }

  tick(ev) {
    let preprocessors /*:Array<(Array<Array<?GameTile>>) => Array<Array<?GameTile>>>*/ = [];
    let newBoard = cloneTable(this.state.board);

    switch(ev.key) {
      case 'ArrowUp':
        preprocessors = [transpose];
        break;
      case 'ArrowDown':
        //dy = ev.key === 'ArrowUp' ? 1 : -1;
        preprocessors = [flip, transpose];
        break;
      case 'ArrowLeft':
        preprocessors = [];
        break;
      case 'ArrowRight':
        preprocessors = [flip];
        //dx = ev.key === 'ArrowRight' ? 1 : -1;
        break;
      default:
        return;
    }

    newBoard = pipe(...preprocessors)(newBoard);
    newBoard = moveGridLeft(newBoard);
    newBoard = pipe(...preprocessors.reverse())(newBoard);

    if(isEqual(newBoard, this.state.board)) {
      console.log('invalid move; no change');
      return;
    }

    this.setState({board: newBoard}, () => {
      const flattened = annotateFlatten(newBoard);
      // is every element non-null?
      const isOver = flattened.every(e => e.num);

      if (!isOver) { // check if it was a valid move, first
        this.addRandom();
      }
    });
  }

  render() {
    return (
      <div className={!this.props.visible ? 'Game-overlay' : ''}
        style={this.props.visible ? {} : { position: "absolute"}}>
        {this.genTable()}
      </div>);
  }
}

Game.defaultProps = {
  tabIndex: "0",
  visible: true,
};

export default Game;
