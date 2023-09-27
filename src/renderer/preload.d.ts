import { IpcRender } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    ipc: IpcRender;
    CVTE_DIGITAL_HUMAN: any;
    initGeetest: any;
  }
}

export {};
