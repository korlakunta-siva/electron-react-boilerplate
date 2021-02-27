import { OLYMPIC_SPORTS, OLYMPIC_COUNTRIES } from "./olympic_lists.js";

const datasaverfunc_athletdata = (row) => {
  console.log("GOT IN DATASAVERFUNC UPDATE ON ROW:", row.data);
};

export const getColumnDefs = (row) => {
    const columnList = [];
    console.log(row);

    Object.keys(row).forEach(element => {
      console.log(element);
      switch(element) {
        case 'id' :
          console.log("GOT Field: " + element);
          break;

          case 'athlete' :
            columnList.push(  {
              headerName: "Athlete",
              field: "athlete",
              cellEditor: "simpleEditor"
            });
            break;
          
          case 'sport' :
            columnList.push( 
            {
              headerName: "Sport",
              field: "sport",
              cellEditor: "asyncValidationEditor",
              cellEditorParams: {
                condition: value => OLYMPIC_SPORTS.includes(value)
              }
            });
            break;
          case 'country' :
              columnList.push(             
            {
              headerName: "Country",
              editable: true,
              field: "country",
              cellEditor: "autoCompleteEditor",
              cellEditorParams: {
                options: OLYMPIC_COUNTRIES
              }
            });
            break;
            case 'date' :
              columnList.push(             
            {
              headerName: "Date",
              field: "date",
              cellEditor: "dateEditor",
              filter: "agDateColumnFilter",
              filterParams: {
                clearButton: true,
                suppressAndOrCondition: true,
                comparator: function(filterLocalDateAtMidnight, cellValue) {
                  var dateAsString = cellValue;
                  var dateParts = dateAsString.split("/");
                  var cellDate = new Date(
                    Number(dateParts[2]),
                    Number(dateParts[1]) - 1,
                    Number(dateParts[0])
                  );
                  if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                    return 0;
                  }
                  if (cellDate < filterLocalDateAtMidnight) {
                    return -1;
                  }
                  if (cellDate > filterLocalDateAtMidnight) {
                    return 1;
                  }
                }
              }
            });
            break;
        default: 
        console.log("GOT Field: DEFAULT " + element);
      }
    }
    );

    columnList.push(     
      {
        headerName: "NEWCOL",
        colId: "mynewcol",
        editable: true,
        filter: false,
        minWidth: 60
      }
      );

    columnList.push(     
      {
        headerName: "",
        colId: "actions",
        cellRenderer: "actionsRenderer",
        btnUpdateHandler: datasaverfunc_athletdata,
        editable: false,
        filter: false,
        minWidth: 220
      }
      );

    console.log(columnList);
    return (columnList);

};
export const columnDefs = [
  {
    headerName: "Athlete (simpleEditor)",
    field: "athlete",
    cellEditor: "simpleEditor"
  },
  {
    headerName: "Sport (Validation)",
    field: "sport",
    cellEditor: "asyncValidationEditor",
    cellEditorParams: {
      condition: value => OLYMPIC_SPORTS.includes(value)
    }
  },
  {
    headerName: "Country (autoComplete)",
    editable: false,
    field: "country",
    cellEditor: "autoCompleteEditor",
    cellEditorParams: {
      options: OLYMPIC_COUNTRIES
    }
  },
  {
    headerName: "Date (Datepicker)",
    field: "date",
    cellEditor: "dateEditor",
    filter: "agDateColumnFilter",
    filterParams: {
      clearButton: true,
      suppressAndOrCondition: true,
      comparator: function(filterLocalDateAtMidnight, cellValue) {
        var dateAsString = cellValue;
        var dateParts = dateAsString.split("/");
        var cellDate = new Date(
          Number(dateParts[2]),
          Number(dateParts[1]) - 1,
          Number(dateParts[0])
        );
        if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
          return 0;
        }
        if (cellDate < filterLocalDateAtMidnight) {
          return -1;
        }
        if (cellDate > filterLocalDateAtMidnight) {
          return 1;
        }
      }
    }
  },
  {
    headerName: "",
    colId: "actions",
    cellRenderer: "actionsRenderer",
    editable: false,
    filter: false,
    minWidth: 220
  }
];

export const defaultColDef = {
  editable: true,
  resizable: true,
  filter: true,
  floatingFilter: false,
  suppressKeyboardEvent: params => params.editing
};
