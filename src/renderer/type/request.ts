import { PlayAnswerer } from './play'
import { SceneInfo } from './scene'
import { LivePlatform } from './task'

/**
 * 保存场景接口参数
 */
export type SaveParams = Partial<
  Pick<
    SceneInfo,
    | 'showId'
    | 'sceneId'
    | 'previewImgFileKey'
    | 'backgroundFileKey'
    | 'playType'
    | 'audioIdList'
  >
>

/**
 * 更新节目信息接口请求
 */
export type UpdateShowParams = {
  showId: number
  title?: string
  previewImgFileKey?: string
  livePlatform?: LivePlatform
  liveRoomUrl?: string
}

/**
 * 提交合成（生成直播的配置）
 */
export type SubmitComposeParams = {
  showId: number
  liveConfig: {
    sceneList: {
      audioList: {
        answerer: PlayAnswerer
        fileKey: string
        copyAudioIdList: {
          answerer: PlayAnswerer
          fileKey: string
        }[]
      }[]
      modelKey: number
    }[]
  }
}
