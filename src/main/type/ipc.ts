/**
 * sendMsg 发送数据的类型
 * return 主进程返回给渲染进程的结果
 */
type SendItem<msg, res extends unknown = any> = {
  sendMsg: msg;
  return: res;
};

/**
 * 记录 渲染进程 -> 主进程 通信的事件
 * key: 事件的名字
 * value: 发送数据的类型（包含发送数据的类型和主进程响应的结果）
 */
export type SendMap = {
  message: SendItem<string>;
  test: SendItem<number>;
};

export type SendChannels = keyof SendMap;

/**
 * receiveArg 主进程 -> 渲染进程的数据
 */
type OnItem<receiveMsg> = {
  receiveArg: receiveMsg;
};

/**
 * 主进程 -> 渲染进程 通信的事件
 * key: 事件的名字
 * value: 接收数据的类型 OnItem
 */
export type OnMap = {
  message: OnItem<string>;
};

export type OnChannels = keyof OnMap;
