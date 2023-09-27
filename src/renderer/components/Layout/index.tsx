import { Outlet } from 'react-router-dom';
import AppHeader from '@renderer/components/Common/AppHeader';
import AppAside from '@renderer/components/Common/AppAside';
import './index.less';

export default function Layouts() {
  return (
    <div className="app-layout">
      <AppHeader />
      <div className="app-body">
        <AppAside />
        <div className="app-container">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}
