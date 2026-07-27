<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :on-delete-before="onDeleteBefore"> </yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="detailButtonClick" :auth-nodes="state.authNodes" @on-edit-load-after="base.onEditLoadAfter">
      <template #blank-baiduMap>
        <!-- 天地图 -->
        <tianditu ref="refTianditu" @tianditu-click="tiandituClick"></tianditu>
      </template>
    </yrt-editor>
  </div>
</template>

<script setup lang="ts" name="basic-storage-storage">
import YrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
import tianditu from '/@/components/tianditu/index.vue';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';

const base = baseHook();
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const { baseState, dataListRefName, editorRefName, detailButtonClick, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
});
//#endregion

onMounted(() => {});

// 删除前事件
const onDeleteBefore = (dataOptions: any, rows: any[]) => {
  dataOptions.deleteUrl = '/composite/basic/baseStorageComposite/remove';
  return true;
};

base.buttonClick = (authNode: string) => {
  switch (authNode) {
  }
};

//天地图点击后事件
const tiandituClick = (lng: any, lat: any, address: any) => {
  let fromData = masterData.value;
  fromData.lng = lng;
  fromData.lat = lat;
  fromData.shipperAddress = address;
};
</script>
