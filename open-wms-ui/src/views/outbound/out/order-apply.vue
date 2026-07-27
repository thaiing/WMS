<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>
	</div>
</template>

<script setup lang="ts" name="outbound-out-order-apply">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import baseHook from '/@/components/hooks/baseHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import { ElMessageBox } from 'element-plus';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
});
//#endregion

onMounted(() => {});

// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
	switch (authNode) {
		case 'forceFinish':
			forceFinish();
			return true;
	}
};

//强制完成
const forceFinish = async () => {
	// state.dataListSelections
	const url = '/outbound/out/order/forceFinish';
	let selectInfos: Array<any> = state.dataListSelections;
	if (!selectInfos.length) {
		proxy.$message.error('至少选择一项进行强制完成');
		return;
	}
	let flag = false;
	for (const item of selectInfos) {
		if ('部分打包' !== item.packageStatus) {
			flag = true;
		}
	}
	if (flag) {
		proxy.$message.error('打包状态不是部分打包不允许操作');
		return;
	}
	let ids = selectInfos.map((item) => item.orderId);

	ElMessageBox.confirm('操作【强制完成】后的单据后续不允许再进行出库操作！！！', '警告', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const params = {
				ids: ids.join(','),
			};
			const [err, res] = await to(postData(url, params));
			if (err) {
				proxy.$message.error(err.message);
				return;
			}

			if (res.result) {
				proxy.common.showMsg(res);
				base.dataListRef.value.loadData();
			}
		})
		.catch(() => {});
};
</script>
