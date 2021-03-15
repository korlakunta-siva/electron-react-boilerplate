import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import icon from '../assets/icon.svg';
import {
  cli,
  cli_tasklist,
  cli_logfile,
  cli_wslogfile,
  cli_logfolder,
  cli_wslogfolder,
  cli_consolidated_log,
  cli_wksadmlogfolder,
  selectFiles,
  cli_getdicom_meta,
  cli_viewdicom_file,
  cli_sendtociga_folder,
} from '../../utils/cli';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

const { exec } = require('child_process');

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import DicomSetView from '../common/DicomSetView';

import { ipcRenderer } from 'electron';
import { PropertyKeys } from 'ag-grid-community';
import { withRouter } from 'react-router-dom';

//import 'ag-grid-enterprise';
// import 'ag-grid-community/dist/styles/ag-grid.css';
// import 'ag-grid-community/dist/styles/ag-theme-balham.css';

// import 'ag-grid-enterprise';
// import '~/node-modules/ag-grid-community/dist/styles/ag-grid.css';
// import '~/node-modules/ag-grid-community/dist/styles/ag-theme-balham.css';

// import "ag-grid-community/dist/styles/ag-grid.css";
// import "ag-grid-community/dist/styles/ag-theme-balham/"

// Launch webserivce:  C:\WKSAdmin\Replicated Files\Local Launchers\QREADS Web Service.vbs
// QREADS5 Log File:  C:\Program Files\Mayo Foundation\QREADS 5\qreads5.log
//  \\R0303393\c$\Program Files\Mayo Foundation\QREADS 5\qreads5.log

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div {...other}>
      {value === index && (
        <Box style={{ padding: 2 }} p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

const HostErrorLog = (props) => {
  const host = props.hostname;
  return (
    <div key={host}>
      {host && host.trim().length > 2 ? (
        <React.Fragment>
          <span style={{ margin: 3 }}>{host}</span>
          <button
            type="button"
            onClick={() => cli_tasklist(props.retfunc, host)}
          >
            Java Tasks
          </button>
          <button
            type="button"
            onClick={() => cli_consolidated_log(props.recvEventsfunc, host)}
          >
            QR Events
          </button>
          <button type="button" onClick={() => cli_logfile(host)}>
            QReads Log File
          </button>

          <button type="button" onClick={() => cli_logfolder(host)}>
            Log Folder
          </button>

          <button type="button" onClick={() => cli_wslogfile(host)}>
            WS Log File
          </button>
          <button type="button" onClick={() => cli_wslogfolder(host)}>
            WS Log Folder
          </button>
          <button type="button" onClick={() => cli_wksadmlogfolder(host)}>
            WKSAdmin Log Folder
          </button>

          <a
            href={'http://' + `${host.trim()}:9780/QReadsTestService`}
            target="qrws_check"
            rel="noreferrer"
          >
            <button type="button">
              <span role="img" aria-label="books"></span>
              Check Webservice
            </button>
          </a>
        </React.Fragment>
      ) : (
        ''
      )}
    </div>
  );
};
const App = (props) => {
  // const [gridApi, setGridApi] = useState([]);
  // const [gridColumnApi, setGridColumnApi] = useState([]);

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [rowData, setRowData] = useState([]);

  const [gridConsEventsApi, setGridConsEventsApi] = useState(null);
  const [gridConsEventsColumnApi, setGridConsEventsColumnApi] = useState(null);
  const [rowConsEventsData, setRowConsEventsData] = useState([]);

  const [dicomData, setdicomData] = useState([]);
  const [dicomKOData, setdicomKOData] = useState([]);
  const [dicomMetaData, setdicomMetaData] = useState([]);

  const ipc = require('electron').ipcRenderer;

  const getDicmFiles = () => {
    // const res = ipcRenderer.sendSync('show-open-dialog', "cmd");
    // console.log("IN REACT: ", res);
    // return res;

    ipc.send('open-file-dialog');

    //selectFiles();
  };

  const onSendExam2CIGA = () => {
    ipc.send('open-file-dialog-send2ciga');
  };

  const getELQFile = () => {
    // const res = ipcRenderer.sendSync('show-open-dialog', "cmd");
    // console.log("IN REACT: ", res);
    // return res;

    ipc.send('open-elq-dialog');

    //selectFiles();
  };

  function onRowSelected1(event) {
    //window.alert('row1 ');
    console.log(event);
    let selectedNodes = event.api
      .getSelectedNodes()
      .filter((node) => node.selected);
    console.log(selectedNodes);

    // try {
    //   if (selectedNodes) {
    //     let selectedData = selectedNodes.map((node) => node.data);
    //     console.log('KO SERES', selectedData[0].koseries);
    //     setdicomKOData(selectedData[0].koseries);
    //     // alert(`Selected Nodes:\n${JSON.stringify(selectedData)}`);
    //     //return selectedData;
    //   } else {
    //     setdicomKOData([]);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }

    console.log('row1', event);
  }

  function onRowSelected2(event) {
    let selectedNodes = event.api
      .getSelectedNodes()
      .filter((node) => node.selected);
    console.log(selectedNodes);

    console.log('row2', selectedNodes[0].data, event);
  }

  // +
  //       event.node.data.athlete +
  //       ' selected = ' +
  //       event.node.isSelected()

  useEffect(() => {
    console.log('USEEFFECT CALLED');
    ipc.on('selected-file', function (event, path) {
      //do what you want with the path/file selected, for example:
      console.log('REACT: ' + path);
      cli_getdicom_meta(recv_dicom_meta, path);
    });
  }, []);

  const recv_dicom_meta = (data) => {
    let modified_data = data.replaceAll("'", '"');
    //console.log('Received DICOM Data', modified_data);
    let myObject = JSON.parse(modified_data);

    // let myArray = [];
    // for (var i in myObject) {
    //   myArray.push(myObject[i]);
    // }

    console.log('DICOM', myObject);
    // if (myObject.hasOwnProperty('koseries')) {
    //   setdicomKOData(myObject['koseries']);
    // }

    setdicomData(myObject);

    let dicomMeta = [];
    let unique_series = myObject.reduce((accumulator, currentValue) => {
      //console.log('image Instance Row:', accumulator, currentValue);

      let found = false;
      for (let i = 0; i < accumulator.length; i++) {
        if (
          accumulator[i].SeriesInstanceUID == currentValue.SeriesInstanceUID
        ) {
          found = true;
          accumulator[i].ImageCount += 1;
          break;
        }
      }
      if (!found) {
        let IsKO = false;
        if (currentValue.hasOwnProperty('koseries')) {
          let ko_series = currentValue['koseries'];
          if (ko_series != '') {
            IsKO = true;
          }
          //console.log('KO INFO', IsKO, currentValue['koseries'], currentValue);
        }
        console.log();
        accumulator.push({
          IsKO: IsKO,
          ImageCount: 1,
          RejectedCount: 0,
          SeriesInstanceUID: currentValue.SeriesInstanceUID,
          StudyInstanceUID: currentValue.StudyInstanceUID,
          SOPClassUID: currentValue.SOPClassUID,
          SeriesPath: currentValue.filepath.match(/(.*)[\/\\]/)[1] || '',
          Accession: currentValue.Accession,
          DisplayName: currentValue.DisplayName,
          Modality: currentValue.Modality,
          PatientID: currentValue.PatientID,
          PatientName: currentValue.PatientName,
          AffectedSeries: currentValue['koseries'],
        });
      }
      //console.log('ACCUMULATOR', accumulator);

      //console.log('FOUND KO', currentValue['koseries']);
      return accumulator;

      //accumulator.concat(currentValue)
    }, []);

    for (let i = 0; i < unique_series.length; i++) {
      if (unique_series[i].IsKO) {
        //console.log('PROCESS THIS', unique_series[i].AffectedSeries);
        unique_series[i].AffectedSeries.forEach((element) => {
          // console.log(
          //   'PROCESS THIS',
          //   element.seruid,
          //   element.images,
          //   element.images.length
          // );

          for (let j = 0; j < unique_series.length; j++) {
            console.log(
              'CHECKING',
              unique_series[j].SeriesInstanceUID == element.seruid,
              unique_series[j].SeriesInstanceUID,
              element.seruid
            );
            if (unique_series[j].SeriesInstanceUID == element.seruid) {
              unique_series[j].RejectedCount += element.images.length;
              console.log(
                'CHECKING-TRUE',
                unique_series[j].SeriesInstanceUID == element.seruid,
                unique_series[j].SeriesInstanceUID,
                element.seruid
              );
              break;
            }
          }
        });
      }
    }

    console.log('Summary', unique_series, myObject['koseries']);

    setdicomKOData(unique_series);
  };

  const retfunc = (data) => {
    //console.log(data);
    //let gotdata = JSON.parse(data);
    console.log('Received Data');
    let myObject = JSON.parse(data);

    let myArray = [];
    for (var i in myObject) {
      myArray.push(myObject[i]);
    }

    console.log('RETFUNC DATA', myArray);
    //setRowData(myArray);
    setRowData(
      myArray
      // .filter((row) =>
      //   row.cmdline.toLowerCase().includes('java'.toLowerCase()))
    );

    //console.log(myObject);
    // data.map(row => {
    //   console.log(row.node);

    // });
    //console.log(gotdata);
  };

  const recvEventsfunc = (data) => {
    console.log('Consolidated Events', data);

    let myObject = JSON.parse(data);

    let myArray = [];
    for (var i in myObject) {
      myArray.push(myObject[i]);
    }

    //   myObject.forEach(function(element){
    //     console.log(element);
    // });

    setRowConsEventsData(myObject);
    //gridConsEventsApi.setRowData(myObject)

    // var params = getParams();
    // gridConsEventsApi.getr.exportDataAsCsv(params);
  };

  const getCmdOut = () => {
    cli_tasklist(retfunc);
    //console.log(gotProcs);
  };

  const getCmdOutLog = (host) => {
    alert('Getting Log for : ' + host);
    cli_logfile(host);
    //console.log(gotProcs);
  };

  const getwsCmdOutLog = (host) => {
    cli_wslogfile(host);
    //console.log(gotProcs);
  };

  const [hostname, setHostname] = useState('R5087474');
  //R0295540,
  const [hostnamelist, setHostnameList] = useState('R5085146');

  function useInput({ type /*...*/ }) {
    const [value, setValue] = useState('');
    const input = (
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={type}
      />
    );
    return [value, input];
  }

  // const [username, userInput] = useInput({ type: "text" });
  // const [password, passwordInput] = useInput({ type: "text" });

  const hostListComponents = hostnamelist
    .split(',')
    .map((host) => (
      <HostErrorLog
        retfunc={retfunc}
        recvEventsfunc={recvEventsfunc}
        hostname={host}
        key={host}
      />
    ));

  function onGridReady(params) {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  }

  const onGridConsEventsReady = (params) => {
    setGridConsEventsApi(params.api);
    setGridConsEventsColumnApi(params.columnApi);
  };

  const onButtonClick = (e) => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    const selectedDataStringPresentation = selectedData
      .map((node) => node.pid + ' ' + node.cmdline)
      .join(', ');
    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  };

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function getParams() {
    return {
      fileName: 'export1.csv',
      onlySelected: true,
    };
  }

  const onBtnExport = (api) => {
    let params = {};

    // if (params.suppressQuotes || params.columnSeparator) {
    //   alert(
    //     'NOTE: you are downloading a file with non-standard quotes or separators - it may not render correctly in Excel.'
    //   );
    // }

    if (api.getSelectedNodes().length > 0) {
      params = {
        fileName: 'export1.csv',
        onlySelected: true,
      };
    } else {
      params = {
        fileName: 'export1.csv',
      };
    }

    //gridApi.forEachNode(node => {console.log(node.data)});
    api.exportDataAsCsv(params);
    //console.log(gridApi.exportDataAsCsv(params))
    //gridApi.exportDataAsCsv(params);
  };

  const onImageView = ({ filepath }) => {
    console.log('READY TO OPEN: ', filepath);
    cli_viewdicom_file(filepath);
  };

  const onSendSeries = (rowdata) => {
    console.log('READY SEND: ', rowdata);
    cli_sendtociga_folder(rowdata.SeriesPath);
  };

  // INT Server  SERVER=http://qreadsq3ha1.mayo.edu:9082/MCRQREADS/
//"C:\WKSAdmin\Replicated Files\Local Launchers\Qreads.vbs" environment=test singleinstancelaunch=testing examid=%1 clinicnumber=%2

  const onOpenQREADS = (rowdata) => {
    console.log('READY OPEN IN QREADS: ', rowdata);
    try {
      exec(
        '"C:\\WKSAdmin\\Replicated Files\\Local Launchers\\Qreads.vbs" PARENTAPP=SIVA ENVIRONMENT=PROD  MODE=ONLINE CLINICNUMBER=' +
          rowdata.PatientID +
          ' ACCESSION=' +
          rowdata.Accession,
        { maxBuffer: 1024 * 50000 },
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
          console.log(stdout);
          //retfunc(stdout);
          //retfunc ((JSON.stringify(stdout)));
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <div style={{ marginTop: '50px' }}>
        {/* <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div> */}
        {/* {userInput} -> {username}
      {passwordInput} -> {password} */}
        <span style={{ display: 'block-inline', margin: 4 }}>Hostname</span>
        <input
          onChange={(e) => setHostname(e.target.value)}
          value={hostname}
          style={{ minWidth: 8, flex: 1 }}
        />
        <button type="button" onClick={() => cli_tasklist(retfunc, hostname)}>
          Java Tasks
        </button>
        <button
          type="button"
          onClick={() => cli_consolidated_log(recvEventsfunc, hostname)}
        >
          QR Events
        </button>
        <button type="button" onClick={() => cli_logfile(hostname)}>
          Get QReads Log File
        </button>
        <button type="button" onClick={() => cli_logfolder(hostname)}>
          QReads Log Folder
        </button>
        <button type="button" onClick={() => cli_wslogfile(hostname)}>
          WS Log File
        </button>
        <button type="button" onClick={() => cli_wslogfolder(hostname)}>
          WS Log Folder
        </button>
        <button type="button" onClick={() => cli_wksadmlogfolder(hostname)}>
          WKSAdmin Log Folder
        </button>
        <a
          href={'http://' + `${hostname.trim()}:9780/QReadsTestService`}
          target="qrws_check"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books"></span>
            Check Webservice
          </button>
        </a>
        <br />
        <span style={{ display: 'block-inline', margin: 4, padding: 4 }}>
          Host List
        </span>
        <input
          style={{ width: '60%' }}
          onChange={(e) => setHostnameList(e.target.value)}
          value={hostnamelist}
        />
        <div>{hostListComponents}</div>
        <div className="Hello1" style={{ width: '100%' }}>
          <AppBar position="static" style={{ margin: 1 }}>
            <Tabs value={value} onChange={handleChange}>
              <Tab label="Java Tasklist" />
              <Tab label="QREADS Events" />
              <Tab label="DICOM Files" />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <div className="ag-fresh">
              {/* <button onClick={onButtonClick}>Get selected rows</button> */}
              <button onClick={() => onBtnExport(gridApi)}>
                {' '}
                Download file as CSV{' '}
              </button>
              <div
                className="ag-theme-balham"
                style={{ height: '70vh', width: '100%' }}
              >
                <AgGridReact
                  onGridReady={onGridReady}
                  rowData={rowData}
                  rowSelection="multiple"
                  rowDragManaged={true}
                  suppressMoveWhenRowDragging={true}
                  animateRows={true}
                  width="100%"
                >
                  <AgGridColumn
                    field="pid"
                    rowDrag={true}
                    headerCheckboxSelection={true}
                    checkboxSelection={true}
                    sortable={true}
                    filter={true}
                  ></AgGridColumn>
                  <AgGridColumn
                    field="created"
                    sortable={true}
                    filter={true}
                  ></AgGridColumn>
                  <AgGridColumn
                    field="host"
                    sortable={true}
                    filter={true}
                    width="100px"
                  ></AgGridColumn>
                  <AgGridColumn
                    field="cmdline"
                    sortable={true}
                    filter={true}
                    floatingFilter={true}
                    filter={'agTextColumnFilter'}
                    width="2600"
                    editable={true}
                  ></AgGridColumn>
                </AgGridReact>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className="ag-fresh">
              <button onClick={() => onBtnExport(gridConsEventsApi)}>
                {' '}
                Download file as CSV{' '}
              </button>
              <div
                className="ag-theme-balham"
                style={{ height: '70vh', width: '100%' }}
              >
                <AgGridReact
                  onGridReady={onGridConsEventsReady}
                  rowData={rowConsEventsData}
                  rowSelection="multiple"
                  rowDragManaged={true}
                  suppressMoveWhenRowDragging={true}
                  animateRows={true}
                  width="100%"
                >
                  <AgGridColumn
                    field="event_at"
                    rowDrag={true}
                    headerCheckboxSelection={true}
                    checkboxSelection={true}
                    width="250px"
                    sortable={true}
                    filter={true}
                  ></AgGridColumn>
                  <AgGridColumn
                    field="event_desc"
                    sortable={true}
                    filter={true}
                    floatingFilter={true}
                    width="300px"
                  ></AgGridColumn>
                  <AgGridColumn
                    field="event_source"
                    sortable={true}
                    filter={true}
                    floatingFilter={true}
                    filter={'agTextColumnFilter'}
                    width="500"
                  ></AgGridColumn>
                  <AgGridColumn
                    field="event_line"
                    sortable={true}
                    filter={true}
                    floatingFilter={true}
                    filter={'agTextColumnFilter'}
                    width="1600"
                  ></AgGridColumn>
                </AgGridReact>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <div className="ag-fresh">
              <button onClick={getDicmFiles}>
                Select DICOM Files / Folder
              </button>
              <button onClick={onSendExam2CIGA}>Selectto CIGA-INT</button>
              <button onClick={getELQFile}>
                Generate ExamList.qreads File For DCM Folder
              </button>
              <DicomSetView
                key="parent"
                dicomData={dicomData}
                onRowSelected={onRowSelected1}
                buttonLabel="View Image"
                onImageView={onImageView}
              />
              <DicomSetView
                key="child"
                dicomData={dicomKOData}
                onRowSelected={onRowSelected2}
                buttonLabel="Send to CIGA"
                onImageView={onSendSeries}
                button2Label="Open in QREADS"
                onButton2Callback={onOpenQREADS}
              />
            </div>
          </TabPanel>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(App);
