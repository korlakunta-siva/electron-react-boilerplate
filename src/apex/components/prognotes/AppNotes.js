import React, { Component } from "react";
import ReactDOM from 'react-dom'
import "./AppNotes.css";
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

const backend_api_endpoint = "https://192.168.1.15:86/"
const backend_api_endpoint_local = "http://127.0.0.1:9041/"
const backend_db_endpoint = "https://192.168.21.199:8044/"
const backend_db_endpoint_local = "http://127.0.0.1:8044/"

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

export default class AppNotes extends Component {


  endpoint_pend_notes_log =
  backend_db_endpoint + "exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%200%20 select top 1000 action_at, action_by, actiontype, pat.Name, e0.visittype, ApptAt =( date %2B starttime), pat.PatientId, enclog.encounterId from apex.pn.encactionlog enclog, mobiledoc..enc e0, apex.rc.vPatient pat where enclog.encounterid = e0.encounterID and e0.patientID = pat.PatientId order by action_at desc ";

  endpoint_pend_notes_log_col =
  backend_db_endpoint + "exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%200%20 select top 10 action_at, action_by, actiontype, pat.Name, e0.visittype, ApptAt =( date %2B starttime), pat.PatientId, enclog.encounterId from apex.pn.encactionlog enclog, mobiledoc..enc e0, apex.rc.vPatient pat where enclog.encounterid = e0.encounterID and e0.patientID = pat.PatientId order by action_at desc ";

  endpoint_exams =
  backend_db_endpoint + "exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%200%20 ";

  endpoint_pend_notes =
  backend_db_endpoint + "exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%200%20  select Name, ApptAt , isdocready = isnull((select min(1) from apex.pn.encactionlog eal where eal.encounterid = pv.encid and eal.actiontype = 'docready'),0), visittype, encid, patientid, refdoc , oldestdate = (select min(dos) from  apex.pn.Apex_PendingNotes_Visits pv2 where pv2.patientid = pv.patientid and   enclock = 0 and dos > '1/1/2019') from apex.pn.Apex_PendingNotes_Visits pv where  enclock = 0 and dos > '1/1/2019' order by 2, 6  ";

  endpoint_pend_notes_col =
  backend_db_endpoint + "exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%2010%20  select Name, ApptAt, isdocready = isnull((select min(1) from apex.pn.encactionlog eal where eal.encounterid = pv.encid and eal.actiontype = 'docready'),0), visittype, encid, patientid, refdoc , oldestdate = (select min(dos) from  apex.pn.Apex_PendingNotes_Visits pv2 where pv2.patientid = pv.patientid and   enclock = 0 and dos > '1/1/2019') from apex.pn.Apex_PendingNotes_Visits pv where  enclock = 0 and dos > '1/1/2019' order by 2, 6  ";

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

  }

  componentWillMount() {

    getColumnsList(
      this.endpoint_pend_notes_col
    ).then(columns => {
      this.setState({'pending_notes_columns' : columns});
      console.log(columns);
    });

    getColumnsList(
      this.endpoint_pend_notes_log_col
    ).then(columns => {
      this.setState({'pending_notes_log_columns' : columns});
      console.log(columns);
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
    alert ("called log refresh");

    fetch(this.endpoint_pend_notes, {})
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

    this.handleLogRefresh();

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
          
          <DataProvider
            endpoint={this.endpoint_pend_notes}

            render={data => (
              <DataGrid
                ref={this.notesGridElement}
                enableFilter
                initialRows={data}
                handlenotesrefesh={this.handleNotesRefresh}
                handlerefresh={this.handleLogRefresh}
                toolbarchildren
                columns={this.state.pending_notes_columns}
                gridheight={300}
                gridname={"Pending Progress Notes"}
                username={this.state.username}
                onRowSelect={this.onRowSelectPatient}
              />
            )}
          />

          <NotesHxViewer  ref={this.notesDiffViewerElement} encid={this.state.encounterid} />

          <label>Progress Notes Work Tracking log</label>
          <DataProvider
            endpoint={this.endpoint_pend_notes_log}

            render={data => (
              <DataGrid
                ref={this.noteslogGridElement}
                enableFilter
                initialRows={data}
                columns={this.state.pending_notes_log_columns}
                gridheight={300}
                gridname={"Pending Progress Notes"}
                username={this.state.username}
                onRowSelect={this.onRowSelectPatientLog}
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


// const AppDocs = () => (
//   <AppNotes />

// );

// console.log(AppDocs);
// const wrapper = document.getElementById("notesapp");
// wrapper ? ReactDOM.render(<AppDocs />, wrapper) : null;



