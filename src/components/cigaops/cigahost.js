//https://iasq1mr2:8081/exSshCmd?dbserver=iasp1fo1&sqltype=unixps&sqltext=ps

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red, lightBlue } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import RefreshIcon from '@material-ui/icons/Refresh';
import ComputerIcon from '@material-ui/icons/Computer';
import { DownloadItem } from 'electron';

const { exec } = require('child_process');

const onOpenSSH = (hostname) => {
  console.log('READY OPEN SSH: ', hostname);
  try {
    exec(
      'start "" "C:\\Programs\\Mobatek\\MobaXterm\\MobaXterm.exe" -newtab "ssh  slk02@' +
        hostname +
        '"',
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
        //retfunc(stdout);
        //retfunc ((JSON.stringify(stdout)));
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 350,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

//start "" "C:\Programs\Mobatek\MobaXterm\MobaXterm.exe" -newtab "ssh  slk02@iasp2ha1"

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

const CigaHost = (props) => {
  const [stateData, setstateData] = React.useState({
    hostname: props.hostname,
    receivers: [],
    processors: [],
    qmanager: [],
    cigatool: [],
    psdata: {},
    expanded: false,
  });

  const [hostSummary, sethostSummary] = React.useState([]);

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    //alert('Got CLick1' + event.currentTarget);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    //alert('Got CLick2' + event.currentTarget);
    setAnchorEl(null);
  };

  const handleCloseStopRecivers = (event, hostname) => {
    //alert(' Stop Recivers : ' + hostname);

    let command_string =
      ' /cigaapp/ciguser/bin/scripts/CIGDicomReceiver_stop_all.sh ';

    runCIGCommand(hostname, command_string);

    setAnchorEl(null);
  };

  const handleCloseStartReceivers = (event, hostname) => {
    //alert(' Start Recivers : ' + hostname);

    let command_string = ' /cigaapp/ciguser/bin/scripts/doit.sh ';
    //command_string = 'cd /cigaapp/ciguser/bin/scripts; ls -l ';

    runCIGCommand(hostname, command_string);

    setAnchorEl(null);
  };

  const handleCloseStopProcessors = (event, hostname) => {
    let command_string =
      ' /cigaapp/ciguser/bin/scripts/CIGProcessor_stop_all.sh ';

    runCIGCommand(hostname, command_string);
    setAnchorEl(null);
  };

  const handleCloseStartProcessors = (event, hostname) => {
    let command_string =
      '  /cigaapp/ciguser/bin/scripts/batch_start_processor.sh ';

    runCIGCommand(hostname, command_string);

    setAnchorEl(null);
  };

  const handleCloseStartQManager = (event, hostname) => {
    let command_string = ' /cigaapp/ciguser/bin/scripts/CIGQueueManager.sh ';

    runCIGCommand(hostname, command_string);
    setAnchorEl(null);
  };

  const handleCloseStopQManager = (event, hostname) => {
    let command_string =
      ' /cigaapp/ciguser/bin/scripts/CIGQueueManager_stop.sh ';

    runCIGCommand(hostname, command_string);
    setAnchorEl(null);
  };

  const handleExpandClick = () => {
    //console.log('before', stateData);
    setstateData({ ...stateData, expanded: !stateData.expanded });
    //console.log('After', stateData);
  };

  const runCIGCommand = (hostname, cmdtorun) => {
    console.log(
      '"api/venv/Scripts/python" api/cigaops.py -cmd cigcmd -host ' +
        hostname +
        ' -a "' +
        cmdtorun +
        '"'
    );
    try {
      exec(
        '"api/venv/Scripts/python" api/cigaops.py -cmd cigcmd -host ' +
          hostname +
          ' -a "' +
          cmdtorun +
          '"',
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
          console.log('CMD Returned', hostname, cmdtorun, stdout);
          refreshHostData();
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const refreshHostData = () => {
    console.log('REFRESH CALLED', props.hostname);
    try {
      exec(
        '"api/venv/Scripts/python" api/cigaops.py -cmd cigvm -a  ' +
          props.hostname,
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

          // console.log(stdout);
          //let myObject = JSON.parse(stdout);
          //console.log(myObject);

          //console.log('RECEIVED from HOST', response);
          //console.log(stdout.replace(/'/g, '"'));
          let psdata = JSON.parse(stdout.replace(/'/g, '"'));
          //console.log(psdata);
          let receivers = [];
          if (psdata.hasOwnProperty('receivers')) {
            try {
              //console.log(psdata.receivers);
              receivers = psdata.receivers; //JSON.parse(psdata.receivers);
              receivers.map((row, index) => {
                //console.log(row.CommandArgs);

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
                //console.log(row.CommandArgs);

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
              //console.log(qmanager);
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

          let newData = {
            hostname: props.hostname,
            psdata: psdata,
            receivers: receivers,
            processors: processors,
            qmanager: qmanager,
          };

          setstateData(newData);

          prepSummary(newData);
          console.log('HOST SUMMARY', newData);
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
  };

  React.useEffect(() => {
    console.log('USEEFFECT CALLED', props.hostname);
    refreshHostData();
  }, [props.hostname]);

  const prepSummary = (newData) => {
    let host_summary = [];

    host_summary = newData.processors.reduce((accumulator, currentValue) => {
      let found = false;
      for (let i = 0; i < accumulator.length; i++) {
        if (accumulator[i].queuekey == currentValue.QUEUE) {
          found = true;
          accumulator[i].processorCount += 1;
          accumulator[i].procesors.push(currentValue);
          break;
        }
      }
      if (!found) {
        let emptyRow = {
          queuekey: currentValue.QUEUE,
          campus: '',
          processorCount: 0,
          receiverCount: 0,
          qmanagerCount: 0,
          procesors: [],
          receivers: [],
          qmanagers: [],
        };
        switch (stateData.hostname) {
          case 'iasp1fo1':
          case 'iasp1ei1':
          case 'iasp2ei1':
          case 'cigadmr01':
          case 'iasp2ha1':
          case 'iasq1mr1':
          case 'iasq1mr2':
            emptyRow.campus = 'MCR';
            emptyRow.campusColor = 'deepskyblue';
            break;
          case 'iasp1mf1':
          case 'iasp1mf2':
          case 'iasq1mf1':
            emptyRow.campus = 'MCF';
            emptyRow.campusColor = 'darkturquoise';
            break;
          case 'iasp1ma1':
          case 'iasp1ma2':
          case 'iasq1ma1':
            emptyRow.campus = 'MCA';
            emptyRow.campusColor = 'darksalmon';
            break;
          default:
            emptyRow.campus = '';
            emptyRow.campusColor = 'lightgrey';
        }
        emptyRow.processorCount += 1;
        emptyRow.procesors.push(currentValue);
        accumulator.push(emptyRow);
      }
      return accumulator;
    }, host_summary);

    host_summary = newData.receivers.reduce((accumulator, currentValue) => {
      let found = false;
      for (let i = 0; i < accumulator.length; i++) {
        if (accumulator[i].queuekey == currentValue.QUEUE) {
          found = true;
          accumulator[i].receiverCount += 1;
          accumulator[i].receivers.push(currentValue);
          break;
        }
      }
      if (!found) {
        let emptyRow = {
          queuekey: currentValue.QUEUE,
          campus: '',
          processorCount: 0,
          receiverCount: 0,
          qmanagerCount: 0,
          procesors: [],
          receivers: [],
          qmanagers: [],
        };
        switch (stateData.hostname) {
          case 'iasp1fo1':
          case 'iasp1ei1':
          case 'iasp2ei1':
          case 'cigadmr01':
          case 'iasp2ha1':
          case 'iasq1mr1':
          case 'iasq1mr2':
            emptyRow.campus = 'MCR';
            emptyRow.campusColor = 'deepskyblue';
            break;
          case 'iasp1mf1':
          case 'iasp1mf2':
          case 'iasq1mf1':
            emptyRow.campus = 'MCF';
            emptyRow.campusColor = 'darkturquoise';
            break;
          case 'iasp1ma1':
          case 'iasp1ma2':
          case 'iasq1ma1':
            emptyRow.campus = 'MCA';
            emptyRow.campusColor = 'darksalmon';
            break;
          default:
            emptyRow.campus = '';
            emptyRow.campusColor = 'lightgrey';
        }
        emptyRow.receiverCount += 1;
        emptyRow.receivers.push(currentValue);
        accumulator.push(emptyRow);
      }
      return accumulator;
    }, host_summary);

    host_summary = newData.qmanager.reduce((accumulator, currentValue) => {
      let found = false;
      for (let i = 0; i < accumulator.length; i++) {
        if (accumulator[i].queuekey == currentValue.QUEUE) {
          found = true;
          accumulator[i].qmanagerCount += 1;
          accumulator[i].qmanagers.push(currentValue);
          break;
        }
      }
      if (!found) {
        let emptyRow = {
          queuekey: currentValue.QUEUE,
          campus: '',
          processorCount: 0,
          receiverCount: 0,
          qmanagerCount: 0,
          procesors: [],
          receivers: [],
          qmanagers: [],
        };
        switch (stateData.hostname) {
          case 'iasp1fo1':
          case 'iasp1ei1':
          case 'iasp2ei1':
          case 'cigadmr01':
          case 'iasp2ha1':
          case 'iasq1mr1':
          case 'iasq1mr2':
            emptyRow.campus = 'MCR';
            emptyRow.campusColor = 'deepskyblue';
            break;
          case 'iasp1mf1':
          case 'iasp1mf2':
          case 'iasq1mf1':
            emptyRow.campus = 'MCF';
            emptyRow.campusColor = 'darkturquoise';
            break;
          case 'iasp1ma1':
          case 'iasp1ma2':
          case 'iasq1ma1':
            emptyRow.campus = 'MCA';
            emptyRow.campusColor = 'darksalmon';
            break;
          default:
            emptyRow.campus = '';
            emptyRow.campusColor = 'lightgrey';
        }
        emptyRow.qmanagerCount += 1;
        emptyRow.qmanagers.push(currentValue);
        accumulator.push(emptyRow);
      }
      return accumulator;
    }, host_summary);

    sethostSummary(host_summary);
    console.log('Hostsummary set', hostSummary);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar
            aria-label="recipe"
            className={classes.avatar}
            style={{
              backgroundColor:
                hostSummary.length > 0
                  ? hostSummary[0].campusColor
                  : 'lightred',
            }}
          >
            {hostSummary.length > 0 ? hostSummary[0].campus[2] : ''}
          </Avatar>
        }
        action={
          <div>
            <IconButton aria-label="settings" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={(event) =>
                  handleCloseStopRecivers(event, stateData.hostname)
                }
              >
                Stop Receivers
              </MenuItem>
              <MenuItem
                onClick={(event) =>
                  handleCloseStopProcessors(event, stateData.hostname)
                }
              >
                Stop Processors
              </MenuItem>
              <MenuItem
                onClick={(event) =>
                  handleCloseStopQManager(event, stateData.hostname)
                }
              >
                Stop Q-Manager
              </MenuItem>
              <MenuItem
                onClick={(event) =>
                  handleCloseStartReceivers(event, stateData.hostname)
                }
              >
                Start Receivers
              </MenuItem>
              <MenuItem
                onClick={(event) =>
                  handleCloseStartProcessors(event, stateData.hostname)
                }
              >
                Start Processors
              </MenuItem>
              <MenuItem
                onClick={(event) =>
                  handleCloseStartQManager(event, stateData.hostname)
                }
              >
                Start Q-Manager
              </MenuItem>
            </Menu>
          </div>
        }
        title={stateData.hostname}
        subheader=""
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {hostSummary.map((row, index) => (
            <div style={{ display: 'block' }}>
              <span
                style={{
                  display: 'block',
                  fontWeight: 'bolder',
                  marginTop: '10px',
                }}
              >
                {' '}
                {row.campus}{' '}
                {row.queuekey ? row.queuekey.replace('queue=', '') : ''}{' '}
              </span>
              Processors {row.processorCount} <br />
              Receivers {row.receiverCount} <br />
              QManagers {row.qmanagerCount}
              <br />
            </div>
          ))}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={refreshHostData}>
          <RefreshIcon />
        </IconButton>
        <IconButton
          aria-label="share"
          onClick={() => onOpenSSH(stateData.hostname)}
        >
          <ComputerIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: stateData.expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={stateData.expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={stateData.expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <h1 style={{ background: 'lightblue' }}>{stateData.hostname}</h1>
          <h4 style={{ background: 'lightgray' }}>Queue Manager</h4>
          {stateData.qmanager.map((row, index) => (
            <p key={row.PID}>
              {' '}
              {row.args.queue} {row.QUEUE} PID {row.PID}
              {row.LOGDIR} CAMPUS {row.CAMPUS}
            </p>
          ))}
          <h4 style={{ background: 'lightgreen' }}>RECEIVERS</h4>
          {stateData.receivers
            .sort((a, b) => {
              //return a.processorid - b.processorid;
              return (
                '' +
                a.args.queue +
                ('0' + a.PID).slice(-2)
              ).localeCompare('' + b.args.queue + ('0' + b.PID).slice(-2));
            })
            .map((row, index) => (
              <p
                key={row.PID}
                data-bs-toggle="tooltip"
                data-bs-html="true"
                title={`" ${row.PID}  ${row.LOGDIR}  ${row.AET}  ${row.port}  ${row.IP} "`}
              >
                {row.args.queue} {row.PORT}
              </p>
            ))}
          <h4 style={{ background: 'orange' }}>PROCESSORS</h4>
          {stateData.processors
            .sort((a, b) => {
              //return a.processorid - b.processorid;
              return (
                1000 * a.PRIORITY +
                100 * a.SERIAL -
                (1000 * b.PRIORITY + 100 * b.SERIAL)
              );
            })
            .map((row, index) => (
              <p
                key={row.PID}
                data-bs-toggle="tooltip"
                data-bs-html="true"
                title={`" ${row.PID}  ${row.LOGDIR} "`}
              >
                {row.args.queue} Priority => {row.PRIORITY} Serial =>{' '}
                {row.SERIAL}
              </p>
            ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default CigaHost;
