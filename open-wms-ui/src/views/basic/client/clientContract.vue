<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :cell-style="cellStyle"></yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>
	</div>
</template>

<script setup lang="ts" name="basic-client-clientContract">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import baseHook from '/@/components/hooks/baseHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import moment from 'moment';

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
});
//#endregion

onMounted(() => {});

const cellStyle = (params: any) => {
	let { row, column, rowIndex, columnIndex } = params;
	const effetiveDays = row.effetiveDays; // 剩余有效天数
	const contractDays = row.contractDays; // 合同天数

	if (effetiveDays > contractDays / 3 && effetiveDays < (contractDays * 2) / 3) {
		// 当剩余有效天数大于合同天数的1/3，小于合同天数的2/3时，背景颜色将提示为橙黄色
		return { 'background-color': '#ff9900 !important', color: '#eee' };
	} else if (effetiveDays > 0 && effetiveDays < contractDays / 3) {
		//  当剩余有效天数大于0，小于合同天数的1/3时，背景颜色将提示为红色
		return { 'background-color': '#ff0033', color: '#eee' };
	} else if (effetiveDays < 0) {
		// 当剩余有效天数小于0，也就是合同已过期，背景颜色将提示为深红色
		return { 'background-color': '#990000', color: '#eee' };
	} else {
		return {
			'background-color': '',
			color: 'black',
		};
	}
};

// 保存前事件
base.onSaveBefore = (formData: any) => {
	//  var arr = JSON.parse(formData.expandFields);
	// var start = moment(formData.contractStartTime).format("YYYY-MM-DD HH:mm:ss");
	// var end = moment(formData.contractEndTime).format("YYYY-MM-DD HH:mm:ss");
	// formData.contractDays = end.subtract(start, "days");
	let contractDays = 0;
	let effetiveDays = 0;

	var start = moment(formData.contractStartTime);
	var end = moment(formData.contractEndTime);
	var now = moment();
	// 合同天数=合同结束日期-合同开始日期
	contractDays = end.diff(start, 'days');
	// 合同天数=合同结束日期-合同开始日期
	effetiveDays = end.diff(now, 'days');

	masterData.value.contractDays = contractDays;
	masterData.value.effetiveDays = effetiveDays;
	if (start > end) {
		proxy.$message.error('合同开始日期不能大于结束日期！');
		return false;
	}
	return true;
};
</script>
