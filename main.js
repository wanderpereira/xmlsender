const { app, BrowserWindow, webContents, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  const mainWindowOptions = {
    width: 780,
    height: 635,
    titleBarStyle: "hidden",
    frame: true,
    icon: path.join(__dirname, "favicon.ico"),
    webPreferences: {
      devTools: isDev ? true : false,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  };

  mainWindow = new BrowserWindow(mainWindowOptions);
  const startUrl = `file://${path.join(__dirname, '/public/home.html')}`;
  mainWindow.loadURL(startUrl);
  mainWindow.setMenuBarVisibility(false);
  
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // IPC Handler para salvar banco de dados com validação
  ipcMain.handle('database:save', (event, data) => {
    try {
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid database format');
      }
      const dbPath = path.join(app.getPath('userData'), 'database.json');
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      return { success: true, message: 'Database saved successfully' };
    } catch (error) {
      console.error('Error saving database:', error);
      return { success: false, error: error.message };
    }
  });

}

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
