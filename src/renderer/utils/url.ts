/***
 * 获取 url 的参数
 */
export function getSearchParam(key: string) {
  const searchParams = new URLSearchParams(window.location.search);
  const paramsObject = Object.fromEntries(searchParams.entries());

  return paramsObject[key] || '';
}
