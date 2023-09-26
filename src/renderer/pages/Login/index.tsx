import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      login
      <Button onClick={handleBack}>返回</Button>
    </div>
  );
};

export default Login;
