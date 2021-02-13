// src/AppWithRouterAccess.jsx

import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { HashRouter as Router } from 'react-router-dom/cjs/react-router-dom';
import LogBrowser from './components/LogBrowser/App';
import CigPurge from './components/patientbrowse/AppPatient';
import CountsMatch from './components/countmatch/ImageCountCompareStatus';
import PatientBrowse from './components/patientbrowse/AppPatient';
import CigaOpsTest from './components/cigaops/AppCigaLoadTest';
import CigaOps from './components/cigaops/AppCigaOps';
import PineStatus from './components/statuspages/PINEStatus';
import CIGProcessor from './components/statuspages/CIGProcessors';
import CIGReceiver from './components/statuspages/CIGReceivers';
import Navbar from './components/Navbar';
import Header from './components/header/Header';

// const history = hashHistory();

//  logbrowser

const AppWithRouterAccess = (props) => {
  try {
    console.log('Hx:', props.history);
  } catch (error) {
    console.log(error);
  }
  // const { url, path } = useRouteMatch();
  //        <Route path="/patientbrowser" component={PatientBrowse} />
  console.log('setting up withRouter, called:', props);

  return (
    <>
      <Router history={props.history}>
        <Route
          path="/patientbrowser"
          render={(props) => <PatientBrowse {...props} />}
        />

        <Route
          path="/logbrowser"
          render={(props) => <LogBrowser {...props} />}
        />

        <Route path="/cispurge" render={(props) => <CigPurge {...props} />} />

        <Route path="/cigaops" render={(props) => <CigaOps {...props} />} />

        <Route
          path="/cigaopstest"
          render={(props) => <CigaOpsTest {...props} />}
        />

        <Route
          path="/pinestatus"
          render={(props) => <PineStatus {...props} />}
        />

        <Route
          path="/cigprocessor"
          render={(props) => <CIGProcessor {...props} />}
        />

        <Route
          path="/cigreceiver"
          render={(props) => <CIGReceiver {...props} />}
        />
        <Header history={history} />
      </Router>
    </>
  );
};

export default AppWithRouterAccess;

{
  /* <Route path="/" exact={true} component={Home} /> */
}
