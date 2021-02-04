import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
// import "ag-grid-enterprise";
// import "./style.css";

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const colDefsAthleteExcluded = [
  { field: 'age', rowData: true, checkboxSelection: true },
  { field: 'country' },
  { field: 'sport' },
  { field: 'year' },
  { field: 'date' },
  { field: 'gold' },
  { field: 'silver' },
  { field: 'bronze' },
  { field: 'total' },
];

const colDefsAthleteIncluded = [
  { field: 'athlete' },
  { field: 'age' },
  { field: 'country' },
  { field: 'sport' },
  { field: 'year' },
  { field: 'date' },
  { field: 'gold' },
  { field: 'silver' },
  { field: 'bronze' },
  { field: 'total' },
];

const DicomSetView = (props) => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [columns, setColumns] = useState(colDefsAthleteExcluded);

  const [dicomData, setDicomData] = React.useState({ ...props.dicomData });

  const [forceRefresh, setForceRefresh] = useState(false);

  useEffect(() => {
    if (forceRefresh) {
      gridApi.refreshCells({ force: true });
      setForceRefresh(false);
    }
  }, [forceRefresh]);

  React.useEffect(() => {
    //setUser(props.user);
    //console.log("PROPS CHANGED", dicomData);

    console.log('PROPS CHANGED 000', props.dicomData);

    if (props.dicomData.length > 0) {
      let firstrow = props.dicomData[0];
      const cols = Object.keys(firstrow)
        .filter((row) => {
          return (
            !row.toLowerCase().startsWith('patientname') &&
            !row.toLowerCase().startsWith('koseri')
          );
        })
        .map((row) => {
          let colrow = {
            field: row,
          };

          if (row.toLowerCase().includes('seriesinstance')) {
            colrow['width'] = 375;
          }

          if (row.toLowerCase().includes('file')) {
            colrow['width'] = 100;
          }
          if (row.toLowerCase().includes('studyinstance')) {
            colrow['width'] = 400;
          }
          if (row.toLowerCase().includes('sopclass')) {
            colrow['width'] = 175;
          }
          if (row.toLowerCase().includes('sopinstance')) {
            colrow['width'] = 400;
          }
          if (row.toLowerCase().includes('moda')) {
            colrow['width'] = 50;
          }
          if (row.toLowerCase().includes('displayname')) {
            colrow['width'] = 150;
          }
          return colrow;
        });
      cols[0]['width'] = 150;
      cols[0]['rowDrag'] = true;
      cols[0]['headerCheckboxSelection'] = true;
      cols[0]['checkboxSelection'] = true;

      setColumns(cols);

      console.log(cols);
      setRowData(props.dicomData);
    } else {
      setRowData([]);
    }
  }, [props.dicomData]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    const httpRequest = new XMLHttpRequest();
    httpRequest.open(
      'GET',
      'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json'
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        setRowData(JSON.parse(httpRequest.responseText));
      }
    };
  };

  const onBtExcludeAthleteColumn = () => {
    setColumns(colDefsAthleteExcluded);
  };

  const onBtIncludeAthleteColumn = () => {
    setColumns(colDefsAthleteIncluded);
  };

  const setHeaderNames = () => {
    const newColumns = gridApi.getColumnDefs();
    newColumns.forEach((newColumn, index) => {
      newColumn.headerName = 'C' + index;
    });
    setColumns(newColumns);
  };

  const removeHeaderNames = () => {
    const newColumns = gridApi.getColumnDefs();
    newColumns.forEach((newColumn, index) => {
      newColumn.headerName = undefined;
    });
    setColumns(newColumns);
  };

  //console.log(props.dicomData);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className="test-container">
        <div className="test-header">
          <div
            style={{
              height: '550px',
              width: '100%',
            }}
            className="ag-theme-balham test-grid"
          >
            <AgGridReact
              rowData={rowData}
              onGridReady={onGridReady}
              defaultColDef={{
                initialWidth: 100,
                sortable: true,
                resizable: true,
                filter: true,
              }}
              rowSelection="single"
              rowDragManaged={true}
              suppressMoveWhenRowDragging={true}
              animateRows={true}
              applyColumnDefOrder={true}
              onSelectionChanged={props.onRowSelected}
            >
              {columns.map((column) => (
                <AgGridColumn {...column} key={column.field} />
              ))}
            </AgGridReact>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DicomSetView;

{
  /* <span className="crud-label">Add Column:</span>
          <button onClick={onBtIncludeAthleteColumn}>
            Include Athlete Column
          </button>
          <br />
          <span className="crud-label">Remove Column:</span>
          <button onClick={onBtExcludeAthleteColumn}>
            Exclude Athlete Column
          </button>
          <br />
          <span className="crud-label">Update Columns:</span>
          <button onClick={setHeaderNames}>Set Header Names</button>
          <button onClick={removeHeaderNames}>Remove Header Names</button> */
}
