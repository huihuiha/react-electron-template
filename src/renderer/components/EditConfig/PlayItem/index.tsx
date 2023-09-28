import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Radio, RadioChangeEvent, Switch } from 'antd';
import cls from 'classnames';
import { useRef, useState } from 'react';
import {
  PlayAnswerer,
  PlayAudioInfo,
  ShowPlayAudioInfo,
} from '@renderer/type/play';
import sceneStore from '@renderer/store/scene';
import './index.less';
import { savePlayAudio } from '@renderer/services/play';
import AudioPlayer, { IMethods } from '@renderer/components/Common/AudioPlayer';
import { formatTime } from '@renderer/utils';

import playIcon from '@renderer/common/images/edit/play.svg';
import pauseIcon from '@renderer/common/images/edit/pause.svg';

type IPlayItemInner = {
  item: ShowPlayAudioInfo | PlayAudioInfo;
  /**
   * 是否是副本
   */
  isBack: boolean;
  /**
   * 是否展示副本
   */
  showBack: boolean;
  /**
   * 是否有副本
   */
  hasBack?: boolean;
  /**
   * 序号
   */
  index: number;
  /**
   * 是否展示副本
   */
  onShowBackChange?: (show: boolean) => void;
};

enum AudioStatus {
  Playing = 'playing',
  Pause = 'pause',
  End = 'end',
}

const Item: React.FC<IPlayItemInner> = ({
  item,
  isBack,
  index,
  showBack,
  hasBack,
  onShowBackChange,
}) => {
  // 控制音频播放的
  const audioRef = useRef<IMethods>(null);

  // 音频总时长
  const [audioTime, setAudioTime] = useState<number>(0);

  // 当前播放时长
  const [audioCurTime, setAudioCurTime] = useState<number>(0);

  const [audioPlayStatus, setAudioPlayStatus] = useState<AudioStatus>(
    AudioStatus.End,
  );

  const handleShowBack = () => {
    onShowBackChange && onShowBackChange(!showBack);
  };

  const handlePlayerConfig = async (answerer: PlayAnswerer) => {
    try {
      await savePlayAudio({
        pageId: sceneStore.curSceneId,
        id: item.id,
        answerer: answerer,
      });

      sceneStore.updatePlayAudio(item.id, 'answerer', answerer);
    } catch (e) {
      console.error(e);
    }
  };

  // 是否使用切换
  const handleUse = async (checked: boolean) => {
    await savePlayAudio({
      pageId: sceneStore.curSceneId,
      id: item.id,
      used: checked,
    });

    sceneStore.updatePlayAudio(item.id, 'used', checked);
  };

  // 删除(正、副本)音频
  const handleDeletePlay = async () => {
    await sceneStore.deletePlayAudio([item.id], isBack, item);
  };

  // 试听
  const handleAudioPlay = () => {
    if (audioPlayStatus === AudioStatus.Playing) {
      audioRef.current?.pause();
      setAudioPlayStatus(AudioStatus.Pause);
    } else {
      audioRef.current?.play();
      setAudioPlayStatus(AudioStatus.Playing);
    }
  };

  return (
    <div
      className={cls('play-item', {
        'back-item': isBack,
      })}
    >
      <div className="play-header">
        <div className="num">
          {isBack ? '副本' : '音频'}
          {index + 1}
        </div>
        <div className="delete" onClick={handleDeletePlay}></div>
      </div>

      <div className="play-content">
        {/* 音频相关区域 */}
        <div className="left-wrap">
          <div className="play-msg">
            <div className="play-title">{item.title}</div>
            <div className="player">
              <span className="title">播放方</span>
              <Radio.Group
                // TODO: v0.1不支持
                disabled={true}
                onChange={(e) => handlePlayerConfig(e.target.value)}
                value={item.answerer}
              >
                <Radio className="item" value={PlayAnswerer.Anchor}>
                  主播
                </Radio>
                <Radio className="item" value={PlayAnswerer.Assistant}>
                  助播
                </Radio>
              </Radio.Group>
            </div>
          </div>

          <div className="audio-wrap" onClick={handleAudioPlay}>
            <img
              src={
                audioPlayStatus === AudioStatus.Playing ? pauseIcon : playIcon
              }
              className="play-audio"
            ></img>
            <div className="play-time">
              {formatTime(audioCurTime)} / {formatTime(audioTime)}
            </div>
          </div>
        </div>

        {/* 设置相关区域 */}
        <div className="play-control">
          <div className="use"></div>
          <div className="use">
            <span className="title">是否使用</span>
            <Switch
              defaultChecked
              size="small"
              checked={item.used}
              onChange={handleUse}
            />
          </div>
        </div>
      </div>

      {!isBack && hasBack && (
        <div className="play-back" onClick={handleShowBack}>
          副本({(item as ShowPlayAudioInfo).copyAudioList.length})
          {showBack ? (
            <UpOutlined className="back-icon" />
          ) : (
            <DownOutlined className="back-icon" />
          )}
        </div>
      )}

      <AudioPlayer
        ref={audioRef}
        audioUrl={item.url}
        onEnded={() => {
          setAudioCurTime(0);
          setAudioPlayStatus(AudioStatus.End);
        }}
        onGetAllTime={(time: number) => setAudioTime(time)}
        onGetCurTime={(time: number) => setAudioCurTime(time)}
      ></AudioPlayer>
    </div>
  );
};

type IProps = {
  /**
   * 音频序号
   */
  index: number;
  /**
   * 音频信息
   */
  audio: ShowPlayAudioInfo;
};

const playItem: React.FC<IProps> = ({ audio, index }) => {
  const [showBack, setShowBack] = useState<boolean>(false);

  return (
    <>
      <Item
        item={audio}
        index={index}
        isBack={false}
        hasBack={!!audio.copyAudioList?.length}
        showBack={showBack}
        onShowBackChange={setShowBack}
      ></Item>

      {/* 副本 */}
      {showBack &&
        audio.copyAudioList.map((item, index) => (
          <Item
            item={item}
            key={index}
            index={index}
            showBack={false}
            isBack={true}
          />
        ))}
    </>
  );
};

export default playItem;
