import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid/v4';
//import PropTypes from 'prop-types';
import './Game.css';
import {moveGridLeft, GameTile} from './gamelogic.js';

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
    ReactDOM.findDOMNode(this).children[0].focus(); // hack
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
      <div className="Game" onKeyDown={this.tick} tabIndex="0">
        {annotateFlatten(this.state.board).map(this.genItem)}
      </div>
    );
  }

  tick(ev) {
    let dy = 0;
    let dx = 0;
    let newBoard = cloneTable(this.state.board);

    switch(ev.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        dy = ev.key === 'ArrowUp' ? 1 : -1;
        break;
      case 'ArrowLeft':
        newBoard = moveGridLeft(this.state.board);
        break;
      case 'ArrowRight':
        console.log(newBoard);
        dx = ev.key === 'ArrowRight' ? 1 : -1;
        break;
      default:
        return;
    }

    console.log(`${dx}:${dy}`);
    const flattened = annotateFlatten(this.state.board);
    // is every element non-null?
    const isOver = flattened.every(e => e.num);

    if (!isOver) {
      const filtered = flattened.filter(e => !e.num);
      const emptyCell = filtered[Math.floor(Math.random() * filtered.length)];

      newBoard[emptyCell.row][emptyCell.col] = new GameTile(2);
    }
    this.setState({board: newBoard});
  }

  render() {
    return (
      <div>
        {this.genTable()}
      </div>);
  }
}

export default Game;
