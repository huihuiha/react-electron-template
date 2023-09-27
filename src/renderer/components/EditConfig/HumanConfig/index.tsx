import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import cls from 'classnames';
import modelStore from '@renderer/store/model';
import './index.less';
import sceneStore from '@renderer/store/scene';
import { ModuleStyle } from '@renderer/type/task';
import { ModelInfo } from '@renderer/type/model';
import task from '@renderer/store/task';
import { message } from 'antd';

const HumanConfig = () => {
  const { modelList } = modelStore;

  const { curSceneData } = sceneStore;

  // 数字人信息
  const human = curSceneData.moduleList?.find(
    (module) => module.style === ModuleStyle.Human,
  );

  const handleModelClick = async (model: ModelInfo) => {
    if (task.disabledOperate) {
      message.warning('暂无法更换数字人~');
      return;
    }

    await sceneStore.updateModule({
      style: ModuleStyle.Human,
      bizId: model.modelId,
      id: human!.id,
      modelKey: model.modelKey,
    });

    sceneStore.setModule(model);
  };

  return (
    <div className="human-config-wrap">
      <p className="big-title">虚拟形象</p>

      <div className="human-wrap">
        <div className="model-list-in-right-panel" data-human-panel="true">
          {modelList.map((model) => (
            <div className="model-grid" key={model.modelId}>
              <div
                className={cls('model-item', {
                  active: human?.bizId === model.modelId,
                })}
                onClick={() => handleModelClick(model)}
              >
                <img src={model.previewUrl} alt="" />
              </div>
              <div className="model-name">{model.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default observer(HumanConfig);
