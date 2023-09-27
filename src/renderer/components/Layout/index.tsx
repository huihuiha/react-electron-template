import Group from '@renderer/pages/Group';
import Home from '@renderer/pages/Home';
import { checkToken } from '@renderer/services';
import { getShowList } from '@renderer/services/home';
import { Button } from 'antd';
import { Route, Routes, useNavigate, Outlet } from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  const send = async () => {
    window.ipc.send('message', '123');
    window.ipc.send('test', 123);
  };

  const handleFull = () => {
    window.ipc.send('maximize');
  };

  return (
    <>
      <Button type="primary" onClick={handleClick}>
        跳转到登录页
      </Button>
      <Button type="primary" onClick={() => navigate('/app/group')}>
        跳转group
      </Button>
      <Button type="primary" onClick={() => navigate('/app/home')}>
        跳转home
      </Button>
      <Button type="primary" onClick={send}>
        向主进程发送消息
      </Button>
      <Button type="primary" onClick={handleFull}>
        窗口全屏
      </Button>
      <Button type="primary" onClick={() => getShowList({})}>
        发送请求
      </Button>

      <hr />

      <Outlet />
    </>
  );
};

export default Layout;
