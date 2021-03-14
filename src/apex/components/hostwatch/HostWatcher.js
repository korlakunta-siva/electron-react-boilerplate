import React, { Component, createRef } from 'react';

import HostView from './HostView';
import RGL, { WidthProvider } from 'react-grid-layout';
import { Tabs, Tab } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
const { exec } = require('child_process');
import ApexDataGrid from '../../../components/datagrid/ApexDataGrid';
import { loadGridData } from './hostData';

const ReactGridLayout = WidthProvider(RGL);

class App extends Component {
  // endpoint_exams =
  //   'https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20 ';

  // endpoint_patient_exams =
  //   "https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20select oncis = (select min('Yes') from iimdb_rch00_repl..img_study sty2, iimdb_rch00_repl..img_study_location styl2 , iimdb_rch00_repl..img_store str2 where sty2.exam_id = exm.exam_id and sty2.imgsty_id = styl2.imgstyl_imgsty_id and styl2.imgstyl_status = 'A' and styl2.imgstyl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 2),  * from iimdb_rch00_repl..exam exm , iimdb_rch00_repl..DEPT_PROCEDURE pp  where exm.proc_id = pp.proc_id and patient_cmrn = ";

  // endpoint_series =
  //   'https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20select * from iimdb_rch00_repl..img_study sty, iimdb_rch00_repl..img_series ser where sty.imgsty_id = ser.imgser_imgsty_id and sty.exam_id = ';

  // endpoint_series_location =
  //   'https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20select * from iimdb_rch00_repl..img_series_location, iimdb_rch00_repl..img_store str, iimdb_rch00_repl..img_system imgsys where imgserl_imgstr_id = imgstr_id and imgstr_imgsys_id = imgsys_id and imgserl_imgser_id = ';

  // endpoint_exceptions =
  //   "https://iasq1mr2:8081/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select  exc_src_system, exc_exr_code	,exc_time , exam_id ,		exc_src_queue_id,		exc_iparam1	,exc_iparam2	,exc_iparam3	,exc_iparam4	,exc_cparam1     ,   exc_cparam2  from iimdb_rch02_prod..EXCEPTION exc  where  exc.exc_exr_code in ('IMGE_SERL_A', 'IMGE_SERL_D', 'IMGE_SERL_P') and exam_id = ";

  // endpoint_exam_cmoves =
  //   'https://iasq1mr2:8081/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%200%20select rd.REQDTL_EXAM_ID as exam_id, howlong = datediff(mi, rh.REQHDR_REQUESTED_AT_TIME, isnull(isnull(rd.REQDTL_COMPLETED_AT_TIME, dcmr.DCMR_LAST_ATTEMPT_TIME), getdate())) , rh.REQHDR_REQUESTED_AT_TIME  as requested_at ,  rd.REQDTL_COMPLETED_AT_TIME done_at , dcmr.DCMR_LAST_ATTEMPT_TIME last_attempt_at, rh.REQHDR_SOURCE as source, rd.REQDTL_PRIORITY as priority, rd.REQDTL_STATUS as status ,* from iimdb_rch02_prod..REQUEST_HEADER rh, iimdb_rch02_prod..REQUEST_DETAIL rd left join iimdb_rch02_prod..DICOM_CMOVE_REQUEST dcmr on dcmr.DCMR_REQUEST_DTL_ID = rd.REQDTL_ID where  rd.REQDTL_REQHDR_ID = rh.REQHDR_ID and rd.REQDTL_EXAM_ID =  ';

  // endpoint_exam_cmoves_cols =
  //   'https://iasq1mr2:8081/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%200%20select rd.REQDTL_EXAM_ID as exam_id, howlong = datediff(mi, rh.REQHDR_REQUESTED_AT_TIME, isnull(isnull(rd.REQDTL_COMPLETED_AT_TIME, dcmr.DCMR_LAST_ATTEMPT_TIME), getdate())) , rh.REQHDR_REQUESTED_AT_TIME  as requested_at ,  rd.REQDTL_COMPLETED_AT_TIME done_at , dcmr.DCMR_LAST_ATTEMPT_TIME last_attempt_at, rh.REQHDR_SOURCE as source, rd.REQDTL_PRIORITY as priority, rd.REQDTL_STATUS as status ,* from iimdb_rch02_prod..REQUEST_HEADER rh, iimdb_rch02_prod..REQUEST_DETAIL rd left join iimdb_rch02_prod..DICOM_CMOVE_REQUEST dcmr on dcmr.DCMR_REQUEST_DTL_ID = rd.REQDTL_ID where  rd.REQDTL_REQHDR_ID = rh.REQHDR_ID and rd.REQDTL_EXAM_ID = 31897826 ';

  // 'cigadmr01',
  // 'iasq1mr1',
  // 'iasq1mr2',

  state = {
    filepath: '',
    iframeRef: createRef(),
    tablValue: 0,
    columns_loaded: false,
    dataCigReceivers: [],
    dataCigProcessors: [],
    dataRecentIOCMjobs: [],
    selecteKO_Path: '',
    dataKOAffectedSeries: [],
    dataExamSeries: [],
    dataExamSeriesArgs: { accession: '' },
    dataSeriesLocations: [],
    dataSeriesLocationsArgs: { imgser_id: '' },
    apexhosts: [
      'APEX-DC',
      'APEX-DC1',
      'APEX-DC2',
      'apex-server',
      'APEX-SERVER2',
      'apex-dt-23',
      
'APEX-DT-22',

'APEX-DT-DOC1',
'APEX-DT-DOC2',

'APEX-DT-15',
'APEX-DT-05',
'APEX-DT-43',
'APEX-DT-04',
'APEX-DT-33',
'APEX-DT-14',
'APEX-DT-09',
'APEX-DT-31',

'APEX-DT-50',
'APEX-DT-51',
'APEX-DT-52',
'APEX-DT-53',
'APEX-DT-24',
'APEX-DT-32',
'APEX-DT-10',
'APEX-DT-02',
'APEX-TV',
'APEX-LT-09',
'APEX-TEST',
'APEX-DSS',

'APEX-EKG-01',
'APEX-LT-JHOBBS',
'APEX-DT-26',
'APEX-DT-25', 


    ],

    
// 'APEX-SERVER-T1',
// 'apexnas',
// 'apexdrive',
// 'APEX-NAS1',
// 'PCODE-NAS1',

    customsqltext:
      "select * from iimdb_rch00_repl..exam exm , iimdb_rch00_repl..IIMTB_PREDEFINED_PROC pp  where exm.pred_proc_id = pp.pred_proc_id and exam_status = 'CM' and performed_dt between  dateadd(hh, -1, getdate()) and getdate()  ",
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    document.title = 'CIGA Ops Tools';

    setTimeout(() => {
      this.setState({ columns_loaded: true });
    }, 2000);
  }

  onLayoutChange(layout) {
    //this.props.onLayoutChange(layout);
  }

  handleTabChange = (event, newValue) => {
    this.setState({ tablValue: newValue });
  };

  onRowSelectExam = (event) => {
    console.log('AG Row selected', event);

    let selectedNodes = event.api
      .getSelectedNodes()
      .filter((node) => node.selected);
    console.log(selectedNodes);
  };

  addRejectedCounts = (exam_series) => {
    let unique_series = exam_series.reduce((accumulator, currentValue) => {
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

    console.log('ENHANCED SERIES', unique_series);
  };

  cli_parse_ko_folder = (examid) => {
    console.log('JS to run parse KO: ', examid);
    let mesg = '';
    console.log(
      '"api/venv/Scripts/python"  api/dicom.py -cmd cisparse -a ' + examid
    );
    try {
      exec(
        '"api/venv/Scripts/python"  api/dicom.py -cmd cisparse -a ' + examid,
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

          //addRejectedCounts()

          let modified_data = stdout.replaceAll("'", '"');
          //console.log('Received DICOM Data', modified_data);
          let myObject = JSON.parse(modified_data);

          this.setState({ dataKOAffectedSeries: myObject }, () => {
            console.log('Affected Series', this.state.dataKOAffectedSeries);

            // let updatedExamSeries = this.state.dataExamSeries.map((row) => {
            //   return row;
            // });

            // for (let i = 0; i < this.state.dataKOAffectedSeries.length; i++) {
            //   if (this.state.dataKOAffectedSeries[i].iocmko == 'yes') {
            //     //console.log('PROCESS THIS', unique_series[i].AffectedSeries);
            //     this.state.dataKOAffectedSeries[i].koseries.forEach(
            //       (element) => {
            //         for (let j = 0; j < updatedExamSeries.length; j++) {
            //           if (updatedExamSeries.series_uid == element.seruid) {
            //             updatedExamSeries.RejectedCount +=
            //               element.images.length;
            //             break;
            //           }
            //         }
            //       }
            //     );
            //   }
            // }

            // this.setState({ dataExamSeries: updatedExamSeries });
          });

          // console.log(stdout);
          //retfunc(stdout);
          //retfunc ((JSON.stringify(stdout)));
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  onRowSelectView = (data, gridname) => {
    console.log('Transaction View:', gridname, data);
    

    //this.handleLinqReportPdf(check_path);
  };

  a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  handleGridRefresh = (gridName) => {
    console.log('Refresh called on: ', gridName);
    loadGridData(gridName, {}, this.recvGridData);
  };

  recvGridData = (gridName, args, gridData) => {
    console.log('ReceivedData for :', gridName, args, gridData);

  };

  render() {
    return this.state.columns_loaded ? (
      <div
        className="col-12 py-3 overflow-auto"
        style={{ height: '90vh', backgroundColor: 'lightgrey' }}
      >
        <Tabs
          value={this.state.tablValue}
          onChange={this.handleTabChange}
          aria-label="simple tabs example"
        >
          <Tab label="Hosts - JVMs" {...this.a11yProps(0)} />
          <Tab label="Config Data" {...this.a11yProps(1)} />
          <Tab label="IOCM Exams" {...this.a11yProps(2)} />
        </Tabs>
        <TabPanel
          value={this.state.tablValue}
          index={0}
          style={{ height: '90%', width: '100%' }}
        >
          <React.Fragment>
            <div className="container-fluid  " style={{ whiteSpace: 'nowrap' }}>
              <div
                className="form-group"
                style={{
                  dislplay: 'inline-block',
                  margin: '10px',
                  float: 'left',
                }}
                width="200px"
              >
                <div
                  className="row "
                  style={{ dislplay: 'inline-block', margin: '10px' }}
                >
                  {this.state.apexhosts.map((row, index) => (
                    <HostView key={row} hostname={row} />
                  ))}
                </div>
              </div>
            </div>
          </React.Fragment>
        </TabPanel>
        <TabPanel value={this.state.tablValue} index={1}>
          <div>
            
          </div>
        </TabPanel>
        <TabPanel value={this.state.tablValue} index={2}>
          <div>
          
          </div>
        </TabPanel>
      </div>
    ) : (
      <span>Loading ...</span>
    );
  }
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

export default App;

// <button id="myButton3" onClick={this.nextPDFPage}>
// Previous Page{' '}
// </button>
// <button id="myButton4" onClick={this.nextPDFPage}>
// Next Page{' '}
// </button>
// <iframe
// width="100%"
// height="600px"
// backgroundcolor="lightgrey"
// ref={this.state.iframeRef}
// src={this.state.filepath}
// />

// button2Label="View"
// onButton2Callback={this.onRowSelectView}
