import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FlipMove from 'react-flip-move';
import { annotateFlatten } from './gamelogic';

const colors = ['#FF', '#AA9988', '#A86D00', '#228899', '#3F757F', '#775555',
'#885511', '#664400', '#4C473D', '#664200', '#882211', '#114488', '#2B2B2B',
'#332100', '#101111', '#001122'];

const genItem = (item) => {
  let inner;
  let key;
  let color = null;

  if (item.num) {
    key = item.id;
    inner = item.num;
    color = colors[Math.floor(Math.log2(inner))];
  } else {
    //key = uuid();
    key = `${item.row}:${item.col}`;
    inner = null;
  }

  return (
    <div className="Game-item" key={key}
      data-game-numeral={inner} style={{backgroundColor: color}}>
      {inner}
    </div>);
};

class GamePresentation extends Component {

  componentDidMount() {
    if(this.props.shouldAutoFocus) {
      ReactDOM.findDOMNode(this).focus();
    }
  }

  render() {
    const {board, tabIndex, shouldAutoFocus, ...other} = this.props;

    return (
      <FlipMove {...other} className="Game" tabIndex={tabIndex}
        duration={125} easing="ease" leaveAnimation="none">
        {annotateFlatten(board).map(genItem)}
      </FlipMove>);
  }
}

export default GamePresentation;
