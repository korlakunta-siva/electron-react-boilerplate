import { OLYMPIC_SPORTS, OLYMPIC_COUNTRIES } from "./olympic_lists.js";



export const documentDetail = [{
  docID: 0,
  docdetailID: 0,
  checkamount: 0.0,
  checknumber: '1234',
  checkdate: '2/4/2021',
  pageno: 0,
  endpageno: 0,
  PatientName: "",
  PatientId: 0,  
  cardamount: 0.0,
  docname: ""
}];

PatientId: 29623
PatientName: "Apex, Billing"
cardamount: 0
checkamount: 239.07
checkdate: "2020-12-16T00:00:00.000+00:00"
checknumber: "6358"
pageno: 1
endpageno: 1


export const getColumnDefs_DocumentDetail = (row, validaterowfunction, saverowfunction) => {
  const columnList = [];
  console.log("IN getColumnDefs_DocumentDetail ", row);

  Object.keys(row).forEach(element => {
    console.log(element);
    switch(element) {
      case 'id' :
      case 'docname' :   
      case 'endpageno' :  
      case 'PatientName' :                       
      case 'id' :        
        break
      case 'docdetailID' :   
      columnList.push(  {
        colId: element + "id",
        checkboxSelection : true,
        headerCheckboxSelection: false,
        headerName: element,
        field: element,
        cellEditor: "simpleEditor",
        editable: false,
        resizable: false,
      });
      break;   
      case 'pageno' :   
      columnList.push(  {
        colId: element + "id",
        headerName: 'Pg',
        field: element,
        cellEditor: "simpleEditor",
        maxWidth: 100,
        editable: true,
        filter: false,
        floatingFilter: false,
        resizable: true,
        sort: 'asc'
      });
      break;        
      case 'checkamount' :
      case 'checknumber' :
              
        case 'cardamount' :  
     
       
        columnList.push(  {
          colId: element + "id",
          headerName: element,
          field: element,
          cellEditor: "simpleEditor",
          editable: true,
          resizable: true,
        });
        break;

          case 'date' :
          case 'checkdate':            
            columnList.push(             
          {
            headerName: "Date",
            field: element,
            cellEditor: "dateEditor",
            filter: "agDateColumnFilter",
            editable: true,
            resizable: true,
            minWidth: 150,            
            filter: true,
            floatingFilter:  true,
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
      headerName: "",
      colId: "actions",
      cellRenderer: "actionsRenderer",
      btnUpdateHandler: saverowfunction,
      validaterowfunction : validaterowfunction,      
      suppressRowClickSelection :true,
      editable: false,
      filter: false,
      floatingFilter: false
    }
    );

  console.log(columnList);
  return (columnList);

};

export const getColumnDefs = (row, validaterowfunction, saverowfunction ) => {
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
        btnUpdateHandler: saverowfunction,
        validaterowfunction : validaterowfunction,
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
  floatingFilter: true,
  sortable: true,
  suppressKeyboardEvent: params => params.editing
};
