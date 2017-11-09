import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import undoable, { ActionCreators } from 'redux-undo';
import { Provider, connect } from 'react-redux';

import registerServiceWorker from './registerServiceWorker';
import App from './App';
import { loadState, saveState } from './Game2048/localstorage';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Game2048 from './Game2048';
import GameActions from './Game2048/GameActions';
import { game } from './Game2048/reducers';

import './index.css';


const store = createStore(
  undoable(game),
  loadState(),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
  saveState(store.getState());
});

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

const GameActionsRedux = connect(mapStateToProps, mapDispatchMover)(GameActions);

ReactDOM.render((
  <Provider store={store}>
    <MuiThemeProvider >
      <div>
        <App heading="React 2048"/>
        <GameActionsRedux />
        <GameRedux />
      </div>
    </MuiThemeProvider>
  </Provider>
), document.getElementById('root'));
//createNewGame();
registerServiceWorker();
