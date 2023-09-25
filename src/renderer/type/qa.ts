import { TtsFileInfo } from '@type/common'

/**
 * @file 问答列表
 */

/**
 * 回复方
 */
export enum AnswererType {
  /**
   * 主播
   */
  Main = 0,
  /**
   * 助播
   */
  Help = 1
}

/**
 * 打断类型
 */
export enum InterruptType {
  /**
   * 智能打断
   */
  Intelligent = 0,
  /**
   * 不打断
   */
  NotBreaking = 1
}

/**
 * 问答信息
 */
export type QaInfo = {
  id?: number
  /**
   * 关联节目的id
   */
  showId?: number
  /**
   * 是否使用
   */
  used: boolean
  /**
   * 回复方（0:主播，1:助播）
   */
  answerer: AnswererType
  /**
   * 打断类型（0: 智能打断，1:不打断）
   */
  interruptType: InterruptType
  /**
   * 关键词列表
   */
  keywordList: string[]
  /**
   * 上传的音频列表
   */
  answerAudioList: TtsFileInfo[]
}
