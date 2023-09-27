import { SaveParams } from '@renderer/type/request';
import { requestPost, serverUrl } from '@renderer/utils/request';

/**
 * 保存场景信息
 */
export const saveScene = (params: SaveParams) => {
  return requestPost<{ sceneId: string }>(
    `${serverUrl}/api/v1/scene/saveScene`,
    params,
  );
};
