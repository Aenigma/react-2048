import React, { Component, cloneElement, Children } from 'react';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';

class CloseableContainer extends Component {
  constructor({open = false}) {
    super();
    this.state = { open };
    this.close = this.close.bind(this);
  }

  componentWillReceiveProps({open}) {
    if(open !== this.state.open) {
      this.setState({open});
    }
  }

  close() {
    this.setState({open: false});
  }

  render() {
    const { children } = this.props;
    const { open } = this.state;
    const onRequestClose = this.close;

    return cloneElement(Children.only(children), { open, onRequestClose });
  }
}
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
