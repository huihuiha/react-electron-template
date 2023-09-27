import { PlayAudioInfo, ShowPlayAudioInfo } from '@renderer/type/play';

/**
 * 音频资源排序、归类（根据序号、文件名）
 */
export function sortAudioList(audioList: PlayAudioInfo[]): ShowPlayAudioInfo[] {
  const sortedList: ShowPlayAudioInfo[] = [];
  const copyMap: Map<string, PlayAudioInfo[]> = new Map();

  // 获取副本的map结构
  audioList.forEach((audio) => {
    if (isCopy(audio.title)) {
      const originalTitle = getOriginalTitle(audio.title);
      if (!copyMap.has(originalTitle)) {
        copyMap.set(originalTitle, []);
      }
      const copyList = copyMap.get(originalTitle) || [];

      copyMap.set(originalTitle, [...copyList, audio]);
    } else {
      sortedList.push({ ...audio, copyAudioList: [] });
    }
  });

  // 对副本做一个排序
  copyMap.forEach((val, key) => {
    const sortCopyList = [...val].sort((a, b) => {
      const aFileName = getFileName(a.title);
      const bFileName = getFileName(b.title);
      return aFileName.localeCompare(bFileName);
    });

    copyMap.set(key, sortCopyList);
  });

  // 对正本进行一个排序
  sortedList.sort((a, b) => {
    const aFileName = getFileName(a.title);
    const bFileName = getFileName(b.title);

    return aFileName.localeCompare(bFileName);
  });

  sortedList.forEach((audio) => {
    const originalTitle = audio.title;

    if (copyMap.has(originalTitle)) {
      audio.copyAudioList = copyMap.get(originalTitle) || [];
      copyMap.delete(originalTitle);
    }
  });

  // 处理没有正本的文件，但是文件名又被识别成副本的情况
  copyMap.forEach((val) => {
    sortedList.push(...(val as ShowPlayAudioInfo[]));
  });

  return sortedList;
}

function getFileName(title: string): string {
  const fileName = title.split('.')[0];
  return fileName;
}

/**
 * 是否是副本
 */
function isCopy(title: string): boolean {
  return title.includes('_c_');
}

// 获取文件名的标识
function getOriginalTitle(title: string): string {
  const extension = title.split('.').pop();
  const originalTitle = title.split('_c_')[0] + `.${extension}`;
  return originalTitle;
}
