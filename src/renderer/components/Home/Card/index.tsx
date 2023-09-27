import React from 'react';
import './index.less';
import { Actions } from '@renderer/type/home';
import { EditOutlined } from '@ant-design/icons';
import { LiveStatus } from '@renderer/type/task';

interface Props {
  image: string;
  title: string;
  time: string;
  liveStatus: number;
  onAction: (action: Actions) => void;
}

const Card: React.FC<Props> = (props) => {
  const renderTag = () => {
    if (props.liveStatus === LiveStatus.NO_START) {
      return <div className="tag pending">未开播</div>;
    }
    if (props.liveStatus === LiveStatus.Starting) {
      return <div className="tag completed">已开播</div>;
    }
    return null;
  };

  return (
    <div className="home-list-card">
      <div className="header">
        <img className="cover" src={props.image} alt="" />

        {renderTag()}

        <div className="mask">
          <div className="operations">
            <span className="item" onClick={() => props.onAction(Actions.Edit)}>
              <EditOutlined />
            </span>
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="title" onClick={() => props.onAction(Actions.Edit)}>
          {props.title}
        </div>

        <div className="right">
          <div className="time">{props.time}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
