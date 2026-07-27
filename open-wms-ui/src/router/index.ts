import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import pinia from '/@/stores/index';
import { storeToRefs } from 'pinia';
import { useKeepALiveNames } from '/@/stores/keepAliveNames';
import { useRoutesList } from '/@/stores/routesList';
import { useThemeConfig } from '/@/stores/themeConfig';
import { Session } from '/@/utils/storage';
import { staticRoutes, notFoundAndNoPower } from '/@/router/routeBack';
import { initFrontEndControlRoutes } from '/@/router/frontEnd';
import { initBackEndControlRoutes } from '/@/router/backEnd';

import { to as tos } from 'await-to-js';
import { useUserStore } from '/@/stores/modules/user';
import { NextLoading } from '../utils/loading';
import { postData } from '../api/common/baseApi';
const userStore = useUserStore(pinia);

/**
 * 1、前端控制路由时：isRequestRoutes 为 false，需要写 roles，需要走 setFilterRoute 方法。
 * 2、后端控制路由时：isRequestRoutes 为 true，不需要写 roles，不需要走 setFilterRoute 方法），
 * 相关方法已拆解到对应的 `backEnd.ts` 与 `frontEnd.ts`（他们互不影响，不需要同时改 2 个文件）。
 * 特别说明：
 * 1、前端控制：路由菜单由前端去写（无菜单管理界面，有角色管理界面），角色管理中有 roles 属性，需返回到 userInfo 中。
 * 2、后端控制：路由菜单由后端返回（有菜单管理界面、有角色管理界面）
 */

// 读取 `/src/stores/themeConfig.ts` 是否开启后端控制路由配置
const storesThemeConfig = useThemeConfig(pinia);
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isRequestRoutes } = themeConfig.value;

/**
 * 创建一个可以被 Vue 应用程序使用的路由实例
 * @method createRouter(options: RouterOptions): Router
 * @link 参考：https://next.router.vuejs.org/zh/api/#createrouter
 */
export const router = createRouter({
  history: createWebHistory(),
  /**
   * 说明：
   * 1、notFoundAndNoPower 默认添加 404、401 界面，防止一直提示 No match found for location with path 'xxx'
   * 2、backEnd.ts(后端控制路由)、frontEnd.ts(前端控制路由) 中也需要加 notFoundAndNoPower 404、401 界面。
   *    防止 404、401 不在 layout 布局中，不设置的话，404、401 界面将全屏显示
   */
  routes: [...notFoundAndNoPower, ...staticRoutes],
});

/**
 * 路由多级嵌套数组处理成一维数组
 * @param arr 传入路由菜单数据数组
 * @returns 返回处理后的一维路由菜单数组
 */
export function formatFlatteningRoutes(arr: any) {
  if (arr.length <= 0) return [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].children) {
      arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1));
    }
  }
  return arr;
}

/**
 * 一维数组处理成多级嵌套数组（只保留二级：也就是二级以上全部处理成只有二级，keep-alive 支持二级缓存）
 * @description isKeepAlive 处理 `name` 值，进行缓存。顶级关闭，全部不缓存
 * @link 参考：https://v3.cn.vuejs.org/api/built-in-components.html#keep-alive
 * @param arr 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成 `定义动态路由（dynamicRoutes）` 的格式
 */
export function formatTwoStageRoutes(arr: any) {
  if (arr.length <= 0) return false;
  const newArr: any = [];
  const cacheList: Array<string> = [];
  arr.forEach((v: any) => {
    if (v.path === '/') {
      newArr.push({ component: v.component, name: v.name, path: v.path, redirect: v.redirect, meta: v.meta, children: [] });
    } else {
      // 判断是否是动态路由（xx/:id/:name），用于 tagsView 等中使用
      // 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
      if (v.path && v.path.indexOf('/:') > -1) {
        v.meta.isDynamic = true;
        v.meta.isDynamicPath = v.path;
      }
      newArr[0].children.push({ ...v });
      // 存 name 值，keep-alive 中 include 使用，实现路由的缓存
      // 路径：/@/layout/routerView/parent.vue
      if (newArr[0].meta.isKeepAlive && v.meta.isKeepAlive) {
        cacheList.push(v.name);
        const stores = useKeepALiveNames(pinia);
        stores.setCacheKeepAlive(cacheList);
      }
    }
  });
  return newArr;
}

const whiteList = ['/login-sso', '/login-sso-scan', '/system/print', '/decorate/design']; //  no redirect whitelist
const simplePageList = ['/amis/scan/']; //  no redirect whitelist

/**
 * 校验是否存在白名单中
 * @param path
 */
function checkWhite(path: string) {
  var isOK = false;
  whiteList.forEach((item) => {
    if (path.indexOf(item) >= 0) isOK = true;
  });
  return isOK;
}

/**
 * 校验是否存在白名单中
 * @param path
 */
function checkSimplePage(path: string) {
  var isOK = false;
  simplePageList.forEach((item) => {
    if (path.indexOf(item) >= 0) isOK = true;
  });
  return isOK;
}

// 路由加载前
router.beforeEach(async (to, from, next) => {
  if (checkWhite(to.path)) {
    //  在免登录白名单，直接进入
    next();
    return;
  }
  NProgress.configure({ showSpinner: false });
  if (to.meta.title) NProgress.start();
  const token = userStore.token; // Session.get('token');
  if (to.path === '/login' && !token) {
    next();
    NProgress.done();
  } else {
    if (!token) {
      let params = to.query ? to.query : to.params;
      delete params.redirect;
      next(`/login?redirect=${to.path}&params=${JSON.stringify(params)}`);
      Session.clear();
      NProgress.done();
      ElMessageBox.close(); // 取消弹窗提示重新登录
    } else if (token && to.path === '/login') {
      let redirect = to.query.redirect;
      if (redirect && redirect.indexOf('http') === 0) {
        // SSO跳转
        let url = '/sso/getRedirectUrl';
        let params = {
          redirect: redirect,
          mode: 'ticket',
          client: '',
        };
        let [err, res] = await tos(postData(url, params));
        if (err) return;
        if (res && res.result) {
          location.href = res.data;
        } else {
          // 系统已退出
          let params = to.query ? to.query : to.params;
          next(`/login?redirect=${redirect}&params=${JSON.stringify(params)}`);
          Session.clear();
          NProgress.done();
        }
      } else {
        next(`${themeConfig.value.defaultHome}?redirect=${redirect}&params=${JSON.stringify(to.params)}`);
        NProgress.done();
      }
    } else if (token && to.path === '/system/tenant/tenant-list') {
      next();
      NProgress.done();
    } else {
      if (useUserStore().roles.length === 0) {
        // 获取用户信息、角色信息、权限信息
        // isRelogin.show = true;
        // 判断当前用户是否已拉取完user_info信息
        const [err] = await tos(useUserStore().getInfo());
        if (err) {
          await useUserStore().logout();
          ElMessage.error(err);
          next({ path: '/' });
          return;
        }
      }

      const storesRoutesList = useRoutesList(pinia);
      const { routesList } = storeToRefs(storesRoutesList);
      if (routesList.value.length === 0 && !userStore.isLoadedMenu) {
        if (isRequestRoutes) {
          // to.meta.isNotLoadRouter:不加载菜单
          let isNotLoadRouter: boolean = !!(to.meta && to.meta.isNotLoadRouter);

          // 后端控制路由：路由数据初始化，防止刷新时丢失
          await initBackEndControlRoutes(isNotLoadRouter);
          let allRoutes: any[] = formatFlatteningRoutes(routesList.value);
          if (allRoutes.some((item) => item.path === to.path || item.meta.dynamicPath === to.path) || to.meta.isHide) {
            let redirect = to.query.redirect as string;
            if (redirect) {
              next({ path: redirect });
            } else {
              // 解决刷新时，一直跳 404 页面问题，关联问题 No match found for location with path 'xxx'
              // to.query 防止页面刷新时，普通路由带参数时，参数丢失。动态路由（xxx/:id/:name"）isDynamic 无需处理
              next({ path: to.path, query: to.query });
            }
          } else {
            if (checkSimplePage(to.path)) {
              //  跳转到自己的页面
              next();
              return;
            } else {
              next({ path: '/' }); // 没有权限的页面直接跳转到首页
            }
          }
        } else {
          // https://gitee.com/lyt-top/vue-next-admin/issues/I5F1HP
          await initFrontEndControlRoutes();
          next({ path: to.path, query: to.query });
        }
      } else {
        next();
        NProgress.done();
      }
    }
  }
});

// 路由加载后
router.afterEach(() => {
  NProgress.done();
  NextLoading.done(); // 后面增加的2024-05-16
});

// 导出路由
export default router;
