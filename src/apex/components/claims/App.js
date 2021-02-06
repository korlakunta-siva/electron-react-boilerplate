import React, { Component } from "react";
import ReactDOM from "react-dom";
import DataProvider from "../common/DataProvider";
import DataGrid from "../common/DataGrid";
import {showFile} from "../common/Utils"

const COLUMN_WIDTH = 140;
  
const defaultColumnProperties = {
    sortable: true,
    filterable: true,
    resizable: true,
    editable: true
  };

const getColumnsList = queryEndpoint => {
    //console.log(queryEndpoint);
    let columnList = [];
    return fetch(encodeURI(queryEndpoint), {})
      .then(response => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: "Something went wrong in getting data for column list"
          });
        }
        return response.json();
      })
      .then(data => {
        //console.log(data);
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
  
          return dict1;
        });
  
        columnList = columnList.map(c => ({
          ...c,
          ...defaultColumnProperties
        }));
  
        return columnList;
      });
  };
  

  export default class App extends Component {
    endpoint_patients ="https://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set rowcount 0 select * from apex..vPatient";
    endpoint_claims   ="https://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set rowcount 0 select top 100 over_30, over_60, over_90, over_120, aging_days = datediff(dd, edos, getdate()), lastclinicvisit =  convert(varchar(10),(select max(date) from mobiledoc..enc e0 where e0.patientid = sum1.patientid and apex.dbo.facilitycode(e0.facilityId) like '%cl'), 21), id = PatientId , claimid = InvoiceId, name = isnull(patientname, 'NameError'), dos = convert(varchar(10), sdos, 21), facility = facility, payortype, insurance, insurance_sec, inspaid, patpaid, insbal, patbal from apex.rc.Apex_Invoice_Summary sum1 where sdos > '1/1/2015' and (insbal > 0 or patbal > 0)  ";
    //order by ( sum1.cptbalance ) desc
    endpoint_claims_columns   ="https://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set rowcount 10 select top 100 aging_days = datediff(dd, edos, getdate()), lastclinicvisit =  convert(varchar(10),(select max(date) from mobiledoc..enc e0 where e0.patientid = sum1.patientid and apex.dbo.facilitycode(e0.facilityId) like '%cl'), 21), id = PatientId , claimid = InvoiceId, name = isnull(patientname, 'NameError'), dos = convert(varchar(10), sdos, 21), facility = facility, payortype, insurance, insurance_sec, inspaid, patpaid, insbal, patbal, over_30, over_60, over_90, over_120 from apex.rc.Apex_Invoice_Summary sum1 where sdos > '8/1/2019' and (insbal > 0 or patbal > 0)  ";
    

    state = {
      loaded: false,
      columns_loaded: false,
      placeholder: "",
      patientGrid_data: [],
      patientGrid_columns: [],
      patientClaimsGrid_data: [],
      patientClaimsGrid_columns: [],      
      patientid: 0,
    };
  
    constructor(props) {
      super(props);
      this.patientGridElement = React.createRef();
      this.patientClaimsGridElement = React.createRef();
    };

    componentWillMount() {

        getColumnsList(this.endpoint_patients).then(columns => {
            this.setState({ patientGrid_columns: columns });
        });

        getColumnsList(this.endpoint_claims_columns).then(columns => {
            //console.log(columns);
            //alert(columns);
            this.setState({ patientClaimsGrid_columns: columns });
        });
       
        setTimeout(() => {
          this.setState({ columns_loaded: true });
        }, 2000);
    };
  
    onRowSelectPatient = data => {
      //console.log("rowselected patient:", data[0].row);

      this.setState({ patientid: data[0].row.PatientId }, () => {
        fetch(
          encodeURI(this.endpoint_claims +
            " and patientid = " +
            this.state.patientid + " order by sdos desc"),
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
            this.setState(
              {
                patientClaimsGrid_data: data,
                loaded: true
              },
              () => {
                //console.log("Changed state", this.state.patientClaimsGrid_data.length);
                //this.patientClaimsGridElement.current.changeGridData(this.state.patientClaimsGrid_data);
              }
            );
          });
      });
    };
  
    onRowSelectClaim = data => {
      console.log("rowselected claim:", data);
    };

    handleErrors = (response) => {
        if (!response.ok) {
            alert(response.statusText);
        } else {
            return response;
        }
    }

    handleStatement = (row) => {
        //this.setState({ filters: {}, selectedIndexes: [] });
        //let row = this.getRows().filter( (elem,indx)=> indx == this.state.selectedIndexes)[0];
        console.log(row);
        fetch("https://192.168.21.199:8040/statement?patid=" + row.PatientId.toString())
            .then(this.handleErrors)
            .then(r => r.blob())
            .then(showFile);
      }; 
  
    render() {

        return this.state.columns_loaded ? (
        <React.Fragment>
        <label>Patients</label>
        <DataProvider
          endpoint={this.endpoint_patients}
          render={data => (
            <DataGrid
              ref={this.patientGridElement}
              initialRows={data}
              columns={this.state.patientGrid_columns }
              toolbarStatement
              OnToolbarStatement={this.handleStatement}
              toolbarStatement2
              gridheight={400}
              gridname={"patient_list"}
              onRowSelect={this.onRowSelectPatient}
            />
            )}
            />
        <label>Claims</label>
        <DataProvider
          endpoint={this.endpoint_claims}
          render={data => (
            <DataGrid
              ref={this.patientClaimsGridElement}
              initialRows={data}
              columns={this.state.patientClaimsGrid_columns }
              gridheight={250}
              gridname={"patient_claims_list"}
              onRowSelect={this.onRowSelectClaim}
            />
            )}
            />            
          </React.Fragment>
            ) : (<span>Loading ...</span>);
    };
};
  

const wrapper = document.getElementById("claimsapp");
wrapper ? ReactDOM.render(<App />, wrapper) : null; 

