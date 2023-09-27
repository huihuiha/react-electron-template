import { LeftOutlined } from '@ant-design/icons';
import { Button, Input, InputRef, message } from 'antd';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import taskStore from '@renderer/store/task';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ShowStatus, LiveStatus, ConfigBlockType } from '@renderer/type/task';
import { checkFileName } from '@renderer/utils';
import editSvg from '@renderer/common/images/edit/edit.svg';
import './index.less';

const EditHeader = () => {
  const navigate = useNavigate();

  const showStatus = taskStore.showStatus;
  const liveStatus = taskStore.liveStatus;
  const liveStreamUrl = taskStore.liveStreamUrl;
  const title = taskStore.title;
  const [edit, setEdit] = useState(false);
  const inputRef = useRef<InputRef>(null);

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

  // 是否可以推流
  const canPush = useMemo(() => {
    return showStatus === ShowStatus.Done && liveStatus === LiveStatus.NO_START;
  }, [showStatus, liveStatus]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePush = () => {
    // 切换到“问答配置”面板
    taskStore.setCurTab(ConfigBlockType.qa);
    if (canPush) {
      taskStore.startLive();
    } else {
      taskStore.stopLive();
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
    taskStore.submitCompose();
  };

  useEffect(() => {
    if (edit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [edit]);

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
            <img
              src={editSvg}
              className="edit-icon"
              onClick={handleClickTitle}
            ></img>
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
          danger={liveStatus === LiveStatus.Starting}
          onClick={handlePush}
        >
          {liveStatus === LiveStatus.NO_START ? '推流' : '停止'}
        </Button>
        {liveStreamUrl && liveStatus === LiveStatus.Starting && (
          <div>推流地址：{liveStreamUrl}</div>
        )}
      </div>
    </div>
  );
};

export default observer(EditHeader);
