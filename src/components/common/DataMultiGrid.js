import React from "react";
import DataGrid from "./DataGridNew";

export default class DataMultiGrid extends React.Component {
  state = {
    datagrids: []
  };

  constructor(props) {
    super(props);
    this.state = {
      datagrids: this.props.datagrids
    };
  }

  changeGridData = gridsets => {
    this.setState({ datagrids: gridsets });
  };

  onRowSelectFunc = data => {
    console.log("rowselected:", data);
  };

  render() {
    console.log("Displaying Grids", this.state.datagrids);
    return (
      <React.Fragment>
        {this.state.datagrids.map((gridata, indx) => (
          <DataGrid
            key={indx}
            showCheckbox={false}
            initialRows={gridata}
            gridheight={200}
            gridname={"custom sql grid"}
            onRowSelect={this.onRowSelectFunc}
          />
        ))}
      </React.Fragment>
    );
  }
}
