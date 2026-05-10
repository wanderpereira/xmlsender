const { contextBridge, ipcRenderer } = require('electron');

// Expose secure APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  saveDatabase: (data) => ipcRenderer.invoke('database:save', data),
  
  // Email operations
  sendEmail: (emailData) => ipcRenderer.invoke('email:send', emailData),

  // File operations
  selectFile: () => ipcRenderer.invoke('file:select'),
  selectFolder: () => ipcRenderer.invoke('folder:select'),

  // Settings
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),

  // Listen for events
  onEmailProgress: (callback) => ipcRenderer.on('email:progress', callback),
  onError: (callback) => ipcRenderer.on('error', callback),
});
