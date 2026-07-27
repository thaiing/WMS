<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"> </yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore"> </yrt-editor>
	</div>
</template>

<script setup lang="ts" name="basic-product-provider">
import YrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
import moment from 'moment';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();

const { baseState, dataListRefName, editorRefName, buttonClick, detailButtonClick, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
});
//#endregion

onMounted(() => {});

// 保存前事件
base.onSaveBefore = (formData: any) => {
	var start = moment(formData.accountStartDate);
	var end = moment(formData.accountEndDate);
	if (start && end && start > end) {
		proxy.$message.error('账单日期不能大于结束日期！');
		return false;
	}
	var start2 = moment(formData.paymentStartDate);
	var end2 = moment(formData.paymentEndDate);
	if (start2 && end2 && start2 > end2) {
		proxy.$message.error('付款周期不能大于结束周期！');
		return false;
	}
	var start3 = moment(formData.billingStartDate);
	var end3 = moment(formData.billingEndDate);
	if (start3 && end3 && start3 > end3) {
		proxy.$message.error('开票周期不能大于结束周期！');
		return false;
	}
	return true;
};
</script>
