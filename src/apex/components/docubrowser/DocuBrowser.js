import React, { Component, createRef } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import PropTypes from 'prop-types';
const { exec } = require('child_process');
import DateFnsUtils from '@date-io/date-fns';
let shell = require('electron').shell;
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import ReactDOM from 'react-dom';
import Moment from 'moment';
import './DocuBrowser.css';
import ShowPDF from '../common/pdf/PdfView';
import DatePicker from 'react-datepicker';
import DataProvider from '../common/DataProvider';
import DataGrid from '../common/DataGridNew';
import { Toolbar, Data } from 'react-data-grid-addons';
import MyGrid from '../unused/MyGrid';

import ApexClaimsView from './ApexClaimsView';

import RGL, { WidthProvider } from 'react-grid-layout';

import axios from 'axios';
import CSRFToken, { getCookie } from '../common/csrftoken';
import request from 'superagent';
import { RadioGroup, Radio } from 'react-radio-group';
import { Button, Progress, Input, CustomInput } from 'reactstrap';

import { Tabs, Tab } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import DepositApp from '../deposits/App';

import { showFile } from '../common/Utils';

import { withRouter } from 'react-router-dom';
import HostWatcher from '../hostwatch/HostWatcher';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const backend_api_endpoint = 'https://192.168.21.199:8040/';
//const backend_api_endpoint_local = "http://127.0.0.1:8000/"
const backend_db_endpoint = 'https://192.168.21.199:8044/';
//const backend_db_endpoint_local = "http://127.0.0.1:8000/"

const endpoint = backend_api_endpoint + 'uploadfiles/';
const endpoint_processing = backend_api_endpoint + 'processfile/';

import FileBrowser, { Icons } from 'react-keyed-file-browser';

import {
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBTableEditable,
} from 'mdbreact';
import { DateEditor, DateFormater } from '../common/DateEditor';

import ApexDataGrid from '../../../components/datagrid/ApexDataGrid';

import {  cli_processfile_py,
        loadGridData,
        DATA_PATIENT_LIST,
        DATA_APEX_CLAIMS,
        cli_quser_cmd }
from "./docuData";

console.log('Directory: ' + __dirname);

let csrftoken = getCookie('csrftoken');

const {  ipcRenderer } = window.require('electron');


// const { remote } = window.require('electron');



// let   eventDataGrid = {
//   onClick: (ev, args) => {
//     const idx = args.idx;
//     const rowIdx = args.rowIdx;
//     this.grid.openCellEditor(rowIdx, idx);
//   }
// }

const ReactGridLayout = WidthProvider(RGL);




const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    marginLeft: 20,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexWrap: 'nowrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

const defaultColumnProperties = {
  sortable: true,
  filterable: true,
  resizable: true,
  editable: false,
};

const columns = [
  {
    key: 'Name',
    name: 'Name',
    sortDescendingFirst: false,
    frozen: true,
    resizable: true,
    width: 225,
  },
  {
    key: 'DOB',
    name: 'Birth Date',
    frozen: false,
    resizable: false,
    width: 120,
    editable: true,
    editor: DatePicker,
    //,  events: eventDataGrid
  },
  {
    key: 'PatientId',
    name: 'ID',
    editable: true,
    resizable: false,
    width: 100,
  },
  {
    key: 'Phone1',
    name: 'Phone',
    frozen: false,
    resizable: false,
    width: 125,
  },
  {
    key: 'City',
    name: 'City',
    frozen: false,
    width: 150,
  },
].map((c) => ({ ...c, ...defaultColumnProperties }));

export const colourOptions = [
  { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
  { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
  { value: 'purple', label: 'Purple', color: '#5243AA' },
  { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
  { value: 'orange', label: 'Orange', color: '#FF8B00' },
  { value: 'yellow', label: 'Yellow', color: '#FFC400' },
  { value: 'green', label: 'Green', color: '#36B37E' },
  { value: 'forest', label: 'Forest', color: '#00875A' },
  { value: 'slate', label: 'Slate', color: '#253858' },
  { value: 'silver', label: 'Silver', color: '#666666' },
];

const columns0 = ['Person Name', 'Age', 'Company Name', 'Country', 'City'];

const data0 = [
  ['Aurelia Vega', 30, 'Deepends', 'Spain', 'Madrid'],
  ['Guerra Cortez', 45, 'Insectus', 'USA', 'San Francisco'],
  ['Guadalupe House', 26, 'Isotronic', 'Germany', 'Frankfurt am Main'],
  ['Elisa Gallagher', 31, 'Portica', 'United Kingdom', 'London'],
];

// const defaultColumnProperties = {
//   sortable: true,
//   filterable: true,
//   resizable: true,
//   editable: true
// };

const getColumnsList = (datarow) => {
  let columnList = [];
  if (datarow == undefined || datarow.length == 0) return [];
  //console.log(Object.keys(datarow));
  columnList = Object.keys(datarow).map(function (key) {
    let dict1 = {};
    //console.log(key);
    Object.assign(
      dict1,
      {
        key: key,
        name: key,
        width: datarow[key] ? datarow[key].toString().length * 7 + 50 : 100,
      },
      {}
    );

    return dict1;
  });

  columnList = columnList.map((c) => ({
    ...c,
    ...defaultColumnProperties,
  }));

  //console.log(columnList);
  return columnList;
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//     backgroundColor: theme.palette.background.paper,
//   },
// }));

export class DocuBrowser extends React.Component {
  endpoint_curr_linqdocs = `https://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%20100%20  select doc.docID, doc.customName , doc.scanDate, doc.ScannedBy, doc.Review, doc.ReviewerId, doc.ReviewerName , doc.delFlag,  doc.PatientId, apex.dbo.PatientName(doc.patientid) as PatientName, doc.dirpath, doc.fileName from mobiledoc..document doc where doc.patientid = arg_ecwpatid and doc.doc_Type in  (114, 115,116,117,119,121,154,157,174) and delflag = 0 order by customName desc `;

  endpoint_invcpt = `https://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%2010%20 select convert(varchar(10),claimdate,121) as claimdate, billedfee, Cpt_Allowed, inspaid, patpaid, insbal, patbal, PatientName, cptcode, cptdesc, pinsname from apex.rc.Apex_Invoice_Cpt_Summary where InvoiceId = arg_invoiceid `;

  endpoint_ecwenc = `https://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%2010%20  select convert(varchar(10),date,121) as date, convert(varchar(10),dateadd(dd, 32, date),121) as next_date, reason, VisitType, STATUS, enclock,  InvoiceId  from mobiledoc..enc e0 where e0.patientID = arg_ecwpatid and VisitType = 'NV' and deleteflag = 0 order by date desc `;

  handleTabChange = (event, newValue) => {
    this.setState({ tablValue: newValue });
  };

  openPDF = () => {
    console.log('Renderer sending message to main');
    ipcRenderer.send('show-file', 'ping');
  };

  getPDFPage = () => {
    console.log('Called Get Page Number');

    const iframePdf = this.state.iframeRef.current.contentWindow;
    console.log(iframePdf);
    console.log(iframePdf.PDFViewerApplication.pdfViewer.currentPageNumber);
    if (this.iframePdf !== undefined) {
      const iframePdf = this.iframePdf.contentWindow;
      iframePdf.print();
    }
  };

  nextPDFPage = () => {
    console.log('Called Next Page Number');

    const iframePdf = this.state.iframeRef.current.contentWindow;
    console.log(iframePdf);
    console.log(
      (iframePdf.PDFViewerApplication.pdfViewer.currentPageNumber += 1)
    );

    iframePdf.PDFViewerApplication.pdfDocument.getPage(1).then((pdfPage) => {
      pdfPage.getTextContent().then((data) => {
        console.log(data);
      });
    });
  };

  state = {
    activeIndex: 0,

    filepath: '',
    iframeRef: createRef(),
    tablValue: 0,
    filetodisplay: '0',
    patientid: 0,
    patientrow: {},
    folderType: 'scanhome',
    folderContext: '/mnt/skscan',
    patientGrid_data: [],
    patientGrid_columns: [],
    showMonitoringPatientsOnly: true,

    ecw_enc: [],
    invoice_cpt: [],

    pat_linqdocs: [],

    dataApexClaims: [],
    RenameToFilename: '',
    newFileNameSelected: '',
    docuType: null,
    docuPages: 'All',
    docuContext: 'EMR',
    recentdate: new Date(),
    filePrefixDate: '',
    date: new Date(),
    selectedFile: [],
    inputRestKey: 'reset',
    filepagenum: null,
    filetotalpages: null,
    loaded: 0,
    uploading: false,
    uploadProgress: {},
    successfullUploaded: false,
    handleRenameTo: this.handleRenameTo,
    files: [],
  };

  constructor(props) {
    super(props);
    this.patientGridElement = React.createRef();
    this.linqGridElement = React.createRef();
    this.ecwencGridElement = React.createRef();
    this.invoiceGridElement = React.createRef();
  }

  componentDidMount() {
    console.log('GrandChild did mount.');
    //this.getPatients();

    loadGridData(DATA_PATIENT_LIST, {}, this.recvGridData);
    loadGridData(DATA_APEX_CLAIMS, {}, this.recvGridData);

    ipcRenderer.on('selectedFile', (event, path) => {
      console.log('Client got: Show file ' + path);

      const element = `<h1>Hello, world</h1> ${path}`;

      // const iframe = document.createElement('iframe');
      // iframe.src = `../public/pdfjs/web/viewer.html?file=${path}`;

      // const frame_element = `
      // <iframe width="100%" height="600px"
      // src = "${path}"
      // />
      // `;

      //       const frame_element = `
      // <iframe width="100%" height="600px"
      // src = "../public/pdfjs/web/viewer.html?file=${path}"
      // />
      // `;

      const frame_element = `/pdfjs/web/viewer.html?file=${path}`;

      this.setState({ filepath: frame_element });
    });

    ipcRenderer.on('dir-file-list', (event, arg, fileList) => {
      //console.log('Client got: dir-file-list ' + arg, fileList);
      let newFileList = fileList.filter((fileobj) => {
        if ( fileobj.key.endsWith(".pdf") && !fileobj.key.includes("_DELETE")) {
        //console.log(fileobj.key, fileobj.key.endsWith('.pdf'));
        return fileobj;
        }else {
        return false;
        }
      });

      console.log("SET TO", newFileList);
      this.setState({ files: newFileList   });

     // const element = `<h1>Hello, world</h1> ${path}`;

      // const iframe = document.createElement('iframe');
      // iframe.src = `../public/pdfjs/web/viewer.html?file=${path}`;

      // const frame_element = `
      // <iframe width="100%" height="600px"
      // src = "${path}"
      // />
      // `;

      //       const frame_element = `
      // <iframe width="100%" height="600px"
      // src = "../public/pdfjs/web/viewer.html?file=${path}"
      // />
      // `;

      //const frame_element = `/pdfjs/web/viewer.html?file=${path}`;

      //this.setState({ filepath: frame_element });
    });

    //this.checkinDjangoApi();

    // folderContext
    // /mnt/scanhome
    fetch(
      backend_api_endpoint + 'getfiles?folderpath=' + this.state.folderContext
    )
      .then((response) => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: 'Something went wrong in getting data',
          });
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ files: data });
        console.log(data);
      });

    this.setState({ patientGrid_columns: columns });
  }


  handleGridRefresh = (gridName) => {

    switch (gridName) {
    case DATA_PATIENT_LIST:
    console.log('Refresh called on: ', gridName);
    this.setState(
      {
        dataPatientList: [],
        loaded: true,
      });
    loadGridData(gridName, {}, this.recvGridData);
    break;

    case DATA_APEX_CLAIMS:
      console.log('Refresh called on: ', gridName);
      this.setState(
        {
          dataApexClaims: [],
          loaded: true,
        });
      loadGridData(gridName, {}, this.recvGridData);
      break;

    default:
    }
  };

  recvGridData = (gridName, args, gridData) => {
    console.log('ReceivedData for :', gridName, args, gridData);

    switch (gridName) {
      case DATA_PATIENT_LIST:
        this.setState(
          {
            dataPatientList: gridData,
            loaded: true,
          },
          () => {
            console.log(
              'Changed state PatientList',
              this.state.dataPatientList.length
            );
          }
        );
        break;
        case DATA_APEX_CLAIMS:
          this.setState(
            {
              dataApexClaims: gridData,
              loaded: true,
            },
            () => {
              console.log(
                'Changed state dataApexClaims',
                this.state.dataApexClaims.length
              );
            }
          );
          break;        
      default:
    }
  };

  onRowSelectEncounter = (data) => {
    console.log('rowselectednew encounter:', data[0].row);
    this.setState({ invoiceid: data[0].row.InvoiceId }, () => {
      //console.log(this.endpoint_series + this.state.examid);
      //console.log(this.endpoint_enc + data[0].row.PatientId);
      fetch(
        this.endpoint_invcpt.replace('arg_invoiceid', this.state.invoiceid),
        {}
      )
        .then((response) => {
          if (response.status !== 200) {
            return this.setState({
              placeholder: 'Something went wrong in getting data',
            });
          }
          return response.json();
        })
        .then((data) => {
          //console.log("___________________");
          //console.log(data);
          let dframe = data['frame0'];
          let myObj = JSON.parse(dframe);
          let data2 = myObj['rows'];
          //console.log(data2);
          this.setState(
            {
              invoice_cpt: data2,
              series_locations: [],
              series_ciga_jobs: [],
              loaded: true,
            },
            () => {
              //console.log("Changed state", this.state.series.length);
              this.invoiceGridElement.current.changeGridData(
                this.state.invoice_cpt,
                getColumnsList(data2[0])
              );
            }
          );
        });
    });
  };

  onRowSelectExam000 = (data) => {
    console.log('Called onRowSelectExam', data);

    handleChangePatient(datarow);
  };

  onRowSelectExam = (event) => {
   

  let selectedNodes = event.api
    .getSelectedNodes()
    .filter((node) => node.selected);
  console.log(selectedNodes);

  let datarow = selectedNodes[0].data;
  console.log('AG Row selected', datarow);

  this.handleChangePatient(datarow);
  //console.log('row2', selectedNodes[0].data, event);
};

  
  onRowSelectView = (datarow, gridname) => {
    console.log('Transaction View:', gridname, datarow);
    let dataArgs = { ...this.state.dataArgs };
    switch (gridname) {
      case DATA_PATIENT_LIST:

        this.handleChangePatient(datarow);

        let newDataArgs = {
          patientid: datarow.PatientId,
          patientrow: datarow
        };
        dataArgs.patientid = datarow.PatientId;
        dataArgs.patientrow = datarow;

        this.setState({  patientid: datarow.PatientId,
          patientrow: datarow,dataArgs: newDataArgs }, () => {
          console.log('NEW ARGS: ', this.state.dataArgs);
        });


        // cli_parse_ko_folder(
        //   DATA_EXAM_SERIES_KO_REFLECTED,
        //   newExamArgs,
        //   this.recvGridData
        // );

        //loadGridData(DATA_EXAM_STUDIES, newExamArgs, this.recvGridData);
        console.log('Retrieve Series and Studies', newDataArgs);
        break;
      // case DATA_EXAM_SERIES:
      //   loadGridData(
      //     DATA_SERIES_LOCATIONS,
      //     {
      //       imgser_id: data.imgser_id,
      //       accession: data.epic_accn,
      //       examid: data.exam_id,
      //       DbEnv: DbEnv,
      //     },
      //     this.recvGridData
      //   );
      //   break;
        default:

    }
  };


  getPatients = () => {

    console.log('GET Patients Called');
    let sqlText = 'set rowcount 0 select  Name, activity_date = (select max(scandate) from mobiledoc..document doc, mobiledoc..documentfolders fldr where doc.patientid = pat.patientid and doc.doc_type = fldr.id and fldr.ParentID = 100 and fldr.delflag = 0 ), * from apex..vPatient pat order by 1 desc ';
    sqlText = 'set rowcount 500 select  Name, PatientId from apex..vPatient pat order by 1 desc ';

    try {
      exec(
        '"C:/CodeWorld/electron/project_desk_apexapp/src/api/venv/Scripts/python" C:/CodeWorld/electron/project_desk_apexapp/src/api/dbutil.py -cmd runsql -sql "' +
        sqlText + '"',
        { maxBuffer: 1024 * 500000 },
        (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          //console.log(`stdout: ${stdout}`);
          //console.log(stdout.replaceAll("None", "''").replaceAll("'", '"'));

          //console.log(data); let dframe = data['frame0']; let myObj = JSON.parse(dframe); data = myObj['rows'];

          let myObject = stdout.replaceAll("None", "''").replaceAll("'", '"');
          //console.log('RETFUNC DATA OBJECT', myObject);
          //let jsonVar = JSON.parse( JSON.stringify(myObject)) ;
          //console.log(jsonVar);

          // let myArray = [];
          // for (var i in myObject) {
          //   myArray.push(myObject[i]);
          // }

          console.log('RETFUNC DATA', myObject.length);
          console.log('RETFUNC DATA',  JSON.parse(myObject));
          //setRowData(myArray);

          //return (stdout);
          //this.setState({patientGrid_data: stdout.replaceAll("'", '"')})
          //retfunc ((JSON.stringify(stdout)));
        }
      );
    } catch (error) {
      console.log("Getpatients ERROR: ", error);
    }
  };


  handleChangePatient = (patientrow) => {

    this.setState(
      {
        patientid: patientrow.PatientId,
        patientrow: patientrow,
      },
      () => {
        fetch(
          this.endpoint_curr_linqdocs.replace(
            'arg_ecwpatid',
            this.state.patientid
          ),
          {}
        )
          .then((response) => {
            if (response.status !== 200) {
              return this.setState({
                placeholder: 'Something went wrong in getting data',
              });
            }
            return response.json();
          })
          .then((data) => {
            //console.log("___________________");
            //console.log(data);
            let dframe = data['frame0'];
            let myObj = JSON.parse(dframe);
            let data2 = myObj['rows'];
            //console.log(data2);
            this.setState(
              {
                linq_docs: data2,
                invoice_cpt: [],
                loaded: true,
              },
              () => {
                //console.log("Changed state", this.state.series.length);
                //this.linqGridElement.current.changeGridData(this.state.linq_docs,getColumnsList(data2[0]) );
              }
            );
          });

        fetch(
          this.endpoint_ecwenc.replace('arg_ecwpatid', this.state.patientid),
          {}
        )
          .then((response) => {
            if (response.status !== 200) {
              return this.setState({
                placeholder: 'Something went wrong in getting data',
              });
            }
            return response.json();
          })
          .then((data) => {
            //console.log("___________________");
            //console.log(data);
            let dframe = data['frame0'];
            let myObj = JSON.parse(dframe);
            let data2 = myObj['rows'];
            //console.log(data2);
            this.setState(
              {
                ecw_enc: data2,
                invoice_cpt: [],
                loaded: true,
              },
              () => {
                //console.log("Changed state", this.state.series.length);
                if (
                  this.ecwencGridElement.current &&
                  data2[0] &&
                  this.state.ecw_enc
                ) {
                  // this.ecwencGridElement.current.changeGridData(this.state.ecw_enc,getColumnsList(data2[0]) );
                }
              }
            );
          });
      }
    );
  };
  


  onRowSelected2 = (event) => {
      console.log('AG Row selected', event);

    let selectedNodes = event.api
      .getSelectedNodes()
      .filter((node) => node.selected);
    console.log(selectedNodes);

    let datarow = selectedNodes[0].data;

    handleChangePatient(datarow);
    //console.log('row2', selectedNodes[0].data, event);
  };



  handleAgStatement = (datarow) => {
    console.log('AG Statement selected', datarow);

    //this.setState({ filters: {}, selectedIndexes: [] });
    //let row = this.getRows().filter( (elem,indx)=> indx == this.state.selectedIndexes)[0];

    fetch(
      'https://192.168.21.199:8040/statement?patid=' +
        datarow.PatientId.toString()
    )
      .then(this.handleErrors)
      .then((r) => r.blob())
      .then((blob) => {
        let url = URL.createObjectURL(blob);
        let viewerUrl = encodeURIComponent(url);

        const frame_element = `../public/pdfjs/web/viewer.html?file=${viewerUrl} `;

        this.setState({ filepath: frame_element });
      });
  };

  handleFileClick000 = (file) => {
    const frame_element = `../public/pdfjs/web/viewer.html?file=${file_name}`;

    this.setState({ filepath: frame_element });
  };

  handleStatement = (row) => {
    //this.setState({ filters: {}, selectedIndexes: [] });
    //let row = this.getRows().filter( (elem,indx)=> indx == this.state.selectedIndexes)[0];
    console.log(row);
    fetch(
      'https://192.168.21.199:8040/statement?patid=' + row.PatientId.toString()
    )
      .then(this.handleErrors)
      .then((r) => r.blob())
      .then(showFile);
  };

  onRowSelectPatient = (data) => {
    //console.log("rowselected patient:", data[0].row);
    console.log(data);
    this.setState(
      { patientid: data[0].row.PatientId, patientrow: data[0].row },
      () => {
        fetch(
          this.endpoint_curr_linqdocs.replace(
            'arg_ecwpatid',
            this.state.patientid
          ),
          {}
        )
          .then((response) => {
            if (response.status !== 200) {
              return this.setState({
                placeholder: 'Something went wrong in getting data',
              });
            }
            return response.json();
          })
          .then((data) => {
            //console.log("___________________");
            //console.log(data);
            let dframe = data['frame0'];
            let myObj = JSON.parse(dframe);
            let data2 = myObj['rows'];
            //console.log(data2);
            this.setState(
              {
                linq_docs: data2,
                invoice_cpt: [],
                loaded: true,
              },
              () => {
                //console.log("Changed state", this.state.series.length);
                this.linqGridElement.current.changeGridData(
                  this.state.linq_docs,
                  getColumnsList(data2[0])
                );
              }
            );
          });

        fetch(
          this.endpoint_ecwenc.replace('arg_ecwpatid', this.state.patientid),
          {}
        )
          .then((response) => {
            if (response.status !== 200) {
              return this.setState({
                placeholder: 'Something went wrong in getting data',
              });
            }
            return response.json();
          })
          .then((data) => {
            //console.log("___________________");
            //console.log(data);
            let dframe = data['frame0'];
            let myObj = JSON.parse(dframe);
            let data2 = myObj['rows'];
            //console.log(data2);
            this.setState(
              {
                ecw_enc: data2,
                invoice_cpt: [],
                loaded: true,
              },
              () => {
                //console.log("Changed state", this.state.series.length);
                if (
                  this.ecwencGridElement.current &&
                  data2[0] &&
                  this.state.ecw_enc
                ) {
                  this.ecwencGridElement.current.changeGridData(
                    this.state.ecw_enc,
                    getColumnsList(data2[0])
                  );
                }
              }
            );
          });
      }
    );
  };

  handleCreateFolder = (key) => {
    alert('create folder: ' + key);
    return;
    this.setState((state) => {
      state.files = state.files.concat([
        {
          key: key,
        },
      ]);
      return state;
    });
  };

  handleCreateFiles = (files, prefix) => {
    alert('create files: ' + files + ' to ' + prefix);
    return;
    this.setState((state) => {
      const newFiles = files.map((file) => {
        let newKey = prefix;
        if (
          prefix !== '' &&
          prefix.substring(prefix.length - 1, prefix.length) !== '/'
        ) {
          newKey += '/';
        }
        newKey += file.name;
        return {
          key: newKey,
          size: file.size,
          modified: +Moment(),
        };
      });

      const uniqueNewFiles = [];
      newFiles.map((newFile) => {
        let exists = false;
        state.files.map((existingFile) => {
          if (existingFile.key === newFile.key) {
            exists = true;
          }
        });
        if (!exists) {
          uniqueNewFiles.push(newFile);
        }
      });
      state.files = state.files.concat(uniqueNewFiles);
      return state;
    });
  };

  handleRenameFolder = (oldKey, newKey) => {
    alert('rename folder: ' + oldKey + ' to ' + newkey);
    return;
    this.setState((state) => {
      const newFiles = [];
      state.files.map((file) => {
        if (file.key.substr(0, oldKey.length) === oldKey) {
          newFiles.push({
            ...file,
            key: file.key.replace(oldKey, newKey),
            modified: +Moment(),
          });
        } else {
          newFiles.push(file);
        }
      });
      state.files = newFiles;
      return state;
    });
  };

  recvProcessFileOutput = (returndata) => {
    console.log("Received from processfile: ", returndata);
  }

  handleRenameFile = (oldKey, newKey) => {
    console.log('rename: ' + oldKey + ' to ' + newKey);

    let processArgs = {
      'op' :  'rename',
      'current' : oldKey,
      'taget' : newKey
    };

    cli_processfile_py(this.recvProcessFileOutput, JSON.stringify(processArgs));

    //this.funcProcessDocument(this.state.docuContext, 'rename', oldKey, newKey);
    console.log('Rename File: Called funcProcessDocument');

    this.setState((state) => {
      const newFiles = [];
      state.files.map((file) => {
        if (file.key === oldKey) {
          newFiles.push({
            ...file,
            key: newKey,
            modified: +Moment(),
          });
        } else {
          newFiles.push(file);
        }
      });
      state.files = newFiles;
      return state;
    });
  };

  handleDeleteFolder = (folderKey) => {
    alert('delete folder: ' + folderkey);
    return;
    this.setState((state) => {
      const newFiles = [];
      state.files.map((file) => {
        if (file.key.substr(0, folderKey.length) !== folderKey) {
          newFiles.push(file);
        }
      });
      state.files = newFiles;
      return state;
    });
  };

  handleDeleteFile = (fileKey) => {
    console.log('File delete Clicked:' + fileKey);
    alert('File delete Clicked:' + fileKey);
    return;
    this.setState((state) => {
      const newFiles = [];
      state.files.map((file) => {
        if (file.key !== fileKey) {
          newFiles.push(file);
        }
      });
      state.files = newFiles;
      return state;
    });
  };

  handleFileClick = (file) => {
    this.setState(
      (state) => ({ ...state, filetodisplay: file.key, filepagenum: 1 }),
      function () {
        console.log('To Display mesg: ' + this.state.filetodisplay);
      }
    );
    console.log('File Clicked mesg:' + file.key);

    let file_name = file.key;
    // file_name =
    //   '\\' +
    //   file_name
    //     .replace('/mnt/scanhome', '\\192.168.1.17\\scanhome')
    //     .replace('/', '\\');
    // console.log('Getting windows file: ', file_name);

    const frame_element = `../public/pdfjs/web/viewer.html?file=${file_name}`;

    this.setState({ filepath: frame_element });
  };

  checkinDjangoApi = () => {
    console.log('Started django-api checkin.');

    const data = new FormData();
    axios.post(endpoint.replace('uploadfiles', 'checkin'), data).then((res) => {
      if (window.DOMParser) {
        // code for modern browsers
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(res.data, 'text/xml');
        let x = xmlDoc.getElementsByTagName('input');
        let cookieValue = x[0].attributes['value'].value;
        csrftoken = cookieValue;
        console.log(cookieValue);
      }

      console.log('csrf: =>' + csrftoken);
    });

    console.log('Completed django-api checkin.');
  };

  onRowSelectLinqReport = (data) => {
    console.log('Linq rowselectednew encounter:', data[0].row);
    console.log(
      'TO DIsplay' + data[0].row.dirpath + '/' + data[0].row.fileName
    );
    this.handleLinqReportPdf(data[0].row.dirpath + '/' + data[0].row.fileName);
  };

  onRowSelectLinqReport2 = (data) => {
    console.log('Linq rowselectednew encounter2:', data);
    console.log('TO DIsplay' + data.dirpath + '/' + data.fileName);
    this.handleLinqReportPdf(data.dirpath + '/' + data.fileName);
  };

  onRowSelectLinqReport0 = (data) => {
    console.log('Linq rowselectednew encounter0:', data);
  };

  handleLinqReportPdf = (filename) => {

    let full_file_path = `\\\\192.168.1.17\\d$\\eClinicalWorks\\ftp\\${filename}`;
    full_file_path = full_file_path.replace('/', '\\');

    console.log('Starting to get Linq File', full_file_path);

    //let url = URL.createObjectURL(full_file_path);

    const frame_element = `../public/pdfjs/web/viewer.html?file=${full_file_path}`;



    this.setState({ filepath: frame_element });

    // fetch(
    //   encodeURI('https://192.168.21.199:8040/getecwfile?filename=' + filename)
    // )
    //   .then(this.handleErrors)
    //   .then((r) => r.blob())
    //   .then((blob) => {
    //     let url = URL.createObjectURL(blob);
    //     let viewerUrl = encodeURIComponent(url);

    //     const frame_element = `../public/pdfjs/web/viewer.html?file=${viewerUrl} `;

    //     this.setState({ filepath: frame_element });
    //   });
  };

  // .then(this.showFilePdf);

  showFilePdf = (blob) => {
    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    //var newBlob = new Blob([blob], { type: "image/png" })
    console.log('Show PDF called');
    var newBlob = new Blob([blob], { type: 'application/pdf' });

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
    link.download = 'file.pdf';
    link.click();
    setTimeout(function () {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
    }, 100);
  };

  showFilePng = (blob) => {
    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    var newBlob = new Blob([blob], { type: 'image/png' });
    //var newBlob = new Blob([blob], { type: "application/pdf" })

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
    link.download = 'file.png';
    link.click();
    setTimeout(function () {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
    }, 100);
  };

  onControlsDateChange = (date) => {
    //var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";
    let d = date;
    console.log('New Date Value: ', date);
    var date_format_str = '';
    if (date != null) {
      var date_format_str =
        d.getFullYear().toString() +
        '-' +
        ((d.getMonth() + 1).toString().length == 2
          ? (d.getMonth() + 1).toString()
          : '0' + (d.getMonth() + 1).toString()) +
        '-' +
        (d.getDate().toString().length == 2
          ? d.getDate().toString()
          : '0' + d.getDate().toString());
      console.log('Date Change triggered: ', date, date_format_str);
    }
    this.setState(
      { recentdate: date, date, filePrefixDate: date_format_str },
      function () {
        console.log('New Date: ' + this.state.recentdate);
      }
    );
  };

  handleselectedFile = (event) => {
    let files_to_add = event.target.files;
    this.setState((prevState) => ({
      selectedFile: prevState.selectedFile.concat(files_to_add),
      filepagenum: 1,
    }));
  };

  handleUploadFiles = async () => {
    this.setState({ uploadProgress: {}, uploading: true });
    const promises = [];
    if (this.state.selectedFile.length > 0) {
      const files_to_add = this.state.selectedFile[0];
      for (let i = 0; i < files_to_add.length; i++) {
        promises.push(this.sendRequest(files_to_add[i]));
      }
    }
    try {
      await Promise.all(promises);

      this.setState(
        {
          successfullUploaded: true,
          selectedFile: [],
          inputRestKey: Date.now(),
          uploading: false,
        },
        () => {
          //this.handleRefreshFiles();
        }
      );
    } catch (e) {
      // Not Production ready! Do some error handling here instead...
      this.setState({ successfullUploaded: true, uploading: false });
    }
  };

  sendRequest(file) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const copy = { ...this.state.uploadProgress };
          copy[file.name] = {
            state: 'pending',
            percentage: (event.loaded / event.total) * 100,
          };
          this.setState({ uploadProgress: copy });
        }
      });

      req.upload.addEventListener('load', (event) => {
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: 'done', percentage: 100 };
        this.setState({ uploadProgress: copy });
        resolve(req.response);
      });

      req.upload.addEventListener('error', (event) => {
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: 'error', percentage: 0 };
        this.setState({ uploadProgress: copy });
        reject(req.response);
      });

      const formData = new FormData();
      formData.append('file', file, file.name);

      req.open('POST', endpoint);
      req.send(formData);
    });
  }



  recevieRefreshFiles = () => {

    fetch(
      backend_api_endpoint + 'getfiles?folderpath=' + this.state.folderContext
    )
      .then((response) => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: 'Something went wrong in getting data',
          });
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ files: data });
        console.log(data);
      });

  }

  handleRefreshFiles = () => {
    console.log("Getting files from: ", this.state.folderContext);
    ipcRenderer.send('show-folder-list', this.state.folderContext);

    return;

  };

  handleUpload = () => {
    const data = new FormData();
    data.append('file', this.state.selectedFile, this.state.selectedFile.name);
    console.log('Uploading File: ' + this.state.selectedFile.name);

    //var file = new FormData();
    //file.append('name',files[0])
    // var req=request
    //           .post(endpoint)
    //           .send(data);
    // req.end(function(err,response){
    //     console.log("upload done!!!!!");
    // });

    axios
      .post(endpoint, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': csrftoken,
        },
        onUploadProgress: (ProgressEvent) => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
          });
        },
      })
      .then((res) => {
        console.log(res.statusText);
      });
  };

  funcProcessDocument = (context, fileop, srcfile, destfile) => {
    let context_data = {
      fileop: fileop,
      patientid: this.state.patientid,
      patientname: this.state.patientrow.Name,
      filecategory: this.state.docuType,
      filename: srcfile,
      context: context,
      renameto: destfile,
      filedate: this.state.recentdate,
      pagenum: this.state.filepagenum,
      docutype: this.state.docuType,
      docupages: this.state.docuPages,
      actiondesc: this.state.actiondesc,
    };

    console.log('Starting process Document File: ');

    cli_processfile_py(this.recvProcessFileOutput, JSON.stringify(context_data));

    // axios
    //   .post(endpoint_processing, context_data, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'X-CSRFToken': csrftoken,
    //     },
    //   })
    //   .then((res) => {
    //     console.log(res.status, res.statusText, res.data);

    //     this.setState((state) => {
    //       const newFiles = [];
    //       state.files.map((file) => {
    //         if (file.key === res.data.inputjson.filename) {
    //           newFiles.push({
    //             ...file,
    //             key: res.data.inputjson.new_name,
    //             modified: +Moment(),
    //           });
    //         } else {
    //           newFiles.push(file);
    //         }
    //       });
    //       state.files = newFiles;
    //       return state;
    //     });
    //   });

  };

  handleProcessDocument = () => {
    var target_name = '';
    target_name = target_name + this.state.filePrefixDate;
    console.log('Change to target name1: ', target_name);
    target_name =
      target_name +
      (this.state.docuType == null ? '' : ' ' + this.state.docuType);
    console.log('Change to target name2: ', target_name);
    target_name =
      target_name +
      (this.state.newFileNameSelected == ''
        ? ''
        : ' ' + this.state.newFileNameSelected);
    console.log('Change to target name3: ', target_name);
    target_name =
      target_name +
      (this.state.RenameToFilename == ''
        ? ''
        : ' ' + this.state.RenameToFilename);
    console.log('Change to target name4: ', target_name);

    let arg_file_operation = 'uploademr';

    if (this.state.docuContext == 'EMR') {
      arg_file_operation = 'uploademr';
    } else {
      arg_file_operation = 'rename';
    }

    // this.funcProcessDocument(
    //   this.state.docuContext,
    //   arg_file_operation,
    //   this.state.filetodisplay,
    //   target_name
    // );

    let context_data = {
      fileop: arg_file_operation,
      patientid: this.state.patientid,
      patientname: this.state.patientrow.Name,
      filecategory: this.state.docuType,
      filename: this.state.filetodisplay,
      context: this.state.docuContext,
      renameto: target_name,
      filedate: this.state.recentdate,
      pagenum: this.state.filepagenum,
      docutype: this.state.docuType,
      docupages: this.state.docuPages,
      actiondesc: this.state.actiondesc,
    };

    console.log('Starting process Document File: ');
    cli_processfile_py(this.recvProcessFileOutput, JSON.stringify(context_data));
    console.log('Called funcProcessDocument');
  };

  handleDocuTypeChange = (selected) => {
    this.setState({
      docuType: selected,
    });
  };

  handeRenameTo = (event) => {
    let filename = event.target.value;
    //console.log('Rename to Filename : ', filename);
    this.setState(
      {
        RenameToFilename: filename,
      },
      () => {
        //this.state.handleRenameTo(filename)
      }
    );
  };

  handleFilenameSelectChange = (selected) => {
    console.log('CreateSelect: ', selected);
    this.setState(
      {
        newFileNameSelected: selected.value,
      },
      () => {
        //this.state.handleRenameTo(filename)
      }
    );
  };
  handleFilenameInputChange = (event) => {
    //console.log("Create Input Changed: " , event);
  };

  handleActionTextChange = (event) => {
    let actiontext = event.target.value;
    //console.log('Rename to Filename : ', filename);
    this.setState(
      {
        actiondesc: actiontext,
      },
      () => {
        //this.state.handleRenameTo(filename)
      }
    );
  };

  handleDocuPagesChange = (selected) => {
    this.setState({
      docuPages: selected,
    });
  };

  handleDocuContextChange = (selected) => {
    this.setState({
      docuContext: selected,
    });
  };

  handlePageChange = (pagenum) => {
    this.setState({
      filepagenum: this.state.filepagenum + pagenum,
    });
  };

  goToPrevPage = () => {
    this.setState((state) => ({ filepagenum: state.filepagenum - 1 }));
  };
  goToNextPage = () => {
    this.setState((state) => ({ filepagenum: state.filepagenum + 1 }));
  };

  updateTotalPages = ({ numPages }) => {
    console.log('Got called: updateTotalPages');
    this.setState((state) => ({
      docuType: null,
      docuPages: 'All',
      filetotalpages: numPages,
    }));
  };

  handleFolderChange = (selected) => {
    console.log('Selected folder: ' + selected.value);
    let folderpath = '\\\\192.168.1.17\\SCANHOME';
    switch (selected.value) {
      case 'scanhome':
        folderpath = '\\\\192.168.1.17\\SCANHOME';
        break;
      case 'echohome':
          folderpath = '\\\\192.168.21.54\\d\\ECHOSTORE\\Export';
          break;        
      case 'skscan':
        folderpath = '\\\\pcode-nas1\\skshare\\skscan';;
        break;
      case 'uploads':
        folderpath = '\\\\192.168.1.17\\UPLOAD_HOME';
          break;     
      case 'apexdoc':
        folderpath = '\\\\192.168.1.17\\d$\\ApexDocs\\EMR';
              break;   
      case 'local':
            folderpath = 'c:\\mydocs';
                      break;                         
      default:
        folderpath = '\\\\192.168.1.17\\UPLOAD_HOME';
        break;
    }
    console.log('Will get files from folder: ' + folderpath);
    this.setState(
      {
        folderContext: folderpath,
        folderType: selected.value,
      },
      () => {
        this.handleRefreshFiles();
      }
    );
  };

  updateStatemdb = (changedata) => {
    console.log(changedata);
    console.log(changedata);
  };

  handleVerticalTabChange = (_, activeIndex) => this.setState({ activeIndex });

  render(props) {
    //console.log("In Render for DocuBrowswer");
    //this.setState({'files': this.props.data})
    //console.log(this.props.data)

    const { classes } = this.props;
    const { activeIndex } = this.state;

    const folderPaths = [
      { value: 'scanhome', label: 'Scan Home' },
      { value: 'echohome', label: 'Echo Home' },      
      { value: 'uploads', label: 'Upload Folder' },
      { value: 'apexdoc', label: 'Apex Documents' },
      { value: 'skscan', label: 'SK Scan Folder' },
      { value: 'local', label: 'Local Folder' },      
    ];

    //endpoint_patients = backend_db_endpoint + "exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set rowcount 0 select * from apex..vPatient";

    let endpoint_patients =
      backend_db_endpoint +
      'exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set rowcount 0 select  Name, activity_date = (select max(scandate) from mobiledoc..document doc, mobiledoc..documentfolders fldr where doc.patientid = pat.patientid and doc.doc_type = fldr.id and fldr.ParentID = 100 and fldr.delflag = 0 ), * from apex..vPatient pat where patientid in (select distinct patientid from mobiledoc..document doc, mobiledoc..documentfolders fldr where doc.doc_type = fldr.id and fldr.ParentID = 100 and fldr.delflag = 0 ) order by 1 desc ';


    return (

      <div
      style={{
        display: 'flex',
        width: '100%',
      }}
    >
      <VerticalTabs value={activeIndex} onChange={this.handleVerticalTabChange}>
        <MyTab label="Documents" style={{ transform: [{ rotate: '180deg' }] }} />
        <MyTab label="Claims" />
        <MyTab label="Deposits" />
      </VerticalTabs>

      {activeIndex === 0 && (
          <TabContainer>
      <React.Fragment>
        <div
          className="container-fluid"
          style={{ height: '100%', width: '100%' }}
        >
          <div
            className="row justify-content-start"
            style={{ height: '100%', width: '100%' }}
          >
            <div
              className="col-3 py-3 overflow-auto"
              style={{
                height: '90vh',
                width: '100%',
                backgroundColor: 'powderblue',
              }}
            >
              <div>
                <div className="App">
                  <Input
                    className="mb-2"
                    type="file"
                    key={this.state.inputRestKey}
                    name=""
                    id=""
                    multiple
                    onChange={this.handleselectedFile}
                  />
                  <Progress
                    className="mb-2"
                    value={Math.round(this.state.loaded, 2)}
                  />
                  <Button className="mb-2" onClick={this.handleUploadFiles}>
                    Upload
                  </Button>
                </div>
                <Button
                  style={{ width: '100%' }}
                  className="mb-3"
                  color="primary"
                  onClick={this.handleRefreshFiles}
                >
                  Refresh
                </Button>
                <div className="d-inline">
                  <Select
                    value={this.state.folderType}
                    onChange={this.handleFolderChange}
                    options={folderPaths}
                  />
                </div>

                <FileBrowser
                  style={{
                    height: 850,
                    width: 'auto',
                    overflow: 'scroll',
                    backgroundColor: 'powderblue',
                  }}
                  files={this.state.files}
                  nestChildren={false}
                  renderStyle={'table'}
                  icons={Icons.FontAwesome(4)}
                  onCreateFolder={this.handleCreateFolder}
                  onCreateFiles={this.handleCreateFiles}
                  onMoveFolder={this.handleRenameFolder}
                  onMoveFile={this.handleRenameFile}
                  onRenameFolder={this.handleRenameFolder}
                  onRenameFile={(oldKey, newKey) => {
                    console.log('rename called=>' + newKey);
                    this.handleRenameFile(oldKey, newKey);
                  }}
                  onDeleteFolder={this.handleDeleteFolder}
                  onDeleteFile={this.handleDeleteFile}
                  onSelectFile={this.handleFileClick}
                />
              </div>
            </div>

            <div
              className="col-5 py-3 overflow-auto"
              style={{ height: '90vh', backgroundColor: 'lightgrey' }}
            >
              <Tabs
                value={this.state.tablValue}
                onChange={this.handleTabChange}
                aria-label="simple tabs example"
              >
                <Tab label="Files" {...a11yProps(0)} />
                <Tab label="Claims" {...a11yProps(1)} />
                <Tab label="Tab3" {...a11yProps(2)} />
              </Tabs>
              <TabPanel
                value={this.state.tablValue}
                index={0}
                style={{ height: '90%', width: '100%' }}
              >
                <div style={{ height: '90%', width: '100%', margin: 0 }}>
                  <button id="myButton1" onClick={this.openPDF}>
                    GetPageNumber
                  </button>
                  <button id="myButton3" onClick={this.nextPDFPage}>
                    Previous Page{' '}
                  </button>
                  <button id="myButton4" onClick={this.nextPDFPage}>
                    Next Page{' '}
                  </button>
                  <iframe
                    width="100%"
                    height="800px"
                    backgroundcolor="lightgrey"
                    ref={this.state.iframeRef}
                    src={this.state.filepath}
                  />
                </div>

                {/* <ShowPDF patid={this.state.filetodisplay} filename={this.state.filetodisplay} style={{ width: '100%', backgroundColor: 'lightgrey' }} onDocumentLoaded={this.updateTotalPages} pageNumber={this.state.filepagenum} /> */}
              </TabPanel>
              <TabPanel value={this.state.tablValue} index={1}>
                <label>Encounters</label>
                <DataGrid
                  ref={this.ecwencGridElement}
                  initialRows={this.state.ecw_enc}
                  columns={getColumnsList(this.state.ecw_enc[0])}
                  gridheight={200}
                  gridname={'encounters'}
                  onRowSelect={this.onRowSelectEncounter}
                />
                <label>Claim Details</label>
                <DataGrid
                  ref={this.invoiceGridElement}
                  initialRows={this.state.invoice_cpt}
                  columns={getColumnsList(this.state.invoice_cpt[0])}
                  gridheight={200}
                  gridname={'invoice_cpt'}
                  onRowSelect={this.onRowSelectExam}
                />{' '}
              </TabPanel>
              <TabPanel value={this.state.tablValue} index={2}>
              <button
                  onClick={() => {
                    shell.openExternal('https://access.cardionet.com/');
                  }}
                >
                  Cardionet
                </button>
                <button
                  onClick={() => {
                    shell.openExternal('https://clc.medtroniccarelink.net/Clinician/home.aspx');
                  }}
                >
                  Medtronic
                </button>   
                <p>
                Cardionet in pps -> emontalvo, Apex@2020c
Medtronic Reveal and Pacemaker Reports
 in pps-> hkorlakunta1, Apex@2021c
</p>             
              </TabPanel>
            </div>

            <div className="col-4 py-3" style={{ height: '100vh' }}>
            <div className="d-inline">

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          value={this.state.recentdate}
          onChange={this.onControlsDateChange}
          autoOk={true}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        </MuiPickersUtilsProvider>

                <RadioGroup
                  className="d-inline"
                  name="doccontext"
                  selectedValue={this.state.docuContext}
                  onChange={this.handleDocuContextChange}
                >
                  <Radio value="EMR" selected />
                  EMR
                  <Radio value="normal" />
                  Normal
                </RadioGroup>
              </div>

              <form className="form-horizontal">
                <div className="form-group d-inline">
                  <span
                    className="d-inline"
                    style={{
                      height: 'fit-content',
                      width: 'fit-content',
                      backgroundColor: 'powderblue',
                    }}
                  >
                    {this.state.filePrefixDate} {this.state.docuType}{' '}
                    {this.state.newFileNameSelected}
                    {this.state.RenameToFilename} 
                  </span>
                  <input
                    type="text"
                    className="form-control "
                    placeholder="Enter File Name"
                    id="filename"
                    name="filename"
                    width="100%"
                    onChange={this.handeRenameTo}
                  />
                  <CreatableSelect
                    isClearable
                    onChange={this.handleFilenameSelectChange}
                    onInputChange={this.handleFilenameInputChange}
                    options={colourOptions}
                  />
                </div>
                <span className="d-block">
                  {`${this.state.patientid} => ${this.state.patientrow.Name} `}
                  </span>
              </form>

              <div className="d-inline-block">
                Pages:
                <RadioGroup
                  className="d-inline"
                  name="docpages"
                  selectedValue={this.state.docuPages}
                  onChange={this.handleDocuPagesChange}
                >
                  <Radio value="All" selected />
                  All
                  <Radio value="current" />
                  Current
                </RadioGroup>
                {this.state.docuType}{' '}
                {this.state.docuPages == 'current'
                  ? '#(' + this.state.filepagenum + ')'
                  : this.state.docuPages}
              </div>

              {/* <div classname="d-inline" >
              <CustomInput type="select" id="docpages" name="docpages" value={this.state.docuPages} onChange={this.handleDocuPagesChange}>
                <option value="All">All</option>
                <option value="Current">Current Page (#{this.state.filepagenum})</option>
              </CustomInput>
              </div> */}

              <div className="d-inline-block">
                Type:
                <RadioGroup
                  className="d-inline"
                  name="doctype"
                  selectedValue={this.state.docuType}
                  onChange={this.handleDocuTypeChange}
                >
                  <Radio value="ECHO" />
                  Echo
                  <Radio value="CAROTID" />
                  Carotid
                  {/* <Radio value="LED" />LED
                <Radio value="PB" />PB
                <Radio value="OPMT" />OPMT
                <Radio value="BL" />BL
                <Radio value="RETMAIL" />RETMAIL */}
                  <Radio value="MCOT Daily" />
                  MCOT Daily
                  <Radio value="LINQ Report" />
                  LINQ Rep
                  <Radio value="LINQ QL" />
                  LINQ QL
                  <Radio value="PM Remote QL" />
                  PM Remote QL
                  <Radio value="Event Report" />
                  Event Report
                </RadioGroup>
              </div>

              <button type="button" onClick={this.handleProcessDocument}>
                Process Document
              </button>

              <DataProvider
                endpoint={endpoint_patients}
                render={(data) => (
                  <React.Fragment>

<ApexDataGrid
                  key="patlist"
                  gridname={DATA_PATIENT_LIST}
                  ShowAllColumns={true}
                  gridTitle={''}
                  divHeight={'420px'}
                  onRefresh={() =>
                    this.handleGridRefresh(DATA_PATIENT_LIST)
                  }
                  gridData={this.state.dataPatientList}
                  onRowSelected={this.onRowSelectExam}
                  button2Label="Stmt"
                  onButton2Callback={this.onRowSelectView}
                />


                    {/* <ApexDataGrid
                      key="child"
                      gridData={data}
                      onRowSelected={this.onRowSelected2}
                      button2Label="Statement"
                      onButton2Callback={this.handleAgStatement}
                    /> */}
                  </React.Fragment>
                )}
                />

              <label>Loop Recorder Reports</label>
              <ApexDataGrid
                key="linq"
                gridname={'linq_reports'}
                ref={this.linqGridElement}
                gridData={this.state.linq_docs}
                onRowSelected={this.onRowSelectLinqReport0}
                button2Label="View"
                onButton2Callback={this.onRowSelectLinqReport2}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
      </TabContainer>)}
        {activeIndex === 1 && (
          <TabContainer>
                      <div className="container-fluid">
                      <ApexClaimsView />

      </div>

             </TabContainer>)}
        {activeIndex === 2 && <TabContainer>

          <DepositApp />
          {/* <HostWatcher /> */}
          </TabContainer>}
      </div>
    );
  }
}

// const AppDocs = () => (
//   <DocuBrowser />

// );

/* console.log(AppDocs);
const wrapper = document.getElementById("docubrowser1");
wrapper ? ReactDOM.render(<AppDocs />, wrapper) : null; */

{
  /* <p class="mb-1">Document Upload Date:</p>
<DateTimePicker
  className="mb-2"
  onChange={this.onControlsDateChange}
  value={this.state.date}
/> */
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const VerticalTabs = withStyles((theme) => ({
  flexContainer: {
    flexDirection: 'column',
  },
  indicator: {
    display: 'none',
  },
}))(Tabs);

const MyTab = withStyles((theme) => ({
  root: {
    backgroundColor: '#ccc',
    borderRadius: theme.shape.borderRadius,
  },
  wrapper: {
    backgroundColor: '#ddd',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
  selected: {
    color: 'tomato',
    borderBottom: '2px solid tomato',
  },
}))(Tab);

function TabContainer(props) {
  return <React.Fragment>{props.children}</React.Fragment>;
}


export default withStyles(styles, { withTheme: true })(withRouter(DocuBrowser));

