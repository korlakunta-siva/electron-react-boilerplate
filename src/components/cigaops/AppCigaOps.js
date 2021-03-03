import React, { Component, createRef } from 'react';

import CigaHost from './cigahost';
import RGL, { WidthProvider } from 'react-grid-layout';
import { Tabs, Tab } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
const { exec } = require('child_process');
import ApexDataGrid from '../../components/datagrid/ApexDataGrid';

const ReactGridLayout = WidthProvider(RGL);
const DATA_CIG_RECEIVERS = 'cig_receivers';
const DATA_CIG_PROCESSORS = 'cig_processors';
const DATA_RECENT_IOCM_JOBS = 'cig_iocm_kos';
const DATA_EXAM_SERIES = 'exam_series';
const DATA_SERIES_LOCATIONS = 'series_locations';
const DATA_KO_REFLECTED = 'exam_show_ko_effect';

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
    cigahosts: [
      'iasp1ei1',
      'iasp1fo1',
      'iasp2ei1',
      'iasp2ha1',
      'iasp1ma1',
      'iasp1ma2',
      'iasp1mf1',
      'iasp1mf2',
      'cigadmr01',
      'iasq1mr1',
      'iasq1mr2',
      'iasq1ma1',
      'iasq1mf1',
    ],

    customsqltext:
      "select * from iimdb_rch00_repl..exam exm , iimdb_rch00_repl..IIMTB_PREDEFINED_PROC pp  where exm.pred_proc_id = pp.pred_proc_id and exam_status = 'CM' and performed_dt between  dateadd(hh, -1, getdate()) and getdate()  ",
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    document.title = 'CIGA Ops Tools';

    this.loadGridData(DATA_CIG_RECEIVERS);
    this.loadGridData(DATA_CIG_PROCESSORS);
    this.loadGridData(DATA_RECENT_IOCM_JOBS);

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
    switch (gridname) {
      case DATA_RECENT_IOCM_JOBS:
        this.loadGridData(DATA_EXAM_SERIES, { accession: data.EXAM_ID });
        try {
          this.setState(
            {
              selecteKO_Path: data.store_path + '\\' + data.series_file_name,
            },
            () => {
              console.log('New KO Path', this.state.selecteKO_Path);
              this.cli_parse_ko_folder(data.EXAM_ID);
            }
          );
        } catch (error) {
          console.log(error);
        }
        break;
      case DATA_EXAM_SERIES:
        this.loadGridData(DATA_SERIES_LOCATIONS, { imgser_id: data.imgser_id });
        break;
    }

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
    this.loadGridData(gridName);
  };

  loadGridData = (gridName, args) => {
    console.log('Retrieve Data for :', gridName);
    let urlPrefix = 'https://iasq1mr2:8081/exsql?dbserver=';
    let dataURL = '';

    switch (gridName) {
      case DATA_CIG_RECEIVERS:
        dataURL =
          'iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select * from cigdb_rch00_prod..CIGTB_RECEIVER ';
        break;
      case DATA_CIG_PROCESSORS:
        dataURL =
          'iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select * from cigdb_rch00_prod..CIGTB_PROCESSOR ';
        break;
      case DATA_RECENT_IOCM_JOBS:
        dataURL = `iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20
         SELECT
    TOP 100
    JOB_QUEUE_ID,
    CAMPUS,
    EXAM_ID,
    PATIENT_EXTERNAL_ID,
    SENDER_AET,
    ser.SERIES_UID,
    JOB_QUEUE_START_TIME,
    STUDY_UID,
    JOB_STATUS,
    JOB_STATUS_TIME,
    RECEIVER_PORT,
    RECEIVER_AET,
    SENDER_HOST,
    SENDER_IP,
    JOB_PRIORITY,
    CAMPUS_DESC,
    DEPARTMENT_ID,
    PATIENT_INTERNAL_ID,
    PATIENT_LAST_NAME,
    PATIENT_FIRST_NAME,
    EXAM_DATE,
    STUDY_UID,
    STUDY_DESC SOPCLASS_UID,
    SERIES_MODALITY,
    TRANSFER_SYNTAX,
    PROCESSOR_HOST,
    PROCESSED_SERIES_COUNT,
    PROCESSED_JOB_COUNT,
    ACTIVE_ASSOCIATION_COUNT,
    JOB_QUEUE_END_TIME,
    UPDATE_TIME   ,  str.* , serl.*
      FROM qrddb_rch03_prod..CIGTB_JOB_QUEUE_LOG jql, iimdb_rch01_prod..IMG_SERIES ser, iimdb_rch01_prod..IMG_SERIES_LOCATION serl, iimdb_rch01_prod..IMG_STORE str  WHERE campus = 2 and jql.SOPCLASS_UID = '1.2.840.10008.5.1.4.1.1.88.59' and jql.SERIES_UID = ser.series_uid and ser.series_id = 11000 and ser.imgser_id = serl.imgserl_imgser_id and serl.imgserl_imgstr_id = str.imgstr_id and str.imgstr_imgsys_id = 2  ORDER BY jql.JOB_QUEUE_END_TIME DESC `;
        break;
      case DATA_EXAM_SERIES:
        console.log('ARGS: ', args, this.state.dataExamSeriesArgs);
        if (args == undefined || args.accession == '') {
          args = this.state.dataExamSeriesArgs;
          if (args.accession == '') return;
        }
        dataURL = `iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20
          SELECT    exm.exam_id,  imgser_imgsty_id,
    series_id,
    imgser_status,
    iocm_flag,
    imgser_image_count,
    modality,
    series_uid,
    sopclass_uid,
    imgser_id,
    series_desc,
    ser.acq_start_time,
    ser.acq_finish_time,
    ser.acq_station_name,
    projection FROM     iimdb_rch01_prod..IMG_SERIES ser,
    iimdb_rch01_prod..IMG_STUDY sty,
    iimdb_rch01_prod..EXAM exm,
    iimdb_rch01_prod..EXAM_IDENTIFIER eid WHERE     eid.examid_value = '${args.accession}' AND
    eid.examid_type_code = 'ACCESSION_NBR' AND
    eid.exam_id = exm.exam_id AND
    exm.exam_id = sty.exam_id AND
    sty.imgsty_id = ser.imgser_imgsty_id  `;

        break;

      case DATA_SERIES_LOCATIONS:
        console.log('ARGS: ', args, this.state.dataSeriesLocationsArgs);
        if (args == undefined || args.imgser_id == '') {
          args = this.state.dataSeriesLocationsArgs;
          if (args.imgser_id == '') {
            return;
          }
        }
        dataURL = `iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20
        SELECT
    imgsys_name,
    imgserl_status,
    imgserl_image_count,
    last_action_time,
    imgserl_id,
    imgserl_imgser_id,
    series_size,
    series_file_name,
    imgserl_imgstr_id  FROM     iimdb_rch01_prod..IMG_SERIES_LOCATION serl,
    iimdb_rch01_prod..IMG_STORE str,
    iimdb_rch01_prod..IMG_SYSTEM imgsys WHERE     imgserl_imgser_id =  ${args.imgser_id}  AND      serl.imgserl_imgstr_id = str.imgstr_id AND     str.imgstr_imgsys_id = imgsys.imgsys_id
     `;

        break;
      default:
    }

    console.log('Getting data from URL:', urlPrefix + dataURL);

    fetch(urlPrefix + dataURL, {})
      .then((response) => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: 'Something went wrong in getting data',
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        let dframe = data['frame0'];
        //console.log(dframe);
        let myObj = JSON.parse(dframe);
        console.log(myObj);
        data = myObj['rows'];

        switch (gridName) {
          case DATA_CIG_RECEIVERS:
            this.setState(
              {
                dataCigReceivers: data,
                loaded: true,
              },
              () => {
                console.log(
                  'Changed state CIGReceivers',
                  this.state.dataCigReceivers.length
                );
              }
            );
            break;
          case DATA_CIG_PROCESSORS:
            this.setState(
              {
                dataCigProcessors: data,
                loaded: true,
              },
              () => {
                console.log(
                  'Changed state Processors',
                  this.state.dataCigProcessors.length
                );
              }
            );
            break;
            break;
          case DATA_RECENT_IOCM_JOBS:
            this.setState(
              {
                dataRecentIOCMjobs: data,
                loaded: true,
              },
              () => {
                console.log(
                  'Changed state IOCM JOBS',
                  this.state.dataRecentIOCMjobs.length
                );
              }
            );
            break;

          case DATA_EXAM_SERIES:
            let updatedExamSeries = data;

            // for (let i = 0; i < this.state.dataKOAffectedSeries.length; i++) {
            //   if (this.state.dataKOAffectedSeries[i].iocmko == 'yes') {
            //     //console.log('PROCESS THIS', unique_series[i].AffectedSeries);
            //     this.state.dataKOAffectedSeries[i].koseries.forEach(
            //       (element) => {
            //         console.log('Affected SeriesApply', element);
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

            //  this.setState({ dataExamSeries: updatedExamSeries });

            this.setState(
              {
                dataExamSeries: updatedExamSeries,
                dataExamSeriesArgs: args,
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

          case DATA_SERIES_LOCATIONS:
            this.setState(
              {
                dataSeriesLocations: data,
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

          default:
        }
      });
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
                  {this.state.cigahosts.map((row, index) => (
                    <CigaHost key={row} hostname={row} />
                  ))}
                </div>
              </div>
            </div>
          </React.Fragment>
        </TabPanel>
        <TabPanel value={this.state.tablValue} index={1}>
          <div>
            <ReactGridLayout
              className="layout"
              onLayoutChange={this.onLayoutChange}
              rowHeight={30}
            >
              <div
                key="1"
                data-grid={{
                  x: 0,
                  y: 0,
                  w: 4,
                  h: 2,
                  minH: 3,
                  maxH: 8,
                  static: true,
                  isResizable: true,
                }}
              >
                <ApexDataGrid
                  key="linq"
                  gridname={DATA_CIG_RECEIVERS}
                  gridTitle={'CIG Receivers - PROD'}
                  onRefresh={() => this.handleGridRefresh(DATA_CIG_RECEIVERS)}
                  ref={this.tranGridElement}
                  gridData={this.state.dataCigReceivers}
                  onRowSelected={this.onRowSelectExam}
                />
              </div>

              <div
                key="2"
                data-grid={{
                  x: 4,
                  y: 0,
                  w: 4,
                  h: 4,
                  static: true,
                  isResizable: false,
                }}
                style={{ height: '90%', width: '100%', margin: 0 }}
              >
                <ApexDataGrid
                  key="linq2"
                  gridname={DATA_EXAM_SERIES}
                  gridTitle={'Exam Series - PROD'}
                  gridData={this.state.dataExamSeries}
                  onRowSelected={this.onRowSelectExam}
                  button2Label="View"
                  onButton2Callback={this.onRowSelectView}
                />
              </div>
            </ReactGridLayout>
          </div>
        </TabPanel>
        <TabPanel value={this.state.tablValue} index={2}>
          <div>
            <ReactGridLayout
              className="layout"
              onLayoutChange={this.onLayoutChange}
              rowHeight={30}
            >
              <div
                key="1"
                data-grid={{
                  x: 0,
                  y: 0,
                  w: 5,
                  h: 2,
                  minH: 2,
                  maxH: 2,
                  static: true,
                  isResizable: true,
                }}
              >
                <ApexDataGrid
                  key="iocm1"
                  gridname={DATA_RECENT_IOCM_JOBS}
                  ShowAllColumns={true}
                  gridTitle={'RECENT IOCM KOs - PROD'}
                  divHeight={'420px'}
                  onRefresh={() =>
                    this.handleGridRefresh(DATA_RECENT_IOCM_JOBS)
                  }
                  gridData={this.state.dataRecentIOCMjobs}
                  onRowSelected={this.onRowSelectExam}
                  button2Label="View"
                  onButton2Callback={this.onRowSelectView}
                />
              </div>
              <div
                key="2"
                data-grid={{
                  x: 6,
                  y: 0,
                  w: 7,
                  h: 2,
                  static: true,
                  isResizable: false,
                }}
                style={{ height: '90%', width: '100%', margin: 0 }}
              >
                <ApexDataGrid
                  key="series1"
                  gridname={DATA_EXAM_SERIES}
                  ShowAllColumns={true}
                  divHeight={'250px'}
                  domHeight={'normal'}
                  gridTitle={'SELECTED EXAM - PROD'}
                  onRefresh={() => this.handleGridRefresh(DATA_EXAM_SERIES)}
                  gridData={this.state.dataExamSeries}
                  onRowSelected={this.onRowSelectExam}
                  button2Label="View"
                  onButton2Callback={this.onRowSelectView}
                />
              </div>
              <h1>{this.state.selecteKO_Path}</h1>
              <div
                key="3"
                data-grid={{
                  x: 6,
                  y: 8,
                  w: 7,
                  h: 3,
                  static: true,
                  isResizable: false,
                }}
                style={{ height: '90%', width: '100%', margin: 0 }}
              >
                <ApexDataGrid
                  key="serloc1"
                  gridname={DATA_SERIES_LOCATIONS}
                  ShowAllColumns={true}
                  divHeight={'350px'}
                  domHeight={'autoHeight'}
                  gridTitle={'SERIES LOCATIONS - PROD'}
                  onRefresh={() =>
                    this.handleGridRefresh(DATA_SERIES_LOCATIONS)
                  }
                  gridData={this.state.dataSeriesLocations}
                  onRowSelected={this.onRowSelectExam}
                  button2Label="View"
                  onButton2Callback={this.onRowSelectView}
                />
              </div>

              <div
                key="4"
                data-grid={{
                  x: 0,
                  y: 12,
                  w: 14,
                  h: 3,
                  static: true,
                  isResizable: false,
                }}
                style={{ height: '90%', width: '100%', margin: 0 }}
              >
                <ApexDataGrid
                  key="serloc2"
                  gridname={DATA_KO_REFLECTED}
                  ShowAllColumns={true}
                  divHeight={'150px'}
                  domHeight={'autoHeight'}
                  gridTitle={'DATA_KO_REFLECTED EXAM - PROD'}
                  onRefresh={() => this.handleGridRefresh(DATA_KO_REFLECTED)}
                  gridData={this.state.dataKOAffectedSeries}
                  onRowSelected={this.onRowSelectExam}
                  button2Label="View"
                  onButton2Callback={this.onRowSelectView}
                />
              </div>
            </ReactGridLayout>
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
