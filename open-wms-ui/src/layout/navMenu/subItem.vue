<template>
  <template v-for="menuItem in children">
    <el-sub-menu :index="menuItem.path" :key="menuItem.path" v-if="menuItem.children && menuItem.children.length > 0">
      <template #title>
        <SvgIcon :name="menuItem.meta.icon" />
        <span>{{ $t(menuItem.meta.title) }}</span>
      </template>
      <sub-item :children="menuItem.children" />
    </el-sub-menu>
    <template v-else>
      <el-menu-item :index="getPath(menuItem)" :key="getPath(menuItem)">
        <template v-if="!menuItem.meta.isLink || (menuItem.meta.isLink && menuItem.meta.isIframe)">
          <SvgIcon :name="menuItem.meta.icon" />
          <span>{{ $t(menuItem.meta.title) }}</span>
        </template>
        <template v-else>
          <a class="w100" @click.prevent="onALinkClick(menuItem)">
            <SvgIcon :name="menuItem.meta.icon" />
            {{ $t(menuItem.meta.title) }}
          </a>
        </template>
      </el-menu-item>
    </template>
  </template>
</template>

<script setup lang="ts" name="navMenuSubItem">
import { computed } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import other from '/@/utils/other';

// 定义父组件传过来的值
const props = defineProps({
  // 菜单列表
  children: {
    type: Array<RouteRecordRaw>,
    default: () => [],
  },
});

// 获取父级菜单数据
const children = computed(() => {
  return <RouteItems>props.children;
});
// 打开外部链接
const onALinkClick = (menuItem: RouteItem) => {
  other.handleOpenLink(menuItem);
};
const getPath = (menuItem: RouteItem) => {
  if (menuItem.meta?.menuId) {
    return '' + menuItem.meta.menuId;
  }
  return '0';
};
</script>
