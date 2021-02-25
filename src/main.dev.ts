/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  dialog,
  BrowserView,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
const { exec } = require('child_process');
var history = require('connect-history-api-fallback');

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let patientWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

// const installExtensions = async () => {
//   const installer = require('electron-devtools-installer');
//   const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
//   const extensions = ['REACT_DEVELOPER_TOOLS'];

//   return installer
//     .default(
//       extensions.map((name) => installer[name]),
//       forceDownload
//     )
//     .catch(console.log);
// };

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    //await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../resources');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: true,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
    },
  });

  patientWindow = new BrowserWindow({
    show: true,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
    },
  });

  console.log(`file://${__dirname}/index.html`);
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  patientWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.webContents.openDevTools();

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow, patientWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();

  //twoViews(mainWindow);

  // let view1 = new BrowserView({
  //   webPreferences: {
  //     nodeIntegration: true,
  //   },
  // });

  // view1.setBounds({ x: 120, y: 150, width: 300, height: 300 });
  // view1.webContents.loadURL(`file://${__dirname}/index.html`);

  // mainWindow.setBrowserView(view1);

  // let view2 = new BrowserView({
  //   webPreferences: {
  //     nodeIntegration: true,
  //   },
  // });

  // view2.setBounds({ x: 230, y: 300, width: 300, height: 300 });
  // view2.webContents.loadURL(`file://${__dirname}/index.html`);

  // mainWindow.setBrowserView(view2);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');

app.whenReady().then(createWindow).catch(console.log);

app.on('ready', () => {
  console.log('Ready', history({ index: 'index.html' }));
});

const twoViews = (topwindow) => {
  //const win = new BrowserWindow({ width: 800, height: 600 })

  let view1 = new BrowserView({
    webPreferences: {
      nodeIntegration: true,
    },
  });

  let view2 = new BrowserView({
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // mainWindow.setBrowserView(view1);
  // mainWindow.setBrowserView(view2);
  view1.setBounds({ x: 10, y: 10, width: 300, height: 300 });
  view1.webContents.loadURL(`file://${__dirname}/index.html`);

  view2.setBounds({ x: 40, y: 60, width: 200, height: 500 });
  view2.webContents.loadURL(`file://${__dirname}/index.html`);

  console.log('Two browser views created');
  topwindow.setBrowserView(view1);
  topwindow.setBrowserView(view2);
};

//app.whenReady().then(twoViews);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

// ipcMain.on('show-open-dialog', (event, arg)=> {

//   const options = {
//       //title: 'Open a file or folder',
//       //defaultPath: '/path/to/something/',
//       //buttonLabel: 'Do it',
//       /*filters: [
//         { name: 'xml', extensions: ['xml'] }
//       ],*/
//       //properties: ['showHiddenFiles'],
//       //message: 'This message will only be shown on macOS'
//     };

//     dialog.showOpenDialog({
//       properties: ['openDirectory']
//    }).then((data) => {
//       console.log(data.filePaths);
//       return data.filePaths;
//    });

// })

ipcMain.on('runCommand', async (event, arg) => {
  event.returnValue = await runCommand(arg);
});

ipcMain.on('open-file-dialog', function (event) {
  dialog
    .showOpenDialog({
      properties: ['openDirectory'],
    })
    .then((data) => {
      //console.log(data.filePaths);
      console.log('Ready to send selected-file', data.filePaths);
      if (data.filePaths) event.sender.send('selected-file', data.filePaths);
    });
});

ipcMain.on('open-elq-dialog', function (event) {
  dialog
    .showOpenDialog({
      properties: ['openDirectory'],
    })
    .then((data) => {
      //console.log(data.filePaths);
      console.log(
        'Ready to Generate ELQ File and Open in QREADS. selected-folder : ',
        data.filePaths
      );

      cli_exec_qreads(data.filePaths);
      //if (data.filePaths) event.sender.send('selected-file', data.filePaths)
    });
});

// CIGA_MCR_ORDSTG@10.128.232.151:6109
// CIGA_MCR_ORDSTG@10.128.232.152:6109

//  CIGA_MCR_ORDSTG@10.128.232.147:6109

export const cli_send2ciga = (folderpath) => {
  //let logStream = fs.createWriteStream('./logFile.log', {flags: 'a'});
  let mesg = '';
  console.log(
    'C:\\Programs\\dcm4che\\bin\\storescu -b TEAM_SCU -c CIGA_MCR_ORDSTG@10.128.232.152:6109   ' +
      folderpath
  );
  try {
    exec(
      'C:\\Programs\\dcm4che\\bin\\storescu -b TEAM_SCU -c CIGA_MCR_ORDSTG@10.128.232.152:6109  ' +
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

ipcMain.on('open-file-dialog-send2ciga', function (event) {
  dialog
    .showOpenDialog({
      properties: ['openDirectory'],
    })
    .then((data) => {
      //console.log(data.filePaths);
      console.log(
        'Ready to Generate ELQ File and Open in QREADS. selected-folder : ',
        data.filePaths
      );

      cli_send2ciga(data.filePaths);
      //if (data.filePaths) event.sender.send('selected-file', data.filePaths)
    });
});

//     properties: ['openFile']

export const cli_exec_qreads = (folderpath) => {
  console.log('JS to run qreads: ', folderpath);
  let mesg = '';
  console.log(
    '"api/venv/Scripts/python" api/qr_util.py -cmd parse -a ' + folderpath
  );
  try {
    exec(
      '"api/venv/Scripts/python" api/qr_util.py -cmd parse -a ' + folderpath,
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

// function openAboutWindow() {
//   if (newWindow) {
//     newWindow.focus()
//     return
//   }

//   newWindow = new BrowserWindow({
//     height: 185,
//     resizable: false,
//     width: 270,
//     title: '',
//     minimizable: false,
//     fullscreenable: false
//   })

//   newWindow.loadURL('file://' + __dirname + '/views/about.html')

//   newWindow.on('closed', function() {
//     newWindow = null
//   })
// }
