import React from "react";

const NavBar = ({ totalCounters }) => {
  console.log("NavBar - Rendered");
  return (

    <nav className="navbar navbar-light bg-light">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a href="#home" className="nav-link" data-toggle="tab">
            Home
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#qreads_perfmetrics"
            className="nav-link active"
            data-toggle="tab"
            style={{ display: "inline-block" }}
          >
            QR Exam load Metrics
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#iims_dearchive_dashb"
            className="nav-link"
            data-toggle="tab"
            style={{ display: "inline-block" }}
          >
            Dearchive Metrics
          </a>
        </li>
        <li className="nav-item">
          <a href="#iims-queues" className="nav-link" data-toggle="tab"
          >
            IIMS Queues
          </a>
        </li>
        <li className="nav-item">
          <a href="#cis-storage" className="nav-link" data-toggle="tab">
            CIS Storage Activity
          </a>
        </li>
        <li className="nav-item">
          <a href="#ciga" className="nav-link" data-toggle="tab">
            CIGA
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
