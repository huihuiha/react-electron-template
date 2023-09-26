import { on, handle } from './ipc';
import { BrowserWindow } from 'electron';

on('message', (event, args) => {});

handle('message', (event, args) => {});

on('maximize', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.maximize();
});

on('closeWindow', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.close();
});
