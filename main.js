import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';

const onSecondInstance = () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
};

const onSetFullscreen = (_event, flag) => {
  if (mainWindow) {
    mainWindow.setFullScreen(Boolean(flag));
  }
};

const onGetFullscreen = () => {
  return mainWindow ? mainWindow.isFullScreen() : false;
};

const onActivate = () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
};

const onWindowAllClosed = () => {
  // macOS leaves the app in tray
  if (process.platform !== 'darwin') {
    app.quit();
  }
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mainWindow = null;

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', onSecondInstance);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 640,
    fullscreen: false,
    useContentSize: true,
    resizable: false, // do not allow to resize the window
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'favicon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false, // false as default in new versions
      preload: path.join(__dirname, 'preload.cjs'), // For Electron's FullScreen mode
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.webContents.once('did-finish-load', async () => {
    try {
      const raw = await mainWindow.webContents.executeJavaScript(
        `localStorage.getItem('embercrest-rising-settings')`
      );
      if (raw) {
        const settings = JSON.parse(raw);
        if (settings.fullscreen) {
          mainWindow.setFullScreen(true);
        }
      }
    } catch {
      // Just ignore it
    }
  });

  mainWindow.once('closed', () => {
    mainWindow = null;
  });

  // join is safer
  mainWindow.loadFile(path.join(__dirname, 'build/index.html'));
}

app.whenReady().then(() => {
  ipcMain.on('set-fullscreen', onSetFullscreen);
  ipcMain.handle('get-fullscreen', onGetFullscreen);
  createWindow();
  // macOS re-create the window if clicked on doc
  app.on('activate', onActivate);
});

app.on('window-all-closed', onWindowAllClosed);

app.once('will-quit', () => {
  app.off('second-instance', onSecondInstance);
  app.off('activate', onActivate);
  app.off('window-all-closed', onWindowAllClosed);

  ipcMain.off('set-fullscreen', onSetFullscreen);
  ipcMain.removeHandler('get-fullscreen');
});
