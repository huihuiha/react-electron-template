/**
 * 用户相关的数据
 */
import { makeAutoObservable, runInAction } from 'mobx';
import { message } from 'antd';
import {
  getTaskDetail,
  pushStream,
  stopPushStream,
  submitCompose,
  saveInteraction,
  batchDeleteInteraction,
  updateShow,
} from '@renderer/services/task';
import sceneStore from './scene';
import {
  LivePlatform,
  LiveStatus,
  ShowStatus,
  ConfigBlockType,
  ModuleStyle,
} from '@renderer/type/task';
import { QaInfo, AnswererType, InterruptType } from '@renderer/type/qa';
import { SubmitComposeParams, UpdateShowParams } from '@renderer/type/request';
import { ShowPlayAudioInfo } from '@renderer/type/play';
import { TtsFileInfo } from '@renderer/type/common';

const DEFAULT_QA_FORM = {
  used: true,
  answerer: AnswererType.Main,
  interruptType: InterruptType.Intelligent,
  keywordList: [],
  answerAudioList: [],
};

class TaskStore {
  _debug_id: number = -1;
  curTab: ConfigBlockType = ConfigBlockType.playList;

  /**
   * 节目id
   */
  showId: number = -1;
  /**
   * 节目名称
   */
  title: string = '';
  /**
   * 直播间地址
   */
  liveRoomUrl: string = '';
  /**
   * 直播平台
   */
  livePlatform: LivePlatform | undefined = LivePlatform.TaoBao;
  /**
   * 节目状态
   */
  showStatus: ShowStatus = ShowStatus.Draft;
  /**
   * 直播状态
   */
  liveStatus: LiveStatus = LiveStatus.NO_START;
  /**
   * 推流地址
   */
  liveStreamUrl: string = '';

  /**
   * 新增/编辑问答时的表单信息
   */
  qaForm: QaInfo = DEFAULT_QA_FORM;
  /**
   * 问答列表
   */
  interactionList: QaInfo[] = [];

  constructor() {
    makeAutoObservable(this);
    // chrome mobx插件调试专用
    (window as any).mobxDebugTaskStore = () => {
      this.setDebugId();
    };
  }

  get disabledOperate() {
    return this.liveStatus === LiveStatus.Starting;
  }

  // chrome mobx插件调试专用，在chrome控制台执行window.mobxDebugTaskStore()即可触发mobx action，从而看到最新的状态值。
  setDebugId = () => {
    this._debug_id += 1;
  };

  setShowId = (id: number) => {
    this.showId = id;
  };

  setCurTab = (tab: ConfigBlockType) => {
    this.curTab = tab;
  };

  setLivePlatform(val: LivePlatform) {
    this.livePlatform = val;
  }

  setLiveRoomUrl(url: string) {
    this.liveRoomUrl = url;
  }

  setQaForm(obj: Partial<QaInfo>) {
    this.qaForm = {
      ...this.qaForm,
      ...obj,
    };
  }

  resetQaForm() {
    this.qaForm = DEFAULT_QA_FORM;
  }

  addAudioToQaForm(audio: TtsFileInfo) {
    this.qaForm.answerAudioList.push(audio);
  }

  setInteractionList(list: QaInfo[]) {
    this.interactionList = list;
  }

  /**
   * 获取任务详情
   */
  async getTaskDetail() {
    const { code, module } = await getTaskDetail({ showId: this.showId });
    if (code === 200 && module) {
      runInAction(() => {
        const {
          title,
          livePlatform,
          liveRoomUrl,
          showStatus,
          liveStatus,
          liveStreamUrl,
          sceneList,
          interactionList,
        } = module;

        this.title = title;
        this.liveRoomUrl = liveRoomUrl;
        this.livePlatform =
          (livePlatform as number) === 0 ? undefined : livePlatform;
        this.showStatus = showStatus;
        this.liveStatus = liveStatus;

        if (liveStatus === LiveStatus.Starting) {
          this.liveStreamUrl = liveStreamUrl;
        }

        this.interactionList = (interactionList || []).map((item) => ({
          ...item,
          keywordList: item.keywordList ?? [],
        }));

        sceneStore.init(sceneList || []);
      });
    }
  }

  setLiveStatus(status: LiveStatus) {
    this.liveStatus = status;
  }

  setLiveStreamUrl(url: string) {
    this.liveStreamUrl = url;
  }

  /**
   * 推流
   */
  async startLive() {
    try {
      const { module, code } = await pushStream({ showId: this.showId });
      if (code === 200 && module) {
        runInAction(() => {
          this.liveStatus = LiveStatus.StartGenerating;
          message.success('创建成功');
        });
      } else {
        message.error('推流失败');
      }
    } catch (e) {
      message.error('推流失败');
    }
  }

  /**
   * 停止推流
   */
  async stopLive() {
    try {
      const { module, code } = await stopPushStream({ showId: this.showId });
      if (code === 200 && module) {
        runInAction(() => {
          this.liveStatus = LiveStatus.NO_START;
          this.liveStreamUrl = '';
        });
      }
    } catch (e) {
      console.log('【停止推流失败】', e);
    }
  }

  /**
   * 提交合成
   */
  async submitCompose() {
    try {
      const params: SubmitComposeParams = {
        showId: this.showId,

        liveConfig: {
          sceneList: sceneStore.sceneList.map((item) => {
            // 获取音频列表配置项
            const audioList = item.sortAudioList
              .filter((audio) => audio.used)
              .map((audio) => {
                return {
                  answerer: audio.answerer,
                  fileKey: audio.fileKey,
                  copyAudioIdList: (
                    (audio as ShowPlayAudioInfo)?.copyAudioList || []
                  ).map((item) => ({
                    answerer: item.answerer,
                    fileKey: item.fileKey,
                  })),
                };
              });

            // 获取
            const humanModel = item.moduleList.find(
              (item) => item.style === ModuleStyle.Human,
            );

            return {
              audioList,
              modelKey: humanModel?.prop1!,
            };
          }),
        },
      };

      const { code } = await submitCompose(params);

      if (code === 200) {
        runInAction(() => {
          this.showStatus = ShowStatus.Done;

          message.success('生成成功');
        });
      } else {
        message.error('生成失败');
      }
    } catch (e) {
      message.error('生成失败');
    }
  }

  /**
   * 更新节目信息
   */
  async updateShow(params: Partial<UpdateShowParams>, isUpdatePage = true) {
    await updateShow({
      ...params,
      showId: this.showId,
    });
    // 更新页面数据
    isUpdatePage && this.getTaskDetail();
  }

  /***
   * 设置节目标题
   */
  async setTitle(title: string) {
    this.title = title;
  }

  async saveInteraction(target: QaInfo, cb?: () => void) {
    try {
      const { code, msg } = await saveInteraction({
        showId: this.showId,
        ...target,
      });
      if (code === 200) {
        message.success(`${target.id === undefined ? '新增' : '修改'}成功`);
        // 更新问答列表
        this.getTaskDetail();
        cb && cb();
      } else {
        message.error(msg);
      }
    } catch {
      message.error('网络异常');
    }
  }

  async batchDeleteInteraction(ids: number[]) {
    try {
      const { code, msg } = await batchDeleteInteraction(ids);
      if (code === 200) {
        message.success(`删除成功`);
        // 更新问答列表
        this.getTaskDetail();
      } else {
        message.error(msg);
      }
    } catch {
      message.error('网络异常');
    }
  }
}

export default new TaskStore();
