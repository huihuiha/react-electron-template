export enum Actions {
  Download = 'download',
  Delete = 'delete',
  Edit = 'edit',
  Play = 'play'
}

export enum TaskStatus {
  DRAFT = 'NOT_COMMIT', // 未提交
  PROCESSING = 'PROCESSING', // 正在生成中
  COMPLETED = 'COMPLETED', // 生成完毕
  FAILED = 'FAILED', // 生成失败
  INIT = 'INIT', // 未开始
  CANCELLED = 'CANCELLED' // 已取消
}

export interface ShowInfo {
  id: number
  title: string
  // 视频生成状态 （本期不做）（0：未生成（草稿），1：等待中，2：生成中，4：生成完毕）
  showStatus: number
  // 开播状态（直播状态）（0：未开播，1：开播中）
  liveStatus: number
  // 直播配置id
  showConfigId: number
  previewImgUrl: string
  updateTime: number
}

export enum MenuType {
  /** 侧边栏菜单 */
  sideMenu = 'sideMenu',
  /** 其他菜单 */
  otherMenu = 'otherMenu'
}
