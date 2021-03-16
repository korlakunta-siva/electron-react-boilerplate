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
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Receivers } from '../cigaops/cigConfigData';

const path = require('path');
const { exec } = require('child_process');

import {
  DATA_PATIENT_EXAMS,
  DATA_PATIENT_EXAM_ACCN,
  DATA_PATIENT_EXAM_EXAMID,
  loadGridData,
  cli_parse_ko_folder,
  DATA_STUDY_LOCATION,
  runCIGCommand,
  cli_getdicom_meta,
  onOpenQREADS,
  cli_viewdicom_file,
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
  DATA_DICOM_FOLDER_SERIES,
  DATA_DICOM_IIM_SERIES_COMPARE,
  DATA_CIG_QUEUE_SERIES,
  DATA_CIG_QUEUE_JOBS,
  DATA_CIG_QUEUE_JOBS_LOG,
  DATA_CIG_QUEUE_JOBS_PROCESS_LOG,
  DATA_CIG_QUEUE_JOBS_EXCEPTIONS,
  DATA_EXAM_LIST_FROM_ACCNLIST,
} from './patbrowseData';

import ApexDataGrid from '../../components/datagrid/ApexDataGrid';

const ReactGridLayout = WidthProvider(RGL);
let shell = require('electron').shell;

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

// document.addEventListener('click', function (event) {
//   if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
//     event.preventDefault()
//     shell.openExternal(event.target.href)
//   }
// })

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

const ipc = require('electron').ipcRenderer;

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

const FormDialog = (props) => {
  const [open, setOpen] = React.useState(false);
  const [accnList, setaccnList] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseCancel = () => {
    setOpen(false);
  };

  const handleCloseOk = () => {
    setOpen(false);
    props.onClose(accnList);
  };

  return (
    <span className="inline">
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Accn List
      </Button>
      <Dialog
        open={open}
        onClose={handleCloseCancel}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Enter Accession numbers to be opened in the exam list grid.
          </DialogContentText>
          <TextField
            autoFocus
            multiline
            margin="dense"
            id="name"
            label="Accession numbers, csv"
            value={accnList}
            onChange={(e) => setaccnList(e.target.value)}
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
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
    activeIndex: 0,

    dicomData: [],
    dicomKOData: [],
    CIGReceiverQueue: '',
    CIGReceiverQueueCampus: '',

    CIGReceiverEnvironment: '',
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
    dicomIimsSeriesComparedata: [],
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

    ipc.on('selected-file', (event, path) => {
      //do what you want with the path/file selected, for example:
      console.log('REACT: ' + path);
      cli_getdicom_meta(path, this.recv_dicom_meta);
    });
  }

  onCIGQ_Refresh = () => {
    loadGridData(
      DATA_CIG_QUEUE_SERIES,
      { DbEnv: this.DbEnvProd },
      this.recvGridData
    );
    loadGridData(
      DATA_CIG_QUEUE_JOBS,
      { DbEnv: this.DbEnvProd },
      this.recvGridData
    );
    loadGridData(
      DATA_CIG_QUEUE_JOBS_LOG,
      { DbEnv: this.DbEnvProd },
      this.recvGridData
    );
    loadGridData(
      DATA_CIG_QUEUE_JOBS_PROCESS_LOG,
      { DbEnv: this.DbEnvProd },
      this.recvGridData
    );
    loadGridData(
      DATA_CIG_QUEUE_JOBS_EXCEPTIONS,
      { DbEnv: this.DbEnvProd },
      this.recvGridData
    );
  };

  handleChangeQueueSelection = (event) => {
    console.log('SELECTED CIG Receiver Queue: ', event.target.value);

    this.setState({
      CIGReceiverQueue: event.target.value,
    });
  };

  handleChangeQueueCampusSelection = (event) => {
    console.log('SELECTED CIG Receiver Queue Campus: ', event.target.value);

    this.setState({
      CIGReceiverQueueCampus: event.target.value,
    });
  };

  recv_dicom_meta = (data) => {
    let modified_data = '';

    try {
      modified_data = data.replaceAll("'", '"');
    } catch (error) {
      return;
    }
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

    this.setState({ dicomData: myObject });

    let AccnNum = '';

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

        if (AccnNum == '') {
          AccnNum = currentValue.Accession;
        }
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

    loadGridData(
      DATA_DICOM_IIM_SERIES_COMPARE,
      {
        accession: AccnNum,
        DbEnv: this.DbEnvProd,
      },
      this.recvGridData
    );

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

    this.setState({ dicomKOData: unique_series });
  };

  componentWillMount() {
    document.title = 'CIGA Patient Browser';

    setTimeout(() => {
      this.setState({ columns_loaded: true });
    }, 2000);
  }

  handleTabChange = (_, activeIndex) => this.setState({ activeIndex });

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

        loadGridData(
          DATA_DICOM_IIM_SERIES_COMPARE,
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

      case DATA_DICOM_FOLDER_SERIES:
        console.log('Need to Send to CIGA', data);
        break;
      default:
    }
  };

  cli_send2_ciga = (folderpath, receiver) => {
    //let logStream = fs.createWriteStream('./logFile.log', {flags: 'a'});

    const recv_aet = receiver.split(',')[0];
    const sender_aet = receiver.split(',')[2];
    console.log('SEND TO CIGA', receiver, folderpath);

    //CIGA_MCR_ORDSTG@10.128.232.152:6109

    let mesg = '';
    console.log(
      'C:\\Programs\\dcm4che\\bin\\storescu -b ' +
        sender_aet +
        ' -c  ' +
        recv_aet +
        ' ' +
        folderpath
    );

    try {
      exec(
        'C:\\Programs\\dcm4che\\bin\\storescu -b ' +
          sender_aet +
          ' -c  ' +
          recv_aet +
          ' ' +
          folderpath,
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

  onSendStudyToCIGA = (data, gridname) => {
    let seriesFolderPath = data.SeriesPath;
    let studyFolderPath = path.dirname(seriesFolderPath);

    console.log('SEND STUDY TO CIGA', studyFolderPath);

    this.cli_send2_ciga(studyFolderPath, this.state.CIGReceiverEnvironment);
  };

  onSendSeriesToCIGA = (data, gridname) => {
    let seriesFolderPath = data.SeriesPath;

    console.log('SEND SERIES TO CIGA', seriesFolderPath);

    this.cli_send2_ciga(seriesFolderPath, this.state.CIGReceiverEnvironment);
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

  handleChangeCIGReceiverEnv = (event) => {
    console.log('SELECTED CIG Receiver Env: ', event.target.value);

    this.setState({
      CIGReceiverEnvironment: event.target.value,
    });
  };

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
      case DATA_CIG_QUEUE_SERIES:
        this.setState({
          dataCigQSeries: gridData,
          loaded: true,
        });
        break;
      case DATA_CIG_QUEUE_JOBS:
        this.setState({
          dataCigQJobs: gridData,
          loaded: true,
        });
        break;
      case DATA_CIG_QUEUE_JOBS_LOG:
        this.setState({
          dataCigQJobsLog: gridData,
          loaded: true,
        });
        break;
      case DATA_CIG_QUEUE_JOBS_PROCESS_LOG:
        this.setState({
          dataCigQProcessLog: gridData,
          loaded: true,
        });
        break;
      case DATA_CIG_QUEUE_JOBS_EXCEPTIONS:
        this.setState({
          dataCigQExceptions: gridData,
          loaded: true,
        });
        break;

      case DATA_EXAM_LIST_FROM_ACCNLIST:
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
      case DATA_DICOM_IIM_SERIES_COMPARE:
        this.setState(
          {
            dicomIimsSeriesComparedata: gridData,
            loaded: true,
          },
          () => {
            console.log(
              'Changed state dicomIimsSeriesComparedata',
              this.state.dicomIimsSeriesComparedata.length
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

  getDicmFiles = () => {
    // const res = ipcRenderer.sendSync('show-open-dialog', "cmd");
    // console.log("IN REACT: ", res);
    // return res;

    ipc.send('open-file-dialog');

    //selectFiles();
  };

  onSendExam2CIGA = () => {
    ipc.send('open-file-dialog-send2ciga');
  };

  getELQFile = () => {
    // const res = ipcRenderer.sendSync('show-open-dialog', "cmd");
    // console.log("IN REACT: ", res);
    // return res;

    ipc.send('open-elq-dialog');

    //selectFiles();
  };

  render() {
    const { classes } = this.props;
    const { activeIndex } = this.state;

    console.log('AppPatient Component is rendering.');

    return this.state.columns_loaded ? (
      <div
        style={{
          display: 'flex',
          width: '100%',
        }}
      >
        <ReactGridLayout
          className="layout"
          onLayoutChange={this.onLayoutChange}
          rowHeight={30}
        >
          <div
            key="24910"
            data-grid={{
              x: 0,
              y: 0,
              w: 10,
              h: 2,
              static: true,
              isResizable: false,
            }}
            style={{ height: '90%', width: '100%', margin: 0 }}
          >
            <button onClick={this.getDicmFiles}>
              Select DICOM Files / Folder
            </button>
            <button
              onClick={() => {
                shell.openExternal(
                  'https://mevi01.mayo.edu:10443/ui/login.jsp'
                );
              }}
            >
              MIDIA-INT
            </button>
            <button
              onClick={() => {
                shell.openExternal('https://mcamidprod.mayo.edu/ui/login.jsp');
              }}
            >
              MIDIA-MCA
            </button>
            <button
              onClick={() => {
                shell.openExternal('https://dicom1.mayo.edu/');
              }}
            >
              MIDIA-MCR
            </button>
            <button
              onClick={() => {
                shell.openExternal('https://midmcfprod.mayo.edu/');
              }}
            >
              MIDIA-MCF
            </button>
            <button onClick={this.onSendExam2CIGA}>Select To CIGA-INT</button>
            {/* <button onClick={this.getELQFile}>
                  Generate ExamList.qreads File For DCM Folder
                </button> */}

            <FormControl className={classes.formControl}>
              <Select
                labelId="simple-select-required-label"
                id="cig-reciver-queue"
                value={this.state.CIGReceiverQueue}
                onChange={this.handleChangeQueueSelection}
                className={classes.selectEmpty}
              >
                {Receivers.map((rcvr) => rcvr.queue)
                  .filter((item, i, ar) => ar.indexOf(item) === i)
                  .map((queue) => (
                    <MenuItem value={`${queue}`}>{queue}</MenuItem>
                  ))}
              </Select>
              <InputLabel id="select-sendto-receiver-label">Queue</InputLabel>
            </FormControl>

            <FormControl className={classes.formControl}>
              <Select
                labelId="simple-select-required-label"
                id="cig-reciver-queue"
                value={this.state.CIGReceiverQueueCampus}
                onChange={this.handleChangeQueueCampusSelection}
                className={classes.selectEmpty}
              >
                {Receivers.filter(
                  (rcvr) => rcvr.queue == this.state.CIGReceiverQueue
                )
                  .map((rcvr) => rcvr.campus)
                  .filter((item, i, ar) => ar.indexOf(item) === i)
                  .map((campus) => (
                    <MenuItem value={`${campus}`}>{campus}</MenuItem>
                  ))}
              </Select>
              <InputLabel id="select-sendto-receiver-label">Campus</InputLabel>
            </FormControl>

            <FormControl className={classes.formControl}>
              <Select
                labelId="simple-select-required-label"
                id="cig-reciver-queue"
                value={this.state.CIGReceiverEnvironment}
                onChange={this.handleChangeCIGReceiverEnv}
                className={classes.selectEmpty}
              >
                {Receivers.filter(
                  (rcvr) =>
                    rcvr.queue == this.state.CIGReceiverQueue &&
                    rcvr.campus == this.state.CIGReceiverQueueCampus
                ).map((rcvr) => (
                  <MenuItem
                    value={`${rcvr.recvaet}@${rcvr.ipaddr}:${rcvr.port},${rcvr.sendaet1},${rcvr.sendaet2}`}
                  >
                    {rcvr.sendaet2}=>{rcvr.hostname}[{rcvr.ipaddr.split('.')[3]}
                    ]->{rcvr.recvaet}:{rcvr.port}
                  </MenuItem>
                ))}
              </Select>
              <InputLabel id="select-sendto-receiver-label">
                CIG Receiver
              </InputLabel>
            </FormControl>
          </div>
          <div
            key="24821"
            data-grid={{
              x: 0,
              y: 2,
              w: 10,
              h: 4,
              static: true,
              isResizable: false,
            }}
            style={{ height: '90%', width: '100%', margin: 0 }}
          >
            <ApexDataGrid
              key="folderImages"
              gridname={DATA_CIGA_EXCEPTIONS}
              ShowAllColumns={true}
              divHeight={'250px'}
              domHeight={'normal'}
              gridTitle={'Folder Images - PROD'}
              onRefresh={() => this.handleGridRefresh(DATA_CIGA_EXCEPTIONS)}
              gridData={this.state.dicomData}
              gridArgsText={''}
              onRowSelected={this.onRowSelectExam}
              button2Label="View"
              onButton2Callback={this.onRowSelectView}
              button2Label="mcroDICOM"
              onButton2Callback={(datarow) => {
                console.log(datarow);
                cli_viewdicom_file(datarow.filepath);
              }}
            />
          </div>

          <div
            key="2491"
            data-grid={{
              x: 0,
              y: 10,
              w: 10,
              h: 3,
              static: true,
              isResizable: false,
            }}
            style={{ height: '90%', width: '100%', margin: 0 }}
          >
            <ApexDataGrid
              key="folderImagesko"
              gridname={DATA_DICOM_FOLDER_SERIES}
              ShowAllColumns={true}
              divHeight={'250px'}
              domHeight={'normal'}
              gridTitle={'Folder KO - PROD'}
              onRefresh={() => this.handleGridRefresh(DATA_DICOM_FOLDER_SERIES)}
              gridData={this.state.dicomKOData}
              gridArgsText={''}
              onRowSelected={this.onRowSelectExam}
              button2Label="Send Study"
              onButton2Callback={this.onSendStudyToCIGA}
              button3Label="Send Series"
              onButton3Callback={this.onSendSeriesToCIGA}
            />
          </div>

          <div
            key="249103"
            data-grid={{
              x: 0,
              y: 17,
              w: 14,
              h: 4,
              static: true,
              isResizable: false,
            }}
            style={{ height: '90%', width: '100%', margin: 0 }}
          >
            <ApexDataGrid
              key="folderImagesiims"
              gridname={DATA_DICOM_IIM_SERIES_COMPARE}
              ShowAllColumns={true}
              divHeight={'250px'}
              domHeight={'normal'}
              gridTitle={'Compare MIDIA and QREADS'}
              onRefresh={() =>
                this.handleGridRefresh(DATA_DICOM_IIM_SERIES_COMPARE)
              }
              gridData={this.state.dicomIimsSeriesComparedata}
              gridArgsText={''}
              onRowSelected={this.onRowSelectExam}
            />
          </div>
        </ReactGridLayout>
      </div>
    ) : (
      <span>Loading ...</span>
    );
  }
}

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

export default withStyles(styles, { withTheme: true })(App);
