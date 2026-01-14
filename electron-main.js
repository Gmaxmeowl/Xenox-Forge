
const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1366,
    height: 768,
    minWidth: 1024,
    minHeight: 600,
    backgroundColor: '#020617',
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  win.setMenuBarVisibility(false);
  
  // Загружаем основной файл
  win.loadFile(path.join(__dirname, 'index.html'));

  win.once('ready-to-show', () => {
    win.show();
    // win.webContents.openDevTools(); 
  });
}

app.whenReady().then(async () => {
  // Очищаем старые данные сессии, чтобы IndexedDB работала "с чистого листа" в новом билде
  await session.defaultSession.clearStorageData({
    storages: ['localstorage']
  });
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
