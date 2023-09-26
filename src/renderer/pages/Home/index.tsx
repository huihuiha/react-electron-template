import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

const Home = () => {
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

  useEffect(() => {
    window.ipc.on('message', (message) => {
      console.log(message);
    });

    window.ipc.on('test', (message) => {
      console.log(message);
    });
  }, []);

  return (
    <>
      <Button type="primary" onClick={handleClick}>
        跳转到登录页
      </Button>
      <Button type="primary" onClick={send}>
        向主进程发送消息
      </Button>
      <Button type="primary" onClick={handleFull}>
        窗口全屏
      </Button>
    </>
  );
};

export default Home;
