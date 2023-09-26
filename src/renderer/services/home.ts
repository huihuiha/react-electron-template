import { requestGet, serverUrl } from '@renderer/utils/request';

export const getShowList = (params: any) =>
  requestGet(`${serverUrl}/api/v1/show/getShowList`, params);
