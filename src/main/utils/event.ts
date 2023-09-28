import { on } from './ipc';
import { BrowserWindow, screen } from 'electron';
import { width as windowWidth, height as windowHeight } from './window';

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

function setCenter(window: BrowserWindow) {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const x = Math.floor((width - windowWidth) / 2); // 计算窗口的水平位置
  const y = Math.floor((height - windowHeight) / 2); // 计算窗口的垂直位置

  window.setPosition(x, y);
}

/**
 * 窗口回到登录的时候大小
 */
on('initWindow', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)!;
  setCenter(window);
  window.setSize(windowWidth, windowHeight);
});
