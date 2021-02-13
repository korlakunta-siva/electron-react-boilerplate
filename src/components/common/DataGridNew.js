import React from "react";
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data } from "react-data-grid-addons";

const selectors = Data.Selectors;

const getColumnsList = datarow => {
  //console.log(datarow);

  // (async function example() {
  //   let driver = await  new webdriver.Builder()
  //   .forBrowser('chrome')
  //   .usingServer('https://korlakunta.com:4444/wd/hub')
  //   .build();

  //   try {
  //     await driver.get('http://www.google.com/ncr');
  //     console.log('Step1a');
  //     await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
  //     console.log('Step1b');
  //     await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  //     console.log('Step1c');
  //   } finally {
  //     await driver.quit();
  //     console.log('Step1d');
  //   }
  //   console.log('Step2');

  // })();

  let columnList = [];
  if (datarow == undefined || datarow.length == 0) return [];
  console.log(Object.keys(datarow));
  columnList = Object.keys(datarow).map(function(key) {
    let dict1 = {};
    //console.log(key);
    Object.assign(
      dict1,
      {
        key: key,
        name: key,
        width: datarow[key]
          ? Math.max(
              datarow[key].toString().length * 7 + 30,
              key.toString().length * 7 + 30
            )
          : 100
      },
      {}
    );

    return dict1;
  });

  columnList = columnList.map(c => ({
    ...c,
    ...defaultColumnProperties
  }));

  //console.log(columnList);
  return columnList;
};

const defaultColumnProperties = {
  sortable: true,
  filterable: true,
  resizable: true,
  editable: true
};

export default class DataGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gridname: props.gridname,
      color: props.color,
      rows: props.initialRows,
      columns: getColumnsList(props.initialRows[0]),
      gridheight: props.gridheight,
      filters: {},
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
    let columns = getColumnsList(gridrows[0]);
    this.setState({
      rows: gridrows,
      columns: columns,
      selectedIndexes: [],
      filters: {}
    });
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
          rowGetter={this.rowGetter}
          rowsCount={this.getSize()}
          minHeight={this.state.gridheight}
          toolbar={
            this.props.enableFilter ? (
              <Toolbar
                enableFilter={this.props.enableFilter ? true : false}
                filterRowsButtonText="Filter"
              >
                {this.props.toolbarButton1 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginRight: "5px", marginLeft: "5px" }}
                    onClick={() => {
                      console.log(this.state.selectedIndexes);
                      if (this.state.selectedIndexes.length == 0) return;
                      let row = this.getRows().filter(
                        (elem, indx) => indx == this.state.selectedIndexes
                      )[0];
                      this.props.OnToolbarButton1(row);
                    }}
                  >
                    <i className="glyphicon glyphicon-refresh" />{" "}
                    {this.props.toobarButton1Text}
                  </button>
                ) : (
                  ""
                )}
                {this.props.toolbarButton2 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginRight: "5px", marginLeft: "5px" }}
                    onClick={() => {
                      console.log(this.state.selectedIndexes);
                      if (this.state.selectedIndexes.length == 0) return;
                      let row = this.getRows().filter(
                        (elem, indx) => indx == this.state.selectedIndexes
                      )[0];
                      this.props.OnToolbarButton2(row);
                    }}
                  >
                    <i className="glyphicon glyphicon-refresh" />{" "}
                    {this.props.toobarButton2Text}
                  </button>
                ) : (
                  ""
                )}
              </Toolbar>
            ) : (
              ""
            )
          }
          onAddFilter={filter => {
            console.log("called addfilter");
            this.handleFilterChange(filter);
          }}
          onClearFilters={() => this.onClearFilters()}
          onGridRowsUpdated={this.onGridRowsUpdated}
          enableCellSelect={true}
          onGridSort={this.handleGridSort}
          rowSelection={
            this.props.showCheckbox == false
              ? ""
              : {
                  showCheckbox: true,
                  enableShiftSelect: false,
                  onRowsSelected: this.onRowsSelected,
                  onRowsDeselected: this.onRowsDeselected,
                  selectBy: {
                    indexes: this.state.selectedIndexes
                  }
                }
          }
        />
      </React.Fragment>
    );
  }
}
