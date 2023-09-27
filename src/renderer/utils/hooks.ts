import { IRoute } from '../type/login'
const { appRoutes } = require('../router')

/**
 * 获得当前页面路由配置
 * @returns IRoute | null
 */
export const useRouter = () => {
  const route = appRoutes.find(
    (route: IRoute) => route.path === location.pathname
  )
  return {
    curRoute: route as IRoute
  }
}
