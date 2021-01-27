import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
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
} from './utils/cli';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

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
  return <div {...other} >{value === index && <Box style={{ padding: 2 }} p={3}>{children}</Box>}</div>;
}

const HostErrorLog = (props) => {
  const host = props.hostname;
  return (
    <div key={host}>
      {host && host.trim().length > 2 ? (
        <React.Fragment>
          <span style={{margin: 3}}>{host}</span>
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
const Hello = () => {


  // const [gridApi, setGridApi] = useState([]);
  // const [gridColumnApi, setGridColumnApi] = useState([]);

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [rowData, setRowData] = useState([]);

  const [gridConsEventsApi, setGridConsEventsApi] = useState(null);
  const [gridConsEventsColumnApi, setGridConsEventsColumnApi] = useState(null);
  const [rowConsEventsData, setRowConsEventsData] = useState([]);

  const retfunc = (data) => {
    //console.log(data);
    //let gotdata = JSON.parse(data);
    console.log('Received Data');
    let myObject = JSON.parse(data);

    let myArray = [];
    for (var i in myObject) {
      myArray.push(myObject[i]);
    }

    console.log(myArray);
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

  const [hostname, setHostname] = useState('r5193050');
  //R0295540,
  const [hostnamelist, setHostnameList] = useState(
    'R5087474, R0301769,  R0295533, R0302014, R0295534, R0301783, R0303393, R5051265'
  );

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
      fileName: "export1.csv",
      onlySelected: true
    };
  }

  const onBtnExport = (api)=> {
    let params = {}


    // if (params.suppressQuotes || params.columnSeparator) {
    //   alert(
    //     'NOTE: you are downloading a file with non-standard quotes or separators - it may not render correctly in Excel.'
    //   );
    // }

    if( api.getSelectedNodes().length > 0 ) {
      params = {
        fileName: "export1.csv",
        onlySelected: true
      };
    } else {
      params = {
        fileName: "export1.csv"
      };
    }

    //gridApi.forEachNode(node => {console.log(node.data)});
    api.exportDataAsCsv(params)
    //console.log(gridApi.exportDataAsCsv(params))
    //gridApi.exportDataAsCsv(params);
  }

  return (
    <div>
      {/* <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div> */}
      <h1>QREADS Support Tools</h1>
      {/* {userInput} -> {username}
      {passwordInput} -> {password} */}
      <span  style={{ display: 'block-inline', margin: 4 }}>Hostname</span>
      <input onChange={(e) => setHostname(e.target.value)} value={hostname} style={{ minWidth:8, flex:1 }}/>
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
      <span  style={{ display: 'block-inline', margin: 4 , padding : 4}}>Host List</span>
      <input
        style={{ width: '60%' }}
        onChange={(e) => setHostnameList(e.target.value)}
        value={hostnamelist}
      />
      <div>{hostListComponents}</div>
      <div className="Hello1" style={{ width: '100%' }}>
        <AppBar position="static" style={{ margin: 1}}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Java Tasklist" />
            <Tab label="QREADS Events" />
            <Tab label="TAB Three" />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <div className="ag-fresh">
            {/* <button onClick={onButtonClick}>Get selected rows</button> */}
            <button onClick={()=>onBtnExport(gridApi)}>  Download file as CSV </button>
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
                ></AgGridColumn>
              </AgGridReact>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div className="ag-fresh">
          <button onClick={() => onBtnExport(gridConsEventsApi)}>  Download file as CSV </button>
            <div
              className="ag-theme-balham"
              style={{ height: '70vh' , width: '100%' }}
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
          Nothing Here Yet
        </TabPanel>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
