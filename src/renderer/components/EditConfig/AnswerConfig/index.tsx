import { observer } from 'mobx-react';
import './index.less';
import {
  Button,
  Space,
  Select,
  Input,
  Table,
  Popconfirm,
  Switch,
  Tooltip,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { LivePlatform } from '@renderer/type/task';
import { QaInfo, AnswererType } from '@renderer/type/qa';
import taskStore from '@renderer/store/task';
import AddQaModal from '../AddQaModal';
import { cloneDeep } from 'lodash-es';
import { AudioOutlined, QuestionCircleOutlined } from '@ant-design/icons';

type DataType = {
  key: number;
  action: number;
  deleted?: boolean;
} & QaInfo;

const AnswerConfig = () => {
  const { interactionList } = taskStore;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlatformChange = async (livePlatform: LivePlatform) => {
    taskStore.setLivePlatform(livePlatform);
    await taskStore.updateShow({
      livePlatform,
    });
  };

  const handleRoomUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    taskStore.setLiveRoomUrl(e.target.value);
  };

  const updateRoomUrl = async () => {
    await taskStore.updateShow({
      liveRoomUrl: taskStore.liveRoomUrl,
    });
  };

  const handlePopConfirm = (record: QaInfo) => {
    taskStore.batchDeleteInteraction([record.id!]);
  };

  const editQa = (record: DataType) => {
    const cloned: Partial<DataType> = cloneDeep(record);
    delete cloned.key;
    delete cloned.action;
    delete cloned.deleted;
    taskStore.setQaForm(cloned);
    setIsModalOpen(true);
  };

  const onUsedChange = (flag: boolean, record: DataType) => {
    const list = cloneDeep(interactionList);
    const target = list.find((v) => v.id === record.id)!;
    target.used = flag;
    taskStore.setInteractionList(list);
    taskStore.saveInteraction(target);
  };

  const cancelModal = () => {
    setIsModalOpen(false);
  };

  const toIntroduce = () => {
    window.open(
      'https://abkt70n9ot.feishu.cn/wiki/F25nwd8JfiNfifktvAZcGafzn8d?from=from_copylink',
    );
  };

  const columns: ColumnsType<DataType> = [
    {
      title: '触发条件',
      dataIndex: 'action',
      key: 'action',
      width: 90,
      render: (_, record) => {
        return <div>{+record.action === 1 ? '关键词' : ''}</div>;
      },
    },
    {
      title: '内容',
      dataIndex: 'keywordList',
      key: 'keywordList',
      render: (_, record) => <div>{record.keywordList.join(' , ')}</div>,
    },
    {
      title: '回复方',
      dataIndex: 'answerer',
      key: 'answerer',
      width: 80,
      render: (_, record) => (
        <div>{+record.answerer === AnswererType.Help ? '助播' : '主播'}</div>
      ),
    },
    {
      title: '是否使用',
      key: 'used',
      width: 90,
      render: (_, record) => (
        <Switch
          checked={record.used}
          onChange={(flag) => onUsedChange(flag, record)}
        />
      ),
    },
    {
      title: '操作',
      key: 'operate',
      width: 110,
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => editQa(record)}>编辑</a>
          <Popconfirm
            placement="topRight"
            rootClassName="edit-qa-del-pop"
            title="删除该问答"
            description="确定删除?"
            onConfirm={() => handlePopConfirm(record)}
            okText="是"
            cancelText="否"
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const data: DataType[] = interactionList.map((item) => ({
    key: item.id!,
    action: 1,
    ...item,
  }));

  return (
    <div className="edit-answer-config">
      <Space wrap style={{ marginBottom: 20 }}>
        <Button
          type="primary"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          新增问答
        </Button>
        <p className="ml-10">直播平台：</p>
        <Select
          placeholder="选择直播平台"
          style={{ width: 130 }}
          onChange={handlePlatformChange}
          value={taskStore.livePlatform}
          options={[
            { value: 2, label: '淘宝' },
            { value: 1, label: '京东' },
            { value: 3, label: '抖音' },
          ]}
        />
        <p className="ml-10 flex-center" onClick={toIntroduce}>
          <span>链接</span>
          <Tooltip title="点击查看如何获取直播间链接">
            <QuestionCircleOutlined className="question-icon" />
          </Tooltip>
          <span>: </span>
        </p>
        <Input
          style={{ width: 500 }}
          placeholder="直播间链接，按回车或失焦后保存"
          value={taskStore.liveRoomUrl}
          onChange={handleRoomUrlChange}
          onBlur={updateRoomUrl}
          onPressEnter={updateRoomUrl}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        expandable={{
          expandedRowRender: (record) => (
            <div className="edit-qa-item-list">
              {record.answerAudioList.map((item) => (
                <div className="qa-item" key={item.content}>
                  <AudioOutlined />
                  <p className="qa-item-text">{item.title}</p>
                </div>
              ))}
            </div>
          ),
          rowExpandable: (record) => record.answerAudioList.length > 0,
        }}
        scroll={{ x: true, y: `calc(100vh - 280px)` }}
      />

      <AddQaModal isModalOpen={isModalOpen} handleCancel={cancelModal} />
    </div>
  );
};

export default observer(AnswerConfig);
