import React, { Component } from 'react'
import { editors } from "react-data-grid"; 
import moment from 'moment';
import {PropTypes} from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import ReactDOM from "react-dom";

//renders react datetime component
export class DateEditor extends editors.EditorBase {
  constructor(props) {
    super(props);
    this.state = {
      date: moment()
    }
  }

  getInputNode() {
    return ReactDOM.findDOMNode(this)
  }

  getValue() {
    var updated = {}
    updated[this.props.column.key] = this.state.date
    return updated
  };

  onClick() {
    this.getInputNode().focus();
  }

  onDoubleClick() {
    this.getInputNode().focus();
  }

  handleDate(date) {
    this.setState({
      date:date
    })
  }

  render(){
    return (
      <div style={{"position":"fixed", "zIndex":"10000000000"}}>
        <DatePicker
        onChange={this.handleDate}
      />
      </div>
    );
  }
}



export class DateFormater extends Component {
  static propTypes = {
    value: PropTypes.string
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value;
  }

  render() {
    let value = this.props.value;
    return <div title={value.format("L")}>{value.format("L")}</div>;
  }
} 