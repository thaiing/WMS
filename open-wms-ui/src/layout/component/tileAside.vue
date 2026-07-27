<template>
  <div class="h100" v-show="!isTagsViewCurrenFull" style="--el-aside-width: 114px">
    <el-aside class="layout-aside" width="114px">
      <Logo v-if="setShowLogo" />
      <el-scrollbar class="flex-auto" ref="layoutAsideScrollbarRef" @mouseenter="onAsideEnterLeave(true)" @mouseleave="onAsideEnterLeave(false)">
        <!-- <Vertical :menuList="state.menuList" /> -->
        <div class="first-menu">
          <template v-for="(item, index) in state.menuList">
            <div class="first-menu-item" :class="[state.activeItem === item ? state.enterClass : '', state.rootPathList[state.rootPathList.length - 1] === getPath(item) ? 'active' : '']" @mouseenter="(e) => menuItemEnter(e, item)" @mouseleave="menuItemLeave" @click="routerGo(item)">
              <svg-icon name="ele-Avatar" class="item-icon" :size="14" />
              <div class="menu-name">{{ item.meta.title }}</div>
              <svg-icon v-if="item.children" name="ele-ArrowRight" class="item-icon-right" :size="14" />
            </div>
          </template>
        </div>
      </el-scrollbar>
      <div class="aside-footer" @click.stop>
        <div class="first-menu-item" @mouseenter="(e) => bottomMenuItemEnter(e, 'message')">
          <svg-icon name="ele-Avatar" class="item-icon" :size="14" />
          <div class="menu-name">消息</div>
        </div>
        <div class="first-menu-item" @mouseenter="(e) => bottomMenuItemEnter(e, 'setting')">
          <svg-icon name="ele-Avatar" class="item-icon" :size="14" />
          <div class="menu-name">设置</div>
          <svg-icon name="ele-ArrowRight" class="item-icon-right" :size="14" />
        </div>
        <div class="first-menu-item" @mouseenter="(e) => bottomMenuItemEnter(e, 'my')">
          <svg-icon name="ele-Avatar" class="item-icon" :size="14" />
          <div class="menu-name">我的</div>
          <svg-icon name="ele-ArrowRight" class="item-icon-right" :size="14" />
        </div>
        <div class="first-menu-item" @mouseenter="(e) => bottomMenuItemEnter(e, 'help')">
          <svg-icon name="ele-Avatar" class="item-icon" :size="14" />
          <div class="menu-name">帮助</div>
          <svg-icon name="ele-ArrowRight" class="item-icon-right" :size="14" />
        </div>
      </div>
    </el-aside>

    <!--弹窗菜单-->
    <div ref="subMenuGroupRef" class="sub-menu-group" :class="state.showSubMenu" :style="{ width: state.showSubMenuGroupWidth, height: state.showSubMenuGroupHeight }" @mouseleave="subMenuGroupLeave" @click.stop>
      <el-scrollbar>
        <div v-masonry transition-duration="0.3s" class="sub-menu-box" item-selector=".sub-menu-item-box" column-width=".sub-menu-item-box">
          <template v-for="(item, index) in state.activeItem?.children" :key="index + '-' + item.meta.menuId">
            <div v-masonry-tile class="sub-menu-item-box">
              <template v-if="!item.children">
                <!--没有子级菜单-->
                <div class="sub-menu-item" :class="[getActiveMenu(item) ? 'active' : '']" style="padding-left: 0" @mouseenter="(e) => subMenuItemEnter(e, item)" @mouseleave="subMenuItemLeave" @click="routerGo(item)">
                  <svg-icon name="ele-Avatar" class="item-icon" :size="14" />
                  <div class="menu-name">{{ item.meta.title }}</div>
                </div>
              </template>
              <template v-else>
                <!--包含子级菜单-->
                <div class="title">{{ item.meta.title }}</div>
                <template v-for="(subItem, index) in item.children">
                  <div class="sub-menu-item" :class="[getActiveMenu(subItem) ? 'active' : '']" @mouseenter="(e) => subMenuItemEnter(e, subItem)" @mouseleave="subMenuItemLeave" @click="routerGo(subItem)">
                    <svg-icon name="ele-Avatar" class="item-icon" :size="14" />
                    <div class="menu-name">{{ subItem.meta.title }}</div>
                  </div>
                </template>
              </template>
            </div>
          </template>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts" name="layoutAside">
import { defineAsyncComponent, reactive, computed, watch, onBeforeMount, ref } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate, RouteRecordRaw } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useRoutesList } from '/@/stores/routesList';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import mittBus from '/@/utils/mitt';
const { locale, t } = useI18n();
import { useI18n } from 'vue-i18n';
import pinia from '/@/stores/index';
import { useUserStore } from '/@/stores/modules/user';
const userStore = useUserStore(pinia);
import { Session, Local } from '/@/utils/storage';
import other from '/@/utils/other';

// 引入组件
const Logo = defineAsyncComponent(() => import('/@/layout/logo/index.vue'));
const Vertical = defineAsyncComponent(() => import('/@/layout/navMenu/vertical.vue'));
const router = useRouter();
const route = useRoute();

// 定义变量内容
const layoutAsideScrollbarRef = ref();
const subMenuGroupRef = ref();
const stores = useRoutesList();
const storesThemeConfig = useThemeConfig();
const storesTagsViewRoutes = useTagsViewRoutes();
const { routesList } = storeToRefs(stores);
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);

const state = reactive<AsideState>({
  menuList: [],
  clientWidth: 0,
  defaultActivePath: (route.meta.isDynamic ? route.meta.isDynamicPath : route.path) as any,

  activeItem: {},
  enterClass: '',
  activeItemSub: {},
  showSubMenu: 'hidden',
  rootPathList: [], // 查找到的层级路由，从根级到叶级
  showSubMenuGroupWidth: '800px', //子菜单宽度
  showSubMenuGroupHeight: '410px', //子菜单高度
  otherMenuList: {
    setting: {
      path: '',
      meta: {
        title: '设置',
      },
      children: [
        {
          path: '',
          meta: {
            title: '基础信息',
            menuId: 1000,
          },
          children: [
            {
              path: '',
              meta: {
                title: '公司信息',
                menuId: 1001,
              },
            },
            {
              path: '',
              meta: {
                title: '部门管理',
                menuId: 1002,
              },
            },
            {
              path: '',
              meta: {
                title: '员工管理',
                menuId: 1003,
              },
            },
            {
              path: '',
              meta: {
                title: '内部公共',
                menuId: 1004,
              },
            },
          ],
        },
        {
          path: '',
          meta: {
            title: '仓储设置',
            menuId: 1002,
          },
          children: [
            {
              path: '',
              meta: {
                title: '仓库管理',
              },
            },
            {
              path: '',
              meta: {
                title: '货位管理',
              },
            },
            {
              path: '',
              meta: {
                title: '货位定义',
              },
            },
            {
              path: '',
              meta: {
                title: '上架策略',
              },
            },
          ],
        },
        {
          path: '',
          meta: {
            title: '开发工具',
            menuId: 1003,
          },
          children: [
            {
              path: '',
              meta: {
                title: '用户UI设计器',
              },
            },
            {
              path: '',
              meta: {
                title: 'BI设计器',
              },
            },
            {
              path: '',
              meta: {
                title: '单据编码设置',
              },
            },
            {
              path: '',
              meta: {
                title: '单据打印设计器',
              },
            },
          ],
        },
        {
          path: '',
          meta: {
            title: '系统管理',
            menuId: 1004,
          },
          children: [
            {
              path: '',
              meta: {
                title: '系统参数',
              },
            },
            {
              path: '',
              meta: {
                title: '系统日志',
              },
            },
            {
              path: '',
              meta: {
                title: '登录日志',
              },
            },
            {
              path: '',
              meta: {
                title: '消息队列',
              },
            },
          ],
        },
      ],
    },
    my: {
      path: '',
      meta: {
        title: '设置',
        menuId: 2001,
      },
      children: [
        {
          path: '/system/tenant/tenant-list',
          meta: {
            title: '切换账号',
          },
        },
        {
          path: '/system/tenant/tenant-buy',
          meta: {
            title: '服务购买',
          },
        },
        {
          path: '/system/tenant/tenant-info',
          meta: {
            title: '账号信息',
            menuId: 2207,
          },
        },
        {
          path: '/system/tenant/user-info',
          meta: {
            title: '个人信息',
            menuId: 2208,
          },
        },
        {
          path: '/system/logout',
          meta: {
            title: '退出登录',
          },
        },
      ],
    },
    help: {
      path: '',
      meta: {
        title: '帮助',
        menuId: 3001,
      },
      children: [
        {
          path: '',
          meta: {
            title: '产品手册',
          },
        },
        {
          path: '',
          meta: {
            title: '在线客服',
          },
        },
        {
          path: '',
          meta: {
            title: 'CEO邮箱',
          },
        },
        {
          path: '',
          meta: {
            title: '客服电话',
          },
        },
      ],
    },
  }, // 其他菜单
  routeParams: '', // 路由参数
});

// 设置菜单展开/收起时的宽度
const setCollapseStyle = computed(() => {
  const { layout, isCollapse, menuBar } = themeConfig.value;
  const asideBrTheme = ['#FFFFFF', '#FFF', '#fff', '#ffffff'];
  const asideBrColor = asideBrTheme.includes(menuBar) ? 'layout-el-aside-br-color' : '';
  // 判断是否是手机端
  if (state.clientWidth <= 1200) {
    if (isCollapse) {
      document.body.setAttribute('class', 'el-popup-parent--hidden');
      const asideEle = document.querySelector('.layout-container') as HTMLElement;
      const modeDivs = document.createElement('div');
      modeDivs.setAttribute('class', 'layout-aside-mobile-mode');
      asideEle.appendChild(modeDivs);
      modeDivs.addEventListener('click', closeLayoutAsideMobileMode);
      return [asideBrColor, 'layout-aside-mobile', 'layout-aside-mobile-open'];
    } else {
      // 关闭弹窗
      closeLayoutAsideMobileMode();
      return [asideBrColor, 'layout-aside-mobile', 'layout-aside-mobile-close'];
    }
  } else {
    if (layout === 'columns' || layout === 'classic') {
      // 分栏布局、经典布局，菜单收起时宽度给 1px，防止切换动画消失
      if (isCollapse) return [asideBrColor, 'layout-aside-pc-1'];
      else return [asideBrColor, 'layout-aside-pc-220'];
    } else {
      // 其它布局给 64px
      if (isCollapse) return [asideBrColor, 'layout-aside-pc-64'];
      else return [asideBrColor, 'layout-aside-pc-220'];
    }
  }
});
// 设置显示/隐藏 logo
const setShowLogo = computed(() => {
  let { layout, isShowLogo } = themeConfig.value;
  return isShowLogo && layout === 'tile';
});
// 关闭移动端蒙版
const closeLayoutAsideMobileMode = () => {
  const el = document.querySelector('.layout-aside-mobile-mode');
  el?.setAttribute('style', 'animation: error-img-two 0.3s');
  setTimeout(() => {
    el?.parentNode?.removeChild(el);
  }, 300);
  const clientWidth = document.body.clientWidth;
  if (clientWidth <= 1200) themeConfig.value.isCollapse = false;
  document.body.setAttribute('class', '');
};
// 设置/过滤路由（非静态路由/是否显示在菜单中）
const setFilterRoutes = () => {
  if (themeConfig.value.layout === 'columns') return false;
  state.menuList = filterRoutesFun(routesList.value);
};
// 路由过滤递归函数
const filterRoutesFun = <T extends RouteItem>(arr: T[]): T[] => {
  return arr
    .filter((item: T) => !item.meta?.isHide)
    .map((item: T) => {
      item = Object.assign({}, item);
      if (item.children) item.children = filterRoutesFun(item.children);
      return item;
    });
};
// 设置菜单导航是否固定（移动端）
const initMenuFixed = (clientWidth: number) => {
  state.clientWidth = clientWidth;
};
// 鼠标移入、移出
const onAsideEnterLeave = (bool: Boolean) => {
  let { layout } = themeConfig.value;
  if (layout !== 'columns') return false;
  if (!bool) mittBus.emit('restoreDefault');
  // 开启 `分栏菜单鼠标悬停预加载` 才设置，防止 columnsAside.vue 监听 pinia.state
  if (themeConfig.value.isColumnsMenuHoverPreload) stores.setColumnsMenuHover(bool);
};
// 页面加载时
onMounted(() => {
  state.rootPathList = [];
  state.defaultActivePath = getRootPath(state.menuList, route);
  state.routeParams = Local.get('routeParams');
});
// 页面加载前
onBeforeMount(() => {
  initMenuFixed(document.body.clientWidth);
  setFilterRoutes();
  // 此界面不需要取消监听(mittBus.off('setSendColumnsChildren))
  // 因为切换布局时有的监听需要使用，取消了监听，某些操作将不生效
  mittBus.on('setSendColumnsChildren', (res: MittMenu) => {
    state.menuList = res.children;
  });
  // 开启经典布局分割菜单时，设置菜单数据
  mittBus.on('setSendClassicChildren', (res: MittMenu) => {
    let { layout, isClassicSplitMenu } = themeConfig.value;
    if (layout === 'classic' && isClassicSplitMenu) {
      // 经典布局分割菜单只要一项子级时，收起左侧导航菜单
      res.children.length <= 1 ? (themeConfig.value.isCollapse = true) : (themeConfig.value.isCollapse = false);
      state.menuList = [];
      state.menuList = res.children;
    }
  });
  // 开启经典布局分割菜单时，重新处理菜单数据
  mittBus.on('getBreadcrumbIndexSetFilterRoutes', () => {
    setFilterRoutes();
  });
  // 监听窗口大小改变时(适配移动端)
  mittBus.on('layoutMobileResize', (res: LayoutMobileResize) => {
    initMenuFixed(res.clientWidth);
    closeLayoutAsideMobileMode();
  });
});
// 监听 themeConfig 配置文件的变化，更新菜单 el-scrollbar 的高度
watch(
  () => [themeConfig.value.isShowLogoChange, themeConfig.value.isShowLogo, themeConfig.value.layout, themeConfig.value.isClassicSplitMenu],
  ([isShowLogoChange, isShowLogo, layout, isClassicSplitMenu]) => {
    if (isShowLogoChange !== isShowLogo) {
      if (layoutAsideScrollbarRef.value) layoutAsideScrollbarRef.value.update();
    }
    if (layout === 'classic' && isClassicSplitMenu) return false;
  }
);
// 监听用户权限切换，用于演示 `权限管理 -> 前端控制 -> 页面权限` 权限切换不生效
watch(
  () => routesList.value,
  () => {
    setFilterRoutes();
  }
);
// 路由更新时
onBeforeRouteUpdate((to) => {
  state.rootPathList = [];
  state.defaultActivePath = getRootPath(state.menuList, to);

  const clientWidth = document.body.clientWidth;
  if (clientWidth <= 1200) themeConfig.value.isCollapse = false;
});
// 菜单高亮（详情时，父级高亮）
const setParentHighlight = (currentRoute: RouteToFrom) => {
  const { path, meta } = currentRoute;
  const pathSplit = meta?.isDynamic ? meta.isDynamicPath!.split('/') : path!.split('/');
  if (meta?.isHide) {
    if (meta?.activeMenu) {
      return meta?.activeMenu;
    } else {
      return pathSplit.splice(0, 3).join('/');
    }
  } else return path;
};

// 递归找到根级菜单
const getRootPath = (childNodes: Array<any>, currentRoute: RouteToFrom): any => {
  let currentPath = currentRoute.meta?.activeMenu || currentRoute.path;
  //获取同级后一个节点，node父节点的所有子节点，node当前节点
  for (let i = 0; i < childNodes.length; i++) {
    let path = getPath(childNodes[i]);
    if (path === currentPath) {
      state.rootPathList.push(path);
      return path;
    } else if (childNodes[i].children) {
      //有下级，递归查询
      let childPath = getRootPath(childNodes[i].children, currentRoute);
      if (childPath) {
        state.rootPathList.push(path);
        return childPath;
      }
    }
  }
  return null;
};
const hiddenSubMenu = () => {
  state.enterClass = '';
  state.showSubMenu = 'hidden';
};

// 主菜单鼠标悬停
const menuItemEnter = (e: any, item: any) => {
  if (!e.target) return;
  state.activeItem = item;
  state.showSubMenuGroupWidth = state.activeItem.children && state.activeItem.children.length <= 2 ? '400px' : '800px';
  if (Number(item.meta.subMenuWidth) > 0) state.showSubMenuGroupWidth = item.meta.subMenuWidth + 'px'; // 后端设置了自定义宽度

  state.showSubMenuGroupHeight = '410px'; //子菜单宽度

  state.enterClass = 'enter';
  if (item.children) {
    state.showSubMenu = 'show-sub-menu-group';
  } else {
    state.showSubMenu = 'hidden';
  }
  setTimeout(() => {
    let rect = e.target.getBoundingClientRect();
    let maxTop = document.body.clientHeight - subMenuGroupRef.value.clientHeight;
    if (rect.top < maxTop) maxTop = rect.top;
    subMenuGroupRef.value.style.top = maxTop + 'px';
  }, 50);

  document.addEventListener('click', hiddenSubMenu);
};
const menuItemLeave = (e: MouseEvent) => {};

// 子菜单鼠标悬停
const subMenuItemEnter = (e: MouseEvent, subItem: any) => {
  state.activeItemSub = subItem;
};
const subMenuItemLeave = (e: MouseEvent) => {
  state.activeItemSub = null;
};
const subMenuGroupLeave = (e: MouseEvent) => {
  state.enterClass = '';
  state.showSubMenu = 'hidden';
  document.removeEventListener('click', hiddenSubMenu);
};

// 路由调整
const routerGo = (item: any) => {
  if (item.path === '/system/logout') {
    ElMessageBox({
      closeOnClickModal: false,
      closeOnPressEscape: false,
      title: t('message.user.logOutTitle'),
      message: t('message.user.logOutMessage'),
      showCancelButton: true,
      confirmButtonText: t('message.user.logOutConfirm'),
      cancelButtonText: t('message.user.logOutCancel'),
      buttonSize: 'default',
      beforeClose: (action: any, instance: any, done: any) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true;
          instance.confirmButtonText = t('message.user.logOutExit');
          setTimeout(() => {
            done();
            setTimeout(() => {
              instance.confirmButtonLoading = false;
            }, 300);
          }, 700);
        } else {
          done();
        }
      },
    })
      .then(async () => {
        // 清除缓存/token等
        await userStore.logout();
        Session.clear();
        // 使用 reload 时，不需要调用 resetRoute() 重置路由
        window.location.reload();
      })
      .catch(() => {});
  } else if (item.meta.isLink && !item.meta.isIframe) {
    other.handleOpenLink(item);
  } else if (item.path && !item.children) {
    let path = getPath(item);
    if (path) {
      router.push(path);
    }
    hiddenSubMenu();
    state.routeParams = '';

    // 发送路由参数
    if (item.meta.routeParams) {
      state.routeParams = JSON.stringify(item.meta.routeParams);
      Local.set('routeParams', state.routeParams);
      mittBus.emit('onRouteParams', {
        menuId: item.meta.menuId,
        routeParams: item.meta.routeParams,
      });
    }
  }
};

// 下面菜单鼠标悬停
const bottomMenuItemEnter = (e: any, item: string) => {
  if (!e.target) return;
  state.activeItem = state.otherMenuList ? state.otherMenuList[item] : null;
  if (!state.activeItem) {
    state.showSubMenu = 'hidden';
    return;
  }

  let rect = e.target.getBoundingClientRect();
  let maxTop = document.body.clientHeight - 410;
  if (['my', 'help'].some((s) => item === s)) {
    state.showSubMenuGroupWidth = '200px';
    state.showSubMenuGroupHeight = '250px'; //子菜单高度
    maxTop = document.body.clientHeight - 230;
  } else {
    state.showSubMenuGroupWidth = '400px';
    state.showSubMenuGroupHeight = '410px'; //子菜单高度
    if (rect.top < maxTop) maxTop = rect.top;
  }

  subMenuGroupRef.value.style.top = maxTop + 'px';
  state.enterClass = 'enter';
  if (state.activeItem.children) {
    state.showSubMenu = 'show-sub-menu-group';
  } else {
    state.showSubMenu = 'hidden';
  }
  document.addEventListener('click', hiddenSubMenu);
};
const bootomMenuItemLeave = (e: MouseEvent) => {
  state.showSubMenu = 'hidden';
};
const getPath = (routeItem: RouteItem) => {
  // 外链不跳转路由
  if (routeItem.meta?.isLink && !routeItem.meta?.isIframe) {
    return null;
  }
  return routeItem.meta?.dynamicPath || routeItem.path;
};

// 获得焦点菜单
const getActiveMenu = (item: any) => {
  // 鼠标悬停状态色
  if (state.activeItemSub === item) {
    return true;
  }

  let isActive = state.rootPathList[0] === getPath(item);
  if (item.meta.routeParams && state.routeParams != JSON.stringify(item.meta.routeParams)) {
    isActive = false;
  }

  return isActive;
};
</script>

<style lang="scss" scoped>
.layout-aside {
  display: flex;
  flex-direction: column;

  .aside-footer {
    color: white;
    height: 170px;
    .first-menu-item {
      display: flex;
      flex-direction: row;
      height: 40px;
      align-items: center;
      cursor: pointer;
      &.active {
        background-color: rgb(33, 141, 212);
      }
      &.enter {
        background-color: rgb(1, 106, 175);
      }
      .item-icon {
        width: 25px;
        justify-content: flex-end;
        display: flex;
      }
      .menu-name {
        flex: 1;
        padding-left: 10px;
      }
      .item-icon-right {
        width: 25px;
        display: flex;
        justify-content: flex-start;
      }
    }
  }
}
.first-menu {
  display: flex;
  flex-direction: column;
  color: white;
  .first-menu-item {
    display: flex;
    flex-direction: row;
    height: 40px;
    align-items: center;
    cursor: pointer;
    &.active {
      background-color: rgb(33, 141, 212);
    }
    &.enter {
      background-color: rgb(1, 106, 175);
    }
    .item-icon {
      width: 25px;
      padding-left: 0px;
    }
    .menu-name {
      flex: 1;
    }
    .item-icon-right {
      width: 25px;
      display: flex;
      justify-content: flex-start;
    }
  }
}
.sub-menu-group {
  position: absolute;
  left: 114px;
  top: 580px;
  z-index: 12000;
  width: 800px;
  height: 450px;
  background-color: rgb(1, 106, 175);
  padding: 20px 0;
  &.hidden {
    display: none;
  }

  .sub-menu-box {
    display: flex;
    flex-direction: row;
    .sub-menu-item-box {
      display: flex;
      flex-direction: column;
      color: white;
      width: 200px;
      & + .sub-menu-item-box {
        border-left: 1px dashed rgb(91, 177, 235);
        transform: translateX(-1px);
      }
      .title {
        color: rgb(196, 196, 196);
        padding-bottom: 5px;
        padding: 0 20px;
        height: 30px;
        display: flex;
        align-items: center;
      }
      .sub-menu-item {
        display: flex;
        flex-direction: row;
        height: 40px;
        align-items: center;
        cursor: pointer;
        padding: 0 20px;
        &.active {
          background-color: rgb(11, 57, 87);
        }
        .item-icon {
          width: 40px;
          padding-left: 10px;
        }
        .menu-name {
          flex: 1;
        }
      }
    }
  }
}
</style>
