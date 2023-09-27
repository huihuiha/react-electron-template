import { MenuType } from '@renderer/type/home';

export type GeetestResult = {
  geetest_challenge: string;
  geetest_seccode: string;
  geetest_validate: string;
};

export type GeetestConfig = {
  product: 'float' | 'popup' | 'custom' | 'bind';
  gt: string;
  challenge: string;
  success: boolean;
  timeout: number;
};

export type CacheUserInfo = {
  name: string;
  userId: string;
};

export type IRoute = {
  path: string;
  name?: string;
  component: string;
  menuType?: MenuType;
  routes?: IRoute[];
};

// 0: 手机+验证码登录  11：手机号绑定（待确定）  12：微信扫描登录（待确定）
export enum LoginType {
  verifyCodeLogin = 0,
  bindPhone = 10,
  wechatLogin = 11,
}
