import { makeAutoObservable, runInAction } from 'mobx';
import { createShow, getShowList } from '@renderer/services/home';
import { ShowInfo } from '@renderer/type/home';

class HomeStore {
  loading: boolean = false;
  completed: boolean = false;
  pageSize: number = 20;
  pageNum: number = 1;
  showList: ShowInfo[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  resetHomeListParams() {
    this.pageNum = 1;
    this.loading = false;
    this.completed = false;
  }

  async createShow() {
    const { code, module } = await createShow();
    if (code === 200) {
      return module;
    }
  }

  async getShowList() {
    if (this.loading) return;
    if (this.completed) return;
    runInAction(() => {
      this.loading = true;
    });
    try {
      const { code, module } = await getShowList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
      if (code === 200) {
        runInAction(() => {
          const list = module.list || [];
          this.showList =
            this.pageNum === 1 ? list : [...this.showList, ...list];
          if (list.length > 0) {
            this.pageNum += 1;
          } else {
            this.completed = true;
          }
        });
      }
    } catch (err) {
      console.log('get show list error', err);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export default new HomeStore();
