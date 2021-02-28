const { exec } = require('child_process');
var fs = require('fs');

//

export const rundbsql = (dbserver, sqltext, callbackfn ) => {
  let mesg = '';
  console.log('Gett log file for host: ' + hostname);
  try {
    exec(
      '"api/venv/Scripts/python" api/dbutil.py -cmd runsql -sql' +
      sqltext,
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
        //retfunc ((JSON.stringify(stdout)));
      }
    );
  } catch (error) {
    console.log(error);
  }
};


export const cli = () => {
  try {
    console.log('Called command');
    const { spawn } = require('child_process');
    const ls = spawn('ls', ['-lh', '/usr']);

    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  } catch (error) {
    console.log(error);
  }
};

//tasklist.exe /s

// exec("c:\\programs\\SysinternalsSuite\\psexec \\\\R0303393 netstat -a > ./logFile.log", (error, stdout, stderr) => {
//  exec("tasklist.exe /s \\\\R0303393  > ./logtlFile.log", (error, stdout, stderr) => {
// CW/incub/qr-oncall-tools/"api/venv/Scripts/python"
// \\R0303393\c$\Program Files\Mayo Foundation\QREADS Web Service\appbase\logs

export const cli_logfile = (hostname) => {
  //let logStream = fs.createWriteStream('./logFile.log', {flags: 'a'});
  let mesg = '';
  console.log('Gett log file for host: ' + hostname);
  try {
    exec(
      '"api/venv/Scripts/python" api/localapp.py -cmd logfile -host ' +
        hostname,
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
        //retfunc ((JSON.stringify(stdout)));
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const cli_showfile = (filepath) => {
  //let logStream = fs.createWriteStream('./logFile.log', {flags: 'a'});
  let mesg = '';
  console.log('Show file : ' + filepath);
  try {
    exec(
      '"src/api/venv/Scripts/python" src/api/localapp.py -cmd showfile -host ' +
      filepath,
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
        //retfunc ((JSON.stringify(stdout)));
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const cli_wslogfile = (hostname) => {
  //let logStream = fs.createWriteStream('./logFile.log', {flags: 'a'});
  let mesg = '';
  console.log('Gett log file for host: ' + hostname);
  try {
    exec(
      '"api/venv/Scripts/python" api/localapp.py -cmd wslogfile -host ' +
        hostname,
        { maxBuffer: 1024 * 5000 },
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
        //retfunc ((JSON.stringify(stdout)));
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const cli_wksadmlogfolder = (hostname) => {
  //let logStream = fs.createWriteStream('./logFile.log', {flags: 'a'});
  let mesg = '';
  console.log('Gett log file for host: ' + hostname);
  try {
    exec(
      '"api/venv/Scripts/python" api/localapp.py -cmd wksadmlogfolder -host ' +
        hostname,
        { maxBuffer: 1024 * 5000 },
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
        //retfunc ((JSON.stringify(stdout)));
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const cli_wslogfolder = (hostname) => {
  //let logStream = fs.createWriteStream('./logFile.log', {flags: 'a'});
  let mesg = '';
  console.log('Gett log file for host: ' + hostname);
  try {
    exec(
      '"api/venv/Scripts/python" api/localapp.py -cmd wslogfolder -host ' +
        hostname,
        { maxBuffer: 1024 * 5000 },
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
        //retfunc ((JSON.stringify(stdout)));
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const cli_logfolder = (hostname) => {
  //let logStream = fs.createWriteStream('./logFile.log', {flags: 'a'});
  let mesg = '';
  console.log('Gett log file for host: ' + hostname);
  try {
    exec(
      '"api/venv/Scripts/python" api/localapp.py -cmd logfolder -host ' +
        hostname,
        { maxBuffer: 1024 * 5000 },
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
        //retfunc ((JSON.stringify(stdout)));
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const cli_consolidated_log = (retfunc, hostname) => {
  //let logStream = fs.createWriteStream('./logFile.log', {flags: 'a'});
  let mesg = '';
  try {
    exec(
      '"api/venv/Scripts/python" api/parselogpy.py -cmd consolog -host ' +
        hostname,
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
        retfunc(stdout);
        //retfunc ((JSON.stringify(stdout)));
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const cli_tasklist = (retfunc, hostname) => {
  //let logStream = fs.createWriteStream('./logFile.log', {flags: 'a'});
  let mesg = '';
  try {
    exec(
      '"api/venv/Scripts/python" api/localapp.py -cmd tasklist -host ' +
        hostname,
        { maxBuffer: 1024 * 5000 },
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
        retfunc(stdout);
        //retfunc ((JSON.stringify(stdout)));
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const cli_tasklist2 = () => {
  //let logStream = fs.createWriteStream('./logFile.log', {flags: 'a'});
  let mesg = '';
  try {
    exec(
      'cmd c c:\\programs\\SysinternalsSuite\\psexec \\\\R0303393 netstat -a > ./logFile.log',
      { maxBuffer: 1024 * 5000 },
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const cli_tasklist0 = () => {
  let logStream = fs.createWriteStream('./logFile.log', { flags: 'a' });
  let mesg = '';
  try {
    console.log('Called command');
    const { spawn } = require('child_process');
    const ls = spawn('c:\\programs\\SysinternalsSuite\\psexec', [
      '\\\\r0303393.mayo.edu',
      'netstat',
      '-a',
      ' >./logFile.log',
    ]);

    ls.stdout.pipe(logStream);
    ls.stderr.pipe(logStream);

    //  ls.stdout.on('data', (data) => {
    //    mesg = mesg +  `${data}`;
    //    console.log(`stdout: ${data} \n`);
    //  });

    //  ls.stderr.on('data', (data) => {
    //    console.error(`stderr: ${data} \n`);
    //  });

    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      console.log(mesg);
    });
  } catch (error) {
    console.log(error);
  }
};
