<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>

    <!--打印条码弹出页面-->
    <order-barcode ref="barcodeDialogRef" v-model:visible="state.barcodeVisible"></order-barcode>

    <!--新增SN调整单-->
    <snAdjust ref="addSnAdjustRef" :isInitLoad="state.isInitLoad" :isShowDataList="state.isShowDataList"></snAdjust>
  </div>
</template>

<script setup lang="ts" name="inventory-core-inventorySn">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
const snAdjust = defineAsyncComponent(() => import('../operation/snAdjust.vue'));
import baseHook from '/@/components/hooks/baseHook';
const orderBarcode = defineAsyncComponent(() => import('/@/views/inbound/in/components/order-barcode.vue'));

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;
const barcodeDialogRef = ref();

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  // 条码打印对话框
  barcodeVisible: false,

  isInitLoad: false,
  isShowDataList: false,
});
//#endregion

onMounted(() => {});
// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    // 打印SN
    case 'printSN':
      printSN();
      return true;
    case 'addSnAdjust': // 新增事故金额往来
      addSnAdjust(state.dataListSelections);
      return true;
  }
};

const printSN = () => {
  // 得到，明细选中项
  var dataListSelections = state.dataListSelections;
  if (!dataListSelections.length) {
    proxy.$message.error('1至少选择一项！');
    return;
  }
  state.barcodeVisible = true;

  var rows: any[] = JSON.parse(JSON.stringify(dataListSelections));
  rows.forEach((row: any) => {
    row.printQty = 1; // 打印数量
  });
  barcodeDialogRef.value.showData(rows, 'SN');
};

// 新增领料单
const addSnAdjust = (row: any[]) => {
  if (!row.length) {
    proxy.$message.error('至少选择一行！');
    return;
  }
  var snRef = proxy.$refs.addSnAdjustRef;
  var editorRef = snRef.getEditorRef(row);
  editorRef.addData();
  snRef.initData(row, base.detailRows.value);
};
</script>
