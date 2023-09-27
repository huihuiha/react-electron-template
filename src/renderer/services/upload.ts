import { requestPostFormData, serverUrl } from '@renderer/utils/request';

/**
 * 通用批量上传
 */
export const batchUploadFile = (params: FormData) => {
  return requestPostFormData<
    {
      fileKey: string;
      downloadUrl: string;
    }[]
  >(`${serverUrl}/api/v1/resources/commonBatchUpload`, params);
};
