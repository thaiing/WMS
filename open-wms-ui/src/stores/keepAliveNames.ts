import { defineStore } from 'pinia';
import { RouteLocationNormalizedLoaded } from 'vue-router';

/**
 * 路由缓存列表
 * @methods setCacheKeepAlive 设置要缓存的路由 names（开启 Tagsview）
 * @methods addCachedView 添加要缓存的路由 names（关闭 Tagsview）
 * @methods delCachedView 删除要缓存的路由 names（关闭 Tagsview）
 * @methods delOthersCachedViews 右键菜单`关闭其它`，删除要缓存的路由 names（关闭 Tagsview）
 * @methods delAllCachedViews 右键菜单`全部关闭`，删除要缓存的路由 names（关闭 Tagsview）
 */
export const useKeepALiveNames = defineStore('keepALiveNames', {
  state: (): KeepAliveNamesState => ({
    keepAliveNames: [],
    cachedViews: [],
  }),
  actions: {
    async setCacheKeepAlive(data: Array<string>) {
      this.keepAliveNames = data;
    },
    async addCachedView(view: any) {
      let name = view.name;
      if (view?.params?.id) {
        name = 'amis-amis-engine-' + view.params.id;
      }
      if (view?.params?.bizId) {
        name += '-' + view.params.bizId;
      }
      if (view.meta.isKeepAlive) this.cachedViews?.push(name);
    },
    async delCachedView(view: any) {
      let name = view.name;
      if (view?.params?.id) {
        name = 'amis-amis-engine-' + view.params.id;
      }
      if (view?.params?.bizId) {
        name += '-' + view.params.bizId;
      }
      const index = this.cachedViews.indexOf(name);
      index > -1 && this.cachedViews.splice(index, 1);
    },
    async delOthersCachedViews(view: any) {
      let name = view.name;
      if (view?.params?.id) {
        name = 'amis-amis-engine-' + view.params.id;
      }
      if (view?.params?.bizId) {
        name += '-' + view.params.bizId;
      }
      if (view.meta.isKeepAlive) this.cachedViews = [name];
      else this.cachedViews = [];
    },
    async delAllCachedViews() {
      this.cachedViews = [];
    },
  },
});
