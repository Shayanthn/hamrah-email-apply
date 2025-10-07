const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    title: 'همراه ایمیل اپلای',
    show: false,
    titleBarStyle: 'default'
  });

  // Load the app
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Focus on the window
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers
ipcMain.handle('app-version', () => {
  return app.getVersion();
});

// Menu template (Persian RTL)
const menuTemplate = [
  {
    label: 'فایل',
    submenu: [
      {
        label: 'باز کردن',
        accelerator: 'CmdOrCtrl+O'
      },
      {
        label: 'ذخیره',
        accelerator: 'CmdOrCtrl+S'
      },
      { type: 'separator' },
      {
        label: 'خروج',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
        click: () => {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'ویرایش',
    submenu: [
      { label: 'بازگردانی', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
      { label: 'تکرار', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
      { type: 'separator' },
      { label: 'برش', accelerator: 'CmdOrCtrl+X', role: 'cut' },
      { label: 'کپی', accelerator: 'CmdOrCtrl+C', role: 'copy' },
      { label: 'چسباندن', accelerator: 'CmdOrCtrl+V', role: 'paste' }
    ]
  },
  {
    label: 'نمایش',
    submenu: [
      { label: 'بارگذاری مجدد', accelerator: 'CmdOrCtrl+R', role: 'reload' },
      { label: 'بارگذاری کامل', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
      { label: 'ابزار توسعه‌دهنده', accelerator: 'F12', role: 'toggleDevTools' },
      { type: 'separator' },
      { label: 'زوم واقعی', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
      { label: 'بزرگ‌نمایی', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
      { label: 'کوچک‌نمایی', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
      { type: 'separator' },
      { label: 'تمام‌صفحه', accelerator: 'F11', role: 'togglefullscreen' }
    ]
  },
  {
    label: 'درباره',
    submenu: [
      {
        label: 'درباره همراه ایمیل اپلای',
        click: () => {
          shell.openExternal('https://github.com/Shayanthn/hamrah-email-apply');
        }
      }
    ]
  }
];

// Set menu
Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));