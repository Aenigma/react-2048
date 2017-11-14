import React from 'react';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';

import CloseableContainer from '../Utils/CloseableContainer';

const tips = [
  "You can use a gamepad to play! Connect one and try it out!",
  "Try to get the highest value into the corner!",
];
const generateTip = () => (tips[Math.floor(Math.random() * tips.length)]);

const GameMessages = ({showVictory = false, showLoss = false, showTip = false}) => (
  <div>
    <CloseableContainer open={showTip}>
      <Snackbar open={showTip} message={generateTip()} autoHideDuration={4000} />
    </CloseableContainer>
    <CloseableContainer open={showVictory}>
      <Dialog title="Victory!" open={showVictory}>
        Hey, you got 2048! Good job!
      </Dialog>
    </CloseableContainer>
    <CloseableContainer open={showLoss}>
      <Dialog title="You lose!" open={showLoss}>
        Looks like you can't move anymore!
      </Dialog>
    </CloseableContainer>
  </div>
);

export default GameMessages;
