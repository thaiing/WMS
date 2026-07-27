<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>

		<!-- 生成容器号 -->
		<plate-code-dialog ref="orderSplit" v-model:visible="state.showPlateCodeDialog" @on-closed="onClose"></plate-code-dialog>
	</div>
</template>

<script setup lang="ts" name="basic-storage-plate">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const plateCodeDialog = defineAsyncComponent(() => import('./components/plate-code-dialog.vue'));

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
	showPlateCodeDialog: false,
});
//#endregion

onMounted(() => {});

// 编辑页面按钮事件
base.buttonClick = (authNode: string) => {
	switch (authNode) {
		case 'createPlateCode':
			// 生成容器号
			createPlateCode();
			return true;
	}
};

// 生成容器号
const createPlateCode = () => {
	state.showPlateCodeDialog = true;
};

// 关闭窗口刷新列表
const onClose = () => {
	base.dataListRef.value.reload();
};
</script>
