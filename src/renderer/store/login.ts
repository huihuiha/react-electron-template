import { makeAutoObservable, runInAction } from 'mobx';
import { GeetestConfig, GeetestResult, LoginType } from '@renderer/type/login';
import { message } from 'antd';
import {
  login,
  initGeetestValidate,
  verifyGeetestCaptcha,
} from '@renderer/services/login';
import { setGlobalUserInfo } from '@renderer/utils/index';

class LoginStore {
  loginType: LoginType = LoginType.verifyCodeLogin;
  downTimer: any; // 验证码倒计时计时器
  phone = ''; // 手机号
  verifyCode = ''; // 验证码
  isAutoLogin = true; // 默认勾选自动登录，登录有效期为30 天。不勾选则使用sessionStorage存储token。
  submitErrorText = '';
  geetestConfig: GeetestConfig | null = null; // 极验验证滑块的初始化参数
  geetestResult: any = null; // 极验验证滑块的验证结果

  constructor() {
    makeAutoObservable(this);
  }

  get loginTitle() {
    switch (this.loginType) {
      case LoginType.wechatLogin:
        return '微信扫码登录';
      case LoginType.bindPhone:
        return '绑定手机';
      case LoginType.verifyCodeLogin:
        return '手机验证码登录';
      default:
        return '';
    }
  }

  setIsAutoLogin(val: boolean) {
    this.isAutoLogin = !!val;
  }

  setDownTimer(timer: any) {
    this.downTimer = timer;
  }

  setSubmitErrorText(val: string) {
    this.submitErrorText = val;
  }

  toggleLoginType(type: LoginType) {
    this.loginType = type;
    // fix:切换登录类型，需要清除倒计时定时器，销毁原有的极验验证插件
    clearInterval(this.downTimer);
    window.CVTE_DIGITAL_HUMAN.geetest_destroy();
  }

  setPhone(val: string) {
    this.phone = val;
  }

  setVerifyCode(val: string) {
    this.verifyCode = val;
  }

  fetchGeetestConfig = async () => {
    try {
      const { code, module } = await initGeetestValidate();
      if (code === 200 && module) {
        runInAction(() => {
          this.geetestConfig = {
            ...module,
            product: 'bind',
          };
        });
      } else {
        message.error('验证码初始化参数获取失败');
      }
    } catch (err) {
      message.error('网络异常，验证码初始化参数获取失败！');
    }
  };

  verifyGeetestCaptcha = async (result: GeetestResult) => {
    try {
      const { code, module } = await verifyGeetestCaptcha({
        challenge: result.geetest_challenge,
        validate: result.geetest_validate,
        seccode: result.geetest_seccode,
        verifyType: 1, // 1：使用极验
        verifyStage: 0, // 验证场景，0：手机验证码登录，1：微信绑定手机号
        receiver: this.phone, // 接收者，类型为手机或者邮箱，必填
      });
      if (code === 200) {
        runInAction(() => {
          this.geetestResult = module;
        });
        message.success('验证码已发送到您的手机！');
      } else {
        message.error(module.message ? module.message : '验证码获取失败');
        window.CVTE_DIGITAL_HUMAN.geetest_reset();
      }
    } catch (err) {
      message.error('网络异常，验证码获取失败！');
      window.CVTE_DIGITAL_HUMAN.geetest_reset();
    }
  };

  handleLogin = async () => {
    try {
      this.setSubmitErrorText('');
      const { code, module, status } = await login({
        phoneNumber: this.phone,
        verifyCode: this.verifyCode,
        expireTime: this.isAutoLogin ? 30 : -1,
        type: this.loginType,
      });
      if (code === 200 && status == 'SUCCESS') {
        console.log('===登录成功:', JSON.stringify(module));
        message.success('登录成功');
        setGlobalUserInfo({
          name: module.name,
          userId: module.userId,
        });
        window.location.href = '/';
      } else {
        this.setSubmitErrorText('手机号或者验证码错误');
      }
    } catch {
      message.error('网络异常');
    }
  };
}

export default new LoginStore();
