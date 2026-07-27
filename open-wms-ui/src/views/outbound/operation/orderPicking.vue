<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" :use-detail-slot="['images', 'singleSignCode']">
      <!--自定义字段插槽-->
      <template #detail-column-slot="{ row, col, detail }">
        <template v-if="col.prop === 'images'">
          <el-image v-for="(pic, index) in base.getPicList(row[col.prop])" :src="base.showSmallPic(pic)" class="pic-small" fit="contain" preview-teleported :preview-src-list="base.getPicList(row[col.prop])" />
        </template>
        <template v-else-if="col.prop === 'singleSignCode'">
          <a href="#" @click="showSnEditor(row, detail)" class="flex flex-col">
            <span class="sn-text">{{ row.singleSignCode }}</span>
            <span class="sn-count">[SN数：{{ row.singleSignCode ? row.singleSignCode.split(',').length : 0 }}]</span>
          </a>
        </template>
      </template>
    </yrt-editor>

    <!-- SN编辑器 -->
    <sn-editor-dialog v-model:visible="state.snEditorVisible" readonly :row="state.detailRow" @on-sn-change="onSnChange"> </sn-editor-dialog>
  </div>
</template>

<script setup lang="ts" name="outbound-operation-orderPicking">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import baseHook from '/@/components/hooks/baseHook';
const SnEditorDialog = defineAsyncComponent(() => import('/@/components/common/sn-editor-dialog.vue'));

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  // 显示SN编辑器
  snEditorVisible: false,
  // 当前明细行
  detailRow: {},
  // 明细表信息
  currentDetail: {
    subTableView: '',
  },
});
//#endregion

onMounted(() => {});

// 显示SN编辑器
const showSnEditor = (row: any, detail: any) => {
  state.currentDetail = detail; // 记录当前明细表信息
  state.detailRow = row;
  state.snEditorVisible = true;
};

// SN改变事件，改变数量
const onSnChange = (currentRow: any, snList: any, snCount: number) => {
  currentRow.quantityOrder = snCount;
};
</script>
