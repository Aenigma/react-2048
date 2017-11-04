import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import Game from './Game2048';
import { game } from './Game2048/reducers';
import undoable, { ActionCreators } from 'redux-undo';

import GamePresentationWrapper from './Game2048/PresentationWrapper';
import GamePresentation from './Game2048/GamePresentation';

const store = createStore(undoable(game));

const moveAction = (direction) => ({
  type: 'MOVE',
  direction
});

const mapDispatchMover = dispatch => ({
  move: direction => dispatch(moveAction(direction))
});

const mapStateToProps = (state) => {
  const { board } = state.present;
  return {
    board,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0
  };
};
const GameRedux = connect(mapStateToProps, mapDispatchMover)(Game);

const createNewGame = () => {
  store.dispatch({type: 'NEW_GAME'});
  store.dispatch(ActionCreators.clearHistory());
};

let GameActions = ({canUndo, canRedo}) => (
  <div className="center">
    <button onClick={createNewGame}>New Game!</button>
    <button onClick={() => store.dispatch(ActionCreators.undo())} disabled={!canUndo}>Undo</button>
    <button onClick={() => store.dispatch(ActionCreators.redo())} disabled={!canRedo}>Redo</button>
  </div>
);
GameActions = connect(mapStateToProps, null)(GameActions);

const EMPTYBOARD = Array(4).fill(Array(4).fill(null));
ReactDOM.render((
  <div>
    <App heading="2048">
    </App>
    <Provider store={store}>
      <div>
        <GameActions />
        <div className="center">
          <GamePresentationWrapper visible={false} board={EMPTYBOARD}>
            <GamePresentation board={EMPTYBOARD} tabIndex={"-1"} shouldAutoFocus={false}/>
          </GamePresentationWrapper>
          <GameRedux />
        </div>
      </div>
    </Provider>
  </div>
), document.getElementById('root'));
createNewGame();
registerServiceWorker();
