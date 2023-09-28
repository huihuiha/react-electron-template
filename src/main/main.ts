import { app, session } from 'electron';
import { createWindow } from './utils/window';
import './utils/shell';

app
  .whenReady()
  .then(async () => {
    const mainWindow = await createWindow();

    app.on('activate', () => {
      if (mainWindow === null) {
        createWindow();
      } else {
        mainWindow.show();
      }
    });

    // 设置 CSP
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy':
            'script-src https://static.geetest.com/static/js/gt.0.4.9.js *',
        },
      });
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
