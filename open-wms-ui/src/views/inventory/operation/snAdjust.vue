<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-if="isShowDataList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :isInitLoad="isInitLoad"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>

    <!--库存SN选择器-->
    <yrt-selector ref="selector-position-dialog" :config="state.selectorSnConfig" v-model:visible="state.selectorSnConfig.visible" @on-selected="onPositionSelected"></yrt-selector>
  </div>
</template>

<script setup lang="ts" name="inventory-operation-adjustsn">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import baseHook from '/@/components/hooks/baseHook';
import { QueryType } from '/@/types/common';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook({
  custoJsonmRoute: '/inventory/operation/snAdjust',
});
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义属性
const props = defineProps({
  // 是否显示列表页面
  isShowDataList: {
    type: Boolean,
    default: () => {
      return true;
    },
  },
  // 打开页面默认时加载数据
  isInitLoad: {
    type: Boolean,
    default: () => {
      return true;
    },
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  // 库存SN选择器
  selectorSnConfig: {
    title: '库存SN选择器',
    width: '1000px',
    visible: false,
    // 配置路由
    router: '/selector/inventorySn',
    url: '/inventory/core/inventorySn',
    fixedWhere: {},
  },
});
//#endregion

onMounted(() => {});

// 编辑页面按钮事件
base.detailButtonClick = (authNode: string, detail: any, btnOpts: any) => {
  switch (authNode) {
    case 'snSelector':
      // 打开库存选择器
      snSelector();
      return true;
  }
};

// 打开库存SN选择器
const snSelector = () => {
  state.selectorSnConfig.visible = true;
};

// 将选择器选择中的数据填充到明细表中
const onPositionSelected = (rows: Array<any>) => {
  rows.forEach((row) => {
    row.snNoTarget = row.snNo;
    row.enableTarget = 1;
  });
  base.editorRef.value.addDetailDataRow(rows);
  state.selectorSnConfig.visible = false;
};

// 明细字段触发改变
base.onDetailChange = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  masterData.value.totalSnCount = detailRows.length;
};

const getEditorRef = (val: any) => {
  base.editorRef.value.addDetailDataRow(val);
  return base.editorRef.value;
};

// 初始化干线运输单业务
const initData = (rows: any[]) => {
  if (!rows) return;
  rows.forEach((item) => {
    item.enableTarget = 1;
    item.snNoTarget = item.snNo;
  });
  base.masterData.value.totalSnCount = rows.length;

  base.editorRef.value.addDetailDataRow(rows, 'storageSnAdjustDetail');
};

// 对外暴露属性和方法
defineExpose({
  getEditorRef,
  initData,
});
</script>
