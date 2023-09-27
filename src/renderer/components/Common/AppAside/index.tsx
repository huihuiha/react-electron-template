import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cls from 'classnames';
import './index.less';
import { IRoute } from '@renderer/type/login';
import { MenuType } from '@renderer/type/home';

// const routeConfig = require('../../../router/index');
// const appRoutes = (routeConfig.appRoutes || []) as IRoute[];

const appRoutes: IRoute[] = [
  {
    path: '/app/home',
    name: '首页',
    component: '@renderer/pages/Home',
    menuType: MenuType.sideMenu,
  },
];

const AppAside = () => {
  const navigate = useNavigate();

  const [currentRoute, setCurrentRoute] = useState('/app/home');
  const menus = appRoutes.filter(
    (route) => route.menuType === MenuType.sideMenu,
  );

  const handleMenuClick = (menu: IRoute) => {
    setCurrentRoute(menu.path);
    navigate(menu.path);
  };

  useEffect(() => {
    setCurrentRoute(location.pathname);
  }, [location.pathname]);

  return (
    <div className="app-aside">
      {menus.map((menu: IRoute) => (
        <div
          className={cls({
            'app-aside-item': true,
            active: currentRoute === menu.path,
          })}
          key={menu.path}
          onClick={() => handleMenuClick(menu)}
        >
          <span className="img"></span>
          <div className="name">{menu.name}</div>
        </div>
      ))}
    </div>
  );
};

export default observer(AppAside);
