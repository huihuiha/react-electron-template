import EditConfig from '@renderer/components/EditConfig';
import EditContent from '@renderer/components/EditContent';
import EditSceneList from '@renderer/components/EditSceneList';
import EditHeader from '@renderer/components/EditHeader';
// import { getSearchParam } from '@/utils/url'
// import taskStore from '@store/task'
// import modelStore from '@store/model'
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import './index.less';

const EditPage = () => {
  useEffect(() => {
    // const showId = +getSearchParam('showId')
    // taskStore.setShowId(showId)
    // taskStore.getTaskDetail()
    // modelStore.getModelList()
  }, []);

  return (
    <div className="edit-page-container">
      {/* 导航 */}
      <EditHeader />

      <div className="main-content">
        {/* 场景 */}
        <div className="scene-list">
          <EditSceneList />
        </div>

        {/* 展示区域 */}
        <div className="main-section">
          <EditContent />
        </div>

        {/* 设置区域 */}
        <div className="config-section">
          <EditConfig />
        </div>
      </div>
    </div>
  );
};

export default observer(EditPage);
