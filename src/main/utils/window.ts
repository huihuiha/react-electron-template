import { app, BrowserWindow, shell } from 'electron';
import path from 'path';
import { resolveHtmlPath } from '.';
import { AppUpdater, installExtensions, isDebug } from './install';

export const createWindow = async () => {
  let mainWindow: BrowserWindow | null = null;

  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 450,
    height: 600,
    // 去掉标题
    frame: false,
    icon: getAssetPath('icon.png'),
    resizable: false,
    // 加载预脚本
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, '../preload.js')
        : path.join(__dirname, '../../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 设置打开的url在浏览器中打开
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  new AppUpdater();
};
