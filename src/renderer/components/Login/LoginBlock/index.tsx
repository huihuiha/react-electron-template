import React from 'react';
import { observer } from 'mobx-react';
import loginStore from '@renderer/store/login';
import { LoginType } from '@renderer/type/login';
import './style.less';
import { Checkbox } from 'antd';
import LoginForm from '../LoginForm';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

import logo from '@renderer/common/images/login/login-logo.png';

interface IProps {}

const LoginBlock: React.FC<IProps> = () => {
  const { loginType, loginTitle, isAutoLogin } = loginStore;

  const onChange = (e: CheckboxChangeEvent) => {
    loginStore.setIsAutoLogin(e.target.checked);
  };

  const toggleLoginType = () => {
    const newType =
      loginType === LoginType.wechatLogin
        ? LoginType.verifyCodeLogin
        : LoginType.wechatLogin;
    loginStore.toggleLoginType(newType);
  };

  const renderForm = () => {
    switch (loginType) {
      case LoginType.wechatLogin:
        return <div className="middle-for-wechat-login"></div>;
      case LoginType.bindPhone:
        return <LoginForm submitType="bind"></LoginForm>;
      case LoginType.verifyCodeLogin:
        return <LoginForm submitType="login"></LoginForm>;
      default:
        return '类型错误！';
    }
  };

  return (
    <div className="login-block">
      <div className="login-block-top">
        <div className="logo-wrap">
          <img className="normal" src={logo} alt="" />
        </div>
        <div className="title">{loginTitle}</div>
      </div>

      <div className="login-block-middle">{renderForm()}</div>

      <div className="login-block-bottom">
        <div className="auto-login-wrap">
          <Checkbox checked={isAutoLogin} onChange={onChange}>
            下次自动登录
          </Checkbox>
        </div>
        <div className="phone-wrap" style={{ display: 'none' }}>
          <div className="phone-inner" onClick={toggleLoginType}>
            <img
              src={
                loginType === LoginType.wechatLogin
                  ? require('@renderer/common/images/login/login-phone.png')
                      .default
                  : require('@renderer/common/images/login/login-wechat.png')
                      .default
              }
              alt=""
            />
            <p>
              {loginType === LoginType.wechatLogin ? '手机登录' : '微信登录'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(LoginBlock);
