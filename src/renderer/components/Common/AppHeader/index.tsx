import { observer } from 'mobx-react';
import './index.less';
import ImageLogo from '@renderer/common/images/home/logo.png';
import { Popover, message } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { getGlobalUserInfo } from '@renderer/utils/index';
import { logout } from '@renderer/services/login';
import defaultAvatar from '@renderer/common/images/home/default_avatar.png';
import { useNavigate } from 'react-router-dom';

const AppHeader = () => {
  const [userName, setUserName] = useState('');

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { code, msg } = await logout();
      if (code == 200) {
        navigate('/');
        window.ipc.send('initWindow');
      } else {
        message.error(msg || '退出失败');
      }
    } catch {
      message.error('网络异常，请稍后重试！');
    }
  };

  useEffect(() => {
    const name = getGlobalUserInfo().name;
    setUserName(name);
  }, []);

  const content = (
    <div className="popover-content">
      <div className="popover-item">
        <img className="avatar" src={defaultAvatar} />
        <span>{userName}</span>
      </div>
      <span className="popover-item" onClick={handleLogout}>
        <LogoutOutlined className="img" />
        退出登录
      </span>
    </div>
  );

  return (
    <div className="app-header">
      <img className="app-logo" src={ImageLogo} alt="" />

      <div className="userinfo">
        <Popover
          content={content}
          title={null}
          placement="bottomRight"
          overlayClassName="app-userinfo-popover"
        >
          <img className="avatar" src={defaultAvatar} />
        </Popover>
      </div>
    </div>
  );
};

export default observer(AppHeader);
