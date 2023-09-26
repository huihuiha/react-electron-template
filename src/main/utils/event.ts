import { on } from './ipc';
import { BrowserWindow } from 'electron';

/**
 * 窗口最大化
 */
on('maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)!;
  win.setPosition(0, 0);

  if (process.platform !== 'darwin') {
    win.maximize();
  } else {
    win.setFullScreen(true);
  }
});

/**
 * 关闭窗口
 */
on('closeWindow', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.close();
});

on('message', (event, args) => {
  console.log(args, '======');
});