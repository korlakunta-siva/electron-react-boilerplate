import React, { Component } from "react";
import "./App.css";
import DataProvider from "../common/DataProvider";
import DataGrid from "../common/DataGrid";
import NotesHxViewer from "./NotesHxViewer";

import "bootstrap/dist/css/bootstrap.css";
import * as FileSaver from "file-saver";
//import VegaRenderer from "./components/VegaRenderer";
//import { Vega, VegaLite } from "react-vega";
import { Vega } from "react-vega";
import { None } from "vega";
//import {Builder, By, Key, until} from 'selenium-webdriver';

export const ExportJson = ({ jsonData, fileName }) => {
  //const fileType = "application/json";
  const fileExtension = ".json";

  const exportToJson = (jsonData, fileName) => { 
    var blob = new Blob([jsonData], { type: "application/json;charset=utf-8" });
    FileSaver.saveAs(blob, fileName + fileExtension);
  };

  return (
    <input
      type="button"
      variant="warning"
      value="Export"
      onClick={e => exportToJson(jsonData, fileName)}
    />
  );
};

const defaultColumnProperties = {
  sortable: true,
  filterable: true,
  resizable: true,
  editable: true
};

const getColumnsList = queryEndpoint => {
  console.log(queryEndpoint);
  let columnList = [];
  return fetch(queryEndpoint, {})
    .then(response => {
      if (response.status !== 200) {
        return this.setState({
          placeholder: "Something went wrong in getting data for column list"
        });
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      let dframe = data["frame0"];

      if (typeof dframe === "undefined") {
        console.log("dframe is undefined. No data returned.", queryEndpoint);
        return [];
      }
      let myObj = JSON.parse(dframe);
      let datarows = myObj["rows"];

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
              : 100
          },
          {}
        );

        //console.log(dict1);
        return dict1;
      });

      columnList = columnList.map(c => ({
        ...c,
        ...defaultColumnProperties
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
      name: "table",
      values: [
        { category: "A", amount: 800 },
        { category: "B", amount: 155 },
        { category: "C", amount: 243 },
        { category: "D", amount: 91 },
        { category: "E", amount: 810 },
        { category: "F", amount: 503 },
        { category: "G", amount: 19 },
        { category: "H", amount: 870 }
      ]
    }
  ],
  scales: [
    {
      name: "xscale",
      type: "band",
      domain: { data: "table", field: "category" },
      range: "width",
      padding: 0.05,
      round: true
    },
    {
      name: "yscale",
      domain: { data: "table", field: "amount" },
      nice: true,
      range: "height"
    }
  ],

  axes: [
    { orient: "bottom", scale: "xscale" },
    { orient: "left", scale: "yscale" }
  ],

  marks: [
    {
      type: "rect",
      from: { data: "table" },
      encode: {
        enter: {
          x: { scale: "xscale", field: "category" },
          width: { scale: "xscale", band: 1 },
          y: { scale: "yscale", field: "amount" },
          y2: { scale: "yscale", value: 0 }
        },
        update: {
          fill: { value: "steelblue" }
        },
        hover: {
          fill: { value: "red" }
        }
      }
    },
    {
      type: "text",
      encode: {
        enter: {
          align: { value: "center" },
          baseline: { value: "bottom" },
          fill: { value: "#333" }
        }
      }
    }
  ]
};

//const BarChart = createClassFromSpec({ mode: "vega", spec: barSpec });

class AppNotes extends Component {


  endpoint_pend_notes_log =
    "http://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%200%20 select top 1000 action_at, action_by, actiontype, pat.Name, e0.visittype, ApptAt =( date %2B starttime), pat.PatientId, enclog.encounterId from apex.pn.encactionlog enclog, mobiledoc..enc e0, apex.rc.vPatient pat where enclog.encounterid = e0.encounterID and e0.patientID = pat.PatientId order by action_at desc ";

  endpoint_pend_notes_log_col =
    "http://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%200%20 select top 10 action_at, action_by, actiontype, pat.Name, e0.visittype, ApptAt =( date %2B starttime), pat.PatientId, enclog.encounterId from apex.pn.encactionlog enclog, mobiledoc..enc e0, apex.rc.vPatient pat where enclog.encounterid = e0.encounterID and e0.patientID = pat.PatientId order by action_at desc ";


  endpoint_exams =
    "http://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%200%20 ";

  endpoint_completed_notes =
    "http://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%200%20  select Name, ApptAt , isdocready = isnull((select min(1) from apex.pn.encactionlog eal where eal.encounterid = pv.encid and eal.actiontype = 'docready'),0), visittype, encid, patientid, refdoc , oldestdate = (select min(dos) from  apex.pn.Apex_PendingNotes_Visits pv2 where pv2.patientid = pv.patientid and   enclock = 0 and dos > '1/1/2019') from apex.pn.Apex_PendingNotes_Visits pv where  enclock = 1 and dos > '1/1/2019' order by 2, 6  ";

  endpoint_pend_notes_col =
    "http://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%2010%20  select Name, ApptAt, isdocready = isnull((select min(1) from apex.pn.encactionlog eal where eal.encounterid = pv.encid and eal.actiontype = 'docready'),0), visittype, encid, patientid, refdoc , oldestdate = (select min(dos) from  apex.pn.Apex_PendingNotes_Visits pv2 where pv2.patientid = pv.patientid and   enclock = 0 and dos > '1/1/2019') from apex.pn.Apex_PendingNotes_Visits pv where  enclock = 0 and dos > '1/1/2019' order by 2, 6  ";


  endpoint_exams =
    "http://iasq1mr2:8042/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20 ";

  endpoint_patient_exams =
    "http://iasq1mr2:8042/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20select * from iimdb_rch00_repl..exam exm , iimdb_rch00_repl..DEPT_PROCEDURE pp  where exm.proc_id = pp.proc_id and patient_cmrn = ";

  endpoint_series =
    "http://iasq1mr2:8042/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20select * from iimdb_rch00_repl..img_study sty, iimdb_rch00_repl..img_series ser where sty.imgsty_id = ser.imgser_imgsty_id and sty.exam_id = ";

  endpoint_series_location =
    "http://iasq1mr2:8042/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20select * from iimdb_rch00_repl..img_series_location, iimdb_rch00_repl..img_store str, iimdb_rch00_repl..img_system imgsys where imgserl_imgstr_id = imgstr_id and imgstr_imgsys_id = imgsys_id and imgserl_imgser_id = ";

  endpoint_exceptions =
    "http://iasq1mr2:8042/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select  exc_src_system, exc_exr_code	,exc_time , exam_id ,		exc_src_queue_id,		exc_iparam1	,exc_iparam2	,exc_iparam3	,exc_iparam4	,exc_cparam1     ,   exc_cparam2  from iimdb_rch02_prod..EXCEPTION exc  where  exc.exc_exr_code in ('IMGE_SERL_A', 'IMGE_SERL_D', 'IMGE_SERL_P') and exam_id = ";

  state = {
    username: "Maria Dughon",
    columns_loaded: false,
    cmrn: "",
    examid: "",
    study_uid: "",
    series_uid: "",
    imgser_id: 0,
    loaded: false,
    placeholder: "",
    data: [],
    pending_notes: [],
    pending_notes_log: [],
    exams: [],
    series: [],
    series_ciga_jobs: [],
    series_ciga_exceptions: [],
    exceptions: [],
    series_locations: [],
    custom_data: [],
    fileReader: "",
    graph_data: {},
    customsqltext:
      "select * from iimdb_rch00_repl..exam exm , iimdb_rch00_repl..IIMTB_PREDEFINED_PROC pp  where exm.pred_proc_id = pp.pred_proc_id and exam_status = 'CM' and performed_dt between  dateadd(hh, -1, getdate()) and getdate()  "
  };

  constructor(props) {
    super(props);
    this.notesDiffViewerElement =  React.createRef();
    this.notesGridElement = React.createRef();
    this.noteslogGridElement = React.createRef();
    this.seriesLocationsGridElement = React.createRef();
    this.exceptionsGridElement = React.createRef();
    this.customExamsGridElement = React.createRef();
    this.customExams2GridElement = React.createRef();
    this.recentExamsGridElement = React.createRef();
    this.seriesCIGAGridElement = React.createRef();
    this.seriesCIGAExceptionsGridElement = React.createRef();
    this.exam_columns = [];
    this.series_columns = [];
    this.exceptions_columns = [];
    this.series_ciga_jobs = [];
    this.series_ciga_exceptions = [];
    this.series_location_columns = [];
    this.pending_notes_columns = [];
    this.pending_notes_log_columns = [];

    getColumnsList(this.endpoint_patient_exams + "'" + "5202342" + "' ").then(
      columns => {
        console.log(columns);
        this.exam_columns = columns;
        console.log(this.exam_columns);

        this.series_columns = columns;
        this.exceptions_columns = columns;
        this.series_ciga_jobs_columns = columns;
        this.series_location_columns = columns;
        this.series_ciga_exceptions_columns = columns;
      }
    );

    getColumnsList(this.endpoint_series + "55255601").then(columns => {
      this.series_columns = columns;
    });
  }

  componentWillMount() {
    let endpoint_ciga_jobs_colqry =
      "http://iasq1mr2:8042/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select top 1 " +
      ` TBL = 'DONE_QUEUE', JOB_QUEUE_ID,	JOB_QUEUE_START_TIME,    	JOB_STATUS,	JOB_STATUS_TIME,         	RECEIVER_PORT,	RECEIVER_AET,   	SENDER_HOST ,    	SENDER_IP,    	SENDER_AET,    	JOB_PRIORITY,	CAMPUS,	CAMPUS_DESC,	DEPARTMENT_ID,	DEPARTMENT_CODE,	PATIENT_EXTERNAL_ID,	PATIENT_INTERNAL_ID,	PATIENT_LAST_NAME,	PATIENT_FIRST_NAME,	EXAM_ID ,	EXAM_DATE  ,             	STUDY_UID     ,                                 	STUDY_DESC  ,                                      	SERIES_UID ,                                            	SOPCLASS_UID,             	SERIES_MODALITY,	TRANSFER_SYNTAX,    	PROCESSOR_HOST,	PROCESSED_SERIES_COUNT,	PROCESSED_JOB_COUNT,	ACTIVE_ASSOCIATION_COUNT,	JOB_QUEUE_END_TIME ,     	UPDATE_TIME
from qrddb_rch03_prod..CIGTB_JOB_QUEUE_LOG `;
    console.log(endpoint_ciga_jobs_colqry);

    getColumnsList(this.endpoint_series + "55255601").then(columns => {
      this.series_columns = columns;
    });
    getColumnsList(this.endpoint_series_location + "192023132").then(
      columns => {
        this.series_location_columns = columns;
      }
    );

    getColumnsList(this.endpoint_exceptions + "55255601").then(columns => {
      this.exceptions_columns = columns;
    });

    getColumnsList(
      "http://iasq1mr2:8042/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select top 10 " +
      ` TBL = 'DONE_QUEUE', JOB_QUEUE_ID,	JOB_QUEUE_START_TIME,    	JOB_STATUS,	JOB_STATUS_TIME,         	RECEIVER_PORT,	RECEIVER_AET,   	SENDER_HOST ,    	SENDER_IP,    	SENDER_AET,    	JOB_PRIORITY,	CAMPUS,	CAMPUS_DESC,	DEPARTMENT_ID,	DEPARTMENT_CODE,	PATIENT_EXTERNAL_ID,	PATIENT_INTERNAL_ID,	PATIENT_LAST_NAME,	PATIENT_FIRST_NAME,	EXAM_ID ,	EXAM_DATE  ,             	STUDY_UID     ,                                 	STUDY_DESC  ,                                      	SERIES_UID ,                                            	SOPCLASS_UID,             	SERIES_MODALITY,	TRANSFER_SYNTAX,    	PROCESSOR_HOST,	PROCESSED_SERIES_COUNT,	PROCESSED_JOB_COUNT,	ACTIVE_ASSOCIATION_COUNT,	JOB_QUEUE_END_TIME ,     	UPDATE_TIME
    from qrddb_rch03_prod..CIGTB_JOB_QUEUE_LOG `
    ).then(columns => {
      this.series_ciga_jobs_columns = columns;
    });

    let endpoint_ciga_exceptions_col =
      "http://iasq1mr2:8042/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select " +
      `  TBL = 'DONE_QUEUE', ql.job_queue_id, el.exception_id, el.exception_code, el.exception_desc, el.exception_time from iimdb_rch01_prod..EXAM_IDENTIFIER ei, qrddb_rch03_prod..CIGTB_JOB_QUEUE_LOG ql , qrddb_rch03_prod..CIGTB_EXCEPTION_LOG el where 
ei.exam_id = 55261446 and ei.examid_type_code = 'ACCESSION_NBR' and ei.examid_value = ql.EXAM_ID and  el.SOURCE_QUEUE_ID = ql.job_queue_id
union
select TBL = 'IN_QUEUE', ql.job_queue_id, el.exception_id, el.exception_code, el.exception_desc, el.exception_time from iimdb_rch01_prod..EXAM_IDENTIFIER ei, qrddb_rch00_prod..CIGTB_JOB_QUEUE ql , qrddb_rch03_prod..CIGTB_EXCEPTION_LOG el where 
ei.exam_id = 55261446 and ei.examid_type_code = 'ACCESSION_NBR' and ei.examid_value = ql.EXAM_ID and  el.SOURCE_QUEUE_ID = ql.job_queue_id
order by exception_id desc`;

    getColumnsList(
      this.endpoint_pend_notes_col
    ).then(columns => {
      this.pending_notes_columns = columns;
    });

    getColumnsList(
      this.endpoint_pend_notes_log_col
    ).then(columns => {
      this.pending_notes_log_columns = columns;
    });



    setTimeout(() => {
      this.setState({ columns_loaded: true });
    }, 2000);
  }

  cmrnChange = event => {
    //console.log("Changed CMR Input Value:", event);
    // console.log("CMRN Value:", this.state.patient_cmrn);
    // console.log("Retrieving Data for cmrn: ", this.state.patient_cmrn);
    fetch(
      this.endpoint_patient_exams +
      "'" +
      this.state.patient_cmrn +
      "' order by performed_dt desc",
      {}
    )
      .then(response => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: "Something went wrong in getting data"
          });
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        let dframe = data["frame0"];
        let myObj = JSON.parse(dframe);
        data = myObj["rows"];
        this.setState(
          {
            data: data,
            series: [],
            series_locations: [],
            series_ciga_jobs: [],
            loaded: true
          },
          () => {
            console.log("Changed state", this.state.data.length);
            this.examsGridElement.current.changeGridData(this.state.data);
          }
        );
      });
  };


  usernameChange = event => {
    //console.log("Changed CMR Input Value:", event);
    // console.log("CMRN Value:", this.state.patient_cmrn);
    // console.log("Retrieving Data for cmrn: ", this.state.patient_cmrn);

    this.notesGridElement.current.changeUserName(this.state.username);

    fetch(
      this.endpoint_patient_exams +
      "'" +
      this.state.patient_cmrn +
      "' order by performed_dt desc",
      {}
    )
      .then(response => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: "Something went wrong in getting data"
          });
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        let dframe = data["frame0"];
        let myObj = JSON.parse(dframe);
        data = myObj["rows"];
        this.setState(
          {
            data: data,
            series: [],
            series_locations: [],
            series_ciga_jobs: [],
            loaded: true
          },
          () => {
            console.log("Changed state", this.state.data.length);
            this.examsGridElement.current.changeGridData(this.state.data);
          }
        );
      });
  };

  onRowSelectExam = data => {
    //console.log("rowselected exam:", data[0].row);
    this.setState({ examid: data[0].row.exam_id }, () => {
      //console.log(this.endpoint_series + this.state.examid);
      fetch(this.endpoint_series + this.state.examid, {})
        .then(response => {
          if (response.status !== 200) {
            return this.setState({
              placeholder: "Something went wrong in getting data"
            });
          }
          return response.json();
        })
        .then(data => {
          //console.log(data);
          let dframe = data["frame0"];
          let myObj = JSON.parse(dframe);
          data = myObj["rows"];
          this.setState(
            {
              series: data,
              series_locations: [],
              series_ciga_jobs: [],
              loaded: true
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
        " order by exc_time desc",
        {}
      )
        .then(response => {
          if (response.status !== 200) {
            return this.setState({
              placeholder: "Something went wrong in getting data"
            });
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          let dframe = data["frame0"];
          let myObj = JSON.parse(dframe);
          data = myObj["rows"];
          this.setState({ exceptions: data, loaded: true }, () => {
            // console.log("Changed state", this.state.exceptions.length);
            this.exceptionsGridElement.current.changeGridData(
              this.state.exceptions
            );
          });
        });

      let endpoint_ciga_exceptions =
        "http://iasq1mr2:8042/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select " +
        ` TBL = 'DONE_QUEUE',  ql.job_queue_id, el.exception_id, el.exception_code, el.exception_desc, el.exception_time from iimdb_rch01_prod..EXAM_IDENTIFIER ei, qrddb_rch03_prod..CIGTB_JOB_QUEUE_LOG ql , qrddb_rch03_prod..CIGTB_EXCEPTION_LOG el where 
      ei.exam_id = ${this.state.examid} and ei.examid_type_code = 'ACCESSION_NBR' and ei.examid_value = ql.EXAM_ID and  el.SOURCE_QUEUE_ID = ql.job_queue_id
      union
      select TBL = 'IN_QUEUE', ql.job_queue_id, el.exception_id, el.exception_code, el.exception_desc, el.exception_time from iimdb_rch01_prod..EXAM_IDENTIFIER ei, qrddb_rch00_prod..CIGTB_JOB_QUEUE ql , qrddb_rch03_prod..CIGTB_EXCEPTION_LOG el where 
      ei.exam_id = ${this.state.examid} and ei.examid_type_code = 'ACCESSION_NBR' and ei.examid_value = ql.EXAM_ID and  el.SOURCE_QUEUE_ID = ql.job_queue_id
      order by exception_id desc`;

      console.log(endpoint_ciga_exceptions);
      fetch(endpoint_ciga_exceptions, {})
        .then(response => {
          if (response.status !== 200) {
            return this.setState({
              placeholder: "Something went wrong in getting data"
            });
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          let dframe = data["frame0"];
          console.log(dframe);
          if (typeof dframe === "undefined") {
            console.log(
              "dframe is undefined. No data returned from ciga exceptions."
            );
            return;
          }
          let myObj = JSON.parse(dframe);
          data = myObj["rows"];
          this.setState({ series_ciga_exceptions: data, loaded: true }, () => {
            // console.log("Changed state", this.state.exceptions.length);
            this.seriesCIGAExceptionsGridElement.current.changeGridData(
              this.state.series_ciga_exceptions
            );
          });
        });
    });
  };

  onRowSelectSeries = data => {
    //console.log("rowselected sereis:", data[0].row.imgser_id);
    this.setState(
      { imgser_id: data[0].row.imgser_id, series_uid: data[0].row.series_uid },
      () => {
        //console.log(this.endpoint_series_location + this.state.imgser_id);
        fetch(this.endpoint_series_location + this.state.imgser_id, {})
          .then(response => {
            if (response.status !== 200) {
              return this.setState({
                placeholder: "Something went wrong in getting data"
              });
            }
            return response.json();
          })
          .then(data => {
            //console.log(data);
            let dframe = data["frame0"];
            let myObj = JSON.parse(dframe);
            data = myObj["rows"];
            this.setState({ series_locations: data, loaded: true }, () => {
              //console.log("Changed state", this.state.series_locations.length);
              this.seriesLocationsGridElement.current.changeGridData(
                this.state.series_locations
              );
            });
          });

        let endpoint_ciga_jobs =
          "http://iasq1mr2:8042/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select " +
          ` TBL = 'DONE_QUEUE', JOB_QUEUE_ID,	JOB_QUEUE_START_TIME,    	JOB_STATUS,	JOB_STATUS_TIME,         	RECEIVER_PORT,	RECEIVER_AET,   	SENDER_HOST ,    	SENDER_IP,    	SENDER_AET,    	JOB_PRIORITY,	CAMPUS,	CAMPUS_DESC,	DEPARTMENT_ID,	DEPARTMENT_CODE,	PATIENT_EXTERNAL_ID,	PATIENT_INTERNAL_ID,	PATIENT_LAST_NAME,	PATIENT_FIRST_NAME,	EXAM_ID ,	EXAM_DATE  ,             	STUDY_UID     ,                                 	STUDY_DESC  ,                                      	SERIES_UID ,                                            	SOPCLASS_UID,             	SERIES_MODALITY,	TRANSFER_SYNTAX,    	PROCESSOR_HOST,	PROCESSED_SERIES_COUNT,	PROCESSED_JOB_COUNT,	ACTIVE_ASSOCIATION_COUNT,	JOB_QUEUE_END_TIME ,     	UPDATE_TIME
        from qrddb_rch03_prod..CIGTB_JOB_QUEUE_LOG where SERIES_UID =  '${this.state.series_uid}'
        union
        select TBL = 'IN_QUEUE',  JOB_QUEUE_ID,	JOB_QUEUE_START_TIME,    	JOB_STATUS,	JOB_STATUS_TIME,         	RECEIVER_PORT,	RECEIVER_AET,   	SENDER_HOST ,    	SENDER_IP,    	SENDER_AET,    	JOB_PRIORITY,	CAMPUS,	CAMPUS_DESC,	DEPARTMENT_ID,	DEPARTMENT_CODE,	PATIENT_EXTERNAL_ID,	PATIENT_INTERNAL_ID,	PATIENT_LAST_NAME,	PATIENT_FIRST_NAME,	EXAM_ID ,	EXAM_DATE  ,             	STUDY_UID     ,                                 	STUDY_DESC  ,                                      	SERIES_UID ,                                            	SOPCLASS_UID,             	SERIES_MODALITY,	TRANSFER_SYNTAX,    	PROCESSOR_HOST,	PROCESSED_SERIES_COUNT,	PROCESSED_JOB_COUNT,	ACTIVE_ASSOCIATION_COUNT,	JOB_QUEUE_END_TIME = convert(datetime,null),     	UPDATE_TIME = convert(datetime,null)
        from qrddb_rch00_prod..CIGTB_JOB_QUEUE where SERIES_UID =  '${this.state.series_uid}' `;

        //console.log(endpoint_ciga_jobs);

        fetch(endpoint_ciga_jobs + " order by JOB_STATUS_TIME desc", {})
          .then(response => {
            if (response.status !== 200) {
              return this.setState({
                placeholder: "Something went wrong in getting data"
              });
            }
            //console.log(response);
            return response.json();
          })
          .then(data => {
            //console.log(data);
            let dframe = data["frame0"];
            //console.log(dframe);
            let myObj = JSON.parse(dframe);
            data = myObj["rows"];
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
          .then(response => {
            if (response.status !== 200) {
              return this.setState({
                placeholder: "Something went wrong in getting data"
              });
            }
            return response.json();
          })
          .then(data => {
            //console.log(data);
            let dframe = data["frame0"];
            let myObj = JSON.parse(dframe);
            data = myObj["rows"];
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

  onRowSelectPatient = data => {
    console.log("rowselected Encounter:", data[0].row);
    this.setState({ encounterid: data[0].row.encid }, () => {
      //console.log("Patient CMRN Changed", this.state.patient_cmrn);
      this.notesDiffViewerElement.current.handleNotesRefresh(this.state.encounterid);
        });
  };

  onRowSelectPatientLog = data => {
    console.log("rowselected Encounter Log:", data[0].row);
  };


  onRowSelectSeriesLocation = data => {
    console.log("rowselected series location:", data);
  };

  onRowSelectSeriesCigaJob = data => {
    console.log("rowselected SeriesCigaJob:", data);
  };

  handleFileReadSQL = e => {
    console.log("handle file read", e);
    const content = e.target.result;
    this.setState({ customsqltext: content, custom_data: [] });

    fetch(this.endpoint_exams + "  " + this.state.customsqltext, {})
      .then(response => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: "Something went wrong in getting data"
          });
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        let dframe = data["frame0"];
        let myObj = JSON.parse(dframe);
        data = myObj["rows"];
        this.setState({ custom_data: data, loaded: true }, () => {
          console.log("Changed state", this.state.custom_data.length);
          this.customExamsGridElement.current.changeGridData(
            this.state.custom_data
          );
        });
      });

    console.log(content);
  };

  handleFileReadJson = e => {
    console.log("handle file read", e);
    const content = e.target.result;
    const jsonData = JSON.parse(content);

    this.setState({ custom_data: jsonData, loaded: true }, () => {
      console.log("Changed state", this.state.custom_data.length);
      this.customExamsGridElement.current.changeGridData(
        this.state.custom_data
      );
    });

    let barData = {
      table: [
        { category: "A", amount: 2800 },
        { category: "B", amount: 55 },
        { category: "C", amount: 43 },
        { category: "D", amount: 91 },
        { category: "E", amount: 810 },
        { category: "F", amount: 503 },
        { category: "G", amount: 19 },
        { category: "H", amount: 870 }
      ]
    };
    this.setState({ graph_data: barData }, () => {
      console.log("Changed graph data ", this.state.graph_data.length);
      // this.vegaGraphElement.current.change(
      //   "table",
      //   this.state.graph_data.table
      // );
    });
  };

  handleFileChosen = file => {
    const fileName = file.name;
    const fileType = file.type;
    console.log("CHosen FIle:", fileName, fileType);
    let fileReader = new FileReader();
    switch (fileType) {
      case "application/sql":
        fileReader.onloadend = this.handleFileReadSQL;
        break;
      case "application/json":
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
    document.getElementById("bar-tip").innerHTML = info;
  };


  handleNotesRefresh = () => {
    // alert ("called log refresh");

    fetch(this.endpoint_completed_notes, {})
      .then(response => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: "Something went wrong in getting data"
          });
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        let dframe = data["frame0"];
        let myObj = JSON.parse(dframe);
        data = myObj["rows"];
        this.setState({ pending_notes: data, loaded: true }, () => {
          console.log("Changed state", this.state.pending_notes.length);
          this.notesGridElement.current.changeGridData(
            this.state.pending_notes
          );
        });
      });

    

  }




  handleLogRefresh = () => {
    // alert ("called log refresh");


    fetch(this.endpoint_pend_notes_log, {})
      .then(response => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: "Something went wrong in getting data"
          });
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        let dframe = data["frame0"];
        let myObj = JSON.parse(dframe);
        data = myObj["rows"];
        this.setState({ pending_notes_log: data, loaded: true }, () => {
          console.log("Changed state", this.state.pending_notes_log.length);
          this.noteslogGridElement.current.changeGridData(
            this.state.pending_notes_log
          );
        });
      });

  }



  testSeleium = () => {
    // alert ("called log refresh");

    alert("Testing Selenium");

    //var webdriver = require("selenium-webdriver");
    alert("Bowser ready for Selenium");
    const serverUri = "http://localhost:3000/#";
    const appTitle = "React Selenium App";

    // var browser = new Builder()
    //   .usingServer()
    //   .withCapabilities({ browserName: "chrome" })
    //   .build();

    alert("Bowser ready for Selenium 2");
  }




  signalListeners = { hover: this.handleHover };

  render() {
    return this.state.columns_loaded ? (
      <React.Fragment>
        <div className="container-fluid " style={{ width: "90%" }}>


          <label>Pending Progress Notes work by {this.state.username} </label>
          <label>
            <input
              className="form-control-inline ml-4"
              type="text"
              id="pat_cmrn"
              placeholder="Your Name..."
              onChange={event => {
                console.log(
                  "CMRN Input Field New Value:",
                  event.target.value
                );
                this.setState({ username: event.target.value });
                this.notesGridElement.current.changeUserName(event.target.value);
              }}
              onKeyPress={event => {
                if (event.key === "Enter") {
                  this.usernameChange();
                }
              }}
            ></input>
          </label>
          <button name="testbutton" className="btn btn-primary d-none" onClick={() => this.testSeleium()}>Testing</button>
          <DataProvider
            endpoint={this.endpoint_completed_notes}

            render={data => (
              <DataGrid
                ref={this.notesGridElement}
                enableFilter
                initialRows={data}
                handlenotesrefesh={this.handleNotesRefresh}
                handlerefresh={this.handleLogRefresh}
                toolbarchildren
                columns={this.pending_notes_columns}
                gridheight={300}
                gridname={"Pending Progress Notes"}
                username={this.state.username}
                onRowSelect={this.onRowSelectPatient}
              />
            )}
          />

          <NotesHxViewer  ref={this.notesDiffViewerElement} encid={this.state.encounterid} />

       
        </div>
      </React.Fragment>
    ) : (
        <span>Loading ...</span>
      );
  }
}

export default AppNotes;
