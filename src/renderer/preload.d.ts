import { IpcRender } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    ipc: IpcRender;
    isPackaged: boolean;
    CVTE_DIGITAL_HUMAN: any;
    initGeetest: any;
  }
}

export {};
