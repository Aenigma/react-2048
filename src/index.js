import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import undoable, { ActionCreators } from 'redux-undo';
import { Provider, connect } from 'react-redux';

import registerServiceWorker from './registerServiceWorker';
import App from './App';

import Game2048 from './Game2048';
import { game } from './Game2048/reducers';

import './index.css';


const store = createStore(undoable(game));

const createNewGame = () => {
  store.dispatch({type: 'NEW_GAME'});
  store.dispatch(ActionCreators.clearHistory());
};

const moveAction = (direction) => ({
  type: 'MOVE',
  direction
});

const mapDispatchMover = dispatch => ({
  move: direction => dispatch(moveAction(direction)),
  undo: () => store.dispatch(ActionCreators.undo()),
  redo: () => store.dispatch(ActionCreators.redo()),
  newgame: () => createNewGame(),
});

const mapStateToProps = (state) => {
  const { board } = state.present;
  return {
    board,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0
  };
};
const GameRedux = connect(mapStateToProps, mapDispatchMover)(Game2048);

let GameActions = ({canUndo, canRedo}) => (
  <div className="center">
    <button onClick={createNewGame}>New Game!</button>
    <button onClick={() => store.dispatch(ActionCreators.undo())} disabled={!canUndo}>Undo</button>
    <button onClick={() => store.dispatch(ActionCreators.redo())} disabled={!canRedo}>Redo</button>
  </div>
);
GameActions = connect(mapStateToProps, null)(GameActions);

ReactDOM.render((
  <div>
    <App heading="2048"/>
    <Provider store={store}>
      <div>
        <GameActions />
        <GameRedux />
      </div>
    </Provider>
  </div>
), document.getElementById('root'));
createNewGame();
registerServiceWorker();
