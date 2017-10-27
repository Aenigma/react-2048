import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Game from './Game2048';

ReactDOM.render((
  <div>
    <App heading="2048">
    </App>
    <div className="center">
      <Game visible={false} tabIndex={null}/>
      <Game />
    </div>
  </div>
), document.getElementById('root'));
registerServiceWorker();
