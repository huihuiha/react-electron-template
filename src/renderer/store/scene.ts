import {
  PlayAudioInfo,
  PlayType,
  ShowPlayAudioInfo,
} from '@renderer/type/play';
import { makeAutoObservable, reaction } from 'mobx';
import taskStore from './task';
import { SceneInfo, ShowSceneInfo } from '@renderer/type/scene';
import { SaveParams } from '@renderer/type/request';
import { saveScene } from '@renderer/services/scene';
import { sortAudioList } from '@renderer/utils/playConfig';
import { deletePlayAudio } from '@renderer/services/play';
import { updateModule } from '@renderer/services/model';
import { ModuleStyle } from '@renderer/type/task';
import { ModelInfo } from '@renderer/type/model';
import { cloneDeep } from 'lodash-es';

/**
 * 场景相关配置
 */
class SceneStore {
  /**
   * 场景信息
   */
  sceneList: ShowSceneInfo[] = [];

  curSceneId: number = -1;

  showId: number = 1;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => taskStore?.showId,
      (showId) => {
        this.showId = showId;
      },
    );
  }

  get curSceneData() {
    return (
      this.sceneList.find(
        (sceneList) => sceneList.sceneId === this.curSceneId,
      ) || ({} as ShowSceneInfo)
    );
  }

  init(sceneList: SceneInfo[]) {
    this.sceneList = sceneList.map((scene) => ({
      ...scene,
      sortAudioList: sortAudioList(scene.audioList),
    }));

    // 默认选中第一个场景
    this.curSceneId = sceneList[0]?.sceneId;
  }

  setCurPlayType(playType: PlayType) {
    this.curSceneData.playType = playType;
  }

  setCurPreviewImgUrl(url: string) {
    this.curSceneData.previewImgUrl = url;
  }

  /**
   * 更新页面(场景)信息
   */
  async updateScene(saveData: SaveParams) {
    return await saveScene({
      ...saveData,
      showId: this.showId,
      sceneId: this.curSceneId,
    });
  }

  /**
   * 增加音频上传列表
   */
  addCurPlayAudioList(audioList: PlayAudioInfo[]) {
    this.curSceneData.audioList = [
      ...this.curSceneData.audioList,
      ...audioList,
    ];
    const sortAudio = sortAudioList(this.curSceneData.audioList);
    this.curSceneData.sortAudioList = sortAudio;
    this.curSceneData.audioIdList = sortAudio.map((item) => item.id);

    return {
      audioIdList: this.curSceneData.audioIdList,
      sortAudioList: this.curSceneData.sortAudioList,
    };
  }

  /**
   * 设置音频列表
   */
  setCurPlayAudioList(audioList: PlayAudioInfo[]) {
    const sortAudio = sortAudioList(audioList);
    this.curSceneData.sortAudioList = sortAudio;
    this.curSceneData.audioIdList = sortAudio.map((item) => item.id);
  }

  /**
   * 直接更新
   */
  setCurSortAudioList(audioList: ShowPlayAudioInfo[]) {
    this.curSceneData.sortAudioList = audioList;

    this.curSceneData.audioIdList = audioList.map((item) => item.id);

    return {
      audioIdList: this.curSceneData.audioIdList,
    };
  }

  /**
   * 删除播放列表音频
   */
  async deletePlayAudio(
    idList: number[],
    isBack: boolean,
    audio?: ShowPlayAudioInfo | PlayAudioInfo,
  ) {
    try {
      let filterIdList: number[] = [];

      // 正文音频的处理
      if (!isBack) {
        // 获取当前音频的副本，做统一删除

        const backIdList =
          ((audio as ShowPlayAudioInfo)?.copyAudioList || []).map(
            (item) => item.id,
          ) || [];

        // 新的音频列表id
        const newAudioIdList = this.curSceneData.audioIdList.filter(
          (id) => !idList.includes(id),
        );

        filterIdList = [...backIdList, ...idList];

        await Promise.all([
          deletePlayAudio({
            // 调用删除音频接口
            sceneId: this.curSceneId,
            idList: filterIdList,
          }),
          // 更新页面信息
          this.updateScene({
            audioIdList: newAudioIdList,
          }),
        ]);
      } else {
        // 副本处理
        filterIdList = [...idList];

        // 调用删除音频接口
        await deletePlayAudio({
          sceneId: this.curSceneId,
          idList: filterIdList,
        });
      }

      // 新的音频列表数组
      this.curSceneData.audioList = this.curSceneData.audioList.filter(
        (item) => !filterIdList.includes(item.id),
      );

      this.setCurPlayAudioList(this.curSceneData.audioList);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * 更新播放列表音频配置
   */
  updatePlayAudio<Key extends keyof PlayAudioInfo>(
    audioId: number,
    key: Key,
    value: PlayAudioInfo[Key],
  ) {
    const audioList = this.curSceneData.audioList.map((audio) => {
      if (audio.id === audioId) {
        return {
          ...audio,
          [key]: value,
        };
      }
      return audio;
    });

    this.curSceneData.audioList = audioList;
    this.curSceneData.sortAudioList = sortAudioList(audioList);
  }

  /**
   * 更新模型
   */
  async updateModule(params: {
    style: ModuleStyle;
    name?: string;
    bizId?: number;
    id: number;
    modelKey: string;
  }) {
    console.log('更新模型参数', params);

    await updateModule({
      pageId: this.curSceneId,
      ...params,
      prop1: params.modelKey,
    });
  }

  /**
   * 更新数字人信息
   */
  setModule(model: ModelInfo) {
    this.curSceneData.moduleList = this.curSceneData.moduleList.map((item) => {
      if (item.style === ModuleStyle.Human) {
        return {
          ...item,
          bizId: model.modelId,
          name: model.name,
        };
      }
      return item;
    });
  }
}

export default new SceneStore();
