import { PlayAudioInfo, PlayType, ShowPlayAudioInfo } from './play'
import { ModuleInfo } from './task'

export type SceneInfo = {
  /**
   * 所属节目id
   */
  showId: number
  /**
   * 场景id
   */
  sceneId: number
  /**
   * 场景图fileKey
   */
  previewImgFileKey: string
  /**
   * 场景图
   */
  previewImgUrl: string
  /**
   * 背景图
   */
  backgroundUrl: string
  /**
   * 背景图fileKey
   */
  backgroundFileKey: string
  /**
   * 语音播放id列表
   */
  audioIdList: number[]
  /**
   * 语音播放列表
   */
  audioList: PlayAudioInfo[]
  /**
   * 播放类型
   */
  playType: PlayType
  /**
   * TODO: 画布模块的类型
   */
  mainModule: any[]
  /**
   * 使用的模块（数字人、背景、前景等）
   */
  moduleList: ModuleInfo[]
}

/**
 * 前端展示需要用到的场景信息
 */
export type ShowSceneInfo = SceneInfo & {
  /**
   * 排序后的音频列表
   * 这个列表区分了正副本，在后端概念中并没有正副本的区分，由前端来区分
   */
  sortAudioList: ShowPlayAudioInfo[]
}
