<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>
		<!-- 商品选择器 -->
		<yrt-selector ref="selector-dialog" :config="state.selectorConfig" v-model:visible="state.selectorConfig.visible" @on-selected="onSelected"></yrt-selector>
	</div>
</template>

<script setup lang="ts" name="inbound-in-orderPlan">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
	selectorConfig: {
		title: '商品选择器',
		width: '1000px',
		visible: false,
		// 配置路由
		router: '/selector/product',
	},
});
//#endregion

// 明细按钮事件
base.detailButtonClick = (authNode: string, detail: any, btnOpts: any) => {
	switch (authNode) {
		case 'detailAdd':
			detailAdd();
			return true;
	}
};
// 明细添加
const detailAdd = () => {
	state.selectorConfig.visible = true;
};
// 将选择器选择中的数据填充到明细表中
const onSelected = (rows: Array<any>) => {
	rows.forEach((item) => {
		item.subCube = item.rowCube;
	});
	base.editorRef.value.addDetailDataRow(rows);
	state.selectorConfig.visible = false;
	let formData = masterData.value; // 主表
	base.detailRows.value?.forEach((item) => {
		item.consignorName = formData.consignorName;
		item.consignorCode = formData.consignorCode;
		item.consignorId = formData.consignorId;
	});
};

onMounted(() => {});
</script>
