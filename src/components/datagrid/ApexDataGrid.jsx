import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
//import 'ag-grid-enterprise';
import './App.css';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import GridComponents from './GridComponents';
import BtnCellRenderer from './BtnCellRenderer';
import Button from '@material-ui/core/Button';

const ApexDataGrid = (props) => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columnsInit, setColumnsInt] = useState(true);

  const [gridData, setgridData] = React.useState({ ...props.gridData });

  const [forceRefresh, setForceRefresh] = useState(false);

  const frameworkComponents = {
    simpleEditor: GridComponents.SimpleEditor,
    asyncValidationEditor: GridComponents.AsyncValidationEditor,
    autoCompleteEditor: GridComponents.AutoCompleteEditor,
    agDateInput: GridComponents.MyDatePicker,
    dateEditor: GridComponents.DateEditor,
    actionsRenderer: GridComponents.ActionsRenderer,
    addRowStatusBar: GridComponents.AddRowStatusBar,
  };

  useEffect(() => {
    if (forceRefresh) {
      gridApi.refreshCells({ force: true });
      setForceRefresh(false);
    }
  }, [forceRefresh]);

  React.useEffect(() => {
    console.log('PROPS CHANGED', props.gridData);

    if (props.gridData == undefined) return;

    if (props.gridData.length > 0) {
      let firstrow = props.gridData[0];
      let columnsToDisplay = 5;
      if (props.NumColumnsToShow) {
        columnsToDisplay = NumColumnsToShow;
      }
      if (props.ShowAllColumns) {
        columnsToDisplay = Object.keys(firstrow).length;
      }
      if (props.colNum) {
        columnsToDisplay = props.colNum;
      }
      const cols = Object.keys(firstrow)
        .filter((row, indx) => {
          return (
            !row.toLowerCase().startsWith('hide_') && indx <= columnsToDisplay
          );
        })
        .map((row) => {
          let colrow = {
            field: row,
          };
          return colrow;
        });

      cols[0]['width'] = 150;
      cols[0]['rowDrag'] = true;
      cols[0]['headerCheckboxSelection'] = true;
      cols[0]['checkboxSelection'] = true;

      if (props.buttonLabel) {
        cols.splice(2, 0, {
          field: 'file',
          cellRenderer: 'btnCellRenderer',
          cellRendererParams: {
            btnLabel: props.buttonLabel,
            clicked: function (rowdata) {
              props.onImageView(rowdata);
            },
          },
        });
      }

      if (props.button2Label) {
        cols.splice(1, 0, {
          field: 'file',
          cellRenderer: 'btnCellRenderer',
          cellRendererParams: {
            btnLabel: props.button2Label,
            clicked: function (rowdata) {
              props.onButton2Callback(rowdata, props.gridname);
            },
          },
        });
      }

      if (props.button3Label) {
        cols.splice(1, 0, {
          field: 'log',
          cellRenderer: 'btnCellRenderer',
          cellRendererParams: {
            btnLabel: props.button3Label,
            clicked: function (rowdata) {
              props.onButton3Callback(rowdata, props.gridname);
            },
          },
        });
      }

      if (gridApi && columnsInit == true) {
        console.log('Calling setColumns');
        setColumns(cols);
      }

      setRowData(props.gridData);

      if (gridApi && columnsInit == true) {
        console.log('Calling sizeColumnsToFit');
        gridApi.sizeColumnsToFit();
        setColumnsInt(false);
      }
    } else {
      setRowData([]);
    }
  }, [props.gridData]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const setAutoHeight = () => {
    console.log('CALLED Auto HEIGHT', gridApi);
    gridApi.setDomLayout('autoHeight');
    // auto height will get the grid to fill the height of the contents,
    // so the grid div should have no height set, the height is dynamic.
    //document.querySelector('#myGrid').style.height = '';
  };

  const setFixedHeight = () => {
    console.log('CALLED FIXED HEIGHT', gridApi);
    // we could also call setDomLayout(null or undefined) here as normal is the default
    gridApi.setDomLayout('normal');
    // when auto height is off, the grid ahs a fixed height, and then the grid
    // will provide scrollbars if the data does not fit into it.
    //document.querySelector('#myGrid').style.height = '400px';
  };

  let divHeight = '550px';
  if (props.divHeight) {
    divHeight = props.divHeight;
  }

  return (
    <React.Fragment>
      {props.gridTitle ? `${props.gridTitle}` : ''} {'  '}
      <Button variant="contained" color="primary" onClick={props.onRefresh}>
        Refresh
      </Button>
      <Button variant="contained" color="primary" onClick={setAutoHeight}>
        Auto Height
      </Button>
      <Button variant="contained" color="primary" onClick={setFixedHeight}>
        Fixed Height
      </Button>
      {props.gridArgsText ? `${props.gridArgsText}` : ''}
      <div id="myGrid">
        <div className="test-container">
          <div className="test-header">
            <div
              style={{
                height: divHeight,
                width: '100%',
              }}
              className="ag-theme-balham test-grid"
            >
              <AgGridReact
                rowData={rowData}
                onGridReady={onGridReady}
                domLayout={props.domHeight ? props.domHeight : 'normal'}
                defaultColDef={{
                  initialWidth: 100,
                  sortable: true,
                  resizable: true,
                  filter: true,
                  editable: true,
                }}
                rowSelection="single"
                rowDragManaged={true}
                suppressMoveWhenRowDragging={true}
                animateRows={true}
                applyColumnDefOrder={true}
                onSelectionChanged={props.onRowSelected}
                frameworkComponents={{
                  btnCellRenderer: BtnCellRenderer,
                }}
              >
                {columns.map((column) => (
                  <AgGridColumn {...column} key={column.field} />
                ))}
              </AgGridReact>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ApexDataGrid;
