const { app, BrowserWindow, remote, ipcMain } = require('electron');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ 
        width: 790, 
        height: 620, 
        titleBarStyle: 'hidden', 
        frame: true, 
        icon: __dirname + '/favicon.ico',
        webPreferences: {
            devTools: true
        }
    });
    mainWindow.loadURL(`file://${__dirname}/public/home.html`);
    mainWindow.setMenuBarVisibility(false)
    mainWindow.on('closed', () => {
        
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

app.on('ready', () => {
    createWindow();
    handleSubmission();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
