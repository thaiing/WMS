<template>
  <div v-if="config.header.text" :class="['pc-section-header', { 'is-viewer': isViewer }]">
    <div class="pc-section-header__inner" :style="{ display: 'flex', 'text-align': config.header.textAlign, 'background-color': config.header.bgColor, 'font-size': config.header.fontSize, margin: config.header.margin, padding: config.header.padding, 'border-bottom': config.header.borderBottom }">
      <div style="width: 100%">
        {{ config.header.text }}
      </div>
      <div v-if="config.search.showAll" style="flex-basis: auto; white-space: nowrap; margin-right: 5px">
        <svg-icon name="yrt-chaxun2" :size="14" @click="state.isShowDialog = true"></svg-icon>
      </div>
    </div>

    <el-dialog v-model="state.isShowDialog" draggable width="920px" title="查询条件" append-to-body>
      <div v-if="config.search.showAll" class="flex pb-25 mb-25">
        <el-select v-if="config.search.showStorage" v-model="config.search.storageId" clearable class="m-2" placeholder="选择仓库" style="width: 140px">
          <el-option v-for="(item, index) in state.storageList" :key="index" :label="item.storageName" :value="item.storageId"></el-option>
        </el-select>
        <el-select v-if="config.search.showConsignor" v-model="config.search.consignorId" clearable class="m-2" placeholder="选择货主" style="width: 140px">
          <el-option v-for="(item, index) in state.consignorList" :key="index" :label="item.consignorName" :value="item.consignorId"></el-option>
        </el-select>
        <el-date-picker v-if="config.search.showDateScope" v-model="config.search.dateScope" type="daterange" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :shortcuts="shortcuts" style="width: 240px; flex-grow: inherit; margin-left: 5px" />
        <el-button type="primary" class="ml-10" @click="search">查询</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="pc-stat">
import { reactive, toRefs, getCurrentInstance, computed } from 'vue';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import dayjs from 'dayjs';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
// 事件定义
const emit = defineEmits(['on-search']);

const shortcuts = [
  {
    text: '今天',
    value: () => {
      const start = dayjs(new Date()).format('YYYY-MM-DD') + ' 00:00:00';
      const end = dayjs(new Date()).format('YYYY-MM-DD') + ' 23:59:59';
      return [start, end];
    },
  },
  {
    text: '昨天',
    value: () => {
      const start = dayjs(new Date()).add(-1, 'days').format('YYYY-MM-DD') + ' 00:00:00';
      const end = dayjs(new Date()).add(-1, 'days').format('YYYY-MM-DD') + ' 23:59:59';
      return [start, end];
    },
  },
  {
    text: '最近1周',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: '最近1月',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: '最近3月',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
  {
    text: '最近半年',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
      return [start, end];
    },
  },
  {
    text: '最近一年',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
      return [start, end];
    },
  },
];

//#region 定义属性
const props = defineProps({
  // 预览模式
  isViewer: {
    type: Boolean,
    default: false,
  },
  // 配置参数
  config: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  // 显示图片
  isShowDialog: false,
  // 仓库下拉框值
  storageList: [] as any,
  // 货主下拉框值
  consignorList: [] as any,

  storageName: null,
  storageId: null,
  consignorId: null,
  consignorName: null,
});
//#endregion

// 监听
watch(
  () => props.config,
  () => {
    init();
  },
  { deep: true }
);

// 页面加载时
onMounted(() => {
  getStorageList();
  getConsignorNames();
});
const init = () => {};
// 获得仓库列表
const getStorageList = async () => {
  const url = '/basic/storage/storage/getList';
  const params = {};
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    state.storageList = res.data;
  }
};
// 获取货主
const getConsignorNames = async () => {
  const url = '/basic/base/consignor/getList';
  const params = {};
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    state.consignorList = res.data;
  }
};
// 查询按钮
const search = () => {
  emit('on-search');
  state.isShowDialog = false;
};
</script>

<style lang="scss" scoped>
.pc-section-header.is-viewer {
  .pc-section-header__inner {
    min-height: 52px;
    align-items: center;
    padding: 0 18px !important;
    margin: 0 !important;
    border-bottom: 1px solid #edf0f5 !important;
    background: #fff !important;
    color: #172033 !important;
    font-size: 17px !important;
    font-weight: 650;
    line-height: 1.35;
    text-align: left !important;
  }

  :deep(.svg-icon) {
    width: 30px;
    height: 30px;
    padding: 7px;
    border-radius: 8px;
    color: #2563eb;
    background: #eff6ff;
    cursor: pointer;
  }
}
</style>
