export type SendItem<msg extends any = unknown, res extends unknown = any> = {
  sendMsg: msg;
  return: res;
};

export type OnItem<receiveMsg> = {
  receiveArg: receiveMsg;
};
