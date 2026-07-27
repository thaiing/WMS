
<template>
	<div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter">
      <!--自定义按钮插槽-->
      <template #footer-button-region="{ formData, details }">
        <!--修改密码按钮-->
        <el-button type="success" @click="modifypwd(formData, details)">
          <template #icon>
            <svg-icon name="ele-Lock" class="text-size-n" :size="14" />
          </template>
          修改密码
        </el-button>
      </template>
    </yrt-editor>

    <!--修改密码弹出页面-->
    <modify-pwd-carrier ref="modifypwdDialogRef" v-model:visible="state.modifyPwdVisible" :is-orgin-pwd="false"></modify-pwd-carrier>
	</div>
</template>

<script setup lang="ts" name="basic-tms-carrier">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import baseHook from '/@/components/hooks/baseHook';
import modifyPwdCarrier from './components/modify-pwd-carrier.vue';

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const modifypwdDialogRef = ref();

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
  // 修改密码页面默认不显示
  modifyPwdVisible: false,
});
//#endregion

onMounted(() => {});

// 修改密码
const modifypwd = (formData: any, details: any) => {
  state.modifyPwdVisible = true;
  modifypwdDialogRef.value.setCarrierId(formData.carrierId);
};
</script>
