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
import IMSUDashboard from './components/imsudashboard/App';
import Navbar from './components/Navbar';
import Header from './components/header/Header';
import MainPage from './components/MainPage';

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
    <MainPage {...props} />
    </>
  );
};

export default AppWithRouterAccess;

{
  /* <Route path="/" exact={true} component={Home} /> */
}
