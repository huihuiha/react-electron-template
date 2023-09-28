import React, { useEffect } from 'react';
import { message } from 'antd';
import './index.less';
import loginStore from '@renderer/store/login';
import { GeetestConfig } from '@renderer/type/login';

type IProps = {
  onSubmit: (result: any) => void;
};

const Geetest: React.FC<IProps> = ({ onSubmit }) => {
  const url = 'https://static.geetest.com/static/js/gt.0.4.9.js?v=0.1';

  const createScript = () => {
    return new Promise((resolve, reject) => {
      const isExist =
        document.querySelectorAll('script[data-id=vmgt]').length > 0;

      if (!isExist) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.async = true;
        script.setAttribute('data-id', 'vmgt');
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      } else {
        resolve({});
      }
    });
  };

  const init = async (config: GeetestConfig) => {
    console.log('===init_geetest_config:', { ...config });
    console.time('geetest');
    if (!config) return;
    window.initGeetest(
      {
        gt: config.gt,
        challenge: config.challenge,
        offline: !config.success,
        new_captcha: true,
        product: config.product,
        https: true,
        timeout: config.timeout || 3000,
      },
      function (captcha: any) {
        // captcha为验证码实例
        captcha
          .onReady(function () {
            console.log('===geetest_ready');
            console.timeEnd('geetest');
            // 验证码ready之后才能调用verify方法显示验证码
          })
          .onSuccess(function () {
            const result = captcha.getValidate();
            if (!result) {
              return message.error('请完成验证');
            }
            onSubmit && onSubmit(result);
          })
          .onError(function (err: any) {
            message.error(err && err.msg ? err.msg : '验证失败，请稍后重试！');
            console.error('err', err);
          });

        // 启动函数挂载到window
        window.CVTE_DIGITAL_HUMAN = window.CVTE_DIGITAL_HUMAN || {};
        window.CVTE_DIGITAL_HUMAN.geetest_showBox = function () {
          captcha.verify(); // 显示验证码弹窗
          console.log('===captcha show modal!');
        };
        window.CVTE_DIGITAL_HUMAN.geetest_reset = function () {
          captcha.reset(); // 二次验证失败后重置验证
          console.log('===captcha reset!');
        };
        window.CVTE_DIGITAL_HUMAN.geetest_destroy = function () {
          captcha.destroy(); // 二次验证成功后移除验证。暂时还没用到。
          console.log('===captcha destroy!');
        };
      },
    );
  };

  useEffect(() => {
    (async () => {
      await Promise.all([loginStore.fetchGeetestConfig(), createScript()]);
      if (loginStore.geetestConfig) {
        init(loginStore.geetestConfig);
      }
    })();
  }, []);

  return <div></div>;
};

export default Geetest;
