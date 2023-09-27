import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import './index.less';
import Card from '../Card';
import { formatDate } from '@renderer/utils/index';
import { Actions } from '@renderer/type/home';
import { useEffect, useRef } from 'react';
import homeStore from '@renderer/store/home';
import { ShowInfo } from '@renderer/type/home';

const TaskList = () => {
  const { showList } = homeStore;
  const scrollRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const handleEditTask = (item: ShowInfo) => {
    navigate(`/app/edit?showId=${item.id}`);
  };

  useEffect(() => {
    (async () => {
      homeStore.resetHomeListParams();
      await homeStore.getShowList();

      const el = scrollRef.current;
      // 不满一屏，再加载下一页
      if (el && el.offsetHeight > 0 && el.scrollHeight <= el.offsetHeight) {
        homeStore.getShowList();
      }
    })();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      // 滑动到底部(50px 是一个自定义的误差值)
      if (
        el.scrollHeight - el.scrollTop - el.clientHeight <= 50 &&
        !homeStore.loading &&
        !homeStore.completed
      ) {
        homeStore.getShowList();
      }
    };
    el.addEventListener('scroll', handleScroll);
    return () => {
      el.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="home-task-list" ref={scrollRef}>
      {showList.map((item: ShowInfo) => (
        <Card
          key={item.id}
          title={item.title}
          image={item.previewImgUrl}
          time={formatDate(item.updateTime)}
          liveStatus={item.liveStatus}
          onAction={(action) => {
            switch (action) {
              case Actions.Edit:
                handleEditTask(item);
                break;
            }
          }}
        />
      ))}
    </div>
  );
};

export default observer(TaskList);
