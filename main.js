const electron = require("electron"),
  app = electron.app,
  BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1024,
    height: 768,
	icon: __dirname + 'app/public/images/logo2.png'
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  //brownsermainWindowmainWindow.webContents.openDevTools();
  mainWindow.on('close', () => {
    mainWindow.webContents.send('stop-server');
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);
app.on("browser-window-created", function (e, window) {
  window.setMenu(null);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
