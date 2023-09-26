import { app } from 'electron';
import { createWindow } from './utils/window';
import './utils/shell';

app
  .whenReady()
  .then(() => {
    const mainWindow = createWindow();

    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });

    import('./utils/event');
  })
  .catch(console.log);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
