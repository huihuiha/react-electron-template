// // import { NAME_KEY, USE_ID_KEY } from '@common/constant'
// // import { CacheUserInfo } from '@type/login'

// export function setGlobalUserInfo({ name = '', userId = '' } = {}) {
//   localStorage.setItem(NAME_KEY, name);
//   localStorage.setItem(USE_ID_KEY, userId);
// }

// export function getGlobalUserInfo() {
//   const result = {} as CacheUserInfo;
//   result.name = localStorage.getItem(NAME_KEY) || '';
//   result.userId = localStorage.getItem(USE_ID_KEY) || '';
//   return result;
// }

// const addZeroPrefix = (number: number): string => {
//   return number < 10 ? `0${number}` : `${number}`;
// };

// export const formatTime = (time: number) => {
//   const minutes = Math.floor(time / 60);
//   const seconds = Math.floor(time % 60);
//   return `${minutes.toString().padStart(2, '0')}:${seconds
//     .toString()
//     .padStart(2, '0')}`;
// };

// export const formatDate = (timestamp: number): string => {
//   const date = new Date(timestamp);
//   const month = date.getMonth() + 1;
//   const day = date.getDate();
//   const hour = date.getHours();
//   const minute = date.getMinutes();

//   return `${addZeroPrefix(month)}-${addZeroPrefix(day)} ${addZeroPrefix(
//     hour,
//   )}:${addZeroPrefix(minute)}`;
// };

// export const checkFileName = (str: string): boolean => {
//   const inputRegex = /^[\u4E00-\u9FA5a-zA-Z0-9_-]+$/;
//   const valid = inputRegex.test(str);
//   return valid;
// };

// export const loadImage = (url: string): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.onload = () => resolve('');
//     img.onerror = () => reject('');
//     img.src = url;
//   });
// };
