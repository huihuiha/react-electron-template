import { message } from 'antd';
import axios from 'axios';

interface RespData<T = any> {
  code: number;
  module: T;
  msg: string;
  status: string;
}

const service = axios.create({
  timeout: 10000,
});

service.interceptors.request.use((config) => {
  return config;
});

service.interceptors.response.use(
  (response) => {
    // 如果未登录，重定向到登录页面   TODO：重新刷新token比强制登录体验会更好
    if (+response.data.code === 401) {
      message.error('您的登录状态已过期或失效，请重新登录。');
      setTimeout(() => {
        // TODO:
        // window.location.href = `/login`;
      }, 1000);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const requestGet = async <T extends any>(
  api: string,
  params?: Object,
): Promise<RespData<T>> => {
  const res = await service.get(api, {
    params: params || {},
  });
  return res.data;
};

export const requestPost = async <T extends any>(
  api: string,
  params?: Object,
  config: Record<string, any> = {},
): Promise<RespData<T>> => {
  const res = await service.post(api, params, {
    headers: config.headers || {},
  });
  return res.data;
};

// 上传文件专用
export const requestPostFormData = async <T extends any>(
  api: string,
  formData: FormData,
): Promise<RespData<T>> => {
  const res = await service.post(api, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

let serverUrl = '';

if (process.env.NODE_ENV === 'development') {
  serverUrl = '';
} else if (process.env.API_ENV === 'DEV') {
  serverUrl = 'https://vmlive.test.seewo.com';
} else if (process.env.API_ENV === 'FAT') {
  serverUrl = 'https://vmlive-fat.test.seewo.com';
} else {
  serverUrl = 'https://live.secoral.com';
}

export { serverUrl };

export default service;
