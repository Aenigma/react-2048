import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import undoable, { ActionCreators, excludeAction } from 'redux-undo';
import { Provider, connect } from 'react-redux';

import registerServiceWorker from './registerServiceWorker';
import App from './App';
import { loadState, saveState } from './Game2048/localstorage';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Game2048 from './Game2048';
import GameActions, { makeGameActionList } from './Game2048/GameActions';
import GameMessages from './Game2048/GameMessages';
import { game } from './Game2048/reducers';

import './index.css';

const ugame = undoable(game, {
  filter: excludeAction('@@INIT')
});

const initialAppState = {
  game: ugame(undefined),
  message: '',
};

const messageMachine = (prev, next, action="") => {
  if(next === 'PLAYSTATE_LOSS') {
    return 'LOSS';
  } else if (prev === 'PLAYSTATE_PLAYING' && next === 'PLAYSTATE_VICTORY') {
    return 'VICTORY'
  } else if (action === "@@INIT") {
    return 'TIP';
  } else {
    return '';
  }
};

const message = (state = initialAppState, action = {type: ""}) => {
  const game = ugame(state.game, action);
  const message = messageMachine(state.game.present.playstate, game.present.playstate, action.type);

  return { game, message };
};

const store = createStore(
  message,
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
  const { board } = state.game.present;
  return {
    board,
    canUndo: state.game.past.length > 0,
    canRedo: state.game.future.length > 0
  };
};
const GameRedux = connect(mapStateToProps, mapDispatchMover)(Game2048);
const GameMessagesRedux = connect((state) => {
  const { message } = state;

  return {
    showVictory: message === 'VICTORY',
    showLoss: message === 'LOSS',
    showTip: message === 'TIP',
  };
}, undefined)(GameMessages);
const GameActionsRedux = connect(mapStateToProps, mapDispatchMover)(GameActions);

const makeGameActionListRedux = connect(mapStateToProps, mapDispatchMover)(makeGameActionList);

ReactDOM.render((
  <Provider store={store}>
    <MuiThemeProvider >
      <div>
        <App heading="React 2048"/>
        <GameActionsRedux />
        <GameRedux actions={makeGameActionListRedux()}/>
        <GameMessagesRedux/>
      </div>
    </MuiThemeProvider>
  </Provider>
), document.getElementById('root'));
//createNewGame();
registerServiceWorker();
