import { SendChannels, SendMap } from '@main/type/ipc';
import { IpcMainEvent, IpcMainInvokeEvent, ipcMain } from 'electron';

export function on<T extends SendChannels>(
  channel: T,
  func: (event: IpcMainEvent, args: SendMap[T]['sendMsg']) => void,
) {
  ipcMain.on(channel, (event, arg) => {
    return func(event, arg);
  });
}

export function handle<T extends SendChannels>(
  channel: T,
  func: (event: IpcMainInvokeEvent, args: SendMap[T]['sendMsg']) => void,
) {
  ipcMain.handle(channel, (event, arg) => {
    return func(event, arg);
  });
}
