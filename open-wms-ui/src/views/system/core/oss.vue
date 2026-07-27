<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes">
      <template #common-column-slot="{ row, col }">
        <!--自定义显示图片-->
        <template v-if="col.prop === 'url'">
          <el-image v-if="base.isPicUrl(row.url)" :src="base.showSmallPic(row.url)" class="pic-small" fit="contain" preview-teleported :preview-src-list="base.getPicList(row[col.prop])" />
          <a v-else :href="row.url" target="_blank">点击下载</a>
        </template>
      </template>
    </yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="detailButtonClick" :auth-nodes="state.authNodes"> </yrt-editor>
  </div>
</template>

<script setup lang="ts" name="system-core-oss">
import YrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';

const base = baseHook();

const { baseState, dataListRefName, editorRefName, buttonClick, detailButtonClick, editorInfo } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
});
//#endregion

onMounted(() => {});
</script>
