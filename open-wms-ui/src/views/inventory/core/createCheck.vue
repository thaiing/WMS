<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :fixed-where="state.fixedWhere">
      <template #button-tool2-slot>
        <el-checkbox v-model="state.showAll" @change="onShowAll" label="显示全部" />
      </template>
    </yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>

    <create-check-dialog ref="createCheckCialog" v-model:dataListSelections="state.dataListSelections" v-model:ids="state.ids" v-model:visible="state.createDistConfig.isShowDialog" @on-closed="onClose"></create-check-dialog>
  </div>
</template>

<script setup lang="ts" name="inventory-core-createCheck">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import baseHook from '/@/components/hooks/baseHook';
import { QueryType } from '/@/types/common';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const CreateCheckDialog = defineAsyncComponent(() => import('./components/create-check-dialog.vue'));

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  createDistConfig: {
    // 生成配送派车单对话框
    isShowDialog: false,
    title: '生成盘点单',
  } as any,
  ids: 0,
  //显示全部
  showAll: false,
  fixedWhere: {
    productStorage: {
      queryType: QueryType.GT,
      value: 0,
    },
  },
});
//#endregion

onMounted(() => {});

// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    case 'CreateCheckBill':
      CreateCheckBill();
      return true;
  }
};

// 生成盘点单
const CreateCheckBill = () => {
  let storageId = '';
  let consignorId = '';
  let areaCode = '';
  let channelCode = '';

  let allWhere = base.dataListRef.value.getAllWhere();
  for (const where of allWhere) {
    if (where.column == 'storageId') {
      storageId = where.values + ''?.toString();
    }
    if (where.column == 'consignorId') {
      consignorId = where.values + ''?.toString();
    }
    if (where.column == 'areaCode') {
      areaCode = where.values + ''?.toString();
    }
    if (where.column == 'channelCode') {
      channelCode = where.values + ''?.toString();
    }
  }
  if (storageId == '') {
    proxy.$message.error('请选择仓库');
    return;
  }
  if (consignorId == '') {
    proxy.$message.error('请选择货主');
    return;
  }
  state.createDistConfig.isShowDialog = true;
  proxy.$refs.createCheckCialog.initData(storageId, consignorId, areaCode, channelCode, allWhere);
};
// 关闭窗口刷新列表
const onClose = () => {
  base.dataListRef.value.reload();
};
const onShowAll = () => {
  if (!state.showAll) {
    state.fixedWhere = {
      productStorage: {
        queryType: QueryType.GT,
        value: 0,
      },
    };
  } else {
    state.fixedWhere = {} as any;
  }
  nextTick(() => {
    base.dataListRef.value.loadData();
  });
};
</script>
