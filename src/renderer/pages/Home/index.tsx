import { useNavigate } from 'react-router-dom';
import './index.less';
import AppPage from '@renderer/components/Common/AppPage';
import TaskList from '@renderer/components/Home/TaskList';
import homeStore from '@renderer/store/home';
import { message } from 'antd';

const Home = () => {
  const navigate = useNavigate();

  const handleToEdit = async () => {
    const showId = await homeStore.createShow();
    if (showId) {
      navigate(`/app/edit/${showId}`);
    } else {
      message.error('接口异常');
    }
  };

  return (
    <AppPage>
      <div className="home-container">
        <div className="home-action-list">
          <div className="action" onClick={handleToEdit}>
            <div className="name">快速创作</div>
          </div>
        </div>
        <div className="label">最近作品</div>
        <TaskList />
      </div>
    </AppPage>
  );
};

export default Home;
