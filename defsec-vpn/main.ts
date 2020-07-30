import { app, Tray, screen } from 'electron';
import { BrowserWindow } from 'electron-acrylic-window';
import * as path from 'path';
import * as url from 'url';

let win = null;
let tray: Tray = null;

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: 300,
    height: 500,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    vibrancy: 'dark',
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
    },
  });

  if (serve) {

    //win.webContents.openDevTools();

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');

  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is ready to be shown.
  win.on('ready-to-show', () => {
    showWindow()
  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null;
  });

  // Emitted when the window is no longer focussed.
  win.on('blur', () => {
    if (!win.webContents.isDevToolsOpened()) {
      win.hide();
    }
  });

  return win;
}

function createTray(): Tray {
  tray = new Tray(path.join('src', 'assets', 'icons', 'vpn', 'offline.png'));
  tray.on('click', function (event) {
      toggleWindow();
  })

  return tray;
}

const toggleWindow = () => {
  win.isVisible() ? win.hide() : showWindow();
}

const showWindow = () => {
  const position = getWindowPosition();
  win.setPosition(position.x, position.y, false);
  win.show();
}

const getWindowPosition = () => {
  const windowBounds = win.getBounds();
  const trayBounds = tray.getBounds();
  
  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))
  const y = Math.round(trayBounds.y - windowBounds.height)
  return {x: x, y: y}
}

try {

  app.allowRendererProcessReuse = true;

  app.on('ready', () => {
    setTimeout(() => {
      createWindow();
      createTray();
    }, 400);
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  throw e;
}
