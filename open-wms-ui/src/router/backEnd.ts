import { RouteRecordRaw } from 'vue-router';
import { storeToRefs } from 'pinia';
import pinia from '/@/stores/index';
import { useUserInfo } from '/@/stores/userInfo';
import { useRequestOldRoutes } from '/@/stores/requestOldRoutes';
import { NextLoading } from '/@/utils/loading';
import { dynamicRoutes, notFoundAndNoPower } from '/@/router/routeBack';
import { formatTwoStageRoutes, formatFlatteningRoutes, router } from '/@/router/index';
import { useRoutesList } from '/@/stores/routesList';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { useMenuApi } from '/@/api/menu/index';

import { useUserStore } from '/@/stores/modules/user';
import { postData } from '../api/common/baseApi';
import to from 'await-to-js';
import { Session } from '../utils/storage';
import { useThemeConfig } from '/@/stores/themeConfig';

const userStore = useUserStore(pinia);
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

// 后端控制路由

// 引入 api 请求接口
const menuApi = useMenuApi();

/**
 * 获取目录下的 .vue、.tsx 全部文件
 * @method import.meta.glob
 * @link 参考：https://cn.vitejs.dev/guide/features.html#json
 */
const layouModules: any = import.meta.glob('../layout/routerView/*.{vue,tsx}');
const viewsModules: any = import.meta.glob('../views/**/*.{vue,tsx}');
const dynamicViewsModules: Record<string, Function> = Object.assign({}, { ...layouModules }, { ...viewsModules });

/**
 * 后端控制路由：初始化方法，防止刷新时路由丢失
 * @method NextLoading 界面 loading 动画开始执行
 * @method useUserInfo().setUserInfos() 触发初始化用户信息 pinia
 * @method useRequestOldRoutes().setRequestOldRoutes() 存储接口原始路由（未处理component），根据需求选择使用
 * @method setAddRoute 添加动态路由
 * @method setFilterMenuAndCacheTagsViewRoutes 设置路由到 pinia routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 * @param isNotLoadRouter to.meta.isNotLoadRouter:不加载菜单
 */
export async function initBackEndControlRoutes(isNotLoadRouter?: boolean) {
  // 界面 loading 动画开始执行
  if (window.nextLoading === undefined && !isNotLoadRouter) NextLoading.start();
  // 无 token 停止执行下一步
  if (!userStore.token) return false;
  // 触发初始化用户信息 pinia
  // https://gitee.com/lyt-top/vue-next-admin/issues/I5F1HP
  await useUserInfo().setUserInfos();
  if (!isNotLoadRouter) {
    // 获取路由菜单数据
    const res = await getBackEndControlRoutes();
    userStore.isLoadedMenu = true;
    // 无登录权限时，添加判断
    // https://gitee.com/lyt-top/vue-next-admin/issues/I64HVO
    if (res!.data.length <= 0) return Promise.resolve(true);
    // 存储接口原始路由（未处理component），根据需求选择使用
    useRequestOldRoutes().setRequestOldRoutes(JSON.parse(JSON.stringify(res!.data)));

    // 获取默认首页
    let home = '/home';
    if (res?.data.length) {
      let dynamicPath = res?.data[0].meta?.dynamicPath as string;
      home = dynamicPath || res?.data[0].path;
    }
    themeConfig.value.defaultHome = home;
    // 处理路由（component），替换 dynamicRoutes（/@/router/route）第一个顶级 children 的路由
    dynamicRoutes[0].children = await backEndComponent(res!.data);
    dynamicRoutes[0].redirect = home; // 根路径 / 跳转到设置home下面
  }
  // 添加动态路由
  await setAddRoute();
  // 设置路由到 pinia routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
  setFilterMenuAndCacheTagsViewRoutes();
}

/**
 * 设置路由到 pinia routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 * @description 用于左侧菜单、横向菜单的显示
 * @description 用于 tagsView、菜单搜索中：未过滤隐藏的(isHide)
 */
export async function setFilterMenuAndCacheTagsViewRoutes() {
  const storesRoutesList = useRoutesList(pinia);
  storesRoutesList.setRoutesList(dynamicRoutes[0].children as any);
  setCacheTagsViewRoutes();
}

/**
 * 缓存多级嵌套数组处理后的一维数组
 * @description 用于 tagsView、菜单搜索中：未过滤隐藏的(isHide)
 */
export function setCacheTagsViewRoutes() {
  const storesTagsView = useTagsViewRoutes(pinia);
  storesTagsView.setTagsViewRoutes(formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes))[0].children);
}

/**
 * 处理路由格式及添加捕获所有路由或 404 Not found 路由
 * @description 替换 dynamicRoutes（/@/router/route）第一个顶级 children 的路由
 * @returns 返回替换后的路由数组
 */
export function setFilterRouteEnd() {
  let filterRouteEnd: any = formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes));
  // notFoundAndNoPower 防止 404、401 不在 layout 布局中，不设置的话，404、401 界面将全屏显示
  // 关联问题 No match found for location with path 'xxx'
  filterRouteEnd[0].children = [...filterRouteEnd[0].children, ...notFoundAndNoPower];
  return filterRouteEnd;
}

/**
 * 添加动态路由
 * @method router.addRoute
 * @description 此处循环为 dynamicRoutes（/@/router/route）第一个顶级 children 的路由一维数组，非多级嵌套
 * @link 参考：https://next.router.vuejs.org/zh/api/#addroute
 */
export async function setAddRoute() {
  let routerList = await setFilterRouteEnd();
  routerList.forEach((route: RouteRecordRaw) => {
    router.addRoute(route);
  });
}

/**
 * 请求后端路由菜单接口
 * @description isRequestRoutes 为 true，则开启后端控制路由
 * @returns 返回后端路由菜单数据
 */
export async function getBackEndControlRoutes() {
  let url = '/system/core/menu/getRouters';
  let params = {};
  let [err, res] = await to(postData(url, params));
  if (err) {
    setTimeout(async () => {
      // 清除缓存/token等
      await userStore.logout();
      Session.clear();
      // 使用 reload 时，不需要调用 resetRoute() 重置路由
      window.location.reload();
    }, 1500);
    return;
  }
  let menuList: RouteRecordRaw[] = res?.data;
  // menuList = menuList.concat(dynamicRoutes[0].children); // 其他参考
  // 模拟 admin 与 test
  // const stores = useUserInfo(pinia);
  // const { userInfos } = storeToRefs(stores);
  // const auth = userInfos.value.roles[0];
  // 管理员 admin
  // if (auth === 'admin') return menuApi.getAdminMenu();
  // 其它用户 test
  // else return menuApi.getTestMenu();
  return {
    data: menuList,
  };
}

/**
 * 重新请求后端路由菜单接口
 * @description 用于菜单管理界面刷新菜单（未进行测试）
 * @description 路径：/src/views/system/menu/component/addMenu.vue
 */
export async function setBackEndControlRefreshRoutes() {
  await getBackEndControlRoutes();
}

/**
 * 后端路由 component 转换
 * @param routes 后端返回的路由表数组
 * @returns 返回处理成函数后的 component
 */
export function backEndComponent(routes: any) {
  if (!routes) return;
  return routes.map((item: any) => {
    if (item.component) item.component = dynamicImport(dynamicViewsModules, item.component as string);
    item.children && backEndComponent(item.children);
    return item;
  });
}

/**
 * 后端路由 component 转换函数
 * @param dynamicViewsModules 获取目录下的 .vue、.tsx 全部文件
 * @param component 当前要处理项 component
 * @returns 返回处理成函数后的 component
 */
export function dynamicImport(dynamicViewsModules: Record<string, Function>, component: string) {
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    const k = key.replace(/..\/views|../, '');
    return k.startsWith(`${component}`) || k.startsWith(`/${component}`);
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return dynamicViewsModules[matchKey];
  }
  if (matchKeys?.length > 1) {
    return false;
  }
}
