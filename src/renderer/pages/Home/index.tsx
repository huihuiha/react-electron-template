import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  const send = async () => {
    const a = await window.ipc.invoke('message', 'hello from renderer');

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
      <button onClick={handleClick}>跳转到登录页</button>
      <button onClick={send}>向主进程发送消息</button>
      <button onClick={handleFull}>窗口全屏</button>
    </>
  );
};

export default Home;
