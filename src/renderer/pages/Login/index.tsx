import { Button } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const isLogin = true;

  useEffect(() => {
    if (isLogin) {
      navigate('/app');
      window.ipc.send('maximize');
    }
  }, []);

  return (
    <div>
      login
      <Button onClick={handleBack}>返回</Button>
    </div>
  );
};

export default Login;
