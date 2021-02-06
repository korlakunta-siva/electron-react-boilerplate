import React, { Component } from "react";
import ReactDOM from 'react-dom'
import DataProvider from "../common/DataProvider";
import DataGrid from "../common/DataGridNew";
import { Toolbar, Data } from "react-data-grid-addons";

//import  {Builder} from "selenium-webdriver"; 

//const chrome = require('selenium-webdriver/chrome');


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

  const getColumnsList =datarow => {
    //console.log(datarow);

    // (async function example() {
    //   let driver = await  new webdriver.Builder()
    //   .forBrowser('chrome')
    //   .usingServer('https://korlakunta.com:4444/wd/hub')
    //   .build();

    //   try {
    //     await driver.get('http://www.google.com/ncr');
    //     console.log('Step1a');
    //     await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
    //     console.log('Step1b');
    //     await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    //     console.log('Step1c');
    //   } finally {
    //     await driver.quit();
    //     console.log('Step1d');
    //   }
    //   console.log('Step2');

    // })();

    let columnList = [];
    if (datarow == undefined || datarow.length == 0) return [];
        //console.log(Object.keys(datarow));
        columnList = Object.keys(datarow).map(function(key) {
          let dict1 = {};
          //console.log(key);
          Object.assign(
            dict1,
            {
              key: key,
              name: key,
              width: datarow[key]
                ? datarow[key].toString().length * 7 + 50
                : 100
            },
            {}
          );
  
          return dict1;
        });
  
        columnList = columnList.map(c => ({
          ...c,
          ...defaultColumnProperties
        }));
  
        //console.log(columnList);
        return columnList;
  
  };  

const defaultColumnProperties = {
    sortable: true,
    filterable: true,
    resizable: true,
    editable: true
  };
    
export default class ApexMonitoring extends React.Component {
    endpoint_exams =
      "https://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%200%20";
  
      endpoint_enc =
      "https://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%2010%20 select * from mobiledoc..enc where patientid =  ";
  
      endpoint_medrep =
      `https://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%2010%20  select reporttype, summaryreportstatus, summaryreportfile, reportkey from medtronic_report where patientkey in (select patientkey from medtronic_patient where ecwpatientid = arg_ecwpatid ) order by summaryreportfile desc `
    
      endpoint_invcpt =
      `https://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%2010%20 select convert(varchar(10),claimdate,121) as claimdate, billedfee, Cpt_Allowed, inspaid, patpaid, insbal, patbal, PatientName, cptcode, cptdesc, pinsname from apex.rc.Apex_Invoice_Cpt_Summary where InvoiceId = arg_invoiceid `
      
      endpoint_ecwenc =
      `https://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%2010%20  select convert(varchar(10),date,121) as date, convert(varchar(10),dateadd(dd, 31, date),121) as next_date, reason, VisitType, STATUS, enclock,  InvoiceId  from mobiledoc..enc e0 where e0.patientID = arg_ecwpatid and VisitType = 'NV' and deleteflag = 0 order by date desc `

      endpoint_curr_linqdocs =
      `https://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%2010%20  select doc.docID, doc.customName , doc.scanDate, doc.ScannedBy, doc.Review, doc.ReviewerId, doc.ReviewerName , doc.delFlag,  doc.PatientId, apex.dbo.PatientName(doc.patientid) as PatientName, doc.dirpath, doc.fileName from mobiledoc..document doc where doc.patientid = arg_ecwpatid and doc.doc_Type in (154, 121) and delflag = 0 order by customName desc `


      state = {
      columns_loaded: false,
      cmrn: "",
      examid: "",
      invoiceid: "",
      study_uid: "",
      series_uid: "",
      imgser_id: 0,
      loaded: false,
      placeholder: "",
      data: [],
      ecw_enc : [],
      medt_reports: [],
      pat_linqdocs : [],
      pat_pacedocs : [],
      invoice_cpt: [],
      customsqltext:
      "SELECT pat.name,epat.DOB,epat.Insurances,epat.Phone1,device,convert(varchar(10),implantDate,121) as implantDate,convert(varchar(10),lastSendDate,121) as lastSendDate,convert(varchar(10),nextSendDate,121) as nextSendDate,nextSendScheduled,nextSendStatus,totalSends,pat.id,patientKey,ecwPatientId as PatientId from medtronic_patient pat,apex.rc.vPatient epat where pat.ecwpatientid=epat.PatientId       order by lastsenddate desc"
    };
  
    constructor(props) {
      super(props);
      this.patientsGridElement = React.createRef();
      this.ecwencGridElement= React.createRef();
      this.medtreportsGridElement = React.createRef();
      this.invoiceGridElement = React.createRef();
      this.linqGridElement = React.createRef();
      this.paceGridElement = React.createRef();
      
    }
  
    componentWillMount() { 
      setTimeout(() => {
        //console.log('Finished componentwillmount');
        this.setState({ columns_loaded: true });
      }, 2000);
    }

    onRowSelectMedtronicReport = data => {
      console.log("rowselectednew medtronic report:", data[0].row);
      if (data[0].row.summaryreportfile.includes("pdf")) {
        this.handleMedtronicReportPdf(data[0].row.summaryreportfile);
      }else       if (data[0].row.summaryreportfile.includes("png")) {
        this.handleMedtronicReportPng(data[0].row.summaryreportfile);
      }
    };

    onRowSelectEncounter = data => {
      console.log("rowselectednew encounter:", data[0].row);
      this.setState({ invoiceid: data[0].row.InvoiceId }, () => {
        //console.log(this.endpoint_series + this.state.examid);
        //console.log(this.endpoint_enc + data[0].row.PatientId);
        fetch(this.endpoint_invcpt.replace('arg_invoiceid', this.state.invoiceid ), {})
          .then(response => {
            if (response.status !== 200) {
              return this.setState({
                placeholder: "Something went wrong in getting data"
              });
            }
            return response.json();
          })
          .then(data => {
            //console.log("___________________");
            //console.log(data);
            let dframe = data["frame0"];
            let myObj = JSON.parse(dframe);
            let data2 = myObj["rows"];
            //console.log(data2);
            this.setState(
              {
                invoice_cpt: data2,
                series_locations: [],
                series_ciga_jobs: [],
                loaded: true
              },
              () => {
                //console.log("Changed state", this.state.series.length);
                this.invoiceGridElement.current.changeGridData(this.state.invoice_cpt,getColumnsList(data2[0]) );

              }
            );
          });

      });
    };
  
    onRowSelectExam = data => {
      //console.log("rowselectednew exam:", data[0].row);
      this.setState({ examid: data[0].row.PatientId }, () => {
        //console.log(this.endpoint_series + this.state.examid);
        //console.log(this.endpoint_enc + data[0].row.PatientId);
        fetch(this.endpoint_medrep.replace('arg_ecwpatid', this.state.examid ), {})
          .then(response => {
            if (response.status !== 200) {
              return this.setState({
                placeholder: "Something went wrong in getting data"
              });
            }
            return response.json();
          })
          .then(data => {
            //console.log("___________________");
            //console.log(data);
            let dframe = data["frame0"];
            let myObj = JSON.parse(dframe);
            let data2 = myObj["rows"];
            //console.log(data2);
            this.setState(
              {
                medt_reports: data2,
                invoice_cpt: [],
                loaded: true
              },
              () => {
                //console.log("Changed state", this.state.series.length);
                this.medtreportsGridElement.current.changeGridData(this.state.medt_reports,getColumnsList(data2[0]) );
                this.invoiceGridElement.current.changeGridData(this.state.invoice_cpt,getColumnsList(this.state.invoice_cpt[0]) );

              }
            );
          });


          console.log(this.endpoint_ecwenc.replace('arg_ecwpatid', this.state.examid ));
  
          fetch(this.endpoint_ecwenc.replace('arg_ecwpatid', this.state.examid ), {})
          .then(response => {
            if (response.status !== 200) {
              return this.setState({
                placeholder: "Something went wrong in getting data"
              });
            }
            return response.json();
          })
          .then(data => {
            //console.log("___________________");
            //console.log(data);
            let dframe = data["frame0"];
            let myObj = JSON.parse(dframe);
            let data2 = myObj["rows"];
            //console.log(data2);
            this.setState(
              {
                ecw_enc: data2,
                invoice_cpt: [],
                loaded: true
              },
              () => {
                //console.log("Changed state", this.state.series.length);
                this.ecwencGridElement.current.changeGridData(this.state.ecw_enc,getColumnsList(data2[0]) );

              }
            );
          });

            fetch(this.endpoint_curr_linqdocs.replace('arg_ecwpatid', this.state.examid ), {})
              .then(response => {
                if (response.status !== 200) {
                  return this.setState({
                    placeholder: "Something went wrong in getting data"
                  });
                }
                return response.json();
              })
              .then(data => {
                //console.log("___________________");
                //console.log(data);
                let dframe = data["frame0"];
                let myObj = JSON.parse(dframe);
                let data2 = myObj["rows"];
                //console.log(data2);
                this.setState(
                  {
                    linq_docs: data2,
                    invoice_cpt: [],
                    loaded: true
                  },
                  () => {
                    //console.log("Changed state", this.state.series.length);
                    this.linqGridElement.current.changeGridData(this.state.linq_docs,getColumnsList(data2[0]) );    
                  }
                );
              });
  
      });
    };

    handleMedtronicReportPdf = (filename) => {
      filename = filename.replace("C:\\Users\\hkorlakunta\\Downloads\\", "/var/www/").replace("\\", "/");
      console.log(filename);
      fetch(encodeURI("https://192.168.21.199:8044/getfile?path=" + filename))
          .then(this.handleErrors)
          .then(r => r.blob())
          .then(this.showFilePdf);
    };  

    
    onRowSelectLinqReport = data => {
      console.log("Linq rowselectednew encounter:", data[0].row);
      console.log("TO DIsplay" + data[0].row.dirpath + "/" +  data[0].row.fileName);
      this.handleLinqReportPdf (data[0].row.dirpath + "/" +  data[0].row.fileName) ;
    };

    handleLinqReportPdf = (filename) => {
      console.log("Starting to get Linq File", filename);
      fetch(encodeURI("http://192.168.21.199:8040/getecwfile?filename=" + filename))
          .then(this.handleErrors)
          .then(r => r.blob())
          .then(this.showFilePdf);
    };      

    handleMedtronicReportPng = (filename) => {
      filename = filename.replace("C:\\Users\\hkorlakunta\\Downloads\\", "/var/www/").replace("\\", "/");
      console.log(filename);
      fetch(encodeURI("https://192.168.21.199:8044/getfile?path=" + filename))
          .then(this.handleErrors)
          .then(r => r.blob())
          .then(this.showFilePng);
    };  

    
 showFilePdf = (blob) => {
  // It is necessary to create a new blob object with mime-type explicitly set
  // otherwise only Chrome works like it should
  //var newBlob = new Blob([blob], { type: "image/png" })
  console.log('Show PDF called');
  var newBlob = new Blob([blob], { type: "application/pdf" })

  // IE doesn't allow using a blob object directly as link href
  // instead it is necessary to use msSaveOrOpenBlob
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
  }

  // For other browsers: 
  // Create a link pointing to the ObjectURL containing the blob.
  const data = window.URL.createObjectURL(newBlob);
  var link = document.createElement('a');
  link.href = data;
  link.download = "file.pdf";
  link.click();
  setTimeout(function () {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
  }, 100);
}

showFilePng = (blob) => {
  // It is necessary to create a new blob object with mime-type explicitly set
  // otherwise only Chrome works like it should
  var newBlob = new Blob([blob], { type: "image/png" })
  //var newBlob = new Blob([blob], { type: "application/pdf" })

  // IE doesn't allow using a blob object directly as link href
  // instead it is necessary to use msSaveOrOpenBlob
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
  }

  // For other browsers: 
  // Create a link pointing to the ObjectURL containing the blob.
  const data = window.URL.createObjectURL(newBlob);
  var link = document.createElement('a');
  link.href = data;
  link.download = "file.png";
  link.click();
  setTimeout(function () {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
  }, 100);
}

  
    signalListeners = { hover: this.handleHover };
  
    render() {
      return this.state.columns_loaded ? (
        <React.Fragment>
          <div className="container-fluid " style={{ width: "90%" }}>

            <DataProvider
              endpoint={this.endpoint_exams + this.state.customsqltext}
              render={data => (
                
                <React.Fragment>
                  <label>Patients</label>
                  <DataGrid
                    enableFilter
                    ref={this.patientsGridElement}
                    initialRows={data}
                    columns={getColumnsList(data[0])}
                    gridheight={200}
                    gridname={"exams"}
                    onRowSelect={this.onRowSelectExam}
                  />
                                   
                  <label>Reports</label>
                  <DataGrid
                    ref={this.medtreportsGridElement}
                    initialRows={this.state.medt_reports}
                    columns={getColumnsList(this.state.medt_reports[0])}
                    gridheight={200}
                    enableFilter
                    toolbar={
                      <Toolbar enableFilter={false} filterRowsButtonText="Filter" style={{ marginRight: 'auto' }} >
                         <React.Fragment>
                             <button type="button" className="btn btn-secondary" style={{ marginRight: '5px' , marginLeft: '5px' }} onClick={this.handleMedtronicReport}>
                               <i className="glyphicon glyphicon-refresh" /> Statement2
                             </button>
                      </React.Fragment>
                        </Toolbar>
                    }
                    gridname={"reports"}
                    onRowSelect={this.onRowSelectMedtronicReport}
                  />{" "}

                  <label>Loop Recorder Reports</label>
                  <DataGrid
                    ref={this.linqGridElement}
                    initialRows={this.state.pat_linqdocs}
                    columns={getColumnsList(this.state.pat_linqdocs[0])}
                    gridheight={200}
                    enableFilter
                    toolbar={
                      <Toolbar enableFilter={false} filterRowsButtonText="Filter" style={{ marginRight: 'auto' }} >
                         <React.Fragment>
                             <button type="button" className="btn btn-secondary" style={{ marginRight: '5px' , marginLeft: '5px' }} onClick={this.handleLinqReport}>
                               <i className="glyphicon glyphicon-refresh" /> Statement2
                             </button>
                      </React.Fragment>
                        </Toolbar>
                    }
                    gridname={"linq_reports"}
                    onRowSelect={this.onRowSelectLinqReport}
                  />{" "}                  

                  <label>Encounters</label>
                  <DataGrid
                    ref={this.ecwencGridElement}
                    initialRows={this.state.ecw_enc}
                    columns={getColumnsList(this.state.ecw_enc[0])}
                    gridheight={200}
                    gridname={"encounters"}
                    onRowSelect={this.onRowSelectEncounter}
                  />

                  <label>Claim Details</label>
                  <DataGrid
                    ref={this.invoiceGridElement}
                    initialRows={this.state.invoice_cpt}
                    columns={getColumnsList(this.state.invoice_cpt[0])}
                    gridheight={200}
                    gridname={"invoice_cpt"}
                    onRowSelect={this.onRowSelectExam}
                  />{" "}
                </React.Fragment>
              )}
            />
          </div>
        </React.Fragment>
      ) : (
        <span>Loading ...</span>
      );
    }
  }
  
  //export default ApexMonitoring;

  
// const AppDocs = () => (
//   <ApexMonitoring />

// );

// console.log(AppDocs);
// const wrapper = document.getElementById("monitoringapp");
// wrapper ? ReactDOM.render(<AppDocs />, wrapper) : null;