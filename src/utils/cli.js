const { exec } = require('child_process');
const { dialog } = require('electron');
var fs = require('fs');

//

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

export const selectFiles = () => {
  const options = {
    //title: 'Open a file or folder',
    //defaultPath: '/path/to/something/',
    //buttonLabel: 'Do it',
    /*filters: [
        { name: 'xml', extensions: ['xml'] }
      ],*/
    //properties: ['showHiddenFiles'],
    //message: 'This message will only be shown on macOS'
  };

  dialog
    .showOpenDialog({
      properties: ['openDirectory'],
    })
    .then((data) => {
      console.log(data.filePaths);
      return data.filePaths;
    });
};

export const cli_viewdicom_file = (filename) => {
  //let logStream = fs.createWriteStream('./logFile.log', {flags: 'a'});
  let mesg = '';
  console.log('C:\\Programs\\microdicom\\mDicom.exe  ' + filename);
  try {
    exec(
      'C:\\Programs\\microdicom\\mDicom.exe ' + filename,
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
        //console.log(stdout);
        //retfunc(stdout);
        //retfunc ((JSON.stringify(stdout)));
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//  SLK_CIGA_MCR_ORD@172.24.110.220:6200
// -b Compass -c CIGA_MCR_ORD_EV@cigaint:6200
// preintg  CIGA_MCR_ORDSTG@10.128.232.147:6109

// CIGA_MCR_ORDSTG@10.128.232.151:6109
// CIGA_MCR_ORDSTG@10.128.232.152:6109

// SLK_CIGA_MCR_ORD@172.24.110.220:6200

export const cli_sendtociga_folder = (folderpath) => {
  //let logStream = fs.createWriteStream('./logFile.log', {flags: 'a'});
  let mesg = '';
  console.log(
    'C:\\Programs\\dcm4che\\bin\\storescu -b TEAM_SCU -c CIGA_MCR_ORDSTG@10.128.232.152:6109  ' +
      folderpath
  );
  try {
    exec(
      'C:\\Programs\\dcm4che\\bin\\storescu -b TEAM_SCU -c CIGA_MCR_ORDSTG@10.128.232.152:6109 ' +
        folderpath,
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

export const cli_getdicom_meta = (retfunc, filename) => {
  console.log(
    'JS: ',
    filename,
    '"api/venv/Scripts/python" api/dicom.py -cmd parse -a ' + filename
  );

  //let logStream = fs.createWriteStream('./logFile.log', {flags: 'a'});
  let mesg = '';
  try {
    exec(
      '"api/venv/Scripts/python" api/dicom.py -cmd parse -a ' + filename,
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
        //console.log(stdout);
        retfunc(stdout);
        //retfunc ((JSON.stringify(stdout)));
      }
    );
  } catch (error) {
    console.log(error);
  }
};
