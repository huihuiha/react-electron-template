enum FileType {
  MP3 = 'mp3',
  M4A = 'm4a'
}

/**
 * 根据文件名字判断文件类型
 */
export function getFileType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase()
  return extension || ''
}

export function isMp3OrM4a(fileName: string): boolean {
  const fileType = getFileType(fileName)
  return fileType === FileType.MP3 || fileType === FileType.M4A
}
