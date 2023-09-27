import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import loginStore from '@renderer/store/login';
import { GeetestResult } from '@renderer/type/login';
import './style.less';
import { Button, Form, Input, Modal } from 'antd';
import ReactGeetest from '@renderer/components/Common/ReactGeetest';
import { useNavigate } from 'react-router-dom';

interface IProps {
  submitType: string;
}

const PREV_PHONE = 'vmlive:prev_login_phone';

const LoginForm: React.FC<IProps> = ({ submitType }) => {
  const navigate = useNavigate();

  // 登录表单 --start
  const [codeDisabled, setCodeDisabled] = useState(false);
  const [hasSended, setHasSended] = useState(false); //是否获取过验证码
  const [countdown, setCountdown] = useState<number>(0);
  const { phone, verifyCode, submitErrorText } = loginStore;
  const [phoneErrorText, setPhoneErrorText] = useState('');

  const submitDisabled = !(phone.length > 0 && verifyCode.length > 0);

  const validPhoneNumber = () => {
    const _phone = (phone || '').trim();
    if (!_phone) {
      setPhoneErrorText('手机号不能为空');
      return false;
    }
    const phoneRegex = /^1\d{10}$/;
    if (!phoneRegex.test(_phone)) {
      setPhoneErrorText('手机号格式不正确');
      return false;
    }
    setPhoneErrorText('');
    return true;
  };

  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    loginStore.setPhone(val);
    window.localStorage.setItem(PREV_PHONE, val);
    if (val) {
      setPhoneErrorText('');
    } else {
      setPhoneErrorText('手机号不能为空');
    }
  };

  const onCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    loginStore.setVerifyCode(e.target.value);
  };

  const handleStartCountdown = () => {
    setCountdown(30);
    setCodeDisabled(true);
    // 开始倒计时
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        // 倒计时结束，清除定时器并启用按钮
        if (prevCountdown === 1) {
          clearInterval(loginStore.downTimer);
          setCodeDisabled(false);
          setHasSended(true);
        }
        // 更新倒计时时间
        return prevCountdown - 1;
      });
    }, 1000);
    loginStore.setDownTimer(timer);
  };

  const handleCodeBtnClick = async () => {
    if (!validPhoneNumber()) return;
    loginStore.setVerifyCode('');
    loginStore.setSubmitErrorText('');
    if (window.CVTE_DIGITAL_HUMAN?.geetest_showBox) {
      window.CVTE_DIGITAL_HUMAN.geetest_showBox();
    }
  };

  const submit = async () => {
    if (submitDisabled) return;
    if (!validPhoneNumber()) return;
    if (submitType === 'login') {
      const res = await loginStore.handleLogin();
      if (res) {
        window.ipc.send('maximize');
        navigate('/app/home');
      }
    } else {
      console.log('binding');
    }
  };

  // 进来需复原上一次输入的手机号
  useEffect(() => {
    const prevPhone = window.localStorage.getItem(PREV_PHONE) || '';
    if (prevPhone) {
      loginStore.setPhone(prevPhone);
    }
  }, []);

  useEffect(() => {
    setCodeDisabled(!phone);
  }, [phone]);

  // 极验验证滑块 --start
  const onGeetestSubmit = async (result: GeetestResult) => {
    await loginStore.verifyGeetestCaptcha(result);
    if (loginStore.geetestResult) {
      handleStartCountdown(); // 验证通过触发获取验证码的逻辑
    }
  };

  return (
    <div className="login-form-wrap">
      <Form style={{ width: '284px' }} autoComplete="off">
        <Form.Item>
          <div className="phone-input-wrap">
            <Input
              value={phone}
              onChange={onPhoneChange}
              placeholder="请输入手机号"
              className={phoneErrorText.length > 0 ? 'custom-ant-input' : ''}
            />
            <p className="phone-error">{phoneErrorText}</p>
          </div>
        </Form.Item>

        <Form.Item>
          <Input
            placeholder="请输入验证码"
            value={verifyCode}
            onChange={onCodeChange}
            style={{
              display: 'inline-block',
              width: '192px',
              marginRight: '8px',
            }}
          />
          <Button
            type="primary"
            disabled={codeDisabled}
            style={{ display: 'inline-block', width: '120px' }}
            onClick={handleCodeBtnClick}
          >
            {countdown > 0
              ? `${countdown}秒后重新发送`
              : hasSended
              ? '重新发送'
              : '获取验证码'}
          </Button>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <div className="sumit-btn-wrap">
            <p className="submit-error">{submitErrorText}</p>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
              disabled={submitDisabled}
              onClick={submit}
            >
              {submitType === 'login' ? '登录' : '绑定'}
            </Button>
          </div>
        </Form.Item>
      </Form>

      <ReactGeetest onSubmit={onGeetestSubmit} />
    </div>
  );
};

export default observer(LoginForm);
