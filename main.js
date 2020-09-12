const { app, BrowserWindow, remote, ipcMain } = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ 
        width: 790, 
        height: 620, 
        titleBarStyle: 'hidden', 
        frame: true, 
        icon: __dirname + '/favicon.ico',
        webPreferences: {
            devTools: false
        }
    });
    mainWindow.loadURL(`file://${__dirname}/sources/home.html`);
    mainWindow.setMenuBarVisibility(false)
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('did-finish-load');
    });
}

function handleSubmission() {
    ipcMain.on('did-submit-form', (event) => {
       
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow();
    handleSubmission();
});

app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
