import React from 'react';
import './index.less';
import { useRouter } from '@renderer/utils/hooks';

const AppPage: React.FC<
  React.PropsWithChildren<{
    operation?: React.ReactNode;
    pageStyle?: React.CSSProperties;
  }>
> = (props) => {
  const { curRoute } = useRouter();

  return (
    <div className="app-page" style={props.pageStyle}>
      <div className="app-page-header">
        <h1 className="app-page-title">{curRoute!.name}</h1>
        {props.operation}
      </div>
      {props.children}
    </div>
  );
};

export default AppPage;
