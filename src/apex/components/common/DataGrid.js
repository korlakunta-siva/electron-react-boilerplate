import React from "react";
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data } from "react-data-grid-addons";
import {showFile} from "./Utils"

const selectors = Data.Selectors;

export default class DataGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      gridname: props.gridname,
      color: props.color,
      rows: props.initialRows,
      columns: props.columns,
      gridheight: props.gridheight,
      filters: {},
      handlerefresh: props.handlerefresh,
      handlenotesrefesh: props.handlenotesrefesh,
      selectedIndexes: []
    };
    //console.log("Got called constructor on datagrid", props.gridname);
  }

  handleFilterChange = filter => {
    //console.log("Handle Filter Change", filter);
    let newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    this.setState({ filters: newFilters });
  };

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    //console.log("updated", fromRow, toRow, updated);
    this.setState(state => {
      const rows = state.rows.slice();
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    });
  };

  onRowsSelected = rows => {
    let rowIndexes = rows.map(r => r.rowIdx);

    let totalSelected = rowIndexes.length;
    if (totalSelected > 1) {
      return;
    }

    this.setState(
      {
        selectedIndexes: rows.map(r => r.rowIdx)
        //this.state.selectedIndexes.concat(rows.map(r => r.rowIdx))
      },
      () => {
        this.props.onRowSelect(rows);
      }
    );
  };

  onRowsDeselected = rows => {
    let rowIndexes = rows.map(r => r.rowIdx);
    this.setState({
      selectedIndexes: this.state.selectedIndexes.filter(
        i => rowIndexes.indexOf(i) === -1
      )
    });
  };

  handleGridSort = (sortColumn, sortDirection) => {
    //console.log("sorting", sortColumn, sortDirection);
    const comparer = (a, b) => {
      if (sortDirection === "ASC") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else if (sortDirection === "DESC") {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    };

    const rows =
      sortDirection === "NONE"
        ? this.state.rows.slice(0)
        : this.state.rows.sort(comparer);

    this.setState({ rows });
  };

  changeGridData = gridrows => {
    //console.log("Called griddatachange:", gridrows);
    this.setState({ rows: gridrows, selectedIndexes: [], filters: {} });
  };

  changeUserName = username => {
    //console.log("Called griddatachange:", gridrows);
    this.setState({ username: username });
  };

  sortRows = (initialRows, sortColumn, sortDirection) => rows => {
    const comparer = (a, b) => {
      if (sortDirection === "ASC") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else if (sortDirection === "DESC") {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    };
    return sortDirection === "NONE" ? initialRows : [...rows].sort(comparer);
  };

  getRows = () => {
    var newProps = {};
    newProps.filters = this.state.filters;
    newProps.rows = this.state.rows;

    //console.log(newProps, selectors.getRows(newProps));
    return selectors.getRows(newProps);
  };

  rowGetter = rowIdx => {
    let rows = this.getRows();
    return rows[rowIdx];
  };

  getSize = () => {
    //console.log("Rows count:", this.getRows().length, this.getRows());
    return this.getRows().length;
  };

  onClearFilters = () => {
    this.setState({ filters: {}, selectedIndexes: [] });
  };

  handleRefresh = () => {
    //this.setState({ filters: {}, selectedIndexes: [] });
    //alert('Called Handle Refresh');
    this.state.handlenotesrefesh()
  };

  handleStart = () => {
    //this.setState({ filters: {}, selectedIndexes: [] });
    //alert('Called Handle Start');
    //alert(this.state.selectedIndexes);
    let row = this.getRows().filter( (elem,indx)=> indx == this.state.selectedIndexes)[0];
    //alert(row.encid);
    this.handleTimerToggle(row.encid, 'notestart');
  };

  handleStop = () => {
    //this.setState({ filters: {}, selectedIndexes: [] });
    let row = this.getRows().filter( (elem,indx)=> indx == this.state.selectedIndexes)[0];
    //alert(row.encid);
    this.handleTimerToggle(row.encid, 'notestop');
  };

  handleDocReady = () => {
    //this.setState({ filters: {}, selectedIndexes: [] });
    let row = this.getRows().filter( (elem,indx)=> indx == this.state.selectedIndexes)[0];
    //alert(row.encid);
    this.handleTimerToggle(row.encid, 'docready');
  };

  handleViewPrior = () => {
    //this.setState({ filters: {}, selectedIndexes: [] });
    let row = this.getRows().filter( (elem,indx)=> indx == this.state.selectedIndexes)[0];
    //alert(row.encid);
    window.open("https://korlakunta.com:86/visitsummary/?encid=" + row.encid, "_blank") //to open new page
    //this.handleTimerToggle(row.encid, 'docready');
  };

 handleErrors = (response) => {
    if (!response.ok) {
        alert(response.statusText);
    } else {
        return response;
    }
}

  handleStatement = () => {
    //this.setState({ filters: {}, selectedIndexes: [] });
    let row = this.getRows().filter( (elem,indx)=> indx == this.state.selectedIndexes)[0];
    console.log(row);
    fetch("https://192.168.21.199:8040/statement?patid=" + row.PatientId.toString())
        .then(this.handleErrors)
        .then(r => r.blob())
        .then(showFile);
  };  

  
  handleTimerToggle = (encId, actiontype) => {
    var data = {
      "encid": encId,
      "action": actiontype
    }

    var headers = {
      "Content-Type": "application/json"
    }

    let save_env_action_url =
    "https://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%200%20 exec apex.pn.apexsp_saveEnvAction ";

    let saveActionURL = save_env_action_url + '@encounterid=' + encId + ", @actiontype='" + actiontype +"' , @action_by='" + this.state.username+"'" ;
    //alert(saveActionURL);

    fetch(
      saveActionURL,
          {
            method: "GET",
            headers: headers,
            //body: JSON.stringify(data)
          }
      )
        .then(response => {
          if (response.status !== 200) {
            return this.setState({
              placeholder: "Something went wrong in getting data"
            });
          }
          return response.json();
        })
        .then(data => {
          try {
          console.log(data);
          let dframe = data["frame0"];
          let myObj = JSON.parse(dframe);
          data = myObj["rows"];
          //this.setState({ exceptions: data, loaded: true }, () => {
            // console.log("Changed state", this.state.exceptions.length);
          //  this.exceptionsGridElement.current.changeGridData(
           //   this.state.exceptions
           // );
          //});
          this.state.handlerefresh();
         
        }catch(ex) {
          alert(ex.message);
        }

        });

    }

     RowRenderer = ({ renderBaseRow, ...props }) => {

      let row = this.state.rows[props.idx];
      const color = row.isdocready & row.isdocready == 1 ? "green" : "black";
      return <div style={{ color : color }}>{renderBaseRow(props)}</div>;
      //return renderBaseRow(props)
    };


  render() {
    // console.log(
    //   "Rending datagrid: ",
    //   this.state.gridname,
    //   this.state.rows.length,
    //   this.props
    // );
    //this.setState({ rows: this.props.initialRows });
    //const [rows, setRows] = useState(this.propsinitialRows);

    //const rowText = this.state.selectedIndexes.length === 1 ? "row" : "rows";

    return (
      <React.Fragment>
        <ReactDataGrid
          columns={this.state.columns}
          width={400}
          rowGetter={this.rowGetter}
          rowsCount={this.getSize()}
          minHeight={this.state.gridheight}
          toolbar={
            <Toolbar enableFilter={true} filterRowsButtonText="Filter" style={{ marginRight: 'auto' }} >
               <React.Fragment>
                { this.props.toolbarStatement ? 
                   <button type="button" className="btn btn-primary" style={{ marginRight: '5px' , marginLeft: '5px' }} onClick={ () => {
                    let row = this.getRows().filter( (elem,indx)=> indx == this.state.selectedIndexes)[0];
                     this.props.OnToolbarStatement(row)
                   }}>
                     <i className="glyphicon glyphicon-refresh" /> Statement
                   </button>
                : '' }
                                { this.props.toolbarStatement2 ? 
                   <button type="button" className="btn btn-secondary" style={{ marginRight: '5px' , marginLeft: '5px' }} onClick={this.handleStatement}>
                     <i className="glyphicon glyphicon-refresh" /> Statement2
                   </button>
                : '' }
            </React.Fragment>
              </Toolbar>
          }
          onAddFilter={filter => {
            console.log("called addfilter");
            this.handleFilterChange(filter);
          }}
          onClearFilters={() => this.onClearFilters()}
          onGridRowsUpdated={this.onGridRowsUpdated}
          enableCellSelect={true}
          onGridSort={this.handleGridSort}
          rowRenderer={this.RowRenderer}
          rowSelection={{
            showCheckbox: true,
            enableShiftSelect: false,
            onRowsSelected: this.onRowsSelected,
            onRowsDeselected: this.onRowsDeselected,
            selectBy: {
              indexes: this.state.selectedIndexes
            }
          }}
        />
      </React.Fragment>
    );
  }
}
