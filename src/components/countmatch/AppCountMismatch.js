import React, { Component } from 'react';
//import "./App.css";
import DataProvider from '../common/DataProvider';
import DataGrid from '../common/DataGrid';
import 'bootstrap/dist/css/bootstrap.css';
import * as FileSaver from 'file-saver';
//import VegaRenderer from "./components/VegaRenderer";
//import { Vega, VegaLite } from "react-vega";
// import { Vega } from "react-vega";

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
  //console.log(queryEndpoint);
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

class App extends Component {
  endpoint_exams =
    'https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20 ';

  endpoint_patient_exams =
    'https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20select * from iimdb_rch00_repl..exam exm , iimdb_rch00_repl..DEPT_PROCEDURE pp  where exm.proc_id = pp.proc_id and patient_cmrn = ';

  endpoint_series =
    'https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20select * from iimdb_rch00_repl..img_study sty, iimdb_rch00_repl..img_series ser where sty.imgsty_id = ser.imgser_imgsty_id and sty.exam_id = ';

  endpoint_series_location =
    'https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20select * from iimdb_rch00_repl..img_series_location, iimdb_rch00_repl..img_store str, iimdb_rch00_repl..img_system imgsys where imgserl_imgstr_id = imgstr_id and imgstr_imgsys_id = imgsys_id and imgserl_imgser_id = ';

  endpoint_exceptions =
    "https://iasq1mr2:8081/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select  exc_src_system, exc_exr_code	,exc_time , exam_id ,		exc_src_queue_id,		exc_iparam1	,exc_iparam2	,exc_iparam3	,exc_iparam4	,exc_cparam1     ,   exc_cparam2  from iimdb_rch02_prod..EXCEPTION exc  where  exc.exc_exr_code in ('IMGE_SERL_A', 'IMGE_SERL_D', 'IMGE_SERL_P') and exam_id = ";

  state = {
    columns_loaded: false,
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
    exceptions: [],
    series_locations: [],
    custom_data: [],
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
    this.exam_columns = [];
    this.series_columns = [];
    this.exceptions_columns = [];
    this.series_ciga_jobs = [];
    this.series_location_columns = [];

    getColumnsList(this.endpoint_patient_exams + "'" + '5202342' + "' ").then(
      (columns) => {
        console.log(columns);
        this.exam_columns = columns;
        console.log(this.exam_columns);

        this.series_columns = columns;
        this.exceptions_columns = columns;
        this.series_ciga_jobs = columns;
        this.series_location_columns = columns;
      }
    );

    getColumnsList(this.endpoint_series + '55255601').then((columns) => {
      this.series_columns = columns;
    });
  }

  componentWillMount() {
    document.title = 'IIMS & QREADS Counts Matcher';
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

    getColumnsList(
      'https://iasq1mr2:8081/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select top 10 ' +
        ` TBL = 'DONE_QUEUE', JOB_QUEUE_ID,	JOB_QUEUE_START_TIME,    	JOB_STATUS,	JOB_STATUS_TIME,         	RECEIVER_PORT,	RECEIVER_AET,   	SENDER_HOST ,    	SENDER_IP,    	SENDER_AET,    	JOB_PRIORITY,	CAMPUS,	CAMPUS_DESC,	DEPARTMENT_ID,	DEPARTMENT_CODE,	PATIENT_EXTERNAL_ID,	PATIENT_INTERNAL_ID,	PATIENT_LAST_NAME,	PATIENT_FIRST_NAME,	EXAM_ID ,	EXAM_DATE  ,             	STUDY_UID     ,                                 	STUDY_DESC  ,                                      	SERIES_UID ,                                            	SOPCLASS_UID,             	SERIES_MODALITY,	TRANSFER_SYNTAX,    	PROCESSOR_HOST,	PROCESSED_SERIES_COUNT,	PROCESSED_JOB_COUNT,	ACTIVE_ASSOCIATION_COUNT,	JOB_QUEUE_END_TIME ,     	UPDATE_TIME
    from qrddb_rch03_prod..CIGTB_JOB_QUEUE_LOG `
    ).then((columns) => {
      this.series_ciga_jobs = columns;
    });

    setTimeout(() => {
      this.setState({ columns_loaded: true });
    }, 2000);
  }

  cmrnChange = (event) => {
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

  onRowSelecGeneric = (data) => {
    console.log('rowselected :', data[0].row);
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
            className="form-group "
            style={{ dislplay: 'inline-block' }}
            width="200px"
          >
            <label>
              Exam ID
              <input
                className="form-control-inline ml-4"
                type="text"
                id="pat_cmrn"
                placeholder="Exam ID..."
                onChange={(event) => {
                  console.log(
                    'Exam ID Input Field New Value:',
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
                  onRowSelect={this.onRowSelecGeneric}
                />
                <label>Exam Series</label>
                <DataGrid
                  ref={this.seriesGridElement}
                  initialRows={this.state.series}
                  columns={this.series_columns}
                  gridheight={200}
                  gridname={'series_grid'}
                  onRowSelect={this.onRowSelecGeneric}
                />
                <label>Series Locations</label>
                <DataGrid
                  ref={this.seriesLocationsGridElement}
                  initialRows={this.state.series_locations}
                  columns={this.series_location_columns}
                  gridheight={125}
                  gridname={'series_location_grid'}
                  onRowSelect={this.onRowSelecGeneric}
                />
                <label>Exceptions Data</label>
                <DataGrid
                  ref={this.exceptionsGridElement}
                  initialRows={this.state.exceptions}
                  columns={this.exceptions_columns}
                  gridheight={200}
                  gridname={'exceptions grid'}
                  onRowSelect={this.onRowSelecGeneric}
                />
                <label>CIGA Series JOBS</label>
                <DataGrid
                  ref={this.seriesCIGAGridElement}
                  initialRows={this.state.series_ciga_jobs}
                  columns={this.series_ciga_jobs}
                  gridheight={125}
                  gridname={'series_ciga_jobs'}
                  onRowSelect={this.onRowSelecGeneric}
                />
                <label>Custom Query Data</label>
                <DataGrid
                  ref={this.customExamsGridElement}
                  initialRows={this.state.custom_data}
                  columns={this.exam_columns}
                  gridheight={200}
                  gridname={'custom sql grid'}
                  onRowSelect={this.onRowSelecGeneric}
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
                onRowSelect={this.onRowSelecGeneric}
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
