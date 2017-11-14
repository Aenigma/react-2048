import React from 'react';
import IconButton from 'material-ui/IconButton';
import { ContentAddCircleOutline, ContentUndo, ContentRedo } from 'material-ui/svg-icons';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CloseableContainer from '../Utils/CloseableContainer';
import { createComponentList } from '../Utils/component-list';

class NewGame extends React.Component {
  constructor({newgame}) {
    super();
    this.state = { promptOpen: false };

    this.openPrompt = this.openPrompt.bind(this);
    this.closePrompt = this.closePrompt.bind(this);

    const newgameBtn = () => {
      this.setState({promptOpen: false});
      newgame();
    };

    this.actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.closePrompt}
      />,
      <FlatButton
        label="New Game"
        primary={true}
        onClick={newgameBtn}
      />,
    ];
  }

  openPrompt() {
    this.setState({promptOpen: true});
  }

  closePrompt() {
    this.setState({promptOpen: false});
  }

  render() {
    const { promptOpen } = this.state;
    return (
      <IconButton tooltip="New Game" onClick={this.openPrompt} touch={true} tooltipPosition="bottom-center">
        <ContentAddCircleOutline />
        <CloseableContainer open={promptOpen}>
          <Dialog title="New Game" open={promptOpen} actions={this.actions}>
            Do you want to start a new game? This action cannot be undone!
          </Dialog>
        </CloseableContainer>
      </IconButton>
    );
  }
}

export const makeGameActionList = ({canUndo, canRedo, newgame, undo, redo}) => createComponentList([
  <NewGame newgame={newgame}/>,
  <IconButton tooltip={canUndo && "Undo"} onClick={undo} disabled={!canUndo} touch={true} tooltipPosition="bottom-center">
    <ContentUndo />
  </IconButton>,
  <IconButton tooltip={canRedo &&"Redo"} onClick={redo} disabled={!canRedo} touch={true} tooltipPosition="bottom-center">
    <ContentRedo />
  </IconButton>,
], 'gaal');

const GameActions = (props) => (
  <div className="center vcenter">
    {makeGameActionList(props)}
  </div>
);

export default GameActions;
