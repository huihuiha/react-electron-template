import { QaInfo } from '@renderer/type/qa';

/**
 * @file 获取任务详情
 */

import { SubmitComposeParams, UpdateShowParams } from '@renderer/type/request';
import {
  LivePlatform,
  LiveStatus,
  ShowStatus,
  TaskDetail,
} from '@renderer/type/task';
import { requestPost, requestGet, serverUrl } from '@renderer/utils/request';

/**
 * 获取任务详情
 * @param id 节目id
 */
export const getTaskDetail = (params: { showId: number }) => {
  return requestGet<TaskDetail>(
    `${serverUrl}/api/v1/show/getShowDetail`,
    params,
  );
};

/**
 * 推流
 */
export const pushStream = (params: { showId: number }) => {
  return requestPost<string>(
    `${serverUrl}/api/v1/streaming/push?showId=${params.showId}`,
  );
};

/**
 * 停止推流
 */
export const stopPushStream = (params: { showId: number }) => {
  return requestPost<string>(
    `${serverUrl}/api/v1/streaming/stop?showId=${params.showId}`,
  );
};

/**
 * 提交合成
 */
export const submitCompose = (params: SubmitComposeParams) => {
  return requestPost<{
    showStatus: ShowStatus;
  }>(`${serverUrl}/api/v1/show/saveShowConfig`, params);
};

/**
 * 更新节目信息
 */
export const updateShow = (params: UpdateShowParams) => {
  return requestPost<{
    showStatus: ShowStatus;
  }>(`${serverUrl}/api/v1/show/updateShow`, params);
};

export const saveInteraction = (params: QaInfo) =>
  requestPost(`${serverUrl}/api/v1/interaction/save`, params);

export const batchDeleteInteraction = (ids: number[]) =>
  requestPost(`${serverUrl}/api/v1/interaction/batchDelete`, ids);

export const getShowConfig = (params: { showId: number }) => {
  return requestGet<{
    liveStatus: LiveStatus;
    liveStreamUrl: string;
  }>(`${serverUrl}/api/v1/show/getShowConfig`, params);
};
