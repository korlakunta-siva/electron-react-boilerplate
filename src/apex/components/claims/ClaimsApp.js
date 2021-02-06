import React, { Component } from "react";
import ReactDOM from "react-dom";
import DataProvider from "../common/DataProvider";
import ClaimsDataGrid from "./ClaimsDataGrid";
import { Filters } from "react-data-grid-addons";
import Table from "../unused/Table";
import PdfView from "../common/pdf/PdfView";

const {
    NumericFilter,
    AutoCompleteFilter,
    MultiSelectFilter,
    SingleSelectFilter
} = Filters;


const columns = [
    {
        key: "id",
        name: "ID",
        filterRenderer: NumericFilter,
        frozen: true,
        resizable: false,
        width: 100
    },
    {
        key: "claimid",
        name: "Claim",
        filterRenderer: NumericFilter,
        frozen: true,
        resizable: false,
        width: 100
    },
    {
        key: "aging_days",
        name: "Aging",
        filterRenderer: NumericFilter,
        frozen: true,
        resizable: false,
        width: 100
    },
    {
        key: "name",
        name: "Name",
        sortDescendingFirst: false,
        frozen: false,
        resizable: true,
        width: 225

    },
    {
        key: "dos",
        name: "Visit On",
        frozen: false,
        resizable: false,
        width: 100
    } ,
    {
        key: "facility",
        name: "At",
        frozen: false,
        resizable: false,
        width: 100
    } 
    ,
    {
        key: "inspaid",
        name: "Paid-I",
        frozen: false,
        resizable: false,
        width: 60
    } 
    ,
    {
        key: "patpaid",
        name: "Paid-P",
        frozen: false,
        resizable: false,
        width: 60
    }     ,
    {
        key: "insbal",
        name: "Bal-I",
        frozen: false,
        resizable: false,
        width: 60
    } 
    ,
    {
        key: "patbal",
        name: "Bal-P",
        frozen: false,
        resizable: false,
        width: 60
    }     ,
    {
        key: "insurance",  
        name: "Insurance",
        frozen: false,
        resizable: false,
        width: 80   
    } 
    

]

let endpoint="https://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set rowcount 0 select top 1000 over_30, over_60, over_90, over_120, aging_days = datediff(dd, edos, getdate()), lastclinicvisit =  convert(varchar(10),(select max(date) from mobiledoc..enc e0 where e0.patientid = sum1.patientid and apex.dbo.facilitycode(e0.facilityId) like '%cl'), 21), id = PatientId , claimid = InvoiceId, name = isnull(patientname, 'NameError'), dos = convert(varchar(10), sdos, 21), facility = facility, payortype, insurance, insurance_sec, inspaid, patpaid, insbal, patbal from apex.rc.Apex_Invoice_Summary sum1 where sdos > '8/1/2019' and (insbal > 0 or patbal > 0) order by ( sum1.cptbalance ) desc ";


//endpoint="https://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%200%20select * from apex..vPatient";

const ClaimsApp = () => (
    <React.Fragment>
    <DataProvider endpoint={endpoint} render={data => <ClaimsDataGrid rows={data} columnstoshow={columns} />} />
    
    </React.Fragment>
);

const wrapper = document.getElementById("claimsapp");
wrapper ? ReactDOM.render(<ClaimsApp />, wrapper) : null; 