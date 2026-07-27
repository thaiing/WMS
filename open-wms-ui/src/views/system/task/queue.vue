<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>
	</div>
</template>

<script setup lang="ts" name="system-task-queue">
import { ComponentInternalInstance, onMounted, reactive, toRefs } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';

import YrtDataList from '/@/components/common/yrtDataList.vue';
import baseHook from '/@/components/hooks/baseHook';

const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
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

onMounted(() => {
	// 列表页面按钮事件
	base.buttonClick = (authNode: string) => {
		switch (authNode) {
			case 'push':
				push();
		}
	};

	//重新推送
	const push = async () => {
		// state.dataListSelections
		const url = '/system/task/queue/push';

		let row = state.dataListSelections[0];

		ElMessageBox.confirm('确定要重新推送单据吗', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				const params = {
					billId: row.billId,
					billCode: row.billCode,
					taskId: row.taskId,
					taskType: row.taskType,
				};
				const [err, res] = await to(postData(url, params));
				if (err) {
					return;
				}
				proxy.common.showMsg(res);

				if (res.result) {
					base.dataListRef.value.loadData();
				}
			})
			.catch(() => {});
	};
});
</script>
