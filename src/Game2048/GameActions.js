import React from 'react';
import IconButton from 'material-ui/IconButton';
import { ContentAddCircleOutline, ContentUndo, ContentRedo } from 'material-ui/svg-icons';


const GameActions = ({canUndo, canRedo, newgame, undo, redo}) => (
  <div className="center vcenter">
    <IconButton tooltip="New Game" onClick={newgame} touch={true} tooltipPosition="bottom-center">
      <ContentAddCircleOutline />
    </IconButton>
    <IconButton tooltip={canUndo && "Undo"} onClick={undo} disabled={!canUndo} touch={true} tooltipPosition="bottom-center">
      <ContentUndo />
    </IconButton>
    <IconButton tooltip={canRedo &&"Redo"} onClick={redo} disabled={!canRedo} touch={true} tooltipPosition="bottom-center">
      <ContentRedo />
    </IconButton>
  </div>
);

export default GameActions;
