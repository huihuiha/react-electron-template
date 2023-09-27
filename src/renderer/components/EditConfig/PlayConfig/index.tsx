import { PlayType, ShowPlayAudioInfo } from '@renderer/type/play';
import sceneStore from '@renderer/store/scene';
import { Radio, RadioChangeEvent, Tooltip, Upload, message } from 'antd';
import { observer } from 'mobx-react';
import { useMemo } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import PlayItem from '../PlayItem';
import { isMp3OrM4a } from '@renderer/utils/file';
import { uploadPlayAudios } from '@renderer/services/play';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import './index.less';
import { cloneDeep } from 'lodash-es';
import task from '@renderer/store/task';
import cls from 'classnames';

const tip = `
文件格式：序号_文件名称.文件类型

副本文件格式：序号_文件名称_c_序号.文件类型

注意：需确保副本名称中含有 '_c_'，系统自动将该文件作为同名音频的副本
`;

// TODO: 0.1版本提示
const tipV1 = `文件格式：序号_文件名称.文件类型`;

const PlayConfig = () => {
  const { audioIdList, sortAudioList, playType } = sceneStore.curSceneData;

  const showList = useMemo(() => {
    return (audioIdList || []).map(
      (id) => sortAudioList.find((item) => item.id === id)!,
    ) as ShowPlayAudioInfo[];
  }, [audioIdList, sortAudioList]);

  const handlePlayTypeChange = async (e: RadioChangeEvent) => {
    const playType = e.target.value;
    try {
      await sceneStore.updateScene({
        playType,
      });
      sceneStore.setCurPlayType(playType);
    } catch (e) {}
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const originIndex = result.source.index;
    const targetIndex = result.destination.index;

    // 替换下位置
    const newSlideIds = cloneDeep(showList);
    const [removeItem] = newSlideIds.splice(originIndex, 1);
    newSlideIds.splice(targetIndex, 0, removeItem);

    // 跟新下音频播放列表
    const { audioIdList } = sceneStore.setCurSortAudioList(newSlideIds);

    sceneStore.updateScene({
      audioIdList,
    });
  };

  const beforeUpload = (file: File) => {
    if (!isMp3OrM4a(file.name)) {
      message.error('录音只支持mp3、m4a格式的音频文件!');
      return false;
    }

    const isLt30M = file.size / 1024 / 1024 < 30;
    if (!isLt30M) {
      message.error('音频只支持30M以内的文件!');
    }

    return true;
  };

  const handleAudioChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      return;
    }

    if (info.file.status === 'done') {
      message.success(`成功上传`);
    } else if (info.file.status === 'error') {
      info.file?.error && message.error(info.file?.error);
    }
  };

  const handleUploadReq = async (options: any) => {
    const { onSuccess, onError, file } = options;
    const formData = new FormData();
    formData.append('sceneId', `${sceneStore.curSceneId}`);
    formData.append('file', file);
    formData.append('type', file.type);

    try {
      const { module, code } = await uploadPlayAudios(formData);

      if (code === 200) {
        onSuccess('上传成功~');

        const { audioIdList } = sceneStore.addCurPlayAudioList(module);
        // 更新场景播放列表
        await sceneStore.updateScene({
          audioIdList: audioIdList,
        });
      }
    } catch (e) {
      onError('网络异常，请稍后重试！');
    }
  };

  return (
    <div className="play-config-wrap">
      {/* 音频顺序 */}
      <div className="play-type">
        <span>播放顺序：</span>
        <Radio.Group
          // TODO: v0.1不支持
          disabled={true}
          onChange={handlePlayTypeChange}
          value={playType}
        >
          <Radio value={PlayType.Order}>顺序</Radio>
          <Radio value={PlayType.Random}>乱序</Radio>
        </Radio.Group>
      </div>

      {/* 音频上传 */}
      <Tooltip
        placement="top"
        color="#333"
        overlayInnerStyle={{
          background: 'background: rgba(222, 228, 244, 0.8)',
        }}
        overlayStyle={{
          whiteSpace: 'pre-line',
        }}
        title={tipV1}
      >
        <div className="play-upload">
          <Upload
            disabled={task.disabledOperate}
            name="bgImg"
            showUploadList={false}
            multiple={true}
            maxCount={10}
            beforeUpload={beforeUpload}
            onChange={handleAudioChange}
            customRequest={handleUploadReq}
          >
            <div
              className={cls('upload-wrap', {
                disabled: task.disabledOperate,
              })}
              data-add-bg
            >
              上传音频
            </div>
          </Upload>
        </div>
      </Tooltip>

      {/* 播放列表 */}
      <div className="play-list">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="SCENE_LIST_DROPPABLE">
            {(provided: any) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {showList.map((item, index) => (
                  <Draggable
                    isDragDisabled={task.disabledOperate}
                    key={item.id}
                    draggableId={item.id + ''}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <PlayItem key={item.id} index={index} audio={item} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default observer(PlayConfig);
