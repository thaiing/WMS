<template>
  <el-menu
    :router="false"
    :default-active="state.defaultActive"
    background-color="transparent"
    :collapse="state.isCollapse"
    :unique-opened="getThemeConfig.isUniqueOpened"
    :collapse-transition="false"
    :popper-offset="0"
    popper-class="wms-sidebar-popper"
    @select="handleMenuSelect"
  >
    <template v-for="menuItem in menuLists">
      <el-sub-menu :index="getPath(menuItem)" v-if="menuItem.children && menuItem.children.length > 0" :key="getPath(menuItem)">
        <template #title>
          <SvgIcon :name="menuItem.meta.icon" />
          <span>{{ $t(menuItem.meta.title) }}</span>
        </template>
        <SubItem :children="menuItem.children" />
      </el-sub-menu>
      <template v-else>
        <el-menu-item :index="getPath(menuItem)" :key="getPath(menuItem)">
          <SvgIcon :name="menuItem.meta.icon" />
          <template #title v-if="!menuItem.meta.isLink || (menuItem.meta.isLink && menuItem.meta.isIframe)">
            <span>{{ $t(menuItem.meta.title) }}</span>
          </template>
          <template #title v-else>
            <a class="w100" @click.prevent="onALinkClick(menuItem)">{{ $t(menuItem.meta.title) }}</a>
          </template>
        </el-menu-item>
      </template>
    </template>
  </el-menu>
</template>

<script setup lang="ts" name="navMenuVertical">
import { defineAsyncComponent, reactive, computed, onMounted, watch } from 'vue';
import { useRoute, onBeforeRouteUpdate, RouteRecordRaw, NavigationFailure, RouteLocationNormalizedLoaded } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import other from '/@/utils/other';
import { Local } from '/@/utils/storage';
import mittBus from '/@/utils/mitt';
const router = useRouter();

// 引入组件
const SubItem = defineAsyncComponent(() => import('/@/layout/navMenu/subItem.vue'));

// 定义父组件传过来的值
const props = defineProps({
  // 菜单列表
  menuList: {
    type: Array<RouteRecordRaw>,
    default: () => [],
  },
});

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const route = useRoute();

const state = reactive({
  // 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
  defaultActive: '0',
  isCollapse: false,
  routeParams: '', // 路由参数
});

// 获取父级菜单数据
const menuLists = computed(() => {
  return <RouteItems>props.menuList;
});
// 获取布局配置信息
const getThemeConfig = computed(() => {
  return themeConfig.value;
});
// 菜单高亮（详情时，父级高亮）
const setParentHighlight = (currentRoute: RouteLocationNormalizedLoaded) => {
  const { path, meta } = currentRoute;

  let menuItem = getMenuItemByFullPath(currentRoute.fullPath);
  let menuId = menuItem?.meta?.menuId;
  if (meta?.isHide) {
    if (meta?.activeMenu) {
      let menuItem = props.menuList.find((item) => item.path === meta?.activeMenu);
      menuId = menuItem?.meta?.menuId;
    }
  }
  return '' + menuId;
};

// 打开外部链接
const onALinkClick = (val: RouteItem) => {
  other.handleOpenLink(val);
};
// 页面加载时
onMounted(() => {
  state.defaultActive = setParentHighlight(route);
});
// 路由更新时
onBeforeRouteUpdate((to) => {
  // 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
  state.defaultActive = setParentHighlight(to);
  const clientWidth = document.body.clientWidth;
  if (clientWidth <= 1200) themeConfig.value.isCollapse = false;
});
// 设置菜单的收起/展开
watch(
  () => themeConfig.value.isCollapse,
  (isCollapse) => {
    document.body.clientWidth <= 1200 ? (state.isCollapse = false) : (state.isCollapse = isCollapse);
  },
  {
    immediate: true,
  }
);
const getPath = (menuItem: RouteItem) => {
  if (menuItem.meta?.menuId) {
    return '' + menuItem.meta.menuId;
  }
  return '0';
};

const getRouterPath = (menuItem: RouteRecordRaw | undefined) => {
  if (menuItem?.meta?.isLink && !menuItem.meta?.isIframe) {
    return '';
  }
  let url = menuItem?.meta?.dynamicPath || menuItem?.path;
  return url;
};
// 路由跳转
const handleMenuSelect = (index: string, indexPath: string[], item: any) => {
  // 外链不跳转路由
  if (item.meta?.isLink && !item.meta?.isIframe) {
    return '';
  }
  let menuItem = findRouteByMenuId(props.menuList, Number(index));
  let path = getRouterPath(menuItem);
  if (path) {
    router.push(path);
  }
  state.routeParams = '';

  // 发送路由参数
  if (menuItem.meta.routeParams) {
    state.routeParams = JSON.stringify(menuItem.meta.routeParams);
    Local.set('routeParams', state.routeParams);
    mittBus.emit('onRouteParams', {
      menuId: menuItem.meta.menuId,
      routeParams: menuItem.meta.routeParams,
    });
  }
};

const getMenuItemByFullPath = (fullPath: string) => {
  return findRouteByPath(props.menuList, fullPath);
};

/**
 * 递归查找匹配路径的路由节点
 * @param {Array} routes 路由配置数组
 * @param {string} targetPath 要查找的目标路径
 * @returns {Object|null} 匹配的路由节点或null
 */
const findRouteByPath = (routes: Array<any>, targetPath: string): any => {
  // 优先尝试精确匹配
  for (const route of routes) {
    let path = route.meta.dynamicPath || route.path;
    // 直接匹配当前路由路径
    if (path === targetPath) {
      return route;
    }

    // 递归查找子路由
    if (route.children) {
      const found = findRouteByPath(route.children, targetPath);
      if (found) return found;
    }
  }

  // 二次遍历处理可能存在的优先级冲突
  return routes.find((route) => route.children && findRouteByPath(route.children, targetPath)) || null;
};

/**
 * 递归查找匹配路径的路由节点
 * @param {Array} routes 路由配置数组
 * @param {string} targetPath 要查找的目标路径
 * @returns {Object|null} 匹配的路由节点或null
 */
const findRouteByMenuId = (routes: Array<any>, menuId: number): any => {
  // 优先尝试精确匹配
  for (const route of routes) {
    // 直接匹配当前路由路径
    if (route.meta.menuId === menuId) {
      return route;
    }

    // 递归查找子路由
    if (route.children) {
      const found = findRouteByMenuId(route.children, menuId);
      if (found) return found;
    }
  }

  // 二次遍历处理可能存在的优先级冲突
  return routes.find((route) => route.children && findRouteByMenuId(route.children, menuId)) || null;
};
</script>

<style scoped lang="scss">
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
	min-width: 0;

	span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
