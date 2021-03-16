import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import './App.css';
import CounterComponent from './components/counters';
import NavBar from './components/navbar';
import IFrame from './components/KibanaEmbedView';
import cfgDashboard from './dashboard.json';

const App = (props) => {
  console.log('App.js  - Rendered', props.history);

  const { pathname, hash } = props.location;

  console.log('App Context: ', pathname, hash);

  const counters = [
    { id: 1, value: 10 },
    { id: 2, value: 20 },
    { id: 3, value: 30 },
    { id: 5, value: 40 },
    { id: 6, value: 50 },
    { id: 7, value: 60 },
  ];

  const hashLinks = [
    '#iims_queues_summary',
    '#iims-queues_detail',
    '#cis_storage_activity',
    '#cis_storage_weekly_summary',
    '#ciga_24hour_snapshot',
    '#ciga_non-prefetch_processing',
    '#ciga_prefetch_processing',
    '#ciga_receivers',
    '#qreads_perfmetrics',
    '#iims_dearchive_dashb',
    '#iims-queues',
    '#cis-storage',
    '#ciga',
  ];

  const scrollToAnchor = (hashAnchor) => {
    if (hashAnchor) {
      console.log('App Switching to TAB: ', hashAnchor);
      document.querySelector(`${hashAnchor}`).classList.add('show');
      document.querySelector(`${hashAnchor}`).classList.add('active');
      //document.querySelector(`${hashAnchor}`).scrollIntoView();

      if (hashAnchor == '#iims_queues') {
        document.querySelector('#iims_queues_summary').classList.add('show');
        document.querySelector('#iims_queues_summary').classList.add('active');
      }

      if (hashAnchor == '#ciga') {
        document.querySelector('#ciga_24hour_snapshot').classList.add('show');
        document.querySelector('#ciga_24hour_snapshot').classList.add('active');
      }

      if (hashAnchor == '#cis-storage') {
        document.querySelector('#cis_storage_activity').classList.add('show');
        document.querySelector('#cis_storage_activity').classList.add('active');
      }

      hashLinks.forEach((hashlink) => {
        console.log('Inactivating hashlink:', hashlink);
        if (hashAnchor != hashlink) {
          const elem = document.querySelector(hashlink);
          if (elem) {
            if (
              ((hashAnchor == '#iims_queues_summary' ||
                hashAnchor == '#iims-queues_detail') &&
                hashlink == '#iims-queues') ||
              ((hashAnchor == '#ciga_24hour_snapshot' ||
                hashAnchor == '#ciga_non-prefetch_processing' ||
                hashAnchor == '#ciga_prefetch_processing' ||
                hashAnchor == '#ciga_receivers') &&
                hashlink == '#ciga') ||
              ((hashAnchor == '#cis_storage_activity' ||
                hashAnchor == '#cis_storage_weekly_summary') &&
                hashlink == '#cis-storage')
            ) {
              document.querySelector(`${hashlink}`).classList.add('show');
            } else {
              elem.classList.add('hide');
              elem.classList.remove('active');
            }

            // if (
            //   hashAnchor == '#iims_queues_summary' ||
            //   hashAnchor == '#iims-queues_detail'
            // ) {
            //   const elem2 = document.querySelector('#iims-queues');
            //   if (elem2) {
            //     elem2.classList.add('show');
            //     //elem.classList.remove('active');
            //   }
            // }
            //document.querySelector(hashlink).classList.remove('active');
          }
        }
      });
    }
  };

  useEffect(() => {
    console.log('App- Mounted');
    generateiFrames();
  }, []);

  useEffect(() => {
    console.log('App - Has Changed to: ', props.location.hash);
    scrollToAnchor(props.location.hash);
  }, [props.location.hash]);

  // const handleIncrement = (product) => {
  //   console.log('Increment clicked!', product);
  //   const counters = [...this.state.counters];
  //   const index = counters.indexOf(product);
  //   counters[index] = { ...product };
  //   counters[index].value++;
  //   this.setState({ counters });
  // };

  // const handleDelete = (counter) => {
  //   console.log('Delete Called', counter);
  //   const counters = this.state.counters.filter((c) => c.id !== counter.id);
  //   this.setState({ counters });
  // };

  // const handleReset = () => {
  //   console.log('Reset called');
  //   const counters = this.state.counters.map((c) => {
  //     c.value = 0;
  //     return c;
  //   });
  //   this.setState({ counters });
  // };

  const generateiFrames = () => {
    console.log('generate iframes called');

    cfgDashboard.map((c) => {
      let div_hook = c.panel_div_hook;
      console.log(div_hook);
      ReactDOM.render(
        <IFrame
          url={c.url}
          element_location={c.element_location}
          element_type={c.element_type}
          element_id={c.element_id}
          embed="true"
          refreshInterval={
            'pause%3A' + c.refresh_enabled + '%2Cvalue%3A' + c.refresh_interval
          }
          time={'from%3A' + c.time_from + '%2Cmode%3Aquick%2Cto%3A' + c.time_to}
          height={c.height}
          width={c.width}
          datalink={c.auth_data_link}
        />,
        document.getElementById(div_hook)
      );
    });
    //document.getElementById("navDrawerMenu").className = "d-none";
    //document.getElementsByClassName("header-global-wrapper").className =
    //  "d-none";

    // for (let c in cfgDashboard) {
    //   console.log(c);
    //   //const panels = cfgDashboard.map(c => {
    //   let div_hook = c.panel_div_hook;
    //   console.log(div_hook);
    // ReactDOM.render(
    //   <IFrame
    //     url={c.url}
    //     element_location={c.element_location}
    //     element_type={c.element_type}
    //     element_id={c.element_id}
    //     embed="true"
    //     refreshInterval={c.refreshInterval}
    //     time={c.time}
    //     height={c.height}
    //     width={c.width}
    //   />,
    //   document.getElementById(div_hook)
    // );
    //}

    //console.log(panels);
  };

  //src="https://hdpr07en03.mayo.edu:5603/app/kibana#/dashboard/7f3b5300-d784-11e9-bb3e-11be430d96a3?embed=true&_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-4h%2Cmode%3Aquick%2Cto%3Anow))"
  return (
    <React.Fragment>
      <NavBar
        totalCounters={counters.filter((c) => c.value > 0).length}
        history={props.history}
      />
      <div className="tab-content">
        <div className="tab-pane fade " id="home">
          <h2 className="mt-2">Work in progress.</h2>
          <h4 className="mt-2">Home Page for IMSU Dashboard</h4>
          <a href="https://hdpr07en05.mayo.edu:5601/">
            Connect to Dashboard Server using this link if you get SAML errors
            on the dashboard tabs. Refresh Dashboard homepage after you connect
            to the server to try again.
          </a>
          <br />
          <p>Click on other tabs on this page to view various dashboards</p>
          <p>
            All dashboards contain production, live information, refreshed on
            different intervals, typically 1 to 5 minutes.{' '}
          </p>
          <p>
            If you do not see the contents of a tab, use (a) right mouse click +
            reload frame or (b) reload the entire page and navigate to the
            specific dashboard tab.{' '}
          </p>
          <br />
          <p>
            Clicking on <strong>Open in Kibana</strong> will open the dashboard
            in Kibana (in another tab). While the embedded dashboards on the
            site has preset configuraiton for the dashboard view, all avilable
            parameters can be used to analyze the data presented in the
            dashboard by navigating to Kibana. Some dashboard panes do not have
            drill down capability, and hence would not have{' '}
            <strong>Open in Kibana</strong> link.
          </p>
          <p>
            Clicking on <strong>DataLink</strong> will open the json data used
            for the dashboard. If you see error in retrieving data for the
            dashboard, click on the <strong>DataLink</strong>
            to accept certificate for the URL serving the data for the
            dashboard.
          </p>
          <br />
          <h3>Best viewed using google chrome.</h3>
          <br />
          <a
            style={{ display: 'inline-block' }}
            href="https://sharepoint.mayo.edu/mayo/content/IMSU/IMS%20Applications%20Documents/IMSUDashboard_Readme.html"
            target="_Readme"
          >
            {' '}
            Dashboard Readme
          </a>
        </div>
        <div className="tab-pane fade" id="qreads_perfmetrics" />
        <div className="tab-pane fade" id="iims_dearchive_dashb" />
        <div className="tab-pane fade show active" id="iims-queues">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a
                className="nav-link"
                data-toggle="tab"
                onClick={() => {
                  props.history.push('/imsudashboard#iims_queues_summary');
                }}
              >
                Current
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                data-toggle="tab"
                style={{ display: 'inline-block' }}
                onClick={() => {
                  props.history.push('/imsudashboard#iims-queues_detail');
                }}
              >
                Details
              </a>
            </li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane fade" id="iims_queues_summary" />
            <div className="tab-pane fade" id="iims-queues_detail" />
          </div>
        </div>
        <div className="tab-pane fade" id="cis-storage">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a
                className="nav-link"
                data-toggle="tab"
                style={{ display: 'inline-block' }}
                onClick={() => {
                  props.history.push('/imsudashboard#cis_storage_activity');
                }}
              >
                Recent Activity
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                data-toggle="tab"
                style={{ display: 'inline-block' }}
                onClick={() => {
                  props.history.push(
                    '/imsudashboard#cis_storage_weekly_summary'
                  );
                }}
              >
                Weekly Summary
              </a>
            </li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane fade" id="cis_storage_activity" />
            <div className="tab-pane fade" id="cis_storage_weekly_summary" />
          </div>
        </div>
        <div className="tab-pane fade" id="ciga">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a
                style={{ display: 'inline-block' }}
                className="nav-link"
                data-toggle="tab"
                onClick={() => {
                  props.history.push('/imsudashboard#ciga_24hour_snapshot');
                }}
              >
                CIGA 24 Hr Snapshot
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                data-toggle="tab"
                style={{ display: 'inline-block' }}
                onClick={() => {
                  props.history.push(
                    '/imsudashboard#ciga_non-prefetch_processing'
                  );
                }}
              >
                Non-Prefetch Processing
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                data-toggle="tab"
                onClick={() => {
                  props.history.push('/imsudashboard#ciga_prefetch_processing');
                }}
              >
                Prefetch Processing
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                data-toggle="tab"
                onClick={() => {
                  props.history.push('/imsudashboard#ciga_receivers');
                }}
              >
                CIGA Receiver Metrics
              </a>
            </li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane fade" id="ciga_non-prefetch_processing" />
            <div className="tab-pane fade" id="ciga_prefetch_processing" />
            <div className="tab-pane fade" id="ciga_24hour_snapshot" />
            <div className="tab-pane fade" id="ciga_receivers" />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default App;

//<iframe src="https://hdpr07en03.mayo.edu:5603/app/kibana#/dashboard/bf8fe7e0-f449-11e9-845c-9f27a8f8ddc8?embed=true&_g=(refreshInterval%3A(pause%3A!f%2Cvalue%3A60000)%2Ctime%3A(from%3Anow-75m%2Cmode%3Aquick%2Cto%3Anow-60m))"
{
  /* <CounterComponent
counters={this.state.counters}
onReset={this.handleReset}
onIncrement={this.handleIncrement}
onDelete={this.handleDelete}
/> */
}

//ReactDOM.render(<App />, document.getElementById("root"));
