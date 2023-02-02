const { app, BrowserWindow, webContents, ipcMain } = require("electron");
const fs = require("fs");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 780,
    height: 635,
    titleBarStyle: "hidden",
    frame: true,
    icon: __dirname + "/favicon.ico",
    webPreferences: {
      devTools: true,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/public/home.html`);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  ipcMain.on('database', (event, write) => {
    fs.writeFileSync("database.json", JSON.stringify(write));
  });

}

function handleSubmission() {
  ipcMain.on("did-submit-form", (event) => {});
}

app.on("ready", () => {
  createWindow();
  handleSubmission();
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
