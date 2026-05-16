import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 640,
    fullscreen: false,
    useContentSize: true,
    resizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false, // false as default in new versions
    },
  });

  // join is safer
  win.loadFile(path.join(__dirname, 'build/index.html'));
}

app.whenReady().then(() => {
  createWindow();

  // macOS re-create the window if clicked on doc
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // macOS leaves the app in tray
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
