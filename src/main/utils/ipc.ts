import { SendMap } from '@main/type/event';
import { IpcMainEvent, IpcMainInvokeEvent, ipcMain } from 'electron';

/**
 * 主进程监听预加载脚本
 */
export function on<T extends keyof SendMap>(
  channel: T,
  func: (event: IpcMainEvent, args: SendMap[T]['sendMsg']) => void,
) {
  ipcMain.on(channel, (event, arg) => {
    return func(event, arg);
  });
}

/**
 * 主进程监听预加载脚本（能够响应）
 */
export function handle<T extends keyof SendMap>(
  channel: T,
  func: (event: IpcMainInvokeEvent, args: SendMap[T]['sendMsg']) => void,
) {
  ipcMain.handle(channel, (event, arg) => {
    return func(event, arg);
  });
}
