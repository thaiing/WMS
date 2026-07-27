<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>
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
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
});
//#endregion
onMounted(() => {});

base.buttonClick = (authNode: string) => {
	switch (authNode) {
		case 'createShelve':
			// 取消入库
			if (!state.dataListSelections.length) {
				proxy.$message.error('请选择一条数据！');
				return;
			}
			createShelve();
			return true;
	}
};
const createShelve = async () => {
	// 选中行id
	var selectInfos: Array<any> = state.dataListSelections;

	let ids = selectInfos.map((item) => item.enterDetailId);
	const url = '/inbound/in/enter/createShelve';
	const params = {
		ids: ids.join(','),
		num: 0,
	};
	const [err, res] = await to(postData(url, params));
	if (err) {
		proxy.$message.error(err.message);
		return;
	}
	if (res.result) {
		base.dataListRef.value.loadData();
		proxy.common.showMsg(res);
	}
};
</script>
