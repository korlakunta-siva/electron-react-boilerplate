import React, { Component } from 'react';
import './App.css';
import DataProvider from '../common/DataProvider';
import DataGrid from '../common/DataGrid';
import DataMultiGrid from '../common/DataMultiGrid';
import 'bootstrap/dist/css/bootstrap.css';
import * as FileSaver from 'file-saver';
//import VegaRenderer from "./components/VegaRenderer";
//import { Vega, VegaLite } from "react-vega";
// import { Vega } from "react-vega";
import CigaHost from '../cigahost';

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

const defaultColumnProperties = {
  sortable: true,
  filterable: true,
  resizable: true,
  editable: true,
};

const getColumnsList = (queryEndpoint) => {
  console.log(queryEndpoint);
  let columnList = [];
  return fetch(queryEndpoint, {})
    .then((response) => {
      if (response.status !== 200) {
        return this.setState({
          placeholder: 'Something went wrong in getting data for column list',
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      let dframe = data['frame0'];

      if (typeof dframe === 'undefined') {
        console.log('dframe is undefined. No data returned.', queryEndpoint);
        return [];
      }
      let myObj = JSON.parse(dframe);
      let datarows = myObj['rows'];

      if (datarows.length == 0) return [];

      columnList = Object.keys(datarows[0]).map(function (key) {
        let dict1 = {};
        Object.assign(
          dict1,
          {
            key: key,
            name: key,
            width: datarows[0][key]
              ? datarows[0][key].toString().length * 7 + 50
              : 100,
          },
          {}
        );

        //console.log(dict1);
        return dict1;
      });

      columnList = columnList.map((c) => ({
        ...c,
        ...defaultColumnProperties,
      }));

      //console.log(columnList);
      return columnList;

      //.map(c => ({ ...c, ...defaultColumnProperties }))
    });
};

const barSpec = {
  width: 400,
  height: 200,
  padding: 5,
  data: [
    {
      name: 'table',
      values: [
        { category: 'A', amount: 800 },
        { category: 'B', amount: 155 },
        { category: 'C', amount: 243 },
        { category: 'D', amount: 91 },
        { category: 'E', amount: 810 },
        { category: 'F', amount: 503 },
        { category: 'G', amount: 19 },
        { category: 'H', amount: 870 },
      ],
    },
  ],
  scales: [
    {
      name: 'xscale',
      type: 'band',
      domain: { data: 'table', field: 'category' },
      range: 'width',
      padding: 0.05,
      round: true,
    },
    {
      name: 'yscale',
      domain: { data: 'table', field: 'amount' },
      nice: true,
      range: 'height',
    },
  ],

  axes: [
    { orient: 'bottom', scale: 'xscale' },
    { orient: 'left', scale: 'yscale' },
  ],

  marks: [
    {
      type: 'rect',
      from: { data: 'table' },
      encode: {
        enter: {
          x: { scale: 'xscale', field: 'category' },
          width: { scale: 'xscale', band: 1 },
          y: { scale: 'yscale', field: 'amount' },
          y2: { scale: 'yscale', value: 0 },
        },
        update: {
          fill: { value: 'steelblue' },
        },
        hover: {
          fill: { value: 'red' },
        },
      },
    },
    {
      type: 'text',
      encode: {
        enter: {
          align: { value: 'center' },
          baseline: { value: 'bottom' },
          fill: { value: '#333' },
        },
      },
    },
  ],
};

//const BarChart = createClassFromSpec({ mode: "vega", spec: barSpec });

class App extends Component {
  endpoint_sql_prefix =
    'https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20 ';

  endpoint_exams =
    'https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20 ';

  endpoint_patient_exams =
    "https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20select oncis = (select min('Yes') from iimdb_rch00_repl..img_study sty2, iimdb_rch00_repl..img_study_location styl2 , iimdb_rch00_repl..img_store str2 where sty2.exam_id = exm.exam_id and sty2.imgsty_id = styl2.imgstyl_imgsty_id and styl2.imgstyl_status = 'A' and styl2.imgstyl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 2),  * from iimdb_rch00_repl..exam exm , iimdb_rch00_repl..DEPT_PROCEDURE pp  where exm.proc_id = pp.proc_id and patient_cmrn = ";

  endpoint_series =
    'https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20select * from iimdb_rch00_repl..img_study sty, iimdb_rch00_repl..img_series ser where sty.imgsty_id = ser.imgser_imgsty_id and sty.exam_id = ';

  endpoint_series_location =
    'https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20select * from iimdb_rch00_repl..img_series_location, iimdb_rch00_repl..img_store str, iimdb_rch00_repl..img_system imgsys where imgserl_imgstr_id = imgstr_id and imgstr_imgsys_id = imgsys_id and imgserl_imgser_id = ';

  endpoint_exceptions =
    "https://iasq1mr2:8081/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select  exc_src_system, exc_exr_code	,exc_time , exam_id ,		exc_src_queue_id,		exc_iparam1	,exc_iparam2	,exc_iparam3	,exc_iparam4	,exc_cparam1     ,   exc_cparam2  from iimdb_rch02_prod..EXCEPTION exc  where  exc.exc_exr_code in ('IMGE_SERL_A', 'IMGE_SERL_D', 'IMGE_SERL_P') and exam_id = ";

  endpoint_exam_cmoves =
    'https://iasq1mr2:8081/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%200%20select rd.REQDTL_EXAM_ID as exam_id, howlong = datediff(mi, rh.REQHDR_REQUESTED_AT_TIME, isnull(isnull(rd.REQDTL_COMPLETED_AT_TIME, dcmr.DCMR_LAST_ATTEMPT_TIME), getdate())) , rh.REQHDR_REQUESTED_AT_TIME  as requested_at ,  rd.REQDTL_COMPLETED_AT_TIME done_at , dcmr.DCMR_LAST_ATTEMPT_TIME last_attempt_at, rh.REQHDR_SOURCE as source, rd.REQDTL_PRIORITY as priority, rd.REQDTL_STATUS as status ,* from iimdb_rch02_prod..REQUEST_HEADER rh, iimdb_rch02_prod..REQUEST_DETAIL rd left join iimdb_rch02_prod..DICOM_CMOVE_REQUEST dcmr on dcmr.DCMR_REQUEST_DTL_ID = rd.REQDTL_ID where  rd.REQDTL_REQHDR_ID = rh.REQHDR_ID and rd.REQDTL_EXAM_ID =  ';

  endpoint_exam_cmoves_cols =
    'https://iasq1mr2:8081/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%200%20select rd.REQDTL_EXAM_ID as exam_id, howlong = datediff(mi, rh.REQHDR_REQUESTED_AT_TIME, isnull(isnull(rd.REQDTL_COMPLETED_AT_TIME, dcmr.DCMR_LAST_ATTEMPT_TIME), getdate())) , rh.REQHDR_REQUESTED_AT_TIME  as requested_at ,  rd.REQDTL_COMPLETED_AT_TIME done_at , dcmr.DCMR_LAST_ATTEMPT_TIME last_attempt_at, rh.REQHDR_SOURCE as source, rd.REQDTL_PRIORITY as priority, rd.REQDTL_STATUS as status ,* from iimdb_rch02_prod..REQUEST_HEADER rh, iimdb_rch02_prod..REQUEST_DETAIL rd left join iimdb_rch02_prod..DICOM_CMOVE_REQUEST dcmr on dcmr.DCMR_REQUEST_DTL_ID = rd.REQDTL_ID where  rd.REQDTL_REQHDR_ID = rh.REQHDR_ID and rd.REQDTL_EXAM_ID = 31897826 ';

  state = {
    columns_loaded: false,
    cigahosts: [
      'cigadmr01',
      'iasq1mr1',
      'iasq1mr2',
      'iasp1ei1',
      'iasp1fo1',
      'iasp2ei1',
      'iasp1ma1',
      'iasp1ma2',
      'iasp1mf1',
      'iasp1mf2',
    ],
    cmrn: '',
    examid: '',
    study_uid: '',
    series_uid: '',
    imgser_id: 0,
    loaded: false,
    placeholder: '',
    data: [],
    exams: [],
    series: [],
    series_ciga_jobs: [],
    series_ciga_exceptions: [],
    exceptions: [],
    exam_cmoves: [],
    series_locations: [],
    custom_data: [],
    multi_grid_data: [],
    fileReader: '',
    graph_data: {},
    customsqltext:
      "select * from iimdb_rch00_repl..exam exm , iimdb_rch00_repl..IIMTB_PREDEFINED_PROC pp  where exm.pred_proc_id = pp.pred_proc_id and exam_status = 'CM' and performed_dt between  dateadd(hh, -1, getdate()) and getdate()  ",
  };

  constructor(props) {
    super(props);
    this.examsGridElement = React.createRef();
    this.seriesGridElement = React.createRef();
    this.seriesLocationsGridElement = React.createRef();
    this.exceptionsGridElement = React.createRef();
    this.customExamsGridElement = React.createRef();
    this.customExams2GridElement = React.createRef();
    this.recentExamsGridElement = React.createRef();
    this.seriesCIGAGridElement = React.createRef();
    this.seriesCIGAExceptionsGridElement = React.createRef();
    this.cmovesGridElement = React.createRef();
    this.customMultiGridElement = React.createRef();
    this.exam_columns = [];
    this.series_columns = [];
    this.exceptions_columns = [];
    this.series_ciga_jobs = [];
    this.series_ciga_exceptions = [];
    this.series_location_columns = [];
    this.cmoves_columns = [];
    this.multi_grid_data = [];

    // getColumnsList(this.endpoint_patient_exams + "'" + "5202342" + "' ").then(
    //   columns => {
    //     console.log(columns);
    //     this.exam_columns = columns;
    //     console.log(this.exam_columns);

    //     this.series_columns = columns;
    //     this.exceptions_columns = columns;
    //     this.series_ciga_jobs_columns = columns;
    //     this.series_location_columns = columns;
    //     this.series_ciga_exceptions_columns = columns;
    //   }
    // );

    // getColumnsList(this.endpoint_series + "55255601").then(columns => {
    //   this.series_columns = columns;
    // });
  }

  componentWillMount() {
    getColumnsList(this.endpoint_patient_exams + "'" + '5202342' + "' ").then(
      (columns) => {
        this.exam_columns = columns;
      }
    );

    this.onRefreshPINEStatus();

    let endpoint_ciga_jobs_colqry =
      'https://iasq1mr2:8081/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select top 1 ' +
      ` TBL = 'DONE_QUEUE', JOB_QUEUE_ID,	JOB_QUEUE_START_TIME,    	JOB_STATUS,	JOB_STATUS_TIME,         	RECEIVER_PORT,	RECEIVER_AET,   	SENDER_HOST ,    	SENDER_IP,    	SENDER_AET,    	JOB_PRIORITY,	CAMPUS,	CAMPUS_DESC,	DEPARTMENT_ID,	DEPARTMENT_CODE,	PATIENT_EXTERNAL_ID,	PATIENT_INTERNAL_ID,	PATIENT_LAST_NAME,	PATIENT_FIRST_NAME,	EXAM_ID ,	EXAM_DATE  ,             	STUDY_UID     ,                                 	STUDY_DESC  ,                                      	SERIES_UID ,                                            	SOPCLASS_UID,             	SERIES_MODALITY,	TRANSFER_SYNTAX,    	PROCESSOR_HOST,	PROCESSED_SERIES_COUNT,	PROCESSED_JOB_COUNT,	ACTIVE_ASSOCIATION_COUNT,	JOB_QUEUE_END_TIME ,     	UPDATE_TIME
from qrddb_rch03_prod..CIGTB_JOB_QUEUE_LOG `;
    console.log(endpoint_ciga_jobs_colqry);

    getColumnsList(this.endpoint_series + '55255601').then((columns) => {
      this.series_columns = columns;
    });
    getColumnsList(this.endpoint_series_location + '192023132').then(
      (columns) => {
        this.series_location_columns = columns;
      }
    );

    getColumnsList(this.endpoint_exceptions + '55255601').then((columns) => {
      this.exceptions_columns = columns;
    });

    getColumnsList(this.endpoint_exam_cmoves_cols).then((columns) => {
      this.cmoves_columns = columns;
    });

    getColumnsList(
      'https://iasq1mr2:8081/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select top 10 ' +
        ` TBL = 'DONE_QUEUE', JOB_QUEUE_ID,	JOB_QUEUE_START_TIME,    	JOB_STATUS,	JOB_STATUS_TIME,         	RECEIVER_PORT,	RECEIVER_AET,   	SENDER_HOST ,    	SENDER_IP,    	SENDER_AET,    	JOB_PRIORITY,	CAMPUS,	CAMPUS_DESC,	DEPARTMENT_ID,	DEPARTMENT_CODE,	PATIENT_EXTERNAL_ID,	PATIENT_INTERNAL_ID,	PATIENT_LAST_NAME,	PATIENT_FIRST_NAME,	EXAM_ID ,	EXAM_DATE  ,             	STUDY_UID     ,                                 	STUDY_DESC  ,                                      	SERIES_UID ,                                            	SOPCLASS_UID,             	SERIES_MODALITY,	TRANSFER_SYNTAX,    	PROCESSOR_HOST,	PROCESSED_SERIES_COUNT,	PROCESSED_JOB_COUNT,	ACTIVE_ASSOCIATION_COUNT,	JOB_QUEUE_END_TIME ,     	UPDATE_TIME
    from qrddb_rch03_prod..CIGTB_JOB_QUEUE_LOG `
    ).then((columns) => {
      this.series_ciga_jobs_columns = columns;
    });

    let endpoint_ciga_exceptions_col =
      'https://iasq1mr2:8081/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select ' +
      `  TBL = 'DONE_QUEUE', ql.job_queue_id, el.exception_id, el.exception_code, el.exception_desc, el.exception_time from iimdb_rch01_prod..EXAM_IDENTIFIER ei, qrddb_rch03_prod..CIGTB_JOB_QUEUE_LOG ql , qrddb_rch03_prod..CIGTB_EXCEPTION_LOG el where
ei.exam_id = 55261446 and ei.examid_type_code = 'ACCESSION_NBR' and ei.examid_value = ql.EXAM_ID and  el.SOURCE_QUEUE_ID = ql.job_queue_id
union
select TBL = 'IN_QUEUE', ql.job_queue_id, el.exception_id, el.exception_code, el.exception_desc, el.exception_time from iimdb_rch01_prod..EXAM_IDENTIFIER ei, qrddb_rch00_prod..CIGTB_JOB_QUEUE ql , qrddb_rch03_prod..CIGTB_EXCEPTION_LOG el where
ei.exam_id = 55261446 and ei.examid_type_code = 'ACCESSION_NBR' and ei.examid_value = ql.EXAM_ID and  el.SOURCE_QUEUE_ID = ql.job_queue_id
order by exception_id desc`;

    getColumnsList(
      'https://iasq1mr2:8081/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select ' +
        `   top 1   TBL = 'DONE_QUEUE', ql.job_queue_id, el.exception_id, el.exception_code, el.exception_desc, el.exception_time from  qrddb_rch03_prod..CIGTB_JOB_QUEUE_LOG ql , qrddb_rch03_prod..CIGTB_EXCEPTION_LOG el where
        el.SOURCE_QUEUE_ID = ql.job_queue_id and el.exception_id in  (select exception_id from qrddb_rch03_prod..CIGTB_EXCEPTION_LOG where exception_time > dateadd(mi, -15, getdate()) )`
    ).then((columns) => {
      this.series_ciga_exceptions_columns = columns;
    });

    setTimeout(() => {
      this.setState({ columns_loaded: true });
    }, 2000);
  }

  cmrnChange = (event) => {
    //console.log("Changed CMR Input Value:", event);
    // console.log("CMRN Value:", this.state.patient_cmrn);
    // console.log("Retrieving Data for cmrn: ", this.state.patient_cmrn);
    console.log(
      this.endpoint_patient_exams +
        "'" +
        this.state.patient_cmrn +
        "' order by performed_dt desc"
    );
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

  onRefreshPINEStatus = () => {
    //console.log("rowselected exam:", data[0].row);
    let PINE_status_query = `
    set nocount on

    declare @pend_pine_count  int, @last_read int, @pine_queue_id int, @pine_queue_old_time datetime

    declare @pend_pine_count1  int, @last_read1 int, @timenow datetime
     select @timenow = getdate()

        select @last_read1 = QUEUEEV_LAST_READ from iimdb_rch02_prod..QUEUEEV_REF
        where QUEUEEV_QNAME = 'IMEvents' and  QUEUEEV_EVENT = 'PINE'

        set rowcount 1
        select @pine_queue_id = oq.OB_MSG_INT1
        from    iimdb_rch02_prod..outbound_queue oq
        where oq.OB_MSG_EVENT_TYPE = 'PINE'
        and oq.OB_MSG_ID >= @last_read1
        order by ob_msg_id

        select @pine_queue_old_time = image_queue_creation_dt from
         iimdb_rch02_prod..q_image_notification notq
        where image_queue_id = @pine_queue_id


        select  @pend_pine_count1 = count(*)
          from 	iimdb_rch01_prod..OUTBOUND_EVENTS (index OUTBOUND_EVENTS_prm)
        where  OE_MSG_EVENT_TYPE = 'PINE'  and  OE_MSG_ID > @last_read1

                    select 'result_type' = 'WATING', 'pending_count' = @pend_pine_count1, 'oldest_nq_id' =  @pine_queue_id, 'oldest_oe_id' = @last_read1

                    select 'result_type' = 'OLDEST EVENT', 'oldest_oe_id'   = oe_msg_id,  'oldest_oe_time' = oe_msg_timestamp, 'oe_pend_mins' = datediff(mi, oe_msg_timestamp, @timenow)  from iimdb_rch01_prod..OUTBOUND_EVENTS (index OUTBOUND_EVENTS_prm)
         where  OE_MSG_EVENT_TYPE = 'PINE'  and  OE_MSG_ID = @last_read1

            select notq.system_name, image_action_code, total_events = count(*)  from iimdb_rch02_prod..q_image_notification notq
        where image_queue_id > @pine_queue_id
        group by notq.system_name, image_action_code


          set rowcount 0
            select notq.system_name, image_action_code, dist_exams = count(distinct notq.exam_id)  from iimdb_rch02_prod..q_image_notification notq
        where image_queue_id > @pine_queue_id
        group by notq.system_name, image_action_code

                select notq.system_name, image_action_code, dist_series = count(distinct notq.series_uid)  from iimdb_rch02_prod..q_image_notification notq
        where image_queue_id > @pine_queue_id
        group by notq.system_name, image_action_code


        set rowcount 0

        select 'OLDEST NOTIFICATION' , 'oldest_nq_id' = image_queue_id, 'oldest_nq_time' = image_queue_creation_dt , 'nq_pend_mins' = datediff(mi, image_queue_creation_dt, @timenow)  from iimdb_rch02_prod..q_image_notification notq where image_queue_id = @pine_queue_id

                select 'nq_time_min' = convert(varchar(5), image_queue_creation_dt, 108),

                notq.system_name, image_action_code , total_events = count(*)  from iimdb_rch02_prod..q_image_notification notq
        where image_queue_id > @pine_queue_id
        group by
        convert(varchar(5), image_queue_creation_dt, 108),
        notq.system_name, image_action_code
        order by 1 desc




    `;

    let CIGA_Processor_query = `

    SELECT 'Non-Prefetch' as P123_data_type, 'Waiting to Process' as processing_status,
    count(*) as jobcount ,
    jq.campus, jq.job_status,
     jq.JOB_PRIORITY,
    datediff(mi,min(jq.JOB_QUEUE_START_TIME),getdate())  as wt_minutes_min,
    datediff(mi,max(jq.JOB_QUEUE_START_TIME),getdate()) as wt_minutes_max,
    min(jq.JOB_QUEUE_START_TIME) as oldest_job,
    max(jq.JOB_QUEUE_START_TIME) as recent_job
    FROM qrddb_rch00_prod..CIGTB_JOB_QUEUE jq,  qrddb_rch00_prod..CIGTB_JOB_QUEUE_DETAIL jqd
    where jq.JOB_QUEUE_ID = jqd.JOB_QUEUE_ID
    and jq.JOB_STATUS = 0 and jq.JOB_PRIORITY != 4
    group by jq.JOB_PRIORITY, jq.campus, jq.job_status
    order by jq.JOB_PRIORITY, jq.campus, jq.job_status

    SELECT   'Non-Prefetch' as P123_data, 'Processing / Errored' as processing_status,
    count(*) as jobcount ,
     jq.campus, jq.job_status,
     jq.JOB_PRIORITY,
    datediff(mi,min(jq.JOB_STATUS_TIME),getdate())  as wt_minutes_min,
    datediff(mi,max(jq.JOB_STATUS_TIME),getdate()) as wt_minutes_max,

    min(jq.JOB_STATUS_TIME) as oldest_job,
    max(jq.JOB_STATUS_TIME) as recent_job
     FROM qrddb_rch00_prod..CIGTB_JOB_QUEUE jq,  qrddb_rch00_prod..CIGTB_JOB_QUEUE_DETAIL jqd
    where jq.JOB_QUEUE_ID = jqd.JOB_QUEUE_ID
    and jq.JOB_STATUS = 1 and jq.JOB_PRIORITY != 4
    group by jq.JOB_PRIORITY, jq.campus, jq.job_status
    order by jq.JOB_PRIORITY, jq.campus, jq.job_status

    SELECT   'Non-Prefetch' as P123_data, 'Errored' as processing_status,
    count(*) as jobcount ,
     jq.campus, jq.job_status,
     jq.JOB_PRIORITY,
    datediff(mi,min(jq.JOB_STATUS_TIME),getdate())  as wt_minutes_min,
    datediff(mi,max(jq.JOB_STATUS_TIME),getdate()) as wt_minutes_max,

    min(jq.JOB_STATUS_TIME) as oldest_job,
    max(jq.JOB_STATUS_TIME) as recent_job
     FROM qrddb_rch00_prod..CIGTB_JOB_QUEUE jq,  qrddb_rch00_prod..CIGTB_JOB_QUEUE_DETAIL jqd
    where jq.JOB_QUEUE_ID = jqd.JOB_QUEUE_ID
    and jq.JOB_STATUS > 1 and jq.JOB_PRIORITY != 4
    group by jq.JOB_PRIORITY, jq.campus, jq.job_status
    order by jq.JOB_PRIORITY, jq.campus, jq.job_status

    SELECT  'Prefetch' as P4_data,  'Waiting to Process' as processing_status,
    count(*) as jobcount ,
     jq.campus, jq.job_status,
      jq.JOB_PRIORITY,
    datediff(mi,min(jq.JOB_QUEUE_START_TIME),getdate())  as wt_minutes_min,
    datediff(mi,max(jq.JOB_QUEUE_START_TIME),getdate()) as wt_minutes_max,
    min(jq.JOB_QUEUE_START_TIME) as oldest_job,
    max(jq.JOB_QUEUE_START_TIME) as recent_job

    FROM qrddb_rch00_prod..CIGTB_JOB_QUEUE jq,  qrddb_rch00_prod..CIGTB_JOB_QUEUE_DETAIL jqd
    where jq.JOB_QUEUE_ID = jqd.JOB_QUEUE_ID
    and  jq.JOB_STATUS = 0 and jq.JOB_PRIORITY = 4
    group by jq.JOB_PRIORITY, jq.campus, jq.job_status
    order by jq.JOB_PRIORITY, jq.campus, jq.job_status

    SELECT  'Prefetch' as P4_data, 'Processing / Erroed' as processing_status,
    count(*) as jobcount ,
     jq.campus, jq.job_status,
     jq.JOB_PRIORITY,
    datediff(mi,min(jq.JOB_STATUS_TIME),getdate())  as wt_minutes_min,
    datediff(mi,max(jq.JOB_STATUS_TIME),getdate()) as wt_minutes_max,
    min(jq.JOB_STATUS_TIME) as oldest_job,
    max(jq.JOB_STATUS_TIME) as recent_job

     FROM qrddb_rch00_prod..CIGTB_JOB_QUEUE jq,  qrddb_rch00_prod..CIGTB_JOB_QUEUE_DETAIL jqd
    where jq.JOB_QUEUE_ID = jqd.JOB_QUEUE_ID
    and  jq.JOB_STATUS = 1 and jq.JOB_PRIORITY = 4
    group by jq.JOB_PRIORITY, jq.campus, jq.job_status
    order by jq.JOB_PRIORITY, jq.campus, jq.job_status

    SELECT  'Prefetch' as P4_data, 'Erroed' as processing_status,
    count(*) as jobcount ,
     jq.campus, jq.job_status,
     jq.JOB_PRIORITY,
    datediff(mi,min(jq.JOB_STATUS_TIME),getdate())  as wt_minutes_min,
    datediff(mi,max(jq.JOB_STATUS_TIME),getdate()) as wt_minutes_max,
    min(jq.JOB_STATUS_TIME) as oldest_job,
    max(jq.JOB_STATUS_TIME) as recent_job

     FROM qrddb_rch00_prod..CIGTB_JOB_QUEUE jq,  qrddb_rch00_prod..CIGTB_JOB_QUEUE_DETAIL jqd
    where jq.JOB_QUEUE_ID = jqd.JOB_QUEUE_ID
    and  jq.JOB_STATUS > 1 and jq.JOB_PRIORITY = 4
    group by jq.JOB_PRIORITY, jq.campus, jq.job_status
    order by jq.JOB_PRIORITY, jq.campus, jq.job_status

    `;

    fetch(
      this.endpoint_sql_prefix.replace('iimsRepl', 'iimsProd') +
        CIGA_Processor_query,
      {}
    )
      .then((response) => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: 'Something went wrong in getting data',
          });
        }
        console.log('MULTI GRID DATA', response);
        return response.json();
      })
      .then((data) => {
        console.log('multi-grid-data', data.length, data);
        let received_frames = Object.keys(data);
        console.log('Frames Received', received_frames);
        let received_data_frames = [];
        for (var frame in received_frames) {
          let myObj = JSON.parse(data[received_frames[frame]]);
          let datarows = myObj['rows'];
          received_data_frames.push(datarows);
        }

        console.log(received_data_frames);

        this.setState(
          {
            multi_grid_data: received_data_frames,
            loaded: true,
          },
          () => {
            //console.log("Changed state", this.state.series.length);
            if (this.customMultiGridElement.current) {
              this.customMultiGridElement.current.changeGridData(
                this.state.multi_grid_data
              );
            }
          }
        );
      });
  };

  onRowSelectExam = (data) => {
    //console.log("rowselected exam:", data[0].row);
    this.setState({ examid: data[0].row.exam_id }, () => {
      //console.log(this.endpoint_series + this.state.examid);
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
              this.seriesGridElement.current.changeGridData(this.state.series);
              this.seriesLocationsGridElement.current.changeGridData(
                this.state.series_locations
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
        'https://iasq1mr2:8081/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select ' +
        ` TBL = 'DONE_QUEUE',  ql.job_queue_id, el.exception_id, el.exception_code, el.exception_desc, el.exception_time from iimdb_rch01_prod..EXAM_IDENTIFIER ei, qrddb_rch03_prod..CIGTB_JOB_QUEUE_LOG ql , qrddb_rch03_prod..CIGTB_EXCEPTION_LOG el where
      ei.exam_id = ${this.state.examid} and ei.examid_type_code = 'ACCESSION_NBR' and ei.examid_value = ql.EXAM_ID and  el.SOURCE_QUEUE_ID = ql.job_queue_id
      union
      select TBL = 'IN_QUEUE', ql.job_queue_id, el.exception_id, el.exception_code, el.exception_desc, el.exception_time from iimdb_rch01_prod..EXAM_IDENTIFIER ei, qrddb_rch00_prod..CIGTB_JOB_QUEUE ql , qrddb_rch03_prod..CIGTB_EXCEPTION_LOG el where
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
          this.setState({ series_ciga_exceptions: data, loaded: true }, () => {
            // console.log("Changed state", this.state.exceptions.length);
            this.seriesCIGAExceptionsGridElement.current.changeGridData(
              this.state.series_ciga_exceptions
            );
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
    });
  };

  onRowSelectSeries = (data) => {
    //console.log("rowselected sereis:", data[0].row.imgser_id);
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
          'https://iasq1mr2:8081/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select ' +
          ` TBL = 'DONE_QUEUE', JOB_QUEUE_ID,	JOB_QUEUE_START_TIME,    	JOB_STATUS,	JOB_STATUS_TIME,         	RECEIVER_PORT,	RECEIVER_AET,   	SENDER_HOST ,    	SENDER_IP,    	SENDER_AET,    	JOB_PRIORITY,	CAMPUS,	CAMPUS_DESC,	DEPARTMENT_ID,	DEPARTMENT_CODE,	PATIENT_EXTERNAL_ID,	PATIENT_INTERNAL_ID,	PATIENT_LAST_NAME,	PATIENT_FIRST_NAME,	EXAM_ID ,	EXAM_DATE  ,             	STUDY_UID     ,                                 	STUDY_DESC  ,                                      	SERIES_UID ,                                            	SOPCLASS_UID,             	SERIES_MODALITY,	TRANSFER_SYNTAX,    	PROCESSOR_HOST,	PROCESSED_SERIES_COUNT,	PROCESSED_JOB_COUNT,	ACTIVE_ASSOCIATION_COUNT,	JOB_QUEUE_END_TIME ,     	UPDATE_TIME
        from qrddb_rch03_prod..CIGTB_JOB_QUEUE_LOG where SERIES_UID =  '${this.state.series_uid}'
        union
        select TBL = 'IN_QUEUE',  JOB_QUEUE_ID,	JOB_QUEUE_START_TIME,    	JOB_STATUS,	JOB_STATUS_TIME,         	RECEIVER_PORT,	RECEIVER_AET,   	SENDER_HOST ,    	SENDER_IP,    	SENDER_AET,    	JOB_PRIORITY,	CAMPUS,	CAMPUS_DESC,	DEPARTMENT_ID,	DEPARTMENT_CODE,	PATIENT_EXTERNAL_ID,	PATIENT_INTERNAL_ID,	PATIENT_LAST_NAME,	PATIENT_FIRST_NAME,	EXAM_ID ,	EXAM_DATE  ,             	STUDY_UID     ,                                 	STUDY_DESC  ,                                      	SERIES_UID ,                                            	SOPCLASS_UID,             	SERIES_MODALITY,	TRANSFER_SYNTAX,    	PROCESSOR_HOST,	PROCESSED_SERIES_COUNT,	PROCESSED_JOB_COUNT,	ACTIVE_ASSOCIATION_COUNT,	JOB_QUEUE_END_TIME = convert(datetime,null),     	UPDATE_TIME = convert(datetime,null)
        from qrddb_rch00_prod..CIGTB_JOB_QUEUE where SERIES_UID =  '${this.state.series_uid}' `;

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

  handleFileReadJson = (e) => {
    console.log('handle file read', e);
    const content = e.target.result;
    const jsonData = JSON.parse(content);

    this.setState({ custom_data: jsonData, loaded: true }, () => {
      console.log('Changed state', this.state.custom_data.length);
      this.customExamsGridElement.current.changeGridData(
        this.state.custom_data
      );
    });

    let barData = {
      table: [
        { category: 'A', amount: 2800 },
        { category: 'B', amount: 55 },
        { category: 'C', amount: 43 },
        { category: 'D', amount: 91 },
        { category: 'E', amount: 810 },
        { category: 'F', amount: 503 },
        { category: 'G', amount: 19 },
        { category: 'H', amount: 870 },
      ],
    };
    this.setState({ graph_data: barData }, () => {
      console.log('Changed graph data ', this.state.graph_data.length);
      // this.vegaGraphElement.current.change(
      //   "table",
      //   this.state.graph_data.table
      // );
    });
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

  handleVegaHover = (...args) => {
    console.log(args);
    const info = JSON.stringify(args);
    document.getElementById('bar-tip').innerHTML = info;
  };

  signalListeners = { hover: this.handleHover };

  render() {
    return this.state.columns_loaded ? (
      <React.Fragment>
        <div
          className="container-fluid "
          style={{ width: '90%', paddingTop: '65px' }}
        >
          <div
            className="form-group fixed-top"
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
                    event.target.value
                  );
                  this.setState({ patient_cmrn: event.target.value });
                }}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    this.cmrnChange();
                  }
                }}
              ></input>
            </label>
            <input
              type="file"
              className="input-file"
              accept="*.json"
              onChange={(e) => this.handleFileChosen(e.target.files[0])}
            />

            <ExportJson
              jsonData={JSON.stringify(this.state.custom_data)}
              fileName={'NewDataFilejson'}
            ></ExportJson>
          </div>
          <h1>Hosts</h1>
          <div>
            {this.state.cigahosts.map((row, index) => (
              <CigaHost hostname={row} />
            ))}
            ;
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
                  columns={this.exam_columns}
                  gridheight={200}
                  gridname={'exams'}
                  onRowSelect={this.onRowSelectExam}
                />
                <label>Exam Series</label>
                <DataGrid
                  ref={this.seriesGridElement}
                  initialRows={this.state.series}
                  columns={this.series_columns}
                  gridheight={200}
                  gridname={'series_grid'}
                  onRowSelect={this.onRowSelectSeries}
                />
                <label>Series Locations</label>
                <DataGrid
                  ref={this.seriesLocationsGridElement}
                  initialRows={this.state.series_locations}
                  columns={this.series_location_columns}
                  gridheight={200}
                  gridname={'series_location_grid'}
                  onRowSelect={this.onRowSelectSeriesLocation}
                />
                <label>CMOVES</label>
                <DataGrid
                  ref={this.cmovesGridElement}
                  initialRows={this.state.exam_cmoves}
                  columns={this.cmoves_columns}
                  gridheight={200}
                  gridname={'cmoves grid'}
                  onRowSelect={this.onRowSelectSeriesLocation}
                />
                <label>Exceptions Data</label>
                <DataGrid
                  ref={this.exceptionsGridElement}
                  initialRows={this.state.exceptions}
                  columns={this.exceptions_columns}
                  gridheight={200}
                  gridname={'exceptions grid'}
                  onRowSelect={this.onRowSelectSeriesLocation}
                />
                <label>CIGA Series JOBS</label>
                <DataGrid
                  ref={this.seriesCIGAGridElement}
                  initialRows={this.state.series_ciga_jobs}
                  columns={this.series_ciga_jobs_columns}
                  gridheight={200}
                  gridname={'series_ciga_jobs'}
                  onRowSelect={this.onRowSelectSeriesCigaJob}
                />
                <label>CIGA JOBS Exceptions</label>
                <DataGrid
                  ref={this.seriesCIGAExceptionsGridElement}
                  initialRows={this.state.series_ciga_exceptions}
                  columns={this.series_ciga_exceptions_columns}
                  gridheight={200}
                  gridname={'series_ciga_jobs'}
                  onRowSelect={this.onRowSelectSeriesCigaJob}
                />
                <label>Custom Query Data</label>
                <DataGrid
                  ref={this.customExamsGridElement}
                  initialRows={this.state.custom_data}
                  columns={this.exam_columns}
                  gridheight={200}
                  gridname={'custom sql grid'}
                  onRowSelect={this.onRowSelectPatient}
                />{' '}
                <label>MultiResults</label>
                <DataMultiGrid
                  ref={this.customMultiGridElement}
                  datagrids={this.state.multi_grid_data}
                  columns={this.exam_columns}
                  gridheight={200}
                  gridname={'custom sql grid'}
                  onRowSelect={this.onRowSelectPatient}
                />{' '}
              </React.Fragment>
            )}
          />
          <label>Recent Exams</label>
          <DataProvider
            endpoint={this.endpoint_exams + this.state.customsqltext}
            render={(data) => (
              <DataGrid
                ref={this.customExams2GridElement}
                enableFilter
                initialRows={data}
                columns={this.exam_columns}
                gridheight={200}
                gridname={'exams across patients'}
                onRowSelect={this.onRowSelectPatient}
              />
            )}
          />
          {/* <Vega data={this.state.graph_data} spec={barSpec} /> */}
        </div>
      </React.Fragment>
    ) : (
      <span>Loading ...</span>
    );
  }
}

export default App;
