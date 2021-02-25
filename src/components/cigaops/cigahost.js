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
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const { exec } = require('child_process');

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
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

  const classes = useStyles();

  const handleExpandClick = () => {
    console.log('before', stateData);
    setstateData({ ...stateData, expanded: !stateData.expanded });
    console.log('After', stateData);
  };

  React.useEffect(() => {
    console.log('USEEFFECT CALLED', props.hostname);
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

          setstateData({
            hostname: props.hostname,
            psdata: psdata,
            receivers: receivers,
            processors: processors,
            qmanager: qmanager,
          });
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
  }, [props.hostname]);

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={stateData.hostname}
        subheader="September 14, 2016"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {stateData.qmanager.map((row, index) => (
            <span>
              <Avatar
                key={row.PID}
                aria-label="recipe"
                className={classes.avatar}
              >
                M
              </Avatar>
              {row.QUEUE}
            </span>
          ))}

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
              <span>
                <Avatar
                  key={row.PID}
                  aria-label="recipe"
                  className={classes.avatar}
                >
                  R
                </Avatar>
                {row.QUEUE}
              </span>
            ))}

          {stateData.processors
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
              <span>
                <Avatar
                  key={row.PID}
                  aria-label="recipe"
                  className={classes.avatar}
                >
                  P
                </Avatar>
                {row.QUEUE}
              </span>
            ))}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
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
              <p key={row.PID}>
                {row.args.queue} PID {row.PID} {row.LOGDIR} {row.args.directory}{' '}
                {row.AET} {row.port} {row.IP} {row.PORT}
                Elapsed {row.ELAPSED}
              </p>
            ))}
          <h4 style={{ background: 'orange' }}>PROCESSORS</h4>
          {stateData.processors
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
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default CigaHost;
