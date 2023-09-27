export interface Pager {
  pageSize: number
  pageNum: number
}

/**
 * tts图片/音频相关信息
 */
export type TtsFileInfo = {
  /**
   * 文件名
   */
  title?: string
  /**
   * 文件内容(filKey)
   */
  content: string
  downloadUrl?: string
}
