import { on } from './ipc';
import { BrowserWindow, screen } from 'electron';

/**
 * 窗口最大化
 */
on('maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)!;

  if (process.platform !== 'darwin') {
    win.maximize();
  } else {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    win.setPosition(0, 0);
    win.setBounds({
      width,
      height,
    });
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
