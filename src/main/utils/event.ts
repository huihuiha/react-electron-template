import { on, handle } from './ipc';
import { BrowserWindow } from 'electron';

on('message', (event, args) => {});

handle('message', (event, args) => {});

on('maximize', (event) => {
  console.log('=====');
  BrowserWindow.fromWebContents(event.sender)?.maximize();
});
