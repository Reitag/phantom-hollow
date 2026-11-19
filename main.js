import { app, BrowserWindow, shell } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mainWindow = null;

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 640,
    fullscreen: false,
    useContentSize: true,
    resizable: true,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'favicon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false, // false as default in new versions
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // join is safer
  mainWindow.loadFile(path.join(__dirname, 'build/index.html'));
}

const onActivate = () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
};

const onWindowAllClosed = () => {
  // macOS leaves the app in tray
  if (process.platform !== 'darwin') {
    app.quit();
  }
};

app.whenReady().then(() => {
  createWindow();

  // macOS re-create the window if clicked on doc
  app.on('activate', onActivate);
});

app.on('window-all-closed', onWindowAllClosed);

app.once('will-quit', () => {
  app.off('activate', onActivate);
  app.off('window-all-closed', onWindowAllClosed);
});
