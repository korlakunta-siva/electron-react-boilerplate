
import React from 'react';
import ReactDOM from 'react-dom';
import "react-datepicker/dist/react-datepicker.css"
//import { BrowserRouter } from 'react-router-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import { Security, LoginCallback } from '@okta/okta-react';
import "react-datepicker/dist/react-datepicker.css"

//############# 'indexroot': 'claimsapp'  #################
//import App from "./components/claims/App";

//############# 'indexroot': 'docubrowser'  #################

import 'semantic-ui-css/semantic.min.css';

import RendererApp from './AppNoAuth';
import './index.css';

//import DocuBrowser from "./components/docubrowser/DocuBrowser";

//############# 'indexroot': 'monitoringapp'  #################
//import ApexMonitoring from './components/monitoring/ApexMonitoring';

//############# 'indexroot': 'notesapp'  #################
//import AppNotes from "./components/prognotes/AppNotes";


//import App from "./CompletedNotes";
//import PdfView from "./components/PdfView";
//import App2 from "./components/ListEditor/index.tsx";
//import App2 from "./components/App2";
//import ClaimsApp from "./components/ClaimsApp";
//ReactDOM.render(<App2 />, document.getElementById("claimsapp2"));

export default RendererApp;

//ReactDOM.render(<RendererApp />, document.getElementById('root'));

