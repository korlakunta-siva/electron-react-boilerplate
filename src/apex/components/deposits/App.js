import React, { useState, createRef, useEffect } from 'react'
import { renderToString } from 'react-dom/server'
import { AgGridReact } from 'ag-grid-react'
import Hotkeys from 'react-hot-keys'
import { format } from 'date-fns'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { saveAs } from 'file-saver'

const useStateRef=require('react-usestateref')

// import {text as deposit_header_5555_b64 } from  './depoist_header_5555';

//import "ag-grid-enterprise";
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'


import GridComponents from '../../../components/datagrid/GridComponents'

import { Tabs, Tab } from '@material-ui/core'
import { TabPanel } from '../../../components/datagrid/TabPanel/TabPanel'

import { uuid } from 'uuidv4'
import './App.css'
import { GridApi } from 'ag-grid-community'
import {
  loadGridData,
  DATA_DEPOSIT_DOCS,
  DATA_DEPOSIT_DETAIL
} from '../docubrowser/docuData'
import ApexDataGrid from '../../../components/datagrid/ApexDataGrid'

export const defaultColDef = {
  editable: true,
  resizable: true,
  filter: true,
  floatingFilter: true,
  sortable: true,
  suppressKeyboardEvent: params => params.editing
};


 const getColumnDefs_DocumentDetail = (validaterowfunction, saverowfunction) => {

  const documentDetail = {
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
  };
  const columnList = [];

  Object.keys(documentDetail).forEach(element => {
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


const docudetail_row = {
  docdetailID: '',
  pageno: '',
  checkamount: '',
  checknumber: '',
  checkdate: '',
  cardamount: '',
  docname: '',
  endpageno: '',
  PatientName: ''
}

function App () {
  const [gridApi, setGridApi] = useState(null)
  const [columnApi, setColumnApi] = useState(null)

  const [rowData, setRowData] = useState(null)
  const [columnDefs, setColumnDefs] = useState(null)
  const [output, setOutput] = useState(
    'Hello, I am a component that listens to keydown and keyup of a'
  )

  const [addBtnRef, setaddBtnRef] = useState(null)

  const [tablValue, settablValue] = useState(0)

  const [b64DepositHeader, setb64DepositHeader] = useState(null)

  const [documentInfo, setdocumentInfo, documentInfoRef ] = useStateRef({
    id: -1,
    name: ''
  })


  const [depositDocsData, setdepositDocsData] = useState([])

  const handleGridRefresh = gridName => {
    console.log('Refresh called on: ', gridName)
    loadGridData(DATA_DEPOSIT_DOCS, {}, recvGridData)
  }

  const recvGridData = (gridName, args, gridData) => {
    console.log('ReceivedData for :', gridName, args, gridData)

    switch (gridName) {
      case DATA_DEPOSIT_DOCS:
        let data0 = gridData.filter(row => {
          if (row.filename.includes('PB')) return row
          if (row.filename.includes('OPMT')) return row
        })

        setdepositDocsData(data0)
        break

      case DATA_DEPOSIT_DETAIL:
        let data2 = gridData.map(row => {
          console.log('CHECK DATE', row.checkdate.slice(0, 10))
          let dateParts = row.checkdate.slice(0, 10).split('-')

          //new Date(row.checkdate.slice(0,10)); //.toDateString('en-GB', {year: 'numeric', month: '2-digit', day: '2-digit'}).split("/");
          let cellDate = new Date(
            Number(dateParts[0]),
            Number(dateParts[1] - 1),
            Number(dateParts[2])
          )

          let cellDateChar =
            Number(dateParts[1]) +
            '/' +
            Number(dateParts[2]) +
            '/' +
            Number(dateParts[0])

          console.log(
            'DATE: ',
            row.checkdate,
            format(cellDate, 'MM/dd/yyyy'),
            dateParts,
            cellDate
          )
          row.checkdate = format(cellDate, 'MM/dd/yyyy')

          return row
        })

        data2.forEach(row => (row.id = uuid()))
        console.log(data2)
        setRowData(data2)

        break

      default:
    }
  }

  const onRowSelectExam = event => {
    let selectedNodes = event.api
      .getSelectedNodes()
      .filter(node => node.selected)
    console.log(selectedNodes)

    let datarow = selectedNodes[0].data
    console.log('AG Row selected', datarow)

    setdocumentInfo({
      id: datarow.docid,
      name: datarow.filename
    })

    let args = {
      document_id: datarow.docid
    }
    loadGridData(DATA_DEPOSIT_DETAIL, args, recvGridData)

    let filename = datarow.filename
    let full_file_path = `\\\\192.168.1.17\\d$\\eClinicalWorks\\ftp\\apexdocs\\EOB\\${filename}`

    full_file_path = full_file_path.replace('/', '\\')

    console.log('Starting to get deposit ', full_file_path)

    //let url = URL.createObjectURL(full_file_path);

    const frame_element = `../public/pdfjs/web/viewer.html?file=${full_file_path}`
    setPdfControl({ ...pdfControl, filepath: frame_element })
  }

  const onRowSelectView = (datarow, gridname) => {
    console.log('Transaction View:', gridname, datarow)
    switch (gridname) {
      case DATA_DEPOSIT_DOCS:
        setdocumentInfo({
          id: datarow.docid,
          name: datarow.filename
        })

        let args = {
          document_id: datarow.docid
        }
        loadGridData(DATA_DEPOSIT_DETAIL, args, recvGridData)

        break
      default:
    }
  }

  const formatMoney = num => {
    // const dec = num.toString().split('.');
    // console.log("FORMAT NUM", num, dec, dec.length);
    // if (dec.length == 1) {
    //   num = Number (dec[0] + ".00")
    //   return dec[0] + ".00";
    // }
    // [1];
    // const len = dec && dec.length > 2 ? dec.length : 2
    // return Number(num).toFixed(len);

    return Number(num).toFixed(2) //* 1.0;
  }

  const onFileChange = event => {
    console.log('File to upload:', event.target.files[0])
    let file = event.target.files[0]

    if (file) {
      const reader = new FileReader()
      reader.onload = _handleReaderLoaded.bind(this)
      reader.readAsBinaryString(file)
    }
  }

  const _handleReaderLoaded = readerEvt => {
    let binaryString = readerEvt.target.result
    console.log('File B64:', btoa(binaryString))
    setb64DepositHeader(btoa(binaryString))
    //saveAs(btoa(binaryString), "/newimg_b64.txt");
  }

  const onFileSubmit = event => {
    event.preventDefault()
    console.log('Clicked Submit')
  }
  const genDefTable = () => {
    let headarr = [['ID', 'Page #', 'Check Date', 'Check# last four', 'Amount']]

    let rowdata1 = rowData.map(row => {
      let rowarr = [
        row.docdetailID,
        row.pageno,
        row.checkdate,
        row.checknumber,
        Number(row.checkamount).toFixed(2)
      ]
      return rowarr
    })

    let total_checks = 0
    let total_amount = 0.0

    for (let i = 0; i < rowData.length; i++) {
      total_checks += 1
      total_amount += rowData[i].checkamount
    }

    rowdata1.push([
      'Count: ' + total_checks,
      'Total Amount: ',
      Number(total_amount).toFixed(2),
      ''
    ])

    //total_amount.toFixed(2)

    let dtable = {
      head: headarr,
      body: rowdata1,
      startY: 90,
      columnStyles: { 1: { halign: 'center' }, 4: { halign: 'right' } },
      options: { margin: { top: 180 } }
    }
    console.log('DocDetail Table to Print', dtable)
    return dtable
  }

  const printPDF = tbl => {
    const doc = new jsPDF()
    //const string = renderToString(<Prints />);
    // doc.text("Hello world!", 10, 10);
    // doc.autoTable({
    //   head: [['Name', 'Email', 'Country']],
    //   body: [
    //     ['David', 'david@example.com', 'Sweden'],
    //     ['Castille', 'castille@example.com', 'Spain'],
    //     // ...
    //   ],
    // });

    // imageToBase64("/deposit_header_5555.jpg") // Path to the image
    // .then(
    //     (response) => {
    //         console.log("JPEG AS b64", response); // "cGF0aC90by9maWxlLmpwZw=="
    //     }
    // )
    // .catch(
    //     (error) => {
    //         console.log("JPEG AS b64 Error", error); // Logs an error if there was one
    //     }
    // )

    doc.moveTo(0, 10)
    doc.addImage(b64DepositHeader, 'PNG', 10, 10, 190, 75)
    doc.text(
      '--------------------------------------------------------------------------',
      30,
      88
    )
    //doc.moveTo (200,200);

    let total_amount = 0.0

    for (let i = 0; i < rowData.length; i++) {
      total_amount += rowData[i].checkamount
    }
    doc.setFontSize(32)
    doc.text(total_amount.toFixed(2), 154, 70)
    doc.setFontSize(18)
    doc.text(documentInfo.name.replace('.pdf', ''), 65, 11)

    //rowdata1.push([total_checks, "", total_amount.toFixed(2), ""]);

    doc.autoTable(genDefTable())
    //let file = doc.output('blob');

    //doc.addImage(b64DepositHeader, 'PNG', 15, 40, 175, 75);

    let base = doc.output('datauri')

    loadblobPDF(base)
    //  PDFViewerApplication.open(pdfData);

    //doc.save("a4.pdf");
  }

  const base64ToUint8Array = base64 => {
    var raw = atob(base64)
    var uint8Array = new Uint8Array(raw.length)
    for (var i = 0; i < raw.length; i++) {
      uint8Array[i] = raw.charCodeAt(i)
    }
    return uint8Array
  }

  const loadblobPDF = blob => {
    console.log('Ready to Loadin PDF from base64')

    try {
      let iframePdf = pdfControl.iframeRef.current.contentWindow
      //console.log(iframePdf);
      //console.log(iframePdf.PDFViewerApplication);
      if (iframePdf !== undefined) {
        let iframePdf2 = iframePdf.contentWindow
        //iframePdf.PDFViewerApplication.open();
        iframePdf.PDFViewerApplication.open(blob)
        //iframePdf.PDFViewerApplication.toolbar.openFile.click(); // iframePdf.PDFViewerApplication
        //iframePdf.print();
      }
    } catch (error) {}

    // ipcRenderer.send('show-file', 'ping')
  }

  const datavalidatefunc_athletedata = row => {
    console.log(
      'GOT IN datavalidatefunc_athletedata UPDATE ON ROW:',
      getPDFPage(),
      row.data
    )

    if (row.data.pageno == undefined) {
      row.data['pageno'] = getPDFPage()
      console.log('Setting page to: ', row.data['pageno'], row.data)
    }
    if (
      row.data.checkamount == undefined ||
      row.data.checkamount == undefined ||
      row.data.checknumber == undefined
    ) {
      return true
    }

    return true
  }

  const datasaverfunc_athletdata = row => {
    console.log('GOT IN DATASAVERFUNC UPDATE ON ROW:', documentInfo, getPDFPage(), row.data)

    let datarow = row.data
    let detailid = 0

    console.log("CURRENT DOCUMENT: ",documentInfoRef.current, row);

    try {
      detailid = datarow.docdetailID
    } catch (err) {
      console.log('Inserting a row for document: ', documentInfoRef.current.id)
      detailid = -1
    }

    let rowchange_SQL = ''
    let currentPage = getPDFPage()

    if (detailid == undefined || detailid == -1) {
      console.log('Inserting a row', detailid)
      detailid = -1

      rowchange_SQL = `


  insert into apex..apex_documentdetail (
    docID ,
    pageno ,
  endpageno,
    detailType,
    checkamount,
    cardamount,
    otheramount ,
    checkdate ,
    checknumber ,
    PatientId,
      PatientName )
  values (
    ${documentInfoRef.current.id}, ${currentPage}, ${currentPage}, '', ${datarow.checkamount}, 0,
    0, '${datarow.checkdate}', '${datarow.checknumber}', 29623 , dbo.PatientName(29623) )

  `
    } else {
      console.log('Updating a row', detailid)
      rowchange_SQL = `

      update apex..apex_documentdetail set
       pageno = ${datarow.pageno},
       endpageno = ${datarow.pageno},
       detailType = '',
       checkamount = ${datarow.checkamount},
       cardamount = ${datarow.cardamount},
       checkdate = '${datarow.checkdate}',
       checknumber = '${datarow.checknumber}'

      where docdetailID = ${detailid}


  `
    }

    console.log(rowchange_SQL)

    const endpoint_document_detail = `https://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%20200%20 ${rowchange_SQL}  `

    fetch(endpoint_document_detail, {})
      .then(response => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: 'Something went wrong in getting data'
          })
        }
        return response
      })
      .then(data => {
        //console.log("___________________");
        console.log('RETURN from insert/update', data)
        // let dframe = data["frame0"];
        // let myObj = JSON.parse(dframe);
        // let data2 = myObj["rows"];
        // data2.map(row=> {
        //   console.log("CHECK DATE", row.checkdate.slice(0,10));
        //   // let dateParts =  row.checkdate.slice(0,10).split("-");

        //   // //new Date(row.checkdate.slice(0,10)); //.toDateString('en-GB', {year: 'numeric', month: '2-digit', day: '2-digit'}).split("/");
        //   // let cellDate = new Date(
        //   //   Number(dateParts[0]),
        //   //   Number(dateParts[1] - 1) ,
        //   //   Number(dateParts[2])
        //   // );

        //   // let  cellDateChar =  Number(dateParts[1]) + "/" + Number(dateParts[2]) + "/" + Number(dateParts[0]);

        //   // console.log("DATE: ", row.checkdate,  format(cellDate, 'MM/dd/yyyy'), dateParts, cellDate);
        //   // row.checkdate =  format(cellDate, 'MM/dd/yyyy');

        // });
      })
  }

  const [pdfControl, setPdfControl] = useState({
    filepath:
      '/pdfjs/web/viewer.html?file=21219_B17EA5D0-D1C2-4E82-A913-3F9B2E9D80EB.pdf',
    iframeRef: createRef()
  })

  //https://192.168.21.199:8040/getecwfile?filename=mobiledoc/2021/02052021/21219_9E9A66B7-D0BD-45E6-A390-EF07226DCB4D.pdf
  //    filepath: "/pdfjs/web/viewer.html?file=/PB162_DELETE.pdf",

  const frameworkComponents = {
    simpleEditor: GridComponents.SimpleEditor,
    asyncValidationEditor: GridComponents.AsyncValidationEditor,
    autoCompleteEditor: GridComponents.AutoCompleteEditor,
    agDateInput: GridComponents.MyDatePicker,
    dateEditor: GridComponents.DateEditor,
    actionsRenderer: GridComponents.ActionsRenderer,
    addRowStatusBar: GridComponents.AddRowStatusBar
  }

  const loadFile = () => {
    console.log('LOAD File Called:', documentInfo)

    getPDFFileName()

    const load_detail_sql = `
 select
 docID ,
 docdetailID,
 pageno ,
endpageno,
 detailType,
 checkamount,
 cardamount,
 otheramount ,
 checkdate ,
 checknumber ,
 PatientId,
   PatientName,
 DOS_start ,
 DOS_end ,
 cptcode ,
 cptunits ,
 encId ,
 invoiceid ,
 invcptid ,
 delFlag,
 insuranceid ,
 notes,
pmtrow,
pmtprocessed,
pmtprocesseddt,
pmtreceipt
from apex..apex_documentdetail where docid = ${documentInfo.id}
`

    const endpoint_document_detail = `https://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%20200%20 ${load_detail_sql}  `

    fetch(endpoint_document_detail, {})
      .then(response => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: 'Something went wrong in getting data'
          })
        }
        return response.json()
      })
      .then(data => {
        //console.log("___________________");
        console.log(data)
        let dframe = data['frame0']
        let myObj = JSON.parse(dframe)
        let data2 = myObj['rows']
        data2.map(row => {
          console.log('CHECK DATE', row.checkdate.slice(0, 10))
          let dateParts = row.checkdate.slice(0, 10).split('-')

          //new Date(row.checkdate.slice(0,10)); //.toDateString('en-GB', {year: 'numeric', month: '2-digit', day: '2-digit'}).split("/");
          let cellDate = new Date(
            Number(dateParts[0]),
            Number(dateParts[1] - 1),
            Number(dateParts[2])
          )

          let cellDateChar =
            Number(dateParts[1]) +
            '/' +
            Number(dateParts[2]) +
            '/' +
            Number(dateParts[0])

          console.log(
            'DATE: ',
            row.checkdate,
            format(cellDate, 'MM/dd/yyyy'),
            dateParts,
            cellDate
          )
          row.checkdate = format(cellDate, 'MM/dd/yyyy')
        })
        console.log(data2)

        data2.forEach(row => (row.id = uuid()))

        let colDEFs1 = getColumnDefs_DocumentDetail(
          datavalidatefunc_athletedata,
          datasaverfunc_athletdata
        )
        //let colDEFs2 = getColumnDefs_DocumentDetail(data[0]);

        //console.log("DEF1", colDEFs1);
        //console.log("DEF2", JSON.parse(colDEFs2));
        setColumnDefs(colDEFs1)
        setRowData(data2)
        //setColumnDefs(JSON.parse(colDEFs2));

        //documentDetail = documentDetail.json();

        // console.log("SETTING DATA", documentDetail);
        // let rowdata = documentDetail;
        // rowdata = rowdata.forEach(row => (row.id = uuid()));
        // console.log("SETTING DATA 2", rowdata);
        // getColumnDefs_DocumentDetail(rowdata[0]);
        //setRowData(rowdata);
        gridApi.sizeColumnsToFit()

        //console.log(data2);
        // this.setState(
        //   {
        //     invoice_cpt: data2,
        //     series_locations: [],
        //     series_ciga_jobs: [],
        //     loaded: true
        //   },
        //   () => {
        //     //console.log("Changed state", this.state.series.length);
        //     this.invoiceGridElement.current.changeGridData(this.state.invoice_cpt,getColumnsList(data2[0]) );

        //   }
        // );
      })
  }

  const detailRowSelected = event => {
    let inEditing = gridApi.getEditingCells().length > 0 ? true : false

    if (inEditing && gridApi.getFocusedCell().column.getColId() != 'actions') {
      console.log(
        'NO ACTION Clicked column',
        gridApi.getEditingCells(),
        gridApi.getFocusedCell().column.getColId(),
        gridApi.getFocusedCell().column
      )
      //console.log("Clicked column ACTIONS",  gridApi.getEditingCells());
      return
    }

    if (!inEditing && gridApi.getFocusedCell().column.getColId() == 'actions') {
      console.log(
        'NO ACTION Clicked column',
        gridApi.getEditingCells(),
        gridApi.getFocusedCell().column.getColId(),
        gridApi.getFocusedCell().column
      )
      //console.log("Clicked column ACTIONS",  gridApi.getEditingCells());
      return
    }

    //|| gridApi.getFocusedCell().column.getColId() == 'actions'

    console.log(
      'Clicked column',
      gridApi.getEditingCells(),
      gridApi.getFocusedCell().column.getColId(),
      gridApi.getFocusedCell().column
    )

    // if(this.gridApi.getFocusedCell().column.getColId() === 'number'){
    //     this.goToItem(params.data.id);
    //     return;
    // }

    //Other row logic

    //console.log("Clicked column", gridApi.getFocusedCell().column.getColId(), gridApi.getFocusedCell().column );

    let row = event.node.data
    console.log('deselected', event.node.data)
    let pageno = row.pageno

    console.log('MOVE to page: ?? ', pageno)

    gotoPDFPage(pageno)

    // if(event.node.isSelected()){
    //   console.log("deselected", event.node.data );
    // }
    // else {
    //   console.log("selected, add", event.node.data);
    // }

    // window.alert(
    //   'row  selected = ' + event.node.isSelected()
    // );
    // console.log("ROW SELECTED", event.node.data);
  }

  function onGridReady (params) {
    setGridApi(params.api)
    setColumnApi(params.columnApi)
    params.api.sizeColumnsToFit();
  }

  const onKeyUp = (keyName, e, handle) => {
    console.log('test:onKeyUp', e, handle)
    setOutput(`onKeyUp ${keyName}`)
  }
  const onKeyDown = (keyName, e, handle) => {
    console.log('test:onKeyDown', keyName, e, handle)
    setOutput(`onKeyDown ${keyName}`)
    addBtnRef.current.click()
  }

  useEffect(() => {
    setaddBtnRef(createRef())
    loadGridData(DATA_DEPOSIT_DOCS, {}, recvGridData)
    let colDEFs1 = getColumnDefs_DocumentDetail(
      datavalidatefunc_athletedata,
      datasaverfunc_athletdata
    )
    setColumnDefs(colDEFs1)

  }, [])

  const openPDF = () => {
    console.log('Renderer sending message to main')

    try {
      let iframePdf = pdfControl.iframeRef.current.contentWindow
      console.log(iframePdf)
      console.log(iframePdf.PDFViewerApplication)
      if (iframePdf !== undefined) {
        let iframePdf2 = iframePdf.contentWindow
        //iframePdf.PDFViewerApplication.open();
        console.log(iframePdf.PDFViewerApplication.url)
        //iframePdf.PDFViewerApplication.toolbar.openFile.click(); // iframePdf.PDFViewerApplication
        //iframePdf.print();
      }
    } catch (error) {}

    // ipcRenderer.send('show-file', 'ping')
  }

  const getPDFPage = () => {
    //console.log("Called Get Page Number");

    try {
      let iframePdf = pdfControl.iframeRef.current.contentWindow
      //console.log(iframePdf);
      return iframePdf.PDFViewerApplication.pdfViewer.currentPageNumber
      if (iframePdf !== undefined) {
        let iframePdf2 = iframePdf.contentWindow
        //iframePdf.print();
      }
    } catch (error) {
      return 1
    }
  }

  const getPDFFileName = () => {
    console.log('LOAD File Called:', documentInfo)

    const load_detail_sql = `
 select  customName from apex..apex_document where docid = ${documentInfo.id}
`

    const endpoint_document_detail = `https://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%20200%20 ${load_detail_sql}  `

    fetch(endpoint_document_detail, {})
      .then(response => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: 'Something went wrong in getting data'
          })
        }
        return response.json()
      })
      .then(data => {
        //console.log("___________________");
        console.log(data)
        let dframe = data['frame0']
        let myObj = JSON.parse(dframe)
        let data2 = myObj['rows']
        console.log('FILE NAME', data2[0].customName)
        setdocumentInfo({ ...documentInfo, name: data2[0].customName })
        console.log('DOCINFO', documentInfo)
      })
  }

  const nextPDFPage = () => {
    console.log('Called Next Page Number')

    let iframePdf = pdfControl.iframeRef.current.contentWindow
    if (iframePdf !== undefined) {
      console.log(iframePdf)
      console.log(
        (iframePdf.PDFViewerApplication.pdfViewer.currentPageNumber += 1)
      )

      iframePdf.PDFViewerApplication.pdfDocument.getPage(1).then(pdfPage => {
        pdfPage.getTextContent().then(data => {
          console.log(data)
        })
      })
    }
  }

  const gotoPDFPage = pageno => {
    try {
      let iframePdf = pdfControl.iframeRef.current.contentWindow
      if (iframePdf !== undefined) {
        console.log(iframePdf)

        if (
          iframePdf.PDFViewerApplication.pdfViewer.currentPageNumber != pageno
        ) {
          console.log('Called Next Page Number', pageno)

          console.log(
            (iframePdf.PDFViewerApplication.pdfViewer.currentPageNumber = pageno)
          )
        }

        //iframePdf.PDFViewerApplication.pdfDocument.getPage(1).then(pdfPage => { pdfPage.getTextContent().then(data => { console.log(data); }); });
      }
    } catch (error) {
      console.log(error)
    }
  }

  const prevPDFPage = () => {
    console.log('Called Previous Page Number')

    let iframePdf = pdfControl.iframeRef.current.contentWindow
    if (iframePdf !== undefined) {
      console.log(iframePdf)
      console.log(
        (iframePdf.PDFViewerApplication.pdfViewer.currentPageNumber -= 1)
      )

      iframePdf.PDFViewerApplication.pdfDocument.getPage(1).then(pdfPage => {
        pdfPage.getTextContent().then(data => {
          console.log(data)
        })
      })
    }
  }

  const handleTabChange = (event, newValue) => {
    //console.log("CHANGING TAB TO: " , newValue);
    settablValue(newValue)
  }

  const a11yProps = index => {
    //console.log("AllyProps", index);
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    }
  }

  return (
    <div className=' my-app container-fluid' style={{ position: 'relative' }}>
      <div className='row justify-content-start'>
        <div
          className='col-7 py-3 overflow-auto'
          style={{
            height: '100vh',
            width: '100%',
            backgroundColor: 'powderblue'
          }}
        >
          <Tabs
            value={tablValue}
            onChange={handleTabChange}
            aria-label='simple tabs example'
          >
            <Tab label='Deposits' {...a11yProps(0)} />
            <Tab label='Documents' {...a11yProps(1)} />
            <Tab label='Tab3' {...a11yProps(2)} />
          </Tabs>
          <TabPanel
            value={tablValue}
            index={0}
            style={{ height: '90%', width: '100%' }}
          >
            <div
              className='overflow-auto'
              style={{
                height: '90vh',
                width: '100%',
                backgroundColor: 'powderblue'
              }}
            >
              <div
                id='myGrid'
                style={{
                  height: '90%',
                  width: '100%',
                  margin: 0,
                  padding: 0,
                  backgroundColor: 'orange'
                }}
                className='ag-theme-balham'
              >
                <AgGridReact
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  rowData={rowData}
                  getRowNodeId={data => data.id}
                  onGridReady={onGridReady}
                  frameworkComponents={frameworkComponents}
                  editType='fullRow'
                  rowSelection='single'
                  onRowClicked={detailRowSelected}
                  suppressClickEdit
                />
              </div>

              <div>
                {gridApi ? (
                  <GridComponents.AddRowStatusBar
                    api={gridApi}
                    columnApi={columnApi}
                    btnRef={addBtnRef}
                  />
                ) : (
                  ''
                )}
                <button onClick={loadFile}>Load File</button>
                <input
                  onChange={e =>
                    setdocumentInfo({ ...documentInfo, id: e.target.value })
                  }
                  value={documentInfo.id}
                />
                <Hotkeys
                  keyName='shift+a,alt+s'
                  onKeyDown={onKeyDown.bind(this)}
                  onKeyUp={onKeyUp.bind(this)}
                ></Hotkeys>
                <Hotkeys
                  keyName='alt+a'
                  onKeyDown={nextPDFPage.bind(this)}
                ></Hotkeys>
                <Hotkeys
                  keyName='alt+z'
                  onKeyDown={prevPDFPage.bind(this)}
                ></Hotkeys>
                <button onClick={printPDF}>printPDF</button>
              </div>
              <form
                onSubmit={e => onFileSubmit(e)}
                onChange={e => onFileChange(e)}
              >
                <input
                  type='file'
                  name='image'
                  id='file'
                  accept='.jpg, .png, .jpeg'
                />
                <input type='submit' />
              </form>

              <ApexDataGrid
                key='depositdocs'
                gridname={DATA_DEPOSIT_DOCS}
                ShowAllColumns={true}
                gridTitle={''}
                divHeight={'120px'}
                onRefresh={() => handleGridRefresh(DATA_DEPOSIT_DOCS)}
                gridData={depositDocsData}
                onRowSelected={onRowSelectExam}
                button2Label='Stmt'
                onButton2Callback={onRowSelectView}
              />
            </div>
          </TabPanel>
          <TabPanel value={tablValue} index={1}></TabPanel>
          <TabPanel value={tablValue} index={2}>
            Item Three
          </TabPanel>
        </div>
        <div
          className='col-5 py-3 overflow-auto'
          style={{ width: '100%', backgroundColor: 'lightsalmon' }}
        >
          <div style={{ height: '90%', width: '100%' }}>
            <button id='myButton1' onClick={openPDF}>
              GetPageNumber
            </button>
            <button id='myButton2' onClick={getPDFPage}>
              GetPageNumber
            </button>
            <button id='myButton3' onClick={prevPDFPage}>
              Previous Page{' '}
            </button>
            <button id='myButton4' onClick={nextPDFPage}>
              Next Page{' '}
            </button>
            <iframe
              width='100%'
              height='100%'
              backgroundcolor='lightgrey'
              ref={pdfControl.iframeRef}
              src={pdfControl.filepath}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
