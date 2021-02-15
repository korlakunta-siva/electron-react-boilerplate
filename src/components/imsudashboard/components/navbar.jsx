import React from 'react';
import { withRouter } from 'react-router-dom';

const NavBar = (props) => {
  console.log('NavBar - Rendered', props.history);
  const { totalCounters } = props;
  return (
    <nav className="navbar navbar-light bg-light style={{ marginTop: '50px' }}">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className="nav-link active"
            data-toggle="tab"
            onClick={() => {
              props.history.push('/imsudashboardho#me');
            }}
          >
            Home
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            data-toggle="tab"
            style={{ display: 'inline-block' }}
            onClick={() => {
              props.history.push('/imsudashboard#qreads_perfmetrics');
            }}
          >
            QR Exam load Metrics
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            data-toggle="tab"
            style={{ display: 'inline-block' }}
            onClick={() => {
              props.history.push('/imsudashboard#iims_dearchive_dashb');
            }}
          >
            Dearchive Metrics
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            data-toggle="tab"
            onClick={() => {
              props.history.push('/imsudashboard#iims-queues');
            }}
          >
            IIMS Queues
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            data-toggle="tab"
            onClick={() => {
              props.history.push('/imsudashboard#cis-storage');
            }}
          >
            CIS Storage Activity
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            data-toggle="tab"
            onClick={() => {
              props.history.push('/imsudashboard#ciga');
            }}
          >
            CIGA
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default withRouter(NavBar);
