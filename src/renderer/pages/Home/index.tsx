import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  return <button onClick={handleClick}>跳转到登录页</button>;
};

export default Home;
