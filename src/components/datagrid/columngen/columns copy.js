import { OLYMPIC_SPORTS, OLYMPIC_COUNTRIES } from "./olympic_lists.js";

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
