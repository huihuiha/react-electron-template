export type SendItem<msg, res extends unknown = any> = {
  sendMsg: msg;
  return: res;
};

export type OnItem<receiveMsg> = {
  receiveArg: receiveMsg;
};
