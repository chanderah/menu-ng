const { app, BrowserWindow } = require('electron');
const path = require('path');

// require('electron-reload')(__dirname, {
//   electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
// });

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    maximizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
    },
  });

  win.webContents.openDevTools();
  const url = 'http://localhost:4200/login';
  win.loadURL(url);
}

app.whenReady().then(() => {
  createWindow();
});
