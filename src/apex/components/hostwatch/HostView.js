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

import { cli_quser_cmd } from './hostData';

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

const HostView = (props) => {
  const [stateData, setstateData] = React.useState({
    hostname: props.hostname,
    connections: [],
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
    cli_quser_cmd("192.168.1.20");
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
  let hostname = stateData.hostname;
  try {
    exec(
      'quser.exe /SERVER:' + stateData.hostname + " | ForEach-Object -Process { $_ -replace '\\s{2,}',',' } " ,
      { shell:'powershell.exe',
      maxBuffer: 1024 * 50000 },
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
        //console.log(stdout);
        let strArr = [];
        stdout.split("\n").reduce((acc, line)=>{
          let csvLineArr = line.split(",");
          console.log(csvLineArr[1]);

          if (csvLineArr.length > 1 ) {

            if (csvLineArr[2] === "ID" ) return acc;

            if (csvLineArr.length == 5) {
              csvLineArr.splice(1, 0, '')
            }

            let rowJson = {
              hostname: hostname,
              username : csvLineArr[0],
              sessionname : csvLineArr[1],
              sessionid: csvLineArr[2],
              state: csvLineArr[3],
              idletime: csvLineArr[4],
              logontime: csvLineArr[5]
            }
            acc.push(rowJson);;
          }

          return acc;
              
          
        }, strArr);

        console.log(strArr);

        setstateData({...stateData, 'connections' : strArr });

      }
    );
  } catch (error) {
    console.log(error);
  }
  };

  React.useEffect(() => {
    console.log('USEEFFECT CALLED', props.hostname);
    refreshHostData();
  }, [props.hostname]);


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
          </div>
        }
        title={stateData.hostname}
        subheader=""
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {stateData.connections.map((row, index) => (
            <div style={{ display: 'block' }}>
              <p key={row.sessionid}>  {row.username} {row.state} <br/>  </p>
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
          <h4 style={{ background: 'lightgray' }}>Active</h4>
          {stateData.connections.map((row, index) => (
            <p key={row.sessionid}>
              {' '}
              {row.username} {row.state} PID {row.idletime}
              {row.logontime} 
            </p>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default HostView;
