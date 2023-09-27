import { requestPost, requestGet, serverUrl } from '@renderer/utils/request';
import { LoginType } from '@renderer/type/login';
import { GeetestConfig } from '@renderer/type/login';

interface ILoginParams {
  phoneNumber: string;
  verifyCode: string;
  expireTime: number;
  type: LoginType;
}

interface ICaptchaParams {
  challenge: string;
  validate: string;
  seccode: string;
  verifyType: number;
  verifyStage: number;
  receiver: string;
}

// 获取极验滑块组件的初始化参数
export const initGeetestValidate = () =>
  requestGet<GeetestConfig>(`${serverUrl}/api/v1/user/initValidate`);

// 验证极验滑块返回的参数，并获取验证码
export const verifyGeetestCaptcha = (params: ICaptchaParams) =>
  requestPost<any>(`${serverUrl}/api/v1/user/verifyCaptcha`, params);

export const login = (params: ILoginParams) =>
  requestPost<any>(`${serverUrl}/api/v1/user/login`, params);

export const logout = () => requestPost(`${serverUrl}/api/v1/user/logout`);

export const checkToken = () =>
  requestPost(`${serverUrl}/api/v1/user/checktoken`);
