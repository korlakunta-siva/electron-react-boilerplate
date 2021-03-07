import React, { Component } from 'react';
import './App.css';
import DataProvider from '../common/DataProvider';
import DataGrid from '../common/DataGridNew';
import DataMultiGrid from '../common/DataMultiGrid';
//import 'bootstrap/dist/css/bootstrap.css';
import * as FileSaver from 'file-saver';
//import VegaRenderer from "./components/VegaRenderer";
//import { Vega, VegaLite } from "react-vega";
// import { Vega } from 'react-vega';
import axios from '../serviceenv/imsuenv';
import { withRouter } from 'react-router-dom';
import RGL, { WidthProvider } from 'react-grid-layout';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import {
  DATA_PATIENT_EXAMS,
  DATA_PATIENT_EXAM_ACCN,
  DATA_PATIENT_EXAM_EXAMID,
  loadGridData,
  cli_parse_ko_folder,
  DATA_STUDY_LOCATION,
  runCIGCommand,
} from './patbrowseData';
import {
  DATA_EXAM_SERIES_KO_REFLECTED,
  DATA_EXAM_SERIES,
  DATA_EXAM_STUDIES,
  DATA_SERIES_LOCATIONS,
  DATA_EXAM_CMOVES,
  DATA_EXAM_EXCEPTIONS,
  DATA_CIGA_JOBS,
  DATA_CIGA_SERIES,
  DATA_CIGA_EXCEPTIONS,
  DATA_CIGA_PROCESSOR_LOG,
  DATA_CIGA_IIMS_NOTIF,
} from './patbrowseData';

import ApexDataGrid from '../../components/datagrid/ApexDataGrid';

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

export const ExportJson = ({ jsonData, fileName }) => {
  //const fileType = "application/json";
  const fileExtension = '.json';

  const exportToJson = (jsonData, fileName) => {
    var blob = new Blob([jsonData], { type: 'application/json;charset=utf-8' });
    FileSaver.saveAs(blob, fileName + fileExtension);
  };

  return (
    <input
      type="button"
      variant="warning"
      value="Export"
      onClick={(e) => exportToJson(jsonData, fileName)}
    />
  );
};

export const getOSFriendlyPath = (PathName, pathstyle) => {
  let MappedPath = '';
  if (pathstyle == 'win') {
    MappedPath = reverseMountPoints(PathName);
  } else {
    MappedPath = configureMountPoint(PathName);
  }

  return MappedPath;
};

export const configureMountPoint = (uncPathName) => {
  console.log(
    'START',
    uncPathName.toLowerCase().startsWith('\\\\mfad.mfroot.org\\rchdept'),
    uncPathName
  );
  let MappedPath = '';
  if (uncPathName != '') {
    if (uncPathName.toLowerCase().startsWith('\\\\mfad.mfroot.org\\rchdept'))
      MappedPath = uncPathName
        .toLowerCase()
        .replaceAll('\\\\mfad.mfroot.org\\rchdept\\', '/qreadscis/mcr/');
    else if (uncPathName.toLowerCase().startsWith('\\\\mfad\\rchdept'))
      MappedPath = uncPathName.replaceAll(
        '\\\\mfad\\rchdept\\',
        '/qreadscis/mcr/'
      );
    else if (uncPathName.toLowerCase().startsWith('\\\\mcsqread11'))
      MappedPath = uncPathName.replaceAll(
        '\\\\mcsqread11\\',
        '/qreadscis/mca/'
      );
    else if (uncPathName.toLowerCase().startsWith('\\\\mfad\\mcaapp\\qreads'))
      MappedPath = uncPathName.replaceAll(
        '\\\\mfad\\mcaapp\\QREADS\\',
        '/qreadscis/mcs/'
      );
    else if (
      uncPathName
        .toLowerCase()
        .startsWith('\\\\mfad.mfroot.org\\mcaapp\\qreads')
    )
      MappedPath = uncPathName.replaceAll(
        '\\\\mfad.mfroot.org\\mcaapp\\QREADS\\',
        '/qreadscis/mcs/'
      );
    else if (
      uncPathName.toLowerCase().startsWith('\\\\mfad.mfroot.org\\rchdept')
    )
      MappedPath = uncPathName.replaceAll(
        '\\\\mfad.mfroot.org\\rchdept\\',
        '/qreadscis/mcr/'
      );
    else if (uncPathName.toLowerCase().startsWith('\\\\mfad\\mcf'))
      MappedPath = uncPathName.replaceAll('\\\\mfad\\mcf\\', '/cig/mcf/');
    else if (uncPathName.toLowerCase().startsWith('\\\\mfad.mfroot.org\\mcf'))
      MappedPath = uncPathName.replaceAll(
        '\\\\mfad.mfroot.org\\mcf\\',
        '/cig/mcf/'
      );
    else MappedPath = uncPathName;
  }

  MappedPath = MappedPath.replaceAll('\\', '/');
  console.log('END', MappedPath);
  return MappedPath;
};

export const reverseMountPoints = (uncPathName) => {
  let MappedPath = '';
  if (uncPathName != None) {
    if (uncPathName.startsWith('/qreadscis/mcr/'))
      uncPathName = uncPathName.replaceAll(
        '/qreadscis/mcr/',
        '\\mfad.mfroot.org\\RCHDept\\'
      );
    else if (uncPathName.startsWith('/qreadscis/mca/'))
      uncPathName = uncPathName.replaceAll('/qreadscis/mca/', '\\mcsqread11\\');
    else if (uncPathName.startsWith('/qreadscis/mcs/'))
      uncPathName = uncPathName.replaceAll(
        '/qreadscis/mcs/',
        '\\mfad.mfroot.org\\mcaapp\\QREADS\\'
      );
    else if (uncPathName.startsWith('/cig/mcf/'))
      uncPathName = uncPathName.replaceAll(
        '/cig/mcf/',
        '\\mfad.mfroot.org\\mcf\\'
      );
    else if (uncPathName.startsWith('/cig/mcr/'))
      uncPathName = uncPathName.replaceAll('/cig/mcr/', '\\\\rchqrdvs01\\cig');
    else
      uncPathName = uncPathName.replaceAll(
        '/cig/mcf/',
        '\\mfad.mfroot.orgmcf\\'
      );

    MappedPath = uncPathName.replaceAll('/', '\\');
  }

  return MappedPath;
};

class App extends Component {
  DbEnv = {
    iimsRepl: 'iimsTest',
    iimsOltp: 'iimsTest',
    iimsReplDBNum: '01',
    iimsOltpDBNum: '01',
    iimsReplExt: '_intg',
    iimsOltpExt: '_intg',
  };

  DbEnvProd = {
    iimsRepl: 'iimsRepl',
    iimsOltp: 'iimsProd',
    iimsReplDBNum: '00',
    iimsOltpDBNum: '01',
    iimsReplExt: '_repl',
    iimsOltpExt: '_prod',
  };

  DbEnvIntg = {
    iimsRepl: 'iimsTest',
    iimsOltp: 'iimsTest',
    iimsReplDBNum: '01',
    iimsOltpDBNum: '01',
    iimsReplExt: '_intg',
    iimsOltpExt: '_intg',
  };

  state = {
    DBEnvironment: 'Intg',
    LogTextvalue: '',
    DbEnv: this.DbEnvIntg,
    CIGQueueEnvironment: {},
    dataArgs: {
      patientcmrn: '',
      accession: '',
      examid: 0,
      examkeytype: 'accn',
      imgsty_id: '',
      study_uid: '',
      series_uid: '',
      imgser_id: 0,
      imgsty_id: 0,
      jobqueueid: 0,
    },
    dataPatientExams: [],
    dataExamSeriesKOReflected: [],
    dataExamStudies: [],
    dataExamStudyLocations: [],
    dataExamSeries: [],
    dataExamSeriesLocations: [],
    dataExamExceptions: [],
    dataExamCmoves: [],
    dataCigaSeriesInbound: [],
    dataCigaJobs: [],
    dataCigaExceptions: [],
    dataCigaProcessorLog: [],
    dataCigaIimsNotification: [],
    loaded: false,
    columns_loaded: false,
    placeholder: '',
    fileReader: '',
    graph_data: {},
  };

  constructor(props) {
    super(props);
    this.examsGridElement = React.createRef();
    this.studyGridElement = React.createRef();
    this.seriesGridElement = React.createRef();
    this.seriesLocationsGridElement = React.createRef();
    this.exceptionsGridElement = React.createRef();
    this.customExamsGridElement = React.createRef();
    this.customExams2GridElement = React.createRef();
    this.recentExamsGridElement = React.createRef();
    this.seriesCIGAInboundGridElement = React.createRef();
    this.seriesCIGAGridElement = React.createRef();
    this.seriesCIGAExceptionsGridElement = React.createRef();
    this.cmovesGridElement = React.createRef();
    this.series_ciga_jobs = [];
    this.series_ciga_exceptions = [];
  }

  componentWillMount() {
    document.title = 'CIGA Patient Browser';

    setTimeout(() => {
      this.setState({ columns_loaded: true });
    }, 2000);
  }

  handleGridRefresh = (gridName) => {
    console.log('Refresh called on: ', gridName);
    let DbEnv = this.state.DbEnv;
    let dataArgs = { ...this.state.dataArgs };

    console.log('REFRESH STATE ARGS: ', dataArgs, this.state.dataArgs);
    let newExamArgs = {
      ...dataArgs,
      DbEnv: DbEnv,
    };

    switch (gridName) {
      case DATA_PATIENT_EXAMS:
      case DATA_PATIENT_EXAM_EXAMID:
      case DATA_PATIENT_EXAM_ACCN:
        this.setState({
          dataPatientExams: [],
          dataExamStudies: [],
          dataExamSeriesKOReflected: [],
          dataExamStudyLocations: [],
          dataExamSeries: [],
          dataExamSeriesLocations: [],
        });
        break;

      case DATA_EXAM_SERIES_KO_REFLECTED:
        this.setState({ dataExamSeriesKOReflected: [] });
        break;

      case DATA_EXAM_STUDIES:
        this.setState({ dataExamStudies: [], dataExamStudyLocations: [] });
        break;
      case DATA_EXAM_SERIES:
        this.setState({ dataExamSeries: [], dataExamSeriesLocations: [] });
        break;

      default:
    }
    console.log('CALLING REFRESH WITH ARGS: ', gridName, newExamArgs);
    loadGridData(gridName, newExamArgs, this.recvGridData);
  };

  onRecevingLog = (logtext) => {
    this.setState({ LogTextvalue: logtext });
  };

  onRowSelectViewLog = (data, gridname) => {
    console.log('Transaction View:', gridname, data);
    let DbEnv = this.state.DbEnv;
    let dataArgs = { ...this.state.dataArgs };

    switch (gridname) {
      case DATA_CIGA_JOBS:
        let command_string =
          ' /cigaapp/ciguser/slk02/getloginfo.sh ' + data.JOB_QUEUE_ID;
        console.log('LOG FILE VIEW: ', command_string);

        runCIGCommand(data.PROCESSOR_HOST, command_string, this.onRecevingLog);

        break;
      default:
    }
  };

  onRowSelectView = (data, gridname) => {
    console.log('Transaction View:', gridname, data);
    let DbEnv = this.state.DbEnv;
    let dataArgs = { ...this.state.dataArgs };
    switch (gridname) {
      case DATA_PATIENT_EXAMS:
        let newExamArgs = {
          accession: data.epic_accn,
          examid: data.exam_id,
          patient_cmrn: data.patient_cmrn,
          DbEnv: DbEnv,
        };
        dataArgs.accession = data.epic_accn;
        dataArgs.examid = data.exam_id;
        dataArgs.patient_cmrn = data.patient_cmrn;

        this.setState({ dataArgs: dataArgs }, () => {
          console.log('NEW ARGS: ', dataArgs, this.state.dataArgs);
        });

        cli_parse_ko_folder(
          DATA_EXAM_SERIES_KO_REFLECTED,
          newExamArgs,
          this.recvGridData
        );
        loadGridData(DATA_EXAM_STUDIES, newExamArgs, this.recvGridData);
        loadGridData(DATA_EXAM_SERIES, newExamArgs, this.recvGridData);
        loadGridData(DATA_EXAM_CMOVES, newExamArgs, this.recvGridData);
        loadGridData(DATA_EXAM_EXCEPTIONS, newExamArgs, this.recvGridData);
        loadGridData(DATA_CIGA_SERIES, newExamArgs, this.recvGridData);
        loadGridData(DATA_CIGA_JOBS, newExamArgs, this.recvGridData);
        loadGridData(DATA_CIGA_EXCEPTIONS, newExamArgs, this.recvGridData);

        console.log('Retrieve Series and Studies', newExamArgs);
        break;
      case DATA_EXAM_SERIES_KO_REFLECTED:
        break;
      case DATA_EXAM_SERIES:
        loadGridData(
          DATA_SERIES_LOCATIONS,
          {
            imgser_id: data.imgser_id,
            accession: data.epic_accn,
            examid: data.exam_id,
            DbEnv: DbEnv,
          },
          this.recvGridData
        );
        break;
      case DATA_EXAM_STUDIES:
        loadGridData(
          DATA_STUDY_LOCATION,
          {
            imgsty_id: data.imgsty_id,
            DbEnv: DbEnv,
          },
          this.recvGridData
        );
        break;
      case DATA_CIGA_JOBS:
        loadGridData(
          DATA_CIGA_PROCESSOR_LOG,
          {
            job_queue_id: data.JOB_QUEUE_ID,
            DbEnv: DbEnv,
          },
          this.recvGridData
        );
        break;
      case DATA_CIGA_PROCESSOR_LOG:
        loadGridData(
          DATA_CIGA_IIMS_NOTIF,
          {
            iims_queue_id: data.IIMS_QUEUE_ID,
            DbEnv: DbEnv,
          },
          this.recvGridData
        );
        break;
    }
  };

  cmrnChange = (event) => {
    let args = {
      patient_cmrn: this.state.dataArgs.patient_cmrn,
      DbEnv: this.state.DbEnv,
      examkeytype: 'cmrn',
    };
    console.log('Retrieving Exams with args: ', args);

    loadGridData(DATA_PATIENT_EXAMS, args, this.recvGridData);

    // console.log(
    //   this.endpoint_patient_exams +
    //     " patient_cmrn = '" +
    //     this.state.patient_cmrn +
    //     "' order by performed_dt desc"
    // );
    // fetch(
    //   this.endpoint_patient_exams +
    //     " patient_cmrn = '" +
    //     this.state.patient_cmrn +
    //     "' order by performed_dt desc",
    //   {}
    // )
    //   .then((response) => {
    //     if (response.status !== 200) {
    //       return this.setState({
    //         placeholder: 'Something went wrong in getting data',
    //       });
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log(data);
    //     let dframe = data['frame0'];
    //     console.log(dframe);
    //     let myObj = JSON.parse(dframe);
    //     console.log(myObj);
    //     data = myObj['rows'];
    //     this.setState(
    //       {
    //         data: data,
    //         series: [],
    //         series_locations: [],
    //         series_ciga_jobs: [],
    //         loaded: true,
    //       },
    //       () => {
    //         console.log('Changed state', this.state.data.length);
    //         this.examsGridElement.current.changeGridData(this.state.data);
    //       }
    //     );
    //   });
  };

  jobqueueIdChange = (event) => {
    let args = {
      jobqueueid: this.state.dataArgs.jobqueueid,
      DbEnv: this.state.DbEnv,
      examkeytype: 'jobqueueid',
    };
    console.log('Retrieving Exams with args: ', args);

    loadGridData(DATA_PATIENT_EXAMS, args, this.recvGridData);
  };

  examidChange = (event) => {
    let args = {
      examid: this.state.dataArgs.examid,
      DbEnv: this.state.DbEnv,
      examkeytype: 'examid',
    };
    console.log('Retrieving Exams with args: ', args);

    loadGridData(DATA_PATIENT_EXAMS, args, this.recvGridData);

    // console.log(
    //   this.endpoint_patient_exams +
    //     ' exam_id = ' +
    //     this.state.exam_id +
    //     ' order by performed_dt desc'
    // );
    // fetch(
    //   this.endpoint_patient_exams +
    //     ' exam_id = ' +
    //     this.state.exam_id +
    //     ' order by performed_dt desc',
    //   {}
    // )
    //   .then((response) => {
    //     if (response.status !== 200) {
    //       return this.setState({
    //         placeholder: 'Something went wrong in getting data',
    //       });
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log(data);
    //     let dframe = data['frame0'];
    //     console.log(dframe);
    //     let myObj = JSON.parse(dframe);
    //     console.log(myObj);
    //     data = myObj['rows'];
    //     this.setState(
    //       {
    //         data: data,
    //         series: [],
    //         series_locations: [],
    //         series_ciga_jobs: [],
    //         loaded: true,
    //       },
    //       () => {
    //         console.log('Changed state', this.state.data.length);
    //         this.examsGridElement.current.changeGridData(this.state.data);
    //       }
    //     );
    //   });
  };

  accnChange = (event) => {
    let args = {
      accession: this.state.dataArgs.accession,
      DbEnv: this.state.DbEnv,
      examkeytype: 'accn',
    };
    console.log('Retrieving Exams with args: ', args);

    loadGridData(DATA_PATIENT_EXAMS, args, this.recvGridData);
  };

  onRowSelectExam = (event) => {
    console.log('AG Row selected', event);

    let selectedNodes = event.api
      .getSelectedNodes()
      .filter((node) => node.selected);
    console.log(selectedNodes);
  };

  OnExamPurge = (data) => {
    console.log('OnExamPurge called:', data);

    // let purge_sql = 'https://iasq1mr2:8042/purge/currentexam/' + data.exam_id;

    // let isOnMidia = data.onMIDIA;
    // let message = 'Are you sure you want purge this exam ?';
    // if (isOnMidia != 'Yes') {
    //   message = 'CAUTION. NOT ON MIDIA. ' + message;
    // }

    // if (window.confirm(message)) {
    //   // Save it!
    //   console.log('Call API: ' + purge_sql);

    //   fetch(purge_sql, {})
    //     .then((response) => {
    //       if (response.status !== 200) {
    //         return this.setState({
    //           placeholder: 'Something went wrong in getting data',
    //         });
    //       }
    //       //console.log(response);
    //       return response.json();
    //     })
    //     .then((data) => {
    //       alert('Submited Purge Request');
    //     });
    // } else {
    //   // Do nothing!
    // }
  };

  OnStudyPurge = (data) => {
    console.log('OnStudyPurge called:', data);

    // let purge_sql =
    //   'https://iasq1mr2:8042/purge/currentstudy/' + data.imgsty_id;

    // let isOnMidia = data.onMIDIA;
    // let message = 'Are you sure you want purge this study ?';
    // if (isOnMidia != 'Yes') {
    //   message = 'CAUTION. NOT ON MIDIA. ' + message;
    // }

    // if (window.confirm(message)) {
    //   // Save it!
    //   console.log('Call API: ' + purge_sql);

    //   fetch(purge_sql, {})
    //     .then((response) => {
    //       if (response.status !== 200) {
    //         return this.setState({
    //           placeholder: 'Something went wrong in getting data',
    //         });
    //       }
    //       //console.log(response);
    //       return response.json();
    //     })
    //     .then((data) => {
    //       alert('Submited Purge Request');
    //     });
    // } else {
    //   // Do nothing!
    // }
  };

  OnSeriesPurge = (data) => {
    console.log('OnSeriesPurge called:', data);

    // let purge_sql =
    //   'https://iasq1mr2:8042/purge/currentseries/' + data.imgser_id;

    // let isOnMidia = data.onMIDIA;
    // let message = 'Are you sure you want purge this series ?';
    // if (isOnMidia != 'Yes') {
    //   message = 'CAUTION. NOT ON MIDIA. ' + message;
    // }

    // if (window.confirm(message)) {
    //   // Save it!
    //   console.log('Call API: ' + purge_sql);

    //   fetch(purge_sql, {})
    //     .then((response) => {
    //       if (response.status !== 200) {
    //         return this.setState({
    //           placeholder: 'Something went wrong in getting data',
    //         });
    //       }
    //       //console.log(response);
    //       return response.json();
    //     })
    //     .then((data) => {
    //       alert('Submited Purge Request');
    //     });
    // } else {
    //   // Do nothing!
    // }
  };

  OnSeriesLocationPurge = (data) => {
    console.log('OnSeriesLocationPurge called:', data);
    if (data.imgsys_name == 'MIDIA') {
      alert(
        'You can not purge series location from MIDIA.  Did you mean to pick QREADS Location? Select the correct series location row to purge. '
      );
      return;
    }

    // let purge_sql =
    //   'https://iasq1mr2:8042/purge/currentserieslocation/' + data.imgserl_id;

    // let isOnMidia = data.onMIDIA;
    // let message = 'Are you sure you want purge this series location ?';
    // if (isOnMidia != 'Yes') {
    //   message = 'CAUTION. NOT ON MIDIA. ' + message;
    // }

    // if (window.confirm(message)) {
    //   // Save it!
    //   console.log('Call API: ' + purge_sql);

    //   fetch(purge_sql, {})
    //     .then((response) => {
    //       if (response.status !== 200) {
    //         return this.setState({
    //           placeholder: 'Something went wrong in getting data',
    //         });
    //       }
    //       //console.log(response);
    //       return response.json();
    //     })
    //     .then((data) => {
    //       alert('Submited Purge Request');
    //     });
    // } else {
    //   // Do nothing!
    // }
  };

  OnSeriesDeArchive = (data) => {
    console.log('OnSeriesDeArchive called:', data);
    // let dearchive_sql =
    //   this.api_endpoint_sql_prefix +
    //   `exec iimdb_rch01${this.DbEnv.iimsOltpExt}..iimsp_prefetch_retrieveimages  @priority = 'H', @exam_id = `;
  };

  OnExamDeArchive = (data) => {
    console.log('OnExamDeArchive called:', data);

    // let dearchive_sql =
    //   this.api_endpoint_sql_prefix +
    //   `exec iimdb_rch01${this.DbEnv.iimsOltpExt}..iimsp_prefetch_retrieveimages  @priority = 'H', @exam_id = `;

    // if (window.confirm('Are you sure you want dearchive this exam ?')) {
    //   // Save it!
    //   console.log('Call API: ' + dearchive_sql + data.exam_id);

    //   fetch(dearchive_sql + data.exam_id, {})
    //     .then((response) => {
    //       if (response.status !== 200) {
    //         return this.setState({
    //           placeholder: 'Something went wrong in getting data',
    //         });
    //       }
    //       //console.log(response);
    //       return response.json();
    //     })
    //     .then((data) => {
    //       alert('Submited Dearchive Request');
    //     });
    // } else {
    //   // Do nothing!
    // }
  };

  handleFileReadSQL = (e) => {
    console.log('handle file read', e);
    const content = e.target.result;
    this.setState({ customsqltext: content, custom_data: [] });

    // fetch(this.endpoint_exams + '  ' + this.state.customsqltext, {})
    //   .then((response) => {
    //     if (response.status !== 200) {
    //       return this.setState({
    //         placeholder: 'Something went wrong in getting data',
    //       });
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log(data);
    //     let dframe = data['frame0'];
    //     let myObj = JSON.parse(dframe);
    //     data = myObj['rows'];
    //     this.setState({ custom_data: data, loaded: true }, () => {
    //       console.log('Changed state', this.state.custom_data.length);
    //       this.customExamsGridElement.current.changeGridData(
    //         this.state.custom_data
    //       );
    //     });
    //   });

    // console.log(content);
  };

  handleFileChosen = (file) => {
    const fileName = file.name;
    const fileType = file.type;
    console.log('CHosen FIle:', fileName, fileType);
    let fileReader = new FileReader();
    switch (fileType) {
      case 'application/sql':
        fileReader.onloadend = this.handleFileReadSQL;
        break;
      case 'application/json':
        fileReader.onloadend = this.handleFileReadJson;
        break;
      default:
        fileReader.onloadend = this.handleFileReadJson;
    }

    fileReader.readAsText(file);
  };

  signalListeners = { hover: this.handleHover };

  handleChangeCIGQueueEnv = (event) => {
    console.log('SELECTED CIG Queue Env: ', event.target.value);
    // switch (event.target.value) {
    //   case 'Intg':
    //     this.setState({
    //       DBEnvironment: event.target.value,
    //       DbEnv: this.DbEnvIntg,
    //     });
    //     break;
    //   case 'Test':
    //     this.setState({
    //       DBEnvironment: event.target.value,
    //       DbEnv: this.DbEnvProd,
    //     });
    //     break;
    //   case 'Prch':
    //     this.setState({
    //       DBEnvironment: event.target.value,
    //       DbEnv: this.DbEnvProd,
    //     });
    //     break;
    //   default:
    //     this.setState({
    //       DBEnvironment: 'Intg',
    //       DbEnv: this.DbEnvIntg,
    //     });
    //     break;
    // }
  };
  handleChangeDbEnv = (event) => {
    console.log('SELECTED', event.target.value);
    switch (event.target.value) {
      case 'Intg':
        this.setState({
          DBEnvironment: event.target.value,
          DbEnv: this.DbEnvIntg,
        });
        break;
      case 'Test':
        this.setState({
          DBEnvironment: event.target.value,
          DbEnv: this.DbEnvProd,
        });
        break;
      case 'Prch':
        this.setState({
          DBEnvironment: event.target.value,
          DbEnv: this.DbEnvProd,
        });
        break;
      default:
        this.setState({
          DBEnvironment: 'Intg',
          DbEnv: this.DbEnvIntg,
        });
        break;
    }
  };

  recvGridData = (gridName, args, gridData) => {
    console.log('ReceivedData for :', gridName, args, gridData);

    switch (gridName) {
      case DATA_PATIENT_EXAMS:
      case DATA_PATIENT_EXAM_EXAMID:
      case DATA_PATIENT_EXAM_ACCN:
        this.setState(
          {
            dataPatientExams: gridData,
            loaded: true,
          },
          () => {
            console.log(
              'Changed state dataPatientExams',
              this.state.dataPatientExams.length
            );
          }
        );
        break;

      case DATA_EXAM_SERIES_KO_REFLECTED:
        this.setState(
          {
            dataExamSeriesKOReflected: gridData,
            loaded: true,
          },
          () => {
            console.log(
              'Changed state dataExamSeriesKOReflected',
              this.state.dataExamSeriesKOReflected.length
            );
          }
        );
        break;

      case DATA_EXAM_SERIES:
        let updatedExamSeries = gridData;

        this.setState(
          {
            dataExamSeries: updatedExamSeries,
            loaded: true,
          },
          () => {
            console.log(
              'Changed state Exam Series',
              this.state.dataExamSeries.length
            );
          }
        );
        break;

      case DATA_EXAM_STUDIES:
        let updatedExamStudies = gridData;

        this.setState(
          {
            dataExamStudies: updatedExamStudies,
            loaded: true,
          },
          () => {
            console.log(
              'Changed state Exam Series',
              this.state.dataExamStudies.length
            );
          }
        );
        break;

      case DATA_STUDY_LOCATION:
        let updatedExamStudyLocations = gridData;

        this.setState(
          {
            dataExamStudyLocations: updatedExamStudyLocations,
            loaded: true,
          },
          () => {
            console.log(
              'Changed state Exam Study Locations',
              this.state.dataExamStudyLocations.length
            );
          }
        );
        break;

      case DATA_SERIES_LOCATIONS:
        this.setState(
          {
            dataSeriesLocations: gridData,
            dataSeriesLocationsArgs: args,
            loaded: true,
          },
          () => {
            console.log(
              'Changed state Series Locations',
              this.state.dataSeriesLocations.length
            );
          }
        );
        break;
      case DATA_EXAM_CMOVES:
        this.setState(
          {
            dataExamCmoves: gridData,
            loaded: true,
          },
          () => {
            console.log(
              'Changed state exam cmoves',
              this.state.dataExamCmoves.length
            );
          }
        );
        break;
      case DATA_EXAM_EXCEPTIONS:
        this.setState(
          {
            dataExamExceptions: gridData,
            loaded: true,
          },
          () => {
            console.log(
              'Changed state exam exceptions',
              this.state.dataExamExceptions.length
            );
          }
        );
        break;
      case DATA_CIGA_SERIES:
        this.setState(
          {
            dataCigaSeriesInbound: gridData,
            loaded: true,
          },
          () => {
            console.log(
              'Changed state ciga inbound series',
              this.state.dataCigaSeriesInbound.length
            );
          }
        );
        break;

      case DATA_CIGA_JOBS:
        this.setState(
          {
            dataCigaJobs: gridData,
            loaded: true,
          },
          () => {
            console.log(
              'Changed state ciga jobs',
              this.state.dataCigaJobs.length
            );
          }
        );
        break;
      case DATA_CIGA_EXCEPTIONS:
        this.setState(
          {
            dataCigaExceptions: gridData,
            loaded: true,
          },
          () => {
            console.log(
              'Changed state ciga exceptions',
              this.state.dataCigaExceptions.length
            );
          }
        );
        break;
      case DATA_CIGA_PROCESSOR_LOG:
        this.setState(
          {
            dataCigaProcessorLog: gridData,
            loaded: true,
          },
          () => {
            console.log(
              'Changed state ciga processor log',
              this.state.dataCigaProcessorLog.length
            );
          }
        );
        break;
      case DATA_CIGA_IIMS_NOTIF:
        this.setState(
          {
            dataCigaIimsNotification: gridData,
            loaded: true,
          },
          () => {
            console.log(
              'Changed state ciga iims notif',
              this.state.dataCigaIimsNotification.length
            );
          }
        );
        break;

      default:
    }
  };

  onLayoutChange(layout) {
    //this.props.onLayoutChange(layout);
  }

  render() {
    const { classes } = this.props;
    console.log('AppPatient Component is rendering.');

    return this.state.columns_loaded ? (
      <div>
        <React.Fragment>
          <div
            className="container-fluid "
            style={{ width: '90%', paddingTop: '65px' }}
          >
            <div
              className="form-group "
              style={{ dislplay: 'inline-block' }}
              width="200px"
            >
              <FormControl required className={classes.formControl}>
                <InputLabel id="demo-simple-select-required-label">
                  Environment
                </InputLabel>
                <Select
                  labelId="demo-simple-select-required-label"
                  id="demo-simple-select-required"
                  value={this.state.DBEnvironment}
                  onChange={this.handleChangeDbEnv}
                  className={classes.selectEmpty}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={'Intg'}>Integration</MenuItem>
                  <MenuItem value={'Test'}>Test</MenuItem>
                  <MenuItem value={'Prch'}>Prod - Rochester</MenuItem>
                </Select>
              </FormControl>

              <TextField
                id="pat_cmrn"
                label="Patient CMRN"
                variant="outlined"
                onChange={(event) => {
                  console.log(
                    'CMRN Input Field New Value:',
                    event.target.value,
                    event.target.value.replaceAll(/\D/g, '')
                  );
                  this.setState({
                    dataArgs: {
                      ...this.state.dataArgs,
                      patient_cmrn: event.target.value.replaceAll(/\D/g, ''),
                    },
                  });
                }}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    this.cmrnChange();
                  }
                }}
              />

              <TextField
                id="pat_accnum"
                label="Epic Accession"
                variant="outlined"
                onChange={(event) => {
                  console.log(
                    'Accession Number value:',
                    event.target.value.trim()
                  );
                  this.setState({
                    dataArgs: {
                      ...this.state.dataArgs,
                      accession: event.target.value.trim(),
                    },
                  });
                }}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    this.accnChange();
                  }
                }}
              />

              <TextField
                id="pat_examid"
                label="IIMS Exam ID"
                variant="outlined"
                onChange={(event) => {
                  console.log(
                    'EXAMID New value:',
                    event.target.value,
                    event.target.value.replaceAll(/\D/g, '')
                  );
                  this.setState({
                    dataArgs: {
                      ...this.state.dataArgs,
                      examid: event.target.value.replaceAll(/\D/g, ''),
                    },
                  });
                }}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    this.examidChange();
                  }
                }}
              />

              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-required-label">
                  CIG Queue
                </InputLabel>
                <Select
                  labelId="simple-select-required-label"
                  id="cig-job-queue"
                  value={this.state.CIGQueueEnvironment}
                  onChange={this.handleChangeCIGQueueEnv}
                  className={classes.selectEmpty}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={'Intg'}>Integration</MenuItem>
                  <MenuItem value={'Test'}>Test</MenuItem>
                  <MenuItem value={'Prod'}>Prod - Rochester</MenuItem>
                  <MenuItem value={'PreProd'}>PreProd - Rochester</MenuItem>
                </Select>
              </FormControl>

              <TextField
                id="arg_job_queue_id"
                label="Job Queue ID"
                variant="outlined"
                onChange={(event) => {
                  console.log(
                    'JOB Queue ID New value:',
                    event.target.value,
                    event.target.value.replaceAll(/\D/g, '')
                  );
                  this.setState({
                    dataArgs: {
                      ...this.state.dataArgs,
                      jobqueueid: event.target.value.replaceAll(/\D/g, ''),
                    },
                  });
                }}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    this.jobqueueIdChange();
                  }
                }}
              />
            </div>
            <React.Fragment>
              <ReactGridLayout
                className="layout"
                onLayoutChange={this.onLayoutChange}
                rowHeight={30}
              >
                <div
                  key="24"
                  data-grid={{
                    x: 0,
                    y: 0,
                    w: 14,
                    h: 3,
                    static: true,
                    isResizable: false,
                  }}
                  style={{ height: '90%', width: '100%', margin: 0 }}
                >
                  <ApexDataGrid
                    key="exmgrid"
                    gridname={DATA_PATIENT_EXAMS}
                    ShowAllColumns={true}
                    divHeight={'150px'}
                    gridTitle={'PATIENT EXAMS'}
                    onRefresh={() => this.handleGridRefresh(DATA_PATIENT_EXAMS)}
                    gridData={this.state.dataPatientExams}
                    gridArgsText={'accn: ' + this.state.dataArgs.accession}
                    onRowSelected={this.onRowSelectExam}
                    button2Label="View"
                    onButton2Callback={this.onRowSelectView}
                  />
                </div>

                <div
                  key="241"
                  data-grid={{
                    x: 0,
                    y: 5,
                    w: 14,
                    h: 3,
                    static: true,
                    isResizable: false,
                  }}
                  style={{ height: '90%', width: '100%', margin: 0 }}
                >
                  <ApexDataGrid
                    key="serwithko"
                    gridname={DATA_EXAM_SERIES_KO_REFLECTED}
                    ShowAllColumns={true}
                    divHeight={'150px'}
                    gridTitle={'DATA_SERIES_KO_REFLECTED - PROD'}
                    onRefresh={() =>
                      this.handleGridRefresh(DATA_EXAM_SERIES_KO_REFLECTED)
                    }
                    gridData={this.state.dataExamSeriesKOReflected}
                    gridArgsText={'accn: ' + this.state.dataArgs.accession}
                    onRowSelected={this.onRowSelectExam}
                    button2Label="View"
                    onButton2Callback={this.onRowSelectView}
                  />
                </div>

                <div
                  key="244"
                  data-grid={{
                    x: 8,
                    y: 10,
                    w: 5,
                    h: 2,
                    static: true,
                    isResizable: false,
                  }}
                  style={{ height: '90%', width: '100%', margin: 0 }}
                >
                  <ApexDataGrid
                    key="studygrid"
                    gridname={DATA_EXAM_STUDIES}
                    ShowAllColumns={true}
                    divHeight={'110px'}
                    gridTitle={'EXAM STUDIES - PROD'}
                    onRefresh={() => this.handleGridRefresh(DATA_EXAM_STUDIES)}
                    gridData={this.state.dataExamStudies}
                    onRowSelected={this.onRowSelectExam}
                    button2Label="View"
                    onButton2Callback={this.onRowSelectView}
                  />
                </div>

                <div
                  key="2449"
                  data-grid={{
                    x: 8,
                    y: 14,
                    w: 5,
                    h: 2,
                    static: true,
                    isResizable: false,
                  }}
                  style={{ height: '90%', width: '100%', margin: 0 }}
                >
                  <ApexDataGrid
                    key="studylocgrid"
                    gridname={DATA_STUDY_LOCATION}
                    ShowAllColumns={true}
                    divHeight={'110px'}
                    gridTitle={'STUDIES LOCATIONS- PROD'}
                    onRefresh={() =>
                      this.handleGridRefresh(DATA_STUDY_LOCATION)
                    }
                    gridData={this.state.dataExamStudyLocations}
                    onRowSelected={this.onRowSelectExam}
                    button2Label="View"
                    onButton2Callback={this.onRowSelectView}
                  />
                </div>

                <div
                  key="246"
                  data-grid={{
                    x: 0,
                    y: 10,
                    w: 7,
                    h: 7,
                    static: true,
                    isResizable: false,
                  }}
                  style={{ height: '90%', width: '100%', margin: 0 }}
                >
                  <ApexDataGrid
                    key="sereisgrid"
                    gridname={DATA_EXAM_SERIES}
                    ShowAllColumns={true}
                    divHeight={'230px'}
                    gridTitle={'EXAM SERIES - PROD'}
                    onRefresh={() => this.handleGridRefresh(DATA_EXAM_SERIES)}
                    gridData={this.state.dataExamSeries}
                    gridArgsText={'accn: ' + this.state.dataArgs.accession}
                    onRowSelected={this.onRowSelectExam}
                    button2Label="View"
                    onButton2Callback={this.onRowSelectView}
                  />
                </div>

                <div
                  key="2463"
                  data-grid={{
                    x: 0,
                    y: 17,
                    w: 14,
                    h: 3,
                    static: true,
                    isResizable: false,
                  }}
                  style={{ height: '90%', width: '100%', margin: 0 }}
                >
                  <ApexDataGrid
                    key="serlocgrid"
                    gridname={DATA_SERIES_LOCATIONS}
                    ShowAllColumns={true}
                    divHeight={'130px'}
                    gridTitle={'SERIES LOCATIONS - PROD'}
                    onRefresh={() =>
                      this.handleGridRefresh(DATA_SERIES_LOCATIONS)
                    }
                    gridData={this.state.dataSeriesLocations}
                    gridArgsText={''}
                    onRowSelected={this.onRowSelectExam}
                    button2Label="View"
                    onButton2Callback={this.onRowSelectView}
                  />
                </div>

                <div
                  key="51"
                  data-grid={{
                    x: 0,
                    y: 22,
                    w: 6,
                    h: 5,
                    static: true,
                    isResizable: false,
                  }}
                  style={{ height: '90%', width: '100%', margin: 0 }}
                >
                  <ApexDataGrid
                    key="cmovegrid"
                    gridname={DATA_EXAM_CMOVES}
                    ShowAllColumns={true}
                    divHeight={'140px'}
                    gridTitle={'CMOVES - PROD'}
                    onRefresh={() => this.handleGridRefresh(DATA_EXAM_CMOVES)}
                    gridData={this.state.dataExamCmoves}
                    gridArgsText={''}
                    onRowSelected={this.onRowSelectExam}
                    button2Label="View"
                    onButton2Callback={this.onRowSelectView}
                  />
                </div>

                <div
                  key="52"
                  data-grid={{
                    x: 8,
                    y: 22,
                    w: 6,
                    h: 5,
                    static: true,
                    isResizable: false,
                  }}
                  style={{ height: '90%', width: '100%', margin: 0 }}
                >
                  <ApexDataGrid
                    key="exceptiongrid"
                    gridname={DATA_EXAM_EXCEPTIONS}
                    ShowAllColumns={true}
                    divHeight={'140px'}
                    gridTitle={'EXCEPTIONS - PROD'}
                    onRefresh={() =>
                      this.handleGridRefresh(DATA_EXAM_EXCEPTIONS)
                    }
                    gridData={this.state.dataExamExceptions}
                    gridArgsText={''}
                    onRowSelected={this.onRowSelectExam}
                    button2Label="View"
                    onButton2Callback={this.onRowSelectView}
                  />
                </div>

                <div
                  key="61"
                  data-grid={{
                    x: 0,
                    y: 27,
                    w: 6,
                    h: 5,
                    static: true,
                    isResizable: false,
                  }}
                  style={{ height: '90%', width: '100%', margin: 0 }}
                >
                  <ApexDataGrid
                    key="cigseriesgrid"
                    gridname={DATA_CIGA_SERIES}
                    ShowAllColumns={true}
                    divHeight={'150px'}
                    gridTitle={'INBOUND SERIES - PROD'}
                    onRefresh={() => this.handleGridRefresh(DATA_CIGA_SERIES)}
                    gridData={this.state.dataCigaSeriesInbound}
                    gridArgsText={''}
                    onRowSelected={this.onRowSelectExam}
                    button2Label="View"
                    onButton2Callback={this.onRowSelectView}
                  />
                </div>

                <div
                  key="62"
                  data-grid={{
                    x: 8,
                    y: 27,
                    w: 6,
                    h: 5,
                    static: true,
                    isResizable: false,
                  }}
                  style={{ height: '90%', width: '100%', margin: 0 }}
                >
                  <ApexDataGrid
                    key="cigjobsgrid"
                    gridname={DATA_CIGA_JOBS}
                    ShowAllColumns={true}
                    divHeight={'150px'}
                    gridTitle={'JOBS QUEUE - PROD'}
                    onRefresh={() => this.handleGridRefresh(DATA_CIGA_JOBS)}
                    gridData={this.state.dataCigaJobs}
                    gridArgsText={''}
                    onRowSelected={this.onRowSelectExam}
                    button2Label="View"
                    onButton2Callback={this.onRowSelectView}
                    button3Label="View"
                    onButton3Callback={this.onRowSelectViewLog}
                  />
                </div>

                <div
                  key="72"
                  data-grid={{
                    x: 0,
                    y: 32,
                    w: 6,
                    h: 4,
                    static: true,
                    isResizable: false,
                  }}
                  style={{ height: '90%', width: '100%', margin: 0 }}
                >
                  <ApexDataGrid
                    key="cigprocessorgrid"
                    gridname={DATA_CIGA_PROCESSOR_LOG}
                    ShowAllColumns={true}
                    divHeight={'120px'}
                    gridTitle={'PROCESSOR LOG - PROD'}
                    onRefresh={() =>
                      this.handleGridRefresh(DATA_CIGA_PROCESSOR_LOG)
                    }
                    gridData={this.state.dataCigaProcessorLog}
                    gridArgsText={''}
                    onRowSelected={this.onRowSelectExam}
                    button2Label="View"
                    onButton2Callback={this.onRowSelectView}
                  />
                </div>
                <div
                  key="725"
                  data-grid={{
                    x: 8,
                    y: 32,
                    w: 6,
                    h: 3,
                    static: true,
                    isResizable: false,
                  }}
                  style={{ height: '90%', width: '100%', margin: 0 }}
                >
                  <ApexDataGrid
                    key="cigprocessorgrid"
                    gridname={DATA_CIGA_IIMS_NOTIF}
                    ShowAllColumns={true}
                    divHeight={'120px'}
                    gridTitle={'IIMS Notification - PROD'}
                    onRefresh={() =>
                      this.handleGridRefresh(DATA_CIGA_IIMS_NOTIF)
                    }
                    gridData={this.state.dataCigaIimsNotification}
                    gridArgsText={''}
                    onRowSelected={this.onRowSelectExam}
                    button2Label="View"
                    onButton2Callback={this.onRowSelectView}
                  />
                </div>

                <div
                  key="71"
                  data-grid={{
                    x: 0,
                    y: 36,
                    w: 15,
                    h: 6,
                    static: true,
                    isResizable: false,
                  }}
                  style={{ height: '90%', width: '100%', margin: 0 }}
                >
                  <ApexDataGrid
                    key="cigexceptionsgrid"
                    gridname={DATA_CIGA_EXCEPTIONS}
                    ShowAllColumns={true}
                    divHeight={'250px'}
                    domHeight={'normal'}
                    gridTitle={'CIG EXCEPTIONS - PROD'}
                    onRefresh={() =>
                      this.handleGridRefresh(DATA_CIGA_EXCEPTIONS)
                    }
                    gridData={this.state.dataCigaExceptions}
                    gridArgsText={''}
                    onRowSelected={this.onRowSelectExam}
                    button2Label="View"
                    onButton2Callback={this.onRowSelectView}
                  />
                </div>
                <div
                  key="920"
                  data-grid={{
                    x: 0,
                    y: 44,
                    w: 20,
                    h: 25,
                    static: true,
                    isResizable: false,
                  }}
                  style={{
                    height: '90%',
                    width: '100%',
                    margin: 0,
                    overflow: 'auto',
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.state.LogTextvalue,
                    }}
                  />
                </div>
                <div>
                  <h1></h1>
                </div>
              </ReactGridLayout>
            </React.Fragment>
          </div>
        </React.Fragment>{' '}
      </div>
    ) : (
      <span>Loading ...</span>
    );
  }
}

export default withStyles(styles, { withTheme: true })(withRouter(App));
