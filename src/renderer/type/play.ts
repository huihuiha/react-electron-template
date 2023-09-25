export type PlayAudioInfo = {
  id: number
  /**
   * 文件名
   */
  title: string
  pageId: number
  fileKey: string
  url: string
  /**
   * 是否使用
   */
  used: boolean
  answerer: PlayAnswerer
}

export enum PlayAnswerer {
  /**
   * 主播
   */
  Anchor = 0,
  /**
   * 助播
   */
  Assistant = 1
}

/**
 * 展示的播放列表（区分正副本）
 */
export type ShowPlayAudioInfo = PlayAudioInfo & {
  copyAudioList: Exclude<PlayAudioInfo, 'copyAudioIdList'>[]
}

/**
 * 播放类型
 */
export enum PlayType {
  /**
   * 顺序播放
   */
  Order = 0,
  /**
   * 乱序播放
   */
  Random = 1
}
