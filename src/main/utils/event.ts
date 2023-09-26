import { on } from './ipc';
import { BrowserWindow } from 'electron';

on('maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)!;
  win.setPosition(0, 0);

  if (process.platform !== 'darwin') {
    win.maximize();
  } else {
    win.setFullScreen(true);
  }
});

on('closeWindow', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.close();
});
