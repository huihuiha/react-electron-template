import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { SendChannels, SendMap, OnChannels, OnMap } from './type/ipc';

/**
 * ipc 通信模块
 */
const ipcRendererHandle = {
  send<Name extends SendChannels>(
    channel: Name,
    args: SendMap[Name]['sendMsg'],
  ) {
    ipcRenderer.send(channel, args);
  },

  // 双信通信
  invoke<Name extends SendChannels>(
    channel: Name,
    args: SendMap[Name]['sendMsg'],
  ): Promise<SendMap[Name]['return']> {
    return ipcRenderer.invoke(channel, args) as Promise<
      SendMap[Name]['return']
    >;
  },

  on<T extends OnChannels>(
    channel: T,
    func: (args: OnMap[T]['receiveArg']) => void,
  ) {
    const subscription = (
      _event: IpcRendererEvent,
      args: OnMap[OnChannels]['receiveArg'],
    ) => func(args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },

  once<T extends OnChannels>(
    channel: T,
    func: (args: OnMap[T]['receiveArg']) => void,
  ) {
    ipcRenderer.once(channel, (_event, args: OnMap[T]['receiveArg']) =>
      func(args),
    );
  },
};

// 通信模块
contextBridge.exposeInMainWorld('ipc', ipcRendererHandle);

export type IpcRender = typeof ipcRendererHandle;
