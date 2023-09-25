import { app } from 'electron';

import { createWindow } from './utils/window';

import './utils/shell';
import './utils/ipc';

app
  .whenReady()
  .then(() => {
    const mainWindow = createWindow();

    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
