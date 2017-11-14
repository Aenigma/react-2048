import { Component, cloneElement, Children } from 'react';

export default class CloseableContainer extends Component {
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
