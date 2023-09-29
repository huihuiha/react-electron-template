import { Outlet } from 'react-router-dom';
import './index.less';

export default function Layouts() {
  return (
    <div className="app-layout">
      <Outlet></Outlet>
    </div>
  );
}
