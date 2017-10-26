import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import './Game.css'

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: Array(4).fill(Array(4).fill(null))
    };
  }

  genItem(item) {
    let inner = (<div className="Game-numeral"/>);
    let key = Math.random() * 1000000000;
    if (item) {
      inner = (
        <div className="Game-numeral">
          item.num
        </div>);
    }

    return (
      <div className="Game-item" key={key}>
        <div className="Game-numeral">
          {inner}
        </div>
      </div>);
  }

  flattened() {
    this.state.board.map()
    return [].concat.apply([], this.state.board);
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
    const isOver = flattened.every(e => e);

    if(!isOver) {

    }

    console.log("TICK!");
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
