import React, { useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data, Filters } from "react-data-grid-addons";
import ExampleContextMenu from "../unused/ExampleContextMenu";
import { Menu } from "react-data-grid-addons";
import {showFile} from "../common/Utils"

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
    fetch("/statement?patid=" + rowId.toString())
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

    const values = rows.map(r => r[columnId]);
    const arr = values.filter((item, i, a) => { return i === a.indexOf(item); }).filter(el => el != null);
    let temp =  []
    for(let i of arr)
        i && temp.push(i);
    return temp;

   // return [ ... new Set(rows.map(r => r[columnId])) ];

   // return rows
   //    .map(r => r[columnId]).distinct();
//         .filter((item, i, a) => {
//            return i === a.indexOf(item);
//         });
}

function getRows(rows, filters) {
    return selectors.getRows({ rows, filters });
}

function ClaimsDataGrid({ rows, columnstoshow }) {
    const [filters, setFilters] = useState({});
    const [setRows] = useState(rows);
    const filteredRows = getRows(rows, filters);
    const columns =  columnstoshow.map(c => ({ ...c, ...defaultColumnProperties }));
    return (
        <div className="column">
        <h4 className="subtitle"><strong>{filteredRows.length}</strong></h4>
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
            />
            </div>
    );
}


export default ClaimsDataGrid;