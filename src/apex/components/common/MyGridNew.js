import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data, Filters } from "react-data-grid-addons";
import { Menu } from "react-data-grid-addons";

const { ContextMenuTrigger } = Menu;

const COLUMN_WIDTH = 140;

const defaultColumnProperties = {
    sortable: false,
    filterable: true
};


const selectors = Data.Selectors;
const {
    NumericFilter,
    AutoCompleteFilter,
    MultiSelectFilter,
    SingleSelectFilter
} = Filters;

const columns1 = [
    {
        key: "id",
        name: "ID",
        filterRenderer: NumericFilter,
        frozen: true,
        resizable: false,
        width: 100
    },
    {
        key: "name",
        name: "Name",
        filterRenderer: AutoCompleteFilter,
        sortDescendingFirst: false,
        frozen: false,
        resizable: true,
        width: 225

    },
    {
        key: "PatientId",
        name: "PatientID",
        editable: true,
        resizable: false,
        width: 100
    },
    {
        key: "dob",
        name: "Birth Date",
        frozen: false,
        resizable: false,
        width: 100
    }
    ,
    {
        key: "phone",
        name: "Phone",
        frozen: false,
        resizable: false,
        width: 125
    }
    ,
    {
        key: "city",
        name: "City",
        frozen: false,
        width: 150
    }
    ,
    {
        key: "address",
        name: "Address",
        frozen: false,
        width: 150
    }
    ,
    {
        key: "state",
        name: "State Zip",
        frozen: false,
        width: 125
    }

].map(c => ({ ...c, ...defaultColumnProperties }));


function showFile(blob){
    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    var newBlob = new Blob([blob], { type: "application/pdf" })

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
    }

    // For other browsers: 
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement('a');
    link.href = data;
    link.download = "file.pdf";
    link.click();
    setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
    }, 100);
}


const deleteRow = rowIdx => rows => {
    const nextRows = [...rows];
    nextRows.splice(rowIdx, 1);
    return nextRows;
};

const insertRow = rowIdx => rows => {
    const newRow = createFakeRow("-");
    const nextRows = [...rows];
    nextRows.splice(rowIdx, 0, newRow);
    return nextRows;
};


const sortRows = (inputrows, sortColumn, sortDirection) => rows => {
    const comparer = (a, b) => {
        if (sortDirection === "ASC") {
            return a[sortColumn] > b[sortColumn] ? 1 : -1;
        } else if (sortDirection === "DESC") {
            return a[sortColumn] < b[sortColumn] ? 1 : -1;
        }
    };
    return sortDirection === "NONE" ? inputrows : [...rows].sort(comparer);
};

function handleErrors(response) {
    if (!response.ok) {
        alert(response.statusText);
    } else {
        return response;
    }
}


function myAction1Callback (rowId)  {
    console.log(rowId);
    fetch("http://localhost:9041/statement?patid=" + rowId.toString())
        .then(handleErrors)
        .then(r => r.blob())
        .then(showFile);
    //alert(rowId);
};

const NameActions = [
    {
        icon: <span className="glyphicon glyphicon-remove" />,
        callback: () => {
            alert("Deleting");
        }
    },
    {
        icon: "glyphicon glyphicon-link",
        actions: [
            {
                text: "Option 1",
                callback: (id) => {
                    alert("Option 1 clicked" + id.toString());
                    myAction1Callback(rowData);
                }
            },
            {
                text: "Option 2",
                callback: () => {
                    alert("Option 2 clicked");
                }
            }
        ]
    }
];
function getCellActions2(column, row) {
    const cellActions = {
        id: NameActions
    };
    return cellActions[column.key];
}

function getCellActions(column, row, state) {

    if (column.key === 'id') {
        return [
            {
                icon: <span className="glyphicon glyphicon-link" />,
                callback: (id) => {
                    //alert("Opening Statement for: " + row.id.toString());
                    myAction1Callback(row.id);
                }
            },
        ];
    }
}


function getCellActions20(column, row, state) {

    if (column.key === 'id') {
        return [
            {

                icon: "glyphicon glyphicon-link",
                actions: [
                    {
                        text: "Statement",
                        callback: (id) => {
                            //alert("Opening Statement for: " + row.id.toString());
                            myAction1Callback(row.id);
                        }
                    }
                ]
            }
        ];
    }
}

const handleFilterChange = filter => filters => {
    const newFilters = { ...filters };
    if (filter.filterTerm) {
        newFilters[filter.column.key] = filter;
    } else {
        delete newFilters[filter.column.key];
    }
    return newFilters;
};



function getValidFilterValues(rows, columnId) {
    return rows
        .map(r => r[columnId])
        .filter((item, i, a) => {
            return i === a.indexOf(item);
        });
}

function getRows(rows, filters) {
    return selectors.getRows({ rows, filters });
}

function onRowsSelected (rows) {
    console.log('selected',rows, selectedIndexes);
    // setSelectedIndexes( prevstate => {
    //   prevstate.concat(
    //     rows.map(r => r.rowIdx)
    //   )
    // });
  };

 function onRowsDeselected ( rows ) {
    console.log('Desected',rows, selectedIndexes);
    // let rowIndexes = rows.map(r => r.rowIdx);
    // this.setState({
    //   selectedIndexes: this.state.selectedIndexes.filter(
    //     i => rowIndexes.indexOf(i) === -1
    //   )
    // });
  };




function MyGrid({ rows, columnstoshow }) {
    const [filters, setFilters] = useState({});
    const [selectedIndexes, setSelectedIndexes] = useState([]);
    const [selectedPatient, setselectedPatient] = useState({});
    //const [setSelectedIndexes] = useState(selectedIndexes);
    const [setRows] = useState(rows);
    const filteredRows = getRows(rows, filters);
    const columns =  columnstoshow;
    useEffect(() => {
        console.log(selectedIndexes);
        console.log(selectedPatient);
      }, [selectedIndexes, selectedPatient]);
      //<strong>{filteredRows.length}</strong>
    return (
        <div className="column">
        <p >{selectedPatient.name}</p>
        <p >{selectedPatient.dob}</p>
        <p >{selectedPatient.address}</p>
        <ReactDataGrid
            columns={columns}
            rowGetter={i => filteredRows[i]}
            rowsCount={filteredRows.length}
            minHeight={300}
            getCellActions={getCellActions}
            contextMenu={
                <ExampleContextMenu
                    onRowDelete={(e, { rowIdx }) => setRows(deleteRow(rowIdx))}
                    onRowInsertAbove={(e, { rowIdx }) => setRows(insertRow(rowIdx))}
                    onRowInsertBelow={(e, { rowIdx }) => setRows(insertRow(rowIdx + 1))}
                />
            }
            RowsContainer={ContextMenuTrigger}
            onGridSort={(sortColumn, sortDirection) =>
                setRows(sortRows(rows, sortColumn, sortDirection))
            }
            toolbar={<Toolbar enableFilter={true} />}
            onAddFilter={filter => setFilters(handleFilterChange(filter))}
            onClearFilters={() => setFilters({})}
            getValidFilterValues={columnKey => getValidFilterValues(rows, columnKey)}
            rowSelection={{
                showCheckbox: true,
                enableShiftSelect: false,
                onRowsSelected : (rows) => {
                   console.log(rows);
                   if (rows.length == 1) {
                   setSelectedIndexes([rows[0].rowIdx]);
                   setselectedPatient(rows[0].row);
                   }
                   //setSelectedIndexes(selectedIndexes.concat(
                   // rows.map(r => r.rowIdx))
                  
                },
                onRowsDeselected:  (rows) => {
                    console.log(rows);
                    setselectedPatient({});
                    let rowIndexes = rows.map(r => r.rowIdx);
                    setSelectedIndexes(selectedIndexes.filter(
                        i => rowIndexes.indexOf(i) === -1
                      ))
                 },
                selectBy: {
                  indexes: selectedIndexes
                }
              }}
            />
            </div>
    );
}


export default MyGrid;  