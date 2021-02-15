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

  endpoint_sql_prefix =
    'https://iasq1mr2:8081/exsql?dbserver=' +
    this.DbEnv.iimsRepl +
    '&sqltype=customSQL&sqltext=set%20rowcount%201000%20 ';

  api_endpoint_sql_prefix =
    'https://iasq1mr2:8081/exsql?dbserver=' +
    this.DbEnv.iimsOltp +
    'iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20 ';

  endpoint_exams =
    'https://iasq1mr2:8081/exsql?dbserver=' +
    this.DbEnv.iimsRepl +
    '&sqltype=customSQL&sqltext=set%20rowcount%201000%20 ';

  // endpoint_patient_exams =
  //   "https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20select oncis = (select min('Yes') from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_study sty2, iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_study_location styl2 , iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_store str2 where sty2.exam_id = exm.exam_id and sty2.imgsty_id = styl2.imgstyl_imgsty_id and styl2.imgstyl_status = 'A' and styl2.imgstyl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 2),  * from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..exam exm , iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..DEPT_PROCEDURE pp  where exm.proc_id = pp.proc_id and  ";

  /// ADD THIS AS POST

  //   ((select sum(imgserl_image_count) from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_study sty, iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_series, iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_series_location
  //   where sty.exam_id = exm.exam_id and sty.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
  //     and imgser_status = 'A' and imgserl_status = 'A'
  //     and modality not in ('KO', 'SR', 'RTSTRUCT') and sopclass_uid != '1.2.840.10008.5.1.4.1.1.88.33'
  //     and (series_desc is null or series_desc not like '%:-q%')
  //     and imgserl_imgstr_id in
  //   (select imgstr_id from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}.dbo.IMG_STORE where imgstr_imgsys_id = 1))
  // -
  // (select sum(imgserl_image_count) from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_study sty, iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_series, iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_series_location imgserl, iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}.dbo.IMG_STORE imgstr
  //   where  sty.exam_id = exm.exam_id and sty.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
  //     and imgser_status = 'A' and imgserl_status = 'A'
  //     and modality not in ('KO', 'SR') and sopclass_uid != '1.2.840.10008.5.1.4.1.1.88.33'
  //     and (series_desc is null or series_desc not like '%:-q%')
  //   and imgserl_imgstr_id = imgstr.imgstr_id and imgstr_imgsys_id = 2
  //         and imgserl.last_action_time = (select max(sl2.last_action_time)
  //                                                                         from img_series_location sl2
  //                                                                         join img_store st2 on sl2.imgserl_imgstr_id = st2.imgstr_id
  //                                                                       where imgserl.imgserl_imgser_id = sl2.imgserl_imgser_id
  //                                                                         and imgstr.imgstr_imgsys_id = st2.imgstr_imgsys_id
  //                                                                         and sl2.imgserl_status = 'A') )
  //                                                                         ) as CountDiff,

  endpoint_patient_exams = ` https://iasq1mr2:8081/exsql?dbserver=${this.DbEnv.iimsRepl}&sqltype=customSQL&sqltext=set%20rowcount%201000%20select
    oncis = (select min('Yes') from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_study sty2, iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_study_location styl2 , iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_store str2 where sty2.exam_id = exm.exam_id and sty2.imgsty_id = styl2.imgstyl_imgsty_id and styl2.imgstyl_status = 'A' and styl2.imgstyl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 2),
    onMIDIA = (select min('Yes') from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_study sty2, iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_study_location styl2 , iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_store str2 where sty2.exam_id = exm.exam_id and sty2.imgsty_id = styl2.imgstyl_imgsty_id and styl2.imgstyl_status = 'A' and styl2.imgstyl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 1),


    patient_cmrn, exam_id ,
    (select examid_value from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..EXAM_IDENTIFIER eid where eid.examid_type_code = 'ACCESSION_NBR' and eid.exam_id = exm.exam_id) as 'iims_accn',
    (select examid_value from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..EXAM_IDENTIFIER eid where eid.examid_type_code = 'EPIC_ACCESSION_NBR' and eid.exam_id = exm.exam_id) as 'epic_accn',
    clinical_viewer_desc, exam_status, performed_dt , report_status, modality_code, exm.dept_id,
    scheduled_for_dt, owner_system,	patient_id,	exam_availability, exam_priority_code,	left_right_flag,	emr_flag,	archive_ind,	sensitive_flag	,pred_proc_id,	exm.proc_id
    ,	proc_code,	proc_desc
    from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..exam exm , iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..DEPT_PROCEDURE pp  where exm.proc_id = pp.proc_id and

 `;

  ///ADD THIS AS POST

  //  ((select sum(imgserl_image_count) from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_series, iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_series_location
  //  where sty.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
  //    and imgser_status = 'A' and imgserl_status = 'A'
  //    and modality not in ('KO', 'SR', 'RTSTRUCT') and sopclass_uid != '1.2.840.10008.5.1.4.1.1.88.33'
  //    and (series_desc is null or series_desc not like '%:-q%')
  //    and imgserl_imgstr_id in
  //  (select imgstr_id from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}.dbo.IMG_STORE where imgstr_imgsys_id = 1))
  // -
  // (select sum(imgserl_image_count) from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_series, iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_series_location imgserl, iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}.dbo.IMG_STORE imgstr
  //  where sty.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
  //    and imgser_status = 'A' and imgserl_status = 'A'
  //    and modality not in ('KO', 'SR') and sopclass_uid != '1.2.840.10008.5.1.4.1.1.88.33'
  //    and (series_desc is null or series_desc not like '%:-q%')
  //  and imgserl_imgstr_id = imgstr.imgstr_id and imgstr_imgsys_id = 2
  //        and imgserl.last_action_time = (select max(sl2.last_action_time)
  //                                                                        from img_series_location sl2
  //                                                                        join img_store st2 on sl2.imgserl_imgstr_id = st2.imgstr_id
  //                                                                      where imgserl.imgserl_imgser_id = sl2.imgserl_imgser_id
  //                                                                        and imgstr.imgstr_imgsys_id = st2.imgstr_imgsys_id
  //                                                                        and sl2.imgserl_status = 'A') )
  //                                                                        ) as CountDiff,

  endpoint_studies = ` https://iasq1mr2:8081/exsql?dbserver=${this.DbEnv.iimsRepl}&sqltype=customSQL&sqltext=set%20rowcount%201000%20select
  oncis = (select min('Yes') from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_study_location styl2 , iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_store str2 where  sty.imgsty_id = styl2.imgstyl_imgsty_id and styl2.imgstyl_status = 'A' and styl2.imgstyl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 2),
  onMIDIA = (select min('Yes') from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_study_location styl2 , iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_store str2 where  sty.imgsty_id = styl2.imgstyl_imgsty_id and styl2.imgstyl_status = 'A' and styl2.imgstyl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 1),


  * from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_study sty where  sty.exam_id =
  `;

  endpoint_series = ` https://iasq1mr2:8081/exsql?dbserver=${this.DbEnv.iimsRepl}&sqltype=customSQL&sqltext=set%20rowcount%201000%20select
  oncis = (select min('Yes') from  iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_series_location serl2 , iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_store str2 where ser.imgser_id = serl2.imgserl_imgser_id and serl2.imgserl_status = 'A' and serl2.imgserl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 2),
  onMIDIA = (select min('Yes') from  iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_series_location serl2 , iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_store str2 where ser.imgser_id = serl2.imgserl_imgser_id and serl2.imgserl_status = 'A' and serl2.imgserl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 1),
    modality as 'SerModality', *
    from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_study sty, iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_series ser where sty.imgsty_id = ser.imgser_imgsty_id and sty.exam_id =
    `;

  endpoint_series_ciga_inbound = `https://iasq1mr2:8081/exsql?dbserver=${this.DbEnv.iimsOltp}&sqltype=customSQL&sqltext=set%20rowcount%201000%20select * from qrddb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsOltpExt}..CIGTB_INBOUND_SERIES inbs where inbs.patient_external_id = `;

  endpoint_series_location = ` https://iasq1mr2:8081/exsql?dbserver=${this.DbEnv.iimsRepl}&sqltype=customSQL&sqltext=set%20rowcount%201000%20
   select
   onMIDIA = (select min('Yes') from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_series ser2, iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_series_location serl2 , iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_store str2 where ser2.imgser_id = serl.imgserl_imgser_id and ser2.imgser_id = serl2.imgserl_imgser_id and serl2.imgserl_status = 'A' and serl2.imgserl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 1),
   store_path as store_p, series_file_name as file_path, * from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_series_location serl, iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_store str, iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..img_system imgsys where imgserl_imgstr_id = imgstr_id and imgstr_imgsys_id = imgsys_id and imgserl_imgser_id =

   `;

  endpoint_exceptions = `https://iasq1mr2:8081/exsql?dbserver=${this.DbEnv.iimsOltp}&sqltype=customSQL&sqltext=set%20rowcount%201000%20select  exc_src_system, exc_exr_code	,exc_time , exam_id ,		exc_src_queue_id,		exc_iparam1	,exc_iparam2	,exc_iparam3	,exc_iparam4	,exc_cparam1     ,   exc_cparam2  from iimdb_rch02${this.DbEnv.iimsOltpExt}..EXCEPTION exc  where  exc.exc_exr_code in ('IMGE_SERL_A', 'IMGE_SERL_D', 'IMGE_SERL_P') and exam_id = `;

  endpoint_exam_cmoves = `https://iasq1mr2:8081/exsql?dbserver=${this.DbEnv.iimsOltp}&sqltype=customSQL&sqltext=set%20rowcount%200%20select rd.REQDTL_EXAM_ID as exam_id, howlong = datediff(mi, rh.REQHDR_REQUESTED_AT_TIME, isnull(isnull(rd.REQDTL_COMPLETED_AT_TIME, dcmr.DCMR_LAST_ATTEMPT_TIME), getdate())) , rh.REQHDR_REQUESTED_AT_TIME  as requested_at ,  rd.REQDTL_COMPLETED_AT_TIME done_at , dcmr.DCMR_LAST_ATTEMPT_TIME last_attempt_at, rh.REQHDR_SOURCE as source, rd.REQDTL_PRIORITY as priority, rd.REQDTL_STATUS as status ,* from iimdb_rch02${this.DbEnv.iimsOltpExt}..REQUEST_HEADER rh, iimdb_rch02${this.DbEnv.iimsOltpExt}..REQUEST_DETAIL rd left join iimdb_rch02${this.DbEnv.iimsOltpExt}..DICOM_CMOVE_REQUEST dcmr on dcmr.DCMR_REQUEST_DTL_ID = rd.REQDTL_ID where  rd.REQDTL_REQHDR_ID = rh.REQHDR_ID and rd.REQDTL_EXAM_ID =  `;

  state = {
    columns_loaded: false,
    cmrn: '',
    examid: '',
    imgsty_id: '',
    study_uid: '',
    series_uid: '',
    imgser_id: 0,
    loaded: false,
    placeholder: '',
    data: [],
    exams: [],
    study: [],
    series: [],
    series_ciga_inbound: [],
    series_ciga_jobs: [],
    series_ciga_exceptions: [],
    exceptions: [],
    exam_cmoves: [],
    series_locations: [],
    custom_data: [],
    multi_grid_data: [],
    fileReader: '',
    graph_data: {},
    customsqltext: `select top 10  * from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..exam exm , iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..IIMTB_PREDEFINED_PROC pp  where exm.pred_proc_id = pp.pred_proc_id and exam_status = 'CM' and performed_dt between  dateadd(dd, -130, getdate()) and getdate()  `,
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

  cmrnChange = (event) => {
    console.log(
      this.endpoint_patient_exams +
        " patient_cmrn = '" +
        this.state.patient_cmrn +
        "' order by performed_dt desc"
    );
    fetch(
      this.endpoint_patient_exams +
        " patient_cmrn = '" +
        this.state.patient_cmrn +
        "' order by performed_dt desc",
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
        console.log(data);
        let dframe = data['frame0'];
        console.log(dframe);
        let myObj = JSON.parse(dframe);
        console.log(myObj);
        data = myObj['rows'];
        this.setState(
          {
            data: data,
            series: [],
            series_locations: [],
            series_ciga_jobs: [],
            loaded: true,
          },
          () => {
            console.log('Changed state', this.state.data.length);
            this.examsGridElement.current.changeGridData(this.state.data);
          }
        );
      });
  };

  examidChange = (event) => {
    console.log(
      this.endpoint_patient_exams +
        ' exam_id = ' +
        this.state.exam_id +
        ' order by performed_dt desc'
    );
    fetch(
      this.endpoint_patient_exams +
        ' exam_id = ' +
        this.state.exam_id +
        ' order by performed_dt desc',
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
        console.log(data);
        let dframe = data['frame0'];
        console.log(dframe);
        let myObj = JSON.parse(dframe);
        console.log(myObj);
        data = myObj['rows'];
        this.setState(
          {
            data: data,
            series: [],
            series_locations: [],
            series_ciga_jobs: [],
            loaded: true,
          },
          () => {
            console.log('Changed state', this.state.data.length);
            this.examsGridElement.current.changeGridData(this.state.data);
          }
        );
      });
  };

  accnChange = (event) => {
    console.log(
      this.endpoint_patient_exams +
        ` exam_id in (select exam_id from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..EXAM_IDENTIFIER eid where eid.examid_type_code = 'ACCESSION_NBR' and eid.examid_value = '` +
        this.state.accn +
        "') " +
        ' order by performed_dt desc'
    );
    fetch(
      this.endpoint_patient_exams +
        ` exam_id in (select exam_id from iimdb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsReplExt}..EXAM_IDENTIFIER eid where eid.examid_type_code = 'ACCESSION_NBR' and eid.examid_value = '` +
        this.state.accn +
        "') " +
        ' order by performed_dt desc',
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
        console.log(data);
        let dframe = data['frame0'];
        console.log(dframe);
        let myObj = JSON.parse(dframe);
        console.log(myObj);
        data = myObj['rows'];
        this.setState(
          {
            data: data,
            series: [],
            series_locations: [],
            series_ciga_jobs: [],
            loaded: true,
          },
          () => {
            console.log('Changed state', this.state.data.length);
            this.examsGridElement.current.changeGridData(this.state.data);
          }
        );
      });
  };

  onRowSelectExam = (data) => {
    //console.log("rowselected exam:", data[0].row);
    this.setState(
      { examid: data[0].row.exam_id, cmrn: data[0].row.patient_cmrn },
      () => {
        console.log(this.endpoint_series + this.state.examid);
        fetch(this.endpoint_series + this.state.examid, {})
          .then((response) => {
            if (response.status !== 200) {
              return this.setState({
                placeholder: 'Something went wrong in getting data',
              });
            }
            return response.json();
          })
          .then((data) => {
            //console.log(data);
            let dframe = data['frame0'];
            let myObj = JSON.parse(dframe);
            data = myObj['rows'];
            this.setState(
              {
                series: data,
                series_locations: [],
                series_ciga_jobs: [],
                loaded: true,
              },
              () => {
                //console.log("Changed state", this.state.series.length);
                this.seriesGridElement.current.changeGridData(
                  this.state.series
                );
                this.seriesLocationsGridElement.current.changeGridData(
                  this.state.series_locations
                );
              }
            );
          });

        console.log(
          'Fetching Ciga Inbound for this patient:',
          this.endpoint_series_ciga_inbound + "'" + this.state.cmrn + "'"
        );

        fetch(
          this.endpoint_series_ciga_inbound + "'" + this.state.cmrn + "'",
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
            //console.log(data);
            let dframe = data['frame0'];
            let myObj = JSON.parse(dframe);
            data = myObj['rows'];
            this.setState(
              {
                series_ciga_inbound: data,
                loaded: true,
              },
              () => {
                //console.log("Changed state", this.state.series.length);
                this.seriesCIGAInboundGridElement.current.changeGridData(
                  this.state.series_ciga_inbound
                );
              }
            );
          });

        fetch(
          this.endpoint_exceptions +
            this.state.examid +
            ' order by exc_time desc',
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
            console.log(data);
            let dframe = data['frame0'];
            let myObj = JSON.parse(dframe);
            data = myObj['rows'];
            this.setState({ exceptions: data, loaded: true }, () => {
              // console.log("Changed state", this.state.exceptions.length);
              this.exceptionsGridElement.current.changeGridData(
                this.state.exceptions
              );
            });
          });

        let endpoint_ciga_exceptions =
          'https://iasq1mr2:8081/exsql?dbserver=' +
          this.DbEnv.iimsOltp +
          '&sqltype=customSQL&sqltext=set%20rowcount%201000%20select ' +
          ` TBL = 'DONE_QUEUE',  ql.job_queue_id, el.exception_id, el.exception_code, el.exception_desc, el.exception_time from iimdb_rch01${this.DbEnv.iimsOltpExt}..EXAM_IDENTIFIER ei, qrddb_rch03${this.DbEnv.iimsOltpExt}..CIGTB_JOB_QUEUE_LOG ql , qrddb_rch03${this.DbEnv.iimsOltpExt}..CIGTB_EXCEPTION_LOG el where
      ei.exam_id = ${this.state.examid} and ei.examid_type_code = 'ACCESSION_NBR' and ei.examid_value = ql.EXAM_ID and  el.SOURCE_QUEUE_ID = ql.job_queue_id
      union
      select TBL = 'IN_QUEUE', ql.job_queue_id, el.exception_id, el.exception_code, el.exception_desc, el.exception_time from iimdb_rch01${this.DbEnv.iimsOltpExt}..EXAM_IDENTIFIER ei, qrddb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsOltpExt}..CIGTB_JOB_QUEUE ql , qrddb_rch03${this.DbEnv.iimsOltpExt}..CIGTB_EXCEPTION_LOG el where
      ei.exam_id = ${this.state.examid} and ei.examid_type_code = 'ACCESSION_NBR' and ei.examid_value = ql.EXAM_ID and  el.SOURCE_QUEUE_ID = ql.job_queue_id
      order by exception_id desc`;

        console.log(endpoint_ciga_exceptions);
        fetch(endpoint_ciga_exceptions, {})
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
            console.log(dframe);
            if (typeof dframe === 'undefined') {
              console.log(
                'dframe is undefined. No data returned from ciga exceptions.'
              );
              return;
            }
            let myObj = JSON.parse(dframe);
            data = myObj['rows'];
            this.setState(
              { series_ciga_exceptions: data, loaded: true },
              () => {
                // console.log("Changed state", this.state.exceptions.length);
                this.seriesCIGAExceptionsGridElement.current.changeGridData(
                  this.state.series_ciga_exceptions
                );
              }
            );
          });

        console.log(
          'Fetching Studies: ',
          this.endpoint_studies + this.state.examid
        );
        fetch(this.endpoint_studies + this.state.examid, {})
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
            let myObj = JSON.parse(dframe);
            data = myObj['rows'];
            this.setState({ study: data, loaded: true }, () => {
              // console.log("Changed state", this.state.exceptions.length);
              this.studyGridElement.current.changeGridData(this.state.study);
            });
          });

        fetch(
          this.endpoint_exam_cmoves +
            this.state.examid +
            ' order by rh.REQHDR_REQUESTED_AT_TIME desc',
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
            console.log(data);
            let dframe = data['frame0'];
            let myObj = JSON.parse(dframe);
            data = myObj['rows'];
            this.setState({ exam_cmoves: data, loaded: true }, () => {
              // console.log("Changed state", this.state.exceptions.length);
              this.cmovesGridElement.current.changeGridData(
                this.state.exam_cmoves
              );
            });
          });
      }
    );
  };

  onRowSelectStudy = (data) => {
    console.log('rowselected study:', data[0].row);
    this.setState({
      imgsty_id: data[0].row.imgsty_id,
      examid: data[0].row.exam_id,
    });
  };

  onRowSelectSeries = (data) => {
    console.log('rowselected sereis:', data[0].row);
    this.setState(
      { imgser_id: data[0].row.imgser_id, series_uid: data[0].row.series_uid },
      () => {
        //console.log(this.endpoint_series_location + this.state.imgser_id);
        fetch(this.endpoint_series_location + this.state.imgser_id, {})
          .then((response) => {
            if (response.status !== 200) {
              return this.setState({
                placeholder: 'Something went wrong in getting data',
              });
            }
            return response.json();
          })
          .then((data) => {
            //console.log(data);
            let dframe = data['frame0'];
            let myObj = JSON.parse(dframe);
            data = myObj['rows'];
            this.setState({ series_locations: data, loaded: true }, () => {
              //console.log("Changed state", this.state.series_locations.length);
              this.seriesLocationsGridElement.current.changeGridData(
                this.state.series_locations
              );
            });
          });

        let endpoint_ciga_jobs =
          'https://iasq1mr2:8081/exsql?dbserver=' +
          this.DbEnv.iimsOltp +
          '&sqltype=customSQL&sqltext=set%20rowcount%201000%20select ' +
          ` TBL = 'DONE_QUEUE', JOB_QUEUE_ID,	JOB_QUEUE_START_TIME,    	JOB_STATUS,	JOB_STATUS_TIME,         	RECEIVER_PORT,	RECEIVER_AET,   	SENDER_HOST ,    	SENDER_IP,    	SENDER_AET,    	JOB_PRIORITY,	CAMPUS,	CAMPUS_DESC,	DEPARTMENT_ID,	DEPARTMENT_CODE,	PATIENT_EXTERNAL_ID,	PATIENT_INTERNAL_ID,	PATIENT_LAST_NAME,	PATIENT_FIRST_NAME,	EXAM_ID ,	EXAM_DATE  ,             	STUDY_UID     ,                                 	STUDY_DESC  ,                                      	SERIES_UID ,                                            	SOPCLASS_UID,             	SERIES_MODALITY,	TRANSFER_SYNTAX,    	PROCESSOR_HOST,	PROCESSED_SERIES_COUNT,	PROCESSED_JOB_COUNT,	ACTIVE_ASSOCIATION_COUNT,	JOB_QUEUE_END_TIME ,     	UPDATE_TIME
        from qrddb_rch03${this.DbEnv.iimsOltpExt}..CIGTB_JOB_QUEUE_LOG where SERIES_UID =  '${this.state.series_uid}'
        union
        select TBL = 'IN_QUEUE',  JOB_QUEUE_ID,	JOB_QUEUE_START_TIME,    	JOB_STATUS,	JOB_STATUS_TIME,         	RECEIVER_PORT,	RECEIVER_AET,   	SENDER_HOST ,    	SENDER_IP,    	SENDER_AET,    	JOB_PRIORITY,	CAMPUS,	CAMPUS_DESC,	DEPARTMENT_ID,	DEPARTMENT_CODE,	PATIENT_EXTERNAL_ID,	PATIENT_INTERNAL_ID,	PATIENT_LAST_NAME,	PATIENT_FIRST_NAME,	EXAM_ID ,	EXAM_DATE  ,             	STUDY_UID     ,                                 	STUDY_DESC  ,                                      	SERIES_UID ,                                            	SOPCLASS_UID,             	SERIES_MODALITY,	TRANSFER_SYNTAX,    	PROCESSOR_HOST,	PROCESSED_SERIES_COUNT,	PROCESSED_JOB_COUNT,	ACTIVE_ASSOCIATION_COUNT,	JOB_QUEUE_END_TIME = convert(datetime,null),     	UPDATE_TIME = convert(datetime,null)
        from qrddb_rch${this.DbEnv.iimsReplDBNum}${this.DbEnv.iimsOltpExt}..CIGTB_JOB_QUEUE where SERIES_UID =  '${this.state.series_uid}' `;

        //console.log(endpoint_ciga_jobs);

        fetch(endpoint_ciga_jobs + ' order by JOB_STATUS_TIME desc', {})
          .then((response) => {
            if (response.status !== 200) {
              return this.setState({
                placeholder: 'Something went wrong in getting data',
              });
            }
            //console.log(response);
            return response.json();
          })
          .then((data) => {
            //console.log(data);
            let dframe = data['frame0'];
            //console.log(dframe);
            let myObj = JSON.parse(dframe);
            data = myObj['rows'];
            this.setState({ series_ciga_jobs: data, loaded: true }, () => {
              //console.log("Changed state", this.state.series_ciga_jobs.length);
              this.seriesCIGAGridElement.current.changeGridData(
                this.state.series_ciga_jobs
              );
            });
          });

        fetch(
          this.endpoint_exceptions +
            this.state.examid +
            " and exc_cparam2 = '" +
            this.state.series_uid +
            "' order by exc_time desc",
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
            //console.log(data);
            let dframe = data['frame0'];
            let myObj = JSON.parse(dframe);
            data = myObj['rows'];
            this.setState({ exceptions: data, loaded: true }, () => {
              //console.log("Changed state", this.state.exceptions.length);
              this.exceptionsGridElement.current.changeGridData(
                this.state.exceptions
              );
            });
          });
      }
    );
  };

  onRowSelectPatient = (data) => {
    //console.log("rowselected patient:", data[0].row.patient_cmrn);
    this.setState({ patient_cmrn: data[0].row.patient_cmrn }, () => {
      //console.log("Patient CMRN Changed", this.state.patient_cmrn);
      fetch(
        this.endpoint_patient_exams +
          "'" +
          this.state.patient_cmrn +
          "' order by performed_dt desc",
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
          //console.log(data);
          let dframe = data['frame0'];
          let myObj = JSON.parse(dframe);
          data = myObj['rows'];
          this.setState(
            {
              data: data,
              series: [],
              series_locations: [],
              exceptions: [],
              series_ciga_jobs: [],
              loaded: true,
            },
            () => {
              console.log('Changed state', this.state.data.length);
              this.examsGridElement.current.changeGridData(this.state.data);
              this.seriesGridElement.current.changeGridData(this.state.series);
              this.seriesLocationsGridElement.current.changeGridData(
                this.state.series_locations
              );
              this.exceptionsGridElement.current.changeGridData(
                this.state.exceptions
              );
            }
          );
        });
    });
  };

  onRowSelectSeriesLocation = (data) => {
    console.log('rowselected series location:', data);
  };

  onRowSelectSeriesCigaJob = (data) => {
    console.log('rowselected SeriesCigaJob:', data);
  };

  OnExamPurge = (data) => {
    console.log('OnExamPurge called:', data);

    let purge_sql = 'https://iasq1mr2:8042/purge/currentexam/' + data.exam_id;

    let isOnMidia = data.onMIDIA;
    let message = 'Are you sure you want purge this exam ?';
    if (isOnMidia != 'Yes') {
      message = 'CAUTION. NOT ON MIDIA. ' + message;
    }

    if (window.confirm(message)) {
      // Save it!
      console.log('Call API: ' + purge_sql);

      fetch(purge_sql, {})
        .then((response) => {
          if (response.status !== 200) {
            return this.setState({
              placeholder: 'Something went wrong in getting data',
            });
          }
          //console.log(response);
          return response.json();
        })
        .then((data) => {
          alert('Submited Purge Request');
        });
    } else {
      // Do nothing!
    }
  };

  OnStudyPurge = (data) => {
    console.log('OnStudyPurge called:', data);

    let purge_sql =
      'https://iasq1mr2:8042/purge/currentstudy/' + data.imgsty_id;

    let isOnMidia = data.onMIDIA;
    let message = 'Are you sure you want purge this study ?';
    if (isOnMidia != 'Yes') {
      message = 'CAUTION. NOT ON MIDIA. ' + message;
    }

    if (window.confirm(message)) {
      // Save it!
      console.log('Call API: ' + purge_sql);

      fetch(purge_sql, {})
        .then((response) => {
          if (response.status !== 200) {
            return this.setState({
              placeholder: 'Something went wrong in getting data',
            });
          }
          //console.log(response);
          return response.json();
        })
        .then((data) => {
          alert('Submited Purge Request');
        });
    } else {
      // Do nothing!
    }
  };

  OnSeriesPurge = (data) => {
    console.log('OnSeriesPurge called:', data);

    let purge_sql =
      'https://iasq1mr2:8042/purge/currentseries/' + data.imgser_id;

    let isOnMidia = data.onMIDIA;
    let message = 'Are you sure you want purge this series ?';
    if (isOnMidia != 'Yes') {
      message = 'CAUTION. NOT ON MIDIA. ' + message;
    }

    if (window.confirm(message)) {
      // Save it!
      console.log('Call API: ' + purge_sql);

      fetch(purge_sql, {})
        .then((response) => {
          if (response.status !== 200) {
            return this.setState({
              placeholder: 'Something went wrong in getting data',
            });
          }
          //console.log(response);
          return response.json();
        })
        .then((data) => {
          alert('Submited Purge Request');
        });
    } else {
      // Do nothing!
    }
  };

  OnSeriesLocationPurge = (data) => {
    console.log('OnSeriesLocationPurge called:', data);
    if (data.imgsys_name == 'MIDIA') {
      alert(
        'You can not purge series location from MIDIA.  Did you mean to pick QREADS Location? Select the correct series location row to purge. '
      );
      return;
    }

    let purge_sql =
      'https://iasq1mr2:8042/purge/currentserieslocation/' + data.imgserl_id;

    let isOnMidia = data.onMIDIA;
    let message = 'Are you sure you want purge this series location ?';
    if (isOnMidia != 'Yes') {
      message = 'CAUTION. NOT ON MIDIA. ' + message;
    }

    if (window.confirm(message)) {
      // Save it!
      console.log('Call API: ' + purge_sql);

      fetch(purge_sql, {})
        .then((response) => {
          if (response.status !== 200) {
            return this.setState({
              placeholder: 'Something went wrong in getting data',
            });
          }
          //console.log(response);
          return response.json();
        })
        .then((data) => {
          alert('Submited Purge Request');
        });
    } else {
      // Do nothing!
    }
  };

  OnSeriesDeArchive = (data) => {
    console.log('OnSeriesDeArchive called:', data);
    let dearchive_sql =
      this.api_endpoint_sql_prefix +
      `exec iimdb_rch01${this.DbEnv.iimsOltpExt}..iimsp_prefetch_retrieveimages  @priority = 'H', @exam_id = `;
  };

  OnExamDeArchive = (data) => {
    console.log('OnExamDeArchive called:', data);

    let dearchive_sql =
      this.api_endpoint_sql_prefix +
      `exec iimdb_rch01${this.DbEnv.iimsOltpExt}..iimsp_prefetch_retrieveimages  @priority = 'H', @exam_id = `;

    if (window.confirm('Are you sure you want dearchive this exam ?')) {
      // Save it!
      console.log('Call API: ' + dearchive_sql + data.exam_id);

      fetch(dearchive_sql + data.exam_id, {})
        .then((response) => {
          if (response.status !== 200) {
            return this.setState({
              placeholder: 'Something went wrong in getting data',
            });
          }
          //console.log(response);
          return response.json();
        })
        .then((data) => {
          alert('Submited Dearchive Request');
        });
    } else {
      // Do nothing!
    }
  };

  handleFileReadSQL = (e) => {
    console.log('handle file read', e);
    const content = e.target.result;
    this.setState({ customsqltext: content, custom_data: [] });

    fetch(this.endpoint_exams + '  ' + this.state.customsqltext, {})
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
        let myObj = JSON.parse(dframe);
        data = myObj['rows'];
        this.setState({ custom_data: data, loaded: true }, () => {
          console.log('Changed state', this.state.custom_data.length);
          this.customExamsGridElement.current.changeGridData(
            this.state.custom_data
          );
        });
      });

    console.log(content);
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

  render() {
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
              <label>
                Patient CMRN
                <input
                  className="form-control-inline ml-4"
                  type="text"
                  id="pat_cmrn"
                  placeholder="CMRN..."
                  onChange={(event) => {
                    console.log(
                      'CMRN Input Field New Value:',
                      event.target.value,
                      event.target.value.replace(/\D/g, '')
                    );
                    this.setState({
                      patient_cmrn: event.target.value.replace(/\D/g, ''),
                    });
                  }}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      this.cmrnChange();
                    }
                  }}
                ></input>
              </label>

              <label>
                Accession Number
                <input
                  className="form-control-inline ml-4"
                  type="text"
                  id="pat_accnum"
                  placeholder="Accession Number ..."
                  onChange={(event) => {
                    console.log(
                      'Accession Number value:',
                      event.target.value.trim()
                    );
                    this.setState({ accn: event.target.value.trim() });
                  }}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      this.accnChange();
                    }
                  }}
                ></input>
              </label>

              <label>
                Exam ID
                <input
                  className="form-control-inline ml-4"
                  type="text"
                  id="pat_examid"
                  placeholder="IIMS Exam Id..."
                  onChange={(event) => {
                    console.log(
                      'EXAMID New value:',
                      event.target.value,
                      event.target.value.replace(/\D/g, '')
                    );
                    this.setState({
                      exam_id: event.target.value.replace(/\D/g, ''),
                    });
                  }}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      this.examidChange();
                    }
                  }}
                ></input>
              </label>
            </div>

            <DataProvider
              endpoint={this.endpoint_exams + this.state.customsqltext}
              render={(data) => (
                <React.Fragment>
                  <label>Patient Exams</label>
                  <DataGrid
                    enableFilter
                    ref={this.examsGridElement}
                    initialRows={this.state.data}
                    toolbarButton1
                    toobarButton1Text="De-Archive"
                    OnToolbarButton1={this.OnExamDeArchive}
                    toolbarButton2
                    toobarButton2Text="Purge"
                    OnToolbarButton2={this.OnExamPurge}
                    gridheight={200}
                    gridname={'exams'}
                    onRowSelect={this.onRowSelectExam}
                  />
                  <label>Exam Study for the selected exam</label>
                  <DataGrid
                    enableFilter
                    ref={this.studyGridElement}
                    showCheckbox={true}
                    initialRows={this.state.study}
                    toolbarButton2
                    toobarButton2Text="Purge"
                    OnToolbarButton2={this.OnStudyPurge}
                    gridheight={200}
                    gridname={'studies_grid'}
                    onRowSelect={this.onRowSelectStudy}
                  />
                  <label>Exam Series for the selected exam</label>
                  <DataGrid
                    enableFilter
                    ref={this.seriesGridElement}
                    initialRows={this.state.series}
                    toolbarButton2
                    toobarButton2Text="De-Archive"
                    OnToolbarButton2={this.OnSeriesDeArchive}
                    toolbarButton2
                    toobarButton2Text="Purge"
                    OnToolbarButton2={this.OnSeriesPurge}
                    gridheight={200}
                    gridname={'series_grid'}
                    onRowSelect={this.onRowSelectSeries}
                  />
                  <label>Series Locations for the selected series</label>
                  <DataGrid
                    enableFilter
                    ref={this.seriesLocationsGridElement}
                    initialRows={this.state.series_locations}
                    toolbarButton2
                    toobarButton2Text="Purge"
                    OnToolbarButton2={this.OnSeriesLocationPurge}
                    gridheight={200}
                    gridname={'series_location_grid'}
                    onRowSelect={this.onRowSelectSeriesLocation}
                  />
                  <label>CMOVES for the selected exam</label>
                  <DataGrid
                    ref={this.cmovesGridElement}
                    initialRows={this.state.exam_cmoves}
                    gridheight={200}
                    gridname={'cmoves grid'}
                    onRowSelect={this.onRowSelectSeriesLocation}
                  />
                  <label>Exceptions Data for selected Exam / Series </label>
                  <DataGrid
                    ref={this.exceptionsGridElement}
                    initialRows={this.state.exceptions}
                    gridheight={200}
                    gridname={'exceptions grid'}
                    onRowSelect={this.onRowSelectSeriesLocation}
                  />
                  <label>CIGA Series INBOUND Queue for this Patient</label>
                  <DataGrid
                    ref={this.seriesCIGAInboundGridElement}
                    showCheckbox={false}
                    initialRows={this.state.series_ciga_inbound}
                    gridheight={200}
                    gridname={'series_ciga_inbound'}
                    onRowSelect={this.onRowSelectSeriesCigaJob}
                  />
                  <label>CIGA Series JOBS for selected Series</label>
                  <DataGrid
                    ref={this.seriesCIGAGridElement}
                    initialRows={this.state.series_ciga_jobs}
                    gridheight={200}
                    gridname={'series_ciga_jobs'}
                    onRowSelect={this.onRowSelectSeriesCigaJob}
                  />
                  <label>CIGA JOBS Exceptions for selected Job</label>
                  <DataGrid
                    ref={this.seriesCIGAExceptionsGridElement}
                    showCheckbox={false}
                    initialRows={this.state.series_ciga_exceptions}
                    gridheight={200}
                    gridname={'series_ciga_jobs'}
                    onRowSelect={this.onRowSelectSeriesCigaJob}
                  />
                </React.Fragment>
              )}
            />
          </div>
        </React.Fragment>{' '}
      </div>
    ) : (
      <span>Loading ...</span>
    );
  }
}

export default withRouter(App);
