/* eslint-disable @typescript-eslint/no-require-imports, no-undef */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setFullscreen: (flag) => ipcRenderer.send('set-fullscreen', flag),
  getFullscreen: () => ipcRenderer.invoke('get-fullscreen'),
});
