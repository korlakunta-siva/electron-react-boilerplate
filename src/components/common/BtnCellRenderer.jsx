import React, { Component } from 'react';

export default class BtnCellRenderer extends Component {
  constructor(props) {
    super(props);
    this.btnClickedHandler = this.btnClickedHandler.bind(this);
  }
  btnClickedHandler() {
    console.log('Clicked', this.props.data);
    this.props.clicked(this.props.data);
  }
  render() {
    return (
      <button onClick={this.btnClickedHandler}>{this.props.btnLabel}</button>
    );
  }
}
