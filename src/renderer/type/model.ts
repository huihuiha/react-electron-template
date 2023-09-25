export type ModelInfo = {
  id: number
  modelId: number
  modelKey: number
  name: string

  /**
   * 预览地址
   */
  previewUrl: string
  previewImgId: string

  /**
   * 展示在画布的地址
   */
  tempUrl: string
}
