import { ConfigBlockType } from '@renderer/type/task';
import { Tabs, TabsProps } from 'antd';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import AnswerConfig from './AnswerConfig';
import HumanConfig from './HumanConfig';
import PlayConfig from './PlayConfig';
import { useMemoizedFn } from 'ahooks';
import taskStore from '@renderer/store/task';

const EditConfig = () => {
  const handleTabChange = useMemoizedFn((key: string) => {
    taskStore.setCurTab(key as ConfigBlockType);
  });

  const items: TabsProps['items'] = [
    {
      key: ConfigBlockType.playList,
      label: `播放列表`,
      children: <PlayConfig />,
    },
    {
      key: ConfigBlockType.human,
      label: `虚拟人`,
      children: <HumanConfig />,
    },
    {
      key: ConfigBlockType.qa,
      label: `问答配置`,
      children: <AnswerConfig />,
    },
  ];

  useEffect(() => {
    taskStore.setCurTab(ConfigBlockType.playList);
  }, []);

  return (
    <div className="edit-config-wrap">
      <Tabs
        className="config-tab"
        activeKey={taskStore.curTab}
        items={items}
        tabBarStyle={{
          fontSize: '16px',
          color: '#666',
        }}
        onChange={handleTabChange}
      />
    </div>
  );
};

export default observer(EditConfig);
