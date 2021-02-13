//https://iasq1mr2:8081/exSshCmd?dbserver=iasp1fo1&sqltype=unixps&sqltext=ps

import React from "react";
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data } from "react-data-grid-addons";

const selectors = Data.Selectors;

export default class CigaHost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hostname: props.hostname,
      receivers: [],
      processors: [],
      qmanager: [],
      cigatool: [],
      psdata: {}
    };
  }

  componentDidMount() {
    this.getHostData(
      "https://iasq1mr2:8081/exSshCmd?dbserver=" +
        //"https://localhost:8244/exSshCmd?dbserver=" +
        this.state.hostname +
        "&sqltype=unixps&sqltext=ps"
    );
  }

  getHostData = endpoint => {
    fetch(endpoint, {})
      .then(response => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: "Something went wrong in getting data"
          });
        }
        try {
          console.log("RECEIVED from HOST", response);
          return response.json();
        } catch (err) {
          console.log(err);
          return {};
        }
      })
      .then(psdata => {
        let receivers = JSON.parse(psdata.receivers);
        receivers.map((row, index) => {
          //console.log(row.CMDARGS);

          let args = JSON.parse("{" + row.CMDARGS);
          row["args"] = args;
          row["port"] = args.b.split(":").pop();
          row["AET"] = args.b.split("@").shift();
          row["IP"] = args.b
            .split(":")
            .shift()
            .split("@")
            .pop();
        });
        let processors = JSON.parse(psdata.processors);

        processors.map((row, index) => {
          console.log(row.CMDARGS);
          let args = JSON.parse("{" + row.CMDARGS);
          row["priority"] = args.p;
          row["processorid"] = args.t;
          row["args"] = args;
        });

        let qmanager = [];

        try {
          qmanager = JSON.parse(psdata.qmanager);
          console.log(qmanager);
          qmanager.map((row, index) => {
            let queue1 = row.CMDARGS.split("queue=").pop();
            row["queue"] = queue1.split(" ").shift();
            let args1 = queue1.split(" ").shift();
            row["logdir"] = queue1
              .split(" ")[2]
              .split("=")
              .pop();
            console.log(
              args1,
              queue1
                .split(" ")[2]
                .split("=")
                .pop()
            );
          });
        } catch (err) {}

        this.setState(
          {
            psdata: psdata,
            receivers: receivers,
            processors: processors,
            qmanager: qmanager
          },
          () => {
            console.log("Got PS state", this.state.receivers.length);
            console.log("Got PS Receivers", this.state.receivers);
            console.log("Got PS Processors", this.state.processors);
            console.log("Got PS Manager", this.state.qmanager);
          }
        );
      });
  };

  render() {
    //let receivers = this.state.psdata.receivers;
    //console.log("RECEIVERS", receivers);

    return (
      <React.Fragment>
        <h1 style={{ background: "lightblue" }}>{this.state.hostname}</h1>
        <h4 style={{ background: "lightgray" }}>Queue Manager</h4>
        {this.state.qmanager.map((row, index) => (
          <p key={row.PID}>
            {" "}
            {row.queue} PID {row.PID}
            {row.logdir}
          </p>
        ))}
        <h4 style={{ background: "lightgreen" }}>RECEIVERS</h4>
        {this.state.receivers
          .sort((a, b) => {
            //return a.processorid - b.processorid;
            return ("" + a.args.queue + ("0" + a.PID).slice(-2)).localeCompare(
              "" + b.args.queue + ("0" + b.PID).slice(-2)
            );
          })
          .map((row, index) => (
            <p key={row.PID}>
              {row.args.queue} PID {row.PID} {row.args.logDir}{" "}
              {row.args.directory} {row.AET} {row.port} {row.IP}
              Elapsed {row.ELAPSED}
            </p>
          ))}
        <h4 style={{ background: "orange" }}>PROCESSORS</h4>
        {this.state.processors
          .sort((a, b) => {
            //return a.processorid - b.processorid;
            return (
              "" +
              a.args.queue +
              ("0" + a.processorid).slice(-2)
            ).localeCompare(
              "" + b.args.queue + ("0" + b.processorid).slice(-2)
            );
          })
          .map((row, index) => (
            <p key={row.PID}>
              {row.args.queue} PID => {row.PID} {row.logDir} {row.priority}{" "}
              {row.processorid} Processor {row.queue}{" "}
            </p>
          ))}
        <hr />
      </React.Fragment>
    );
  }
}
