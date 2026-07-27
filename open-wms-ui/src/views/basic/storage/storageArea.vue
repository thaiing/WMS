<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :on-delete-before="onDeleteBefore"> </yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="detailButtonClick" :auth-nodes="state.authNodes"> </yrt-editor>
  </div>
</template>

<script setup lang="ts" name="basic-storage-storageArea">
import YrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();

const { baseState, dataListRefName, editorRefName, buttonClick, detailButtonClick, editorInfo } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
});
//#endregion

onMounted(() => {});
base.buttonClick = (authNode: string) => {
  switch (authNode) {
  }
};

// 删除前事件
const onDeleteBefore = (dataOptions: any, rows: any[]) => {
  dataOptions.deleteUrl = '/composite/basic/baseStorageAreaComposite/remove';
  return true;
};
</script>
