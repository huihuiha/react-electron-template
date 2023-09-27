import './index.less';
import LoginBlock from '@renderer/components/Login/LoginBlock/';

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <LoginBlock></LoginBlock>
      </div>
    </div>
  );
};

export default Login;
