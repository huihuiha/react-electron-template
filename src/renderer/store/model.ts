import { getModelList } from '@renderer/services/model';
import { ModelInfo } from '@renderer/type/model';
import { message } from 'antd';
import { makeAutoObservable, runInAction } from 'mobx';

/**
 * 模特相关的配置
 */
class ModelStore {
  /**
   * 模特列表
   */
  modelList: ModelInfo[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async getModelList() {
    try {
      const { code, module } = await getModelList();
      if (code === 200) {
        runInAction(() => {
          this.modelList = module;
        });

        // 体验优化：提前去加载一下图片资源
        module.forEach((model) => {
          fetch(model.previewUrl);
        });
      }
    } catch (e) {
      message.error('获取模特列表失败！！！');
      console.log(e);
    }
  }
}

export default new ModelStore();
