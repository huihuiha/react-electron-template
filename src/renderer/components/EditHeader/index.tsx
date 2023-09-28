import { LeftOutlined } from '@ant-design/icons';
import { Button, Input, InputRef, message } from 'antd';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import taskStore from '@renderer/store/task';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ShowStatus, LiveStatus, ConfigBlockType } from '@renderer/type/task';
import { checkFileName } from '@renderer/utils';
import { useInterval } from 'ahooks';
import './index.less';
import { getShowConfig } from '@renderer/services/task';
import scene from '@renderer/store/scene';

const EditHeader = () => {
  const showStatus = taskStore.showStatus;
  const liveStatus = taskStore.liveStatus;
  const liveStreamUrl = taskStore.liveStreamUrl;
  const title = taskStore.title;
  const [edit, setEdit] = useState(false);
  const inputRef = useRef<InputRef>(null);

  const navigate = useNavigate();

  const [inputVal, setInputVal] = useState(title);

  const handleClickTitle = () => {
    setEdit(!edit);
    setInputVal(title);
  };

  // 是否可以生成任务
  const canGenerate = useMemo(() => {
    if (liveStatus === LiveStatus.Starting) {
      return false;
    } else {
      return true;
    }
  }, [liveStatus]);

  const handleBack = () => {
    navigate('/app/home');
  };

  const handlePush = () => {
    // 切换到“问答配置”面板
    taskStore.setCurTab(ConfigBlockType.qa);

    if (liveStreamUrl) {
      taskStore.stopLive();
    }

    if (!liveStreamUrl && showStatus === ShowStatus.Done) {
      taskStore.startLive();
    }
  };

  const handleSaveTitle = async (e: any) => {
    setEdit(!edit);
    const currTitle = e.target.value;
    if (!checkFileName(currTitle)) {
      message.error('请输入合法文件名');
      setInputVal(title);
      return;
    }

    await taskStore.updateShow({
      title: currTitle,
    });

    taskStore.setTitle(currTitle);
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };

  const handleGenerate = () => {
    if (!scene.curSceneData.sortAudioList) {
      return message.error('请上传播放音频');
    }
    taskStore.submitCompose();
  };

  useEffect(() => {
    if (edit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [edit]);

  useInterval(
    async () => {
      if (liveStatus === LiveStatus.NO_START) return;

      const { module, code } = await getShowConfig({
        showId: taskStore.showId,
      });
      if (code === 200) {
        taskStore.setLiveStatus(module.liveStatus);
        if (module.liveStatus === LiveStatus.Starting) {
          taskStore.setLiveStreamUrl(module.liveStreamUrl);
        }
      }
    },
    3000,
    {
      immediate: true,
    },
  );

  return (
    <div className="edit-header-wrap">
      <div className="left">
        <LeftOutlined className="back-icon" onClick={handleBack} />
        {edit ? (
          <Input
            maxLength={30}
            className="edit-text"
            onBlur={handleSaveTitle}
            value={inputVal}
            ref={inputRef}
            onChange={handleChangeTitle}
          />
        ) : (
          <>
            <div className="view-text">{title}</div>
            <div className="edit-icon" onClick={handleClickTitle}></div>
          </>
        )}
      </div>

      <div className="right">
        <Button
          className="btn generate"
          disabled={!canGenerate}
          onClick={handleGenerate}
        >
          生成
        </Button>
        <Button
          className="btn push"
          type="primary"
          disabled={showStatus !== ShowStatus.Done}
          danger={!!liveStreamUrl}
          loading={liveStatus === LiveStatus.StartGenerating}
          onClick={handlePush}
        >
          {liveStatus === LiveStatus.StartGenerating
            ? '创建中'
            : liveStreamUrl
            ? '停止'
            : '推流'}
        </Button>
        {liveStreamUrl && liveStatus === LiveStatus.Starting && (
          <div>推流地址：{liveStreamUrl}</div>
        )}
      </div>
    </div>
  );
};

export default observer(EditHeader);
