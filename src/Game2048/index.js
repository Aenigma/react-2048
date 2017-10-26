import React, { Component } from 'react';
import uuid from 'uuid/v4';
//import PropTypes from 'prop-types';
import './Game.css'

class Game extends Component {
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

  flattened() {
    const copiedBoard = this.state.board.map((row, i) => {
      return row.map((col, j) => {
        let ncol = Object.assign({
          row: i,
          col: j
        }, col);
        return ncol;
      });
    });
    return [].concat.apply([], copiedBoard);
  }

  genTable() {
    return (
      <div className="Game">
        {this.flattened().map(this.genItem)}
      </div>
    );
  }

  tick() {
    const flattened = this.flattened();
    // is every element non-null?
    const isOver = flattened.every(e => e.num);

    if(!isOver) {
      const newBoard = this.state.board.map(arr => arr.slice());
      const filtered = flattened.filter(e => !e.num);
      const emptyCell = filtered[Math.floor(Math.random() * filtered.length)];

      newBoard[emptyCell.row][emptyCell.col] = {id: uuid(), num: 2};
      this.setState({board: newBoard});
    }
  }

  render() {
    return (
      <div>
        {this.genTable()}
        <button onClick={this.tick}>TICK</button>
      </div>);
  }
}

export default Game;
