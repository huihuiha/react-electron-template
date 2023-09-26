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

    // 处理主进程监听到的事件
    import('./utils/event');
  })
  .catch(console.log);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
