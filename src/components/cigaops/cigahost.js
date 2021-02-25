//https://iasq1mr2:8081/exSshCmd?dbserver=iasp1fo1&sqltype=unixps&sqltext=ps

import React from 'react';
import ReactDataGrid from 'react-data-grid';
import { Toolbar, Data } from 'react-data-grid-addons';

const { exec } = require('child_process');

const selectors = Data.Selectors;

const parse_cmdline = (cmdline) => {
  var re_next_arg = /^\s*((?:(?:"(?:\\.|[^"])*")|(?:'[^']*')|\\.|\S)+)\s*(.*)$/;
  var next_arg = ['', '', cmdline];
  var args = [];
  while ((next_arg = re_next_arg.exec(next_arg[2]))) {
    var quoted_arg = next_arg[1];
    var unquoted_arg = '';
    while (quoted_arg.length > 0) {
      if (/^"/.test(quoted_arg)) {
        var quoted_part = /^"((?:\\.|[^"])*)"(.*)$/.exec(quoted_arg);
        unquoted_arg += quoted_part[1].replace(/\\(.)/g, '$1');
        quoted_arg = quoted_part[2];
      } else if (/^'/.test(quoted_arg)) {
        var quoted_part = /^'([^']*)'(.*)$/.exec(quoted_arg);
        unquoted_arg += quoted_part[1];
        quoted_arg = quoted_part[2];
      } else if (/^\\/.test(quoted_arg)) {
        unquoted_arg += quoted_arg[1];
        quoted_arg = quoted_arg.substring(2);
      } else {
        unquoted_arg += quoted_arg[0];
        quoted_arg = quoted_arg.substring(1);
      }
    }
    args[args.length] = unquoted_arg;
  }
  return args;
};

export default class CigaHost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hostname: props.hostname,
      receivers: [],
      processors: [],
      qmanager: [],
      cigatool: [],
      psdata: {},
    };
  }

  componentDidMount() {
    try {
      exec(
        '"api/venv/Scripts/python" api/cigaops.py -cmd cigvm -a  ' +
          this.state.hostname,
        { maxBuffer: 1024 * 50000 },
        (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          //console.log(`stdout: ${stdout}`);

          console.log(stdout);
          //let myObject = JSON.parse(stdout);
          //console.log(myObject);

          //console.log('RECEIVED from HOST', response);
          //console.log(stdout.replace(/'/g, '"'));
          let psdata = JSON.parse(stdout.replace(/'/g, '"'));
          //console.log(psdata);
          let receivers = [];
          if (psdata.hasOwnProperty('receivers')) {
            try {
              console.log(psdata.receivers);
              receivers = psdata.receivers; //JSON.parse(psdata.receivers);
              receivers.map((row, index) => {
                console.log(row.CommandArgs);

                //console.log('RECEIVERS ARGS', argv);
                if (row.CommandArgs) {
                  if (row.CommandArgs.toLowerCase().includes('queue=test'))
                    row['args'] = { queue: 'test' };
                  else if (row.CommandArgs.toLowerCase().includes('queue=int'))
                    row['args'] = { queue: 'int' };
                  else if (
                    row.CommandArgs.toLowerCase().includes('queue=preint')
                  )
                    row['args'] = { queue: 'preint' };
                  else if (row.CommandArgs.toLowerCase().includes('queue=prod'))
                    row['args'] = { queue: 'prod' };
                  else if (
                    row.CommandArgs.toLowerCase().includes('queue=preprod')
                  )
                    row['args'] = { queue: 'preprod' };
                  else row['args'] = { queue: 'other' };
                } else {
                  row['args'] = { queue: 'other' };
                }
                row['port'] = ''; //args.b.split(':').pop();
                row['AET'] = ''; //args.b.split('@').shift();
                row['IP'] = ''; //args.b.split(':').shift().split('@').pop();

                try {
                  var argv = parse_cmdline(CommandArgs);
                } catch (err) {}

                // let args = JSON.parse('{' + row.CommandArgs);
                // row['args'] = args;
                // row['port'] = args.b.split(':').pop();
                // row['AET'] = args.b.split('@').shift();
                // row['IP'] = args.b.split(':').shift().split('@').pop();
              });
            } catch (err) {
              console.log(err);
            }
          }

          let processors = [];
          if (psdata.hasOwnProperty('processors')) {
            try {
              processors = psdata.processors; //JSON.parse(psdata.processors);

              processors.map((row, index) => {
                console.log(row.CommandArgs);

                row['priority'] = ''; //args.p;
                row['processorid'] = ''; //args.t;

                if (row.CommandArgs) {
                  if (row.CommandArgs.toLowerCase().includes('queue=test'))
                    row['args'] = { queue: 'test' };
                  else if (row.CommandArgs.toLowerCase().includes('queue=int'))
                    row['args'] = { queue: 'int' };
                  else if (
                    row.CommandArgs.toLowerCase().includes('queue=preint')
                  )
                    row['args'] = { queue: 'preint' };
                  else if (row.CommandArgs.toLowerCase().includes('queue=prod'))
                    row['args'] = { queue: 'prod' };
                  else if (
                    row.CommandArgs.toLowerCase().includes('queue=preprod')
                  )
                    row['args'] = { queue: 'preprod' };
                  else row['args'] = { queue: 'other' };
                } else {
                  row['args'] = { queue: 'other' };
                }

                //row['args'] = { queue: 'abcd' }; // args;

                // let args = JSON.parse('{' + row.CommandArgs);
                // row['priority'] = args.p;
                // row['processorid'] = args.t;
                // row['args'] = args;
              });
            } catch (err) {
              console.log(err);
            }
          }

          let qmanager = [];
          if (psdata.hasOwnProperty('qmanager')) {
            try {
              qmanager = psdata.qmanager; // JSON.parse(psdata.qmanager); //
              console.log(qmanager);
              qmanager.map((row, index) => {
                if (row.CommandArgs) {
                  if (row.CommandArgs.toLowerCase().includes('queue=test'))
                    row['args'] = { queue: 'test' };
                  else if (row.CommandArgs.toLowerCase().includes('queue=int'))
                    row['args'] = { queue: 'int' };
                  else if (
                    row.CommandArgs.toLowerCase().includes('queue=preint')
                  )
                    row['args'] = { queue: 'preint' };
                  else if (row.CommandArgs.toLowerCase().includes('queue=prod'))
                    row['args'] = { queue: 'prod' };
                  else if (
                    row.CommandArgs.toLowerCase().includes('queue=preprod')
                  )
                    row['args'] = { queue: 'preprod' };
                  else row['args'] = { queue: 'other' };
                } else {
                  row['args'] = { queue: 'other' };
                }

                // row['queue'] = 'abcd'; //queue1.split(' ').shift();

                row['logdir'] = ''; //queue1.split(' ')[2].split('=').pop();

                //let queue1 = row.CommandArgs.split('queue=').pop();
                // row['queue'] = queue1.split(' ').shift();
                // let args1 = queue1.split(' ').shift();
                // row['logdir'] = queue1.split(' ')[2].split('=').pop();
                // console.log(args1, queue1.split(' ')[2].split('=').pop());
              });
            } catch (err) {}
          }

          this.setState(
            {
              psdata: psdata,
              receivers: receivers,
              processors: processors,
              qmanager: qmanager,
            },
            () => {
              console.log('Got PS state', this.state.receivers.length);
              console.log('Got PS Receivers', this.state.receivers);
              console.log('Got PS Processors', this.state.processors);
              console.log('Got PS Manager', this.state.qmanager);
            }
          );
        }
      );
    } catch (error) {
      console.log(error);
    }

    // this.getHostData(
    //   "https://iasq1mr2:8081/exSshCmd?dbserver=" +
    //     //"https://localhost:8244/exSshCmd?dbserver=" +
    //     this.state.hostname +
    //     "&sqltype=unixps&sqltext=ps"
    // );
  }

  // getHostData = (endpoint) => {
  //   fetch(endpoint, {})
  //     .then((response) => {
  //       if (response.status !== 200) {
  //         return this.setState({
  //           placeholder: 'Something went wrong in getting data',
  //         });
  //       }
  //       try {

  //     .then((psdata) => {
  //       let receivers = JSON.parse(psdata.receivers);
  //       receivers.map((row, index) => {
  //         //console.log(row.CMDARGS);

  //         let args = JSON.parse('{' + row.CMDARGS);
  //         row['args'] = args;
  //         row['port'] = args.b.split(':').pop();
  //         row['AET'] = args.b.split('@').shift();
  //         row['IP'] = args.b.split(':').shift().split('@').pop();
  //       });
  //       let processors = JSON.parse(psdata.processors);

  //       processors.map((row, index) => {
  //         console.log(row.CMDARGS);
  //         let args = JSON.parse('{' + row.CMDARGS);
  //         row['priority'] = args.p;
  //         row['processorid'] = args.t;
  //         row['args'] = args;
  //       });

  //       let qmanager = [];

  //       try {
  //         qmanager = JSON.parse(psdata.qmanager);
  //         console.log(qmanager);
  //         qmanager.map((row, index) => {
  //           let queue1 = row.CMDARGS.split('queue=').pop();
  //           row['queue'] = queue1.split(' ').shift();
  //           let args1 = queue1.split(' ').shift();
  //           row['logdir'] = queue1.split(' ')[2].split('=').pop();
  //           console.log(args1, queue1.split(' ')[2].split('=').pop());
  //         });
  //       } catch (err) {}

  //       this.setState(
  //         {
  //           psdata: psdata,
  //           receivers: receivers,
  //           processors: processors,
  //           qmanager: qmanager,
  //         },
  //         () => {
  //           console.log('Got PS state', this.state.receivers.length);
  //           console.log('Got PS Receivers', this.state.receivers);
  //           console.log('Got PS Processors', this.state.processors);
  //           console.log('Got PS Manager', this.state.qmanager);
  //         }
  //       );
  //     });
  // };

  render() {
    //let receivers = this.state.psdata.receivers;
    //console.log("RECEIVERS", receivers);

    return (
      <React.Fragment>
        <h1 style={{ background: 'lightblue' }}>{this.state.hostname}</h1>
        <h4 style={{ background: 'lightgray' }}>Queue Manager</h4>
        {this.state.qmanager.map((row, index) => (
          <p key={row.PID}>
            {' '}
            {row.args.queue} {row.QUEUE} PID {row.PID}
            {row.LOGDIR} CAMPUS {row.CAMPUS}
          </p>
        ))}
        <h4 style={{ background: 'lightgreen' }}>RECEIVERS</h4>
        {this.state.receivers
          .sort((a, b) => {
            //return a.processorid - b.processorid;
            return ('' + a.args.queue + ('0' + a.PID).slice(-2)).localeCompare(
              '' + b.args.queue + ('0' + b.PID).slice(-2)
            );
          })
          .map((row, index) => (
            <p key={row.PID}>
              {row.args.queue} PID {row.PID} {row.LOGDIR} {row.args.directory}{' '}
              {row.AET} {row.port} {row.IP} {row.PORT}
              Elapsed {row.ELAPSED}
            </p>
          ))}
        <h4 style={{ background: 'orange' }}>PROCESSORS</h4>
        {this.state.processors
          .sort((a, b) => {
            //return a.processorid - b.processorid;
            return (
              a.SERIAL +
              a.QUEUE +
              ('0' + a.processorid).slice(-2)
            ).localeCompare(
              b.SERIAL + b.QUEUE + ('0' + b.processorid).slice(-2)
            );
          })
          .map((row, index) => (
            <p key={row.PID}>
              {row.SERIAL} {row.QUEUE} PID => {row.PID} {row.LOGDIR}{' '}
              {row.PRIROITY} {row.processorid} Processor {row.queue}{' '}
            </p>
          ))}
        <hr />
      </React.Fragment>
    );
  }
}
