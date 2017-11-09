import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import logo from './logo.svg';
import './App.css';

const AppLogo = (
  <img src={logo} className="App-logo" alt="logo" />
);

const GithubLink = (
  <IconButton iconClassName="fa fa-github" />
);

const appStyle = {
  backgroundColor: '#222'
};

const App = ({heading}) => (
  <AppBar title={heading}
    style={appStyle}
    showMenuIconButton={true}
    iconElementLeft={AppLogo}
    iconElementRight={GithubLink}
    //iconClassNameRight="fa fa-github"
  />
);

export default App;
