import { QaInfo } from './qa';
import { SceneInfo } from './scene';

export type TaskDetail = {
  /**
   * 节目id
   */
  showId: number;
  /**
   * 节目名称
   */
  title: string;
  /**
   * 节目状态
   */
  showStatus: ShowStatus;
  /**
   * 开播状态
   */
  liveStatus: LiveStatus;
  /**
   * 直播地址
   */
  liveRoomUrl: string;
  /**
   * 推流地址
   */
  liveStreamUrl: string;
  /**
   * 直播平台
   */
  livePlatform: LivePlatform;
  /**
   * 问答列表
   */
  interactionList: QaInfo[];
  /**
   * 场景信息
   */
  sceneList: SceneInfo[];
};

export type ModuleInfo = {
  /**
   * 模块id
   */
  id: number;
  /**
   * 模块名称
   */
  name: string;
  /**
   * 模块类型
   */
  style: ModuleStyle;
  /**
   * 如果是数字人，则对应modelId
   */
  bizId: number;

  prop1: string;
};

export enum ModuleStyle {
  /**
   * 数字人
   */
  Human = 1,
}

/**
 * 节目状态
 */
export enum ShowStatus {
  /**
   * 草稿
   */
  Draft = 0,
  /**
   * 等待中
   */
  Waiting = 1,
  /**
   * 生成中
   */
  Generating = 2,
  /**
   * 生成完毕
   */
  Done = 4,
}

/**
 * 直播状态
 */
export enum LiveStatus {
  /**
   * 未开始
   */
  NO_START = 0,
  /**
   * 推流中
   */
  Starting = 1,
}

/**
 * 平台类型
 */
export enum LivePlatform {
  /**
   * 京东
   */
  JingDong = 1,
  /**
   * 淘宝
   */
  TaoBao = 2,
  /**
   * 抖音
   */
  DouYin = 3,
}

export enum ConfigBlockType {
  playList = 'playList',
  human = 'human',
  qa = 'qa',
}
