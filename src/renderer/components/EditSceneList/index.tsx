import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useState } from 'react';
import './index.less';
import { observer } from 'mobx-react';
import sceneStore from '@renderer/store/scene';

const EditSceneList = () => {
  const [sceneList, setSceneList] = useState([1]);

  const {
    curSceneData: { previewImgUrl = '' },
  } = sceneStore;

  return (
    <div className="edit-scene-wrap">
      <div className="title">场景</div>

      {/* <div className="add-scene">
        <Button
          className="add-item"
          icon={<PlusOutlined />}
          onClick={handleBuild}
        >
          新建页面
        </Button>
        <div className="add-item import">
          <span className="ppt-icon"></span>
          <span>导入PPT</span>
        </div>
      </div> */}

      {sceneList.map((item, index) => (
        <div key={index} className="scene-item-container" onClick={() => {}}>
          <div className="scene-index">{index + 1}</div>

          <div className="scene-thumbnail-outer">
            <div id={`scene-thumbnail-${index}`} className={`scene-thumbnail`}>
              <img
                src={previewImgUrl}
                className="scene-preview"
                style={{ opacity: previewImgUrl ? 1 : 0 }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default observer(EditSceneList);
