<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter">
      <!--自定义按钮插槽-->
      <template #footer-button-region="{ formData, details }">
        <!--审核-->
        <el-button :disabled="state.btnReadOnly.multiAuditing" type="success" @click="multiAuditing()">
          <template #icon>
            <svg-icon name="icon-shenpi6" class="text-size-n" :size="14" />
          </template>
          审核
        </el-button>
        <!--分拣-->
        <el-button :disabled="state.btnReadOnly.sorting" type="success" @click="sorting()">
          <template #icon>
            <svg-icon name="icon-fenjianchuku" class="text-size-n" :size="14" />
          </template>
          分拣
        </el-button>
      </template>
    </yrt-editor>
  </div>
</template>

<script setup lang="ts" name="inventory-replenishment-replenishment">
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

//审核
const multiAuditing = async () => {
  // 选中行id
  let flag = false;
  if (['新建', '待审核'].indexOf(masterData.value.billStatus) == -1) {
    flag = true;
  }
  if (flag) {
    proxy.$message.error('只有新建或者待审核的单据才可以进行审核');
    return;
  }

  const url = '/inventory/replenishment/replenishment/multiAuditing';
  const params = {
    id: masterData.value.replenishmentId,
    // log日志条件
    menuId: state.dataOptions.menuId,
    tableName: state.dataOptions.tableName,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    proxy.common.showMsg(res);
    base.dataListRef.value.reload(); // 刷新列表数据
  }
};
// 分拣
const sorting = async () => {
  // 选中行id
  let flag = false;
  if (['审核成功'].indexOf(masterData.value.billStatus) == -1) {
    flag = true;
  }
  if (flag) {
    proxy.$message.error('只有审核成功的单据才可以分拣');
    return;
  }

  const url = '/inventory/replenishment/replenishment/sorting';
  const params = {
    id: masterData.value.replenishmentId,
    // log日志条件
    menuId: state.dataOptions.menuId,
    tableName: state.dataOptions.tableName,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    proxy.common.showMsg(res);
    base.dataListRef.value.reload(); // 刷新列表数据
  }
};
</script>
