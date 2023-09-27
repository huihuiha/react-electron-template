import { ModelInfo } from '@renderer/type/model';
import { ModuleStyle } from '@renderer/type/task';
import { requestGet, requestPost, serverUrl } from '@renderer/utils/request';

/**
 * 获取模特列表
 */
export const getModelList = () => {
  return requestGet<ModelInfo[]>(`${serverUrl}/api/v1/model/getModelList`);
};

/**
 * 更新模型
 */
export const updateModule = (params: {
  pageId: number;
  id: number;
  style: ModuleStyle;
  name?: string;
  bizId?: number;
  /**
   * 数字人这块 props1为 modelKey
   */
  prop1: string;
}) => {
  return requestPost<{
    id: number;
  }>(`${serverUrl}/api/v1/module/save`, params);
};
