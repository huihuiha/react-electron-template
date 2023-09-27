/**
 * @file 播放列表相关的请求
 */

import { requestPost, serverUrl } from '@renderer/utils/request';
import { PlayAudioInfo } from '@renderer/type/play';

/**
 * 播放列表：批量上传音频
 */
export const uploadPlayAudios = (params: FormData) => {
  return requestPost<PlayAudioInfo[]>(
    `${serverUrl}/api/v1/audio/batchUpload`,
    params,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};

/**
 * 保存音频
 */
export const savePlayAudio = (params: Partial<PlayAudioInfo>) => {
  return requestPost<{
    id: number;
  }>(`${serverUrl}/api/v1/audio/save`, params);
};

/**
 * 删除音频
 */
export const deletePlayAudio = (params: {
  sceneId: number;
  idList: number[];
}) => {
  return requestPost<{ id: string }>(
    `${serverUrl}/api/v1/audio/batchDelete`,
    params,
  );
};
