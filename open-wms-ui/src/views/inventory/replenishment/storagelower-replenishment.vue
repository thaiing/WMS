<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>
  </div>
</template>

<script setup lang="ts" name="inventory-replenishment-storagelower-replenishment">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import baseHook from '/@/components/hooks/baseHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
});
//#endregion

onMounted(() => {});

// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    case 'createBill':
      // 生成补货单
      createBill();
      return true;
    case 'autoToReplenishment':
      // 自动生成补货单
      autoToReplenishment();
      return true;
  }
};
// 生成补货单
const createBill = () => {
  const ids = state.dataListSelections.map((m) => {
    return m['inventoryId'];
  });
  if (!ids.length) {
    proxy.$message.error('至少选中一行！');
    return;
  }
  for (var item of state.dataListSelections) {
    if (item.isCreateReplenishment === 1) {
      proxy.$message.error('已经生成的不允许重复生成！');
      return;
    }
  }

  proxy
    .$confirm('确定要将选中数据生成补货单吗?', '生成补货单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const url = '/composite/StorageLowerReplenishment/toReplenishment';
      const [err, res] = await to(postData(url, state.dataListSelections));
      if (err) {
        return;
      }
      if (res.result) {
        proxy.common.showMsg(res);
        base.dataListRef.value.loadData(); // 刷新列表
      }
    })
    .catch(() => {});
};

// 自动生成补货单
const autoToReplenishment = async () => {
  const url = '/composite/StorageLowerReplenishment/autoToReplenishment';
  const params = {};
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    proxy.common.showMsg(res);
    base.dataListRef.value.loadData(); // 刷新列表
  }
};
</script>
