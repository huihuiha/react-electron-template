import { OnItem, SendItem } from './ipc';

// 渲染进程发送的消息记录
export type SendMap = {
  message: SendItem<string>;
  test: SendItem<number>;
  maximize: SendItem;
  closeWindow: SendItem;
  initWindow: SendItem;
};

// 渲染进程监听主进程的消息记录
export type OnMap = {
  message: OnItem<string>;
  test: OnItem<number>;
};
