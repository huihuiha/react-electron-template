import { requestGet, requestPost, serverUrl } from '@renderer/utils/request';
import { Pager } from '@renderer/type/common';
import { ShowInfo } from '@renderer/type/home';

export const createShow = () =>
  requestPost<number>(`${serverUrl}/api/v1/show/createShow`);

export const getShowList = (params: Pager) =>
  requestGet<{ list: ShowInfo[] }>(
    `${serverUrl}/api/v1/show/getShowList`,
    params,
  );
