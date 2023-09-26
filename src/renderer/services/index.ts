import { requestPost, serverUrl } from '@renderer/utils/request';

export const checkToken = () =>
  requestPost(`${serverUrl}/api/v1/user/checktoken`);
