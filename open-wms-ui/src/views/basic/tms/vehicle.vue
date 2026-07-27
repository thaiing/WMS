<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes">
			<!--自定义字段插槽-->
			<template #common-column-slot="{ row, col }">
				<template v-if="col.prop == 'vehicleStatus'">
					<!-- {{ state.dataOptions.idField }} -->
					<state-flow :load-options="state.stateLoadOptions" :where="{ vehicleId: row[state.dataOptions.idField] }">
						<template #content>
							<el-tag :color="common.getTagBgColor(row, col, row[col.prop])" :style="common.getTagColor(row, col, row[col.prop])">
								{{ proxy.common.formatData(row, col) }}
							</el-tag>
						</template>
					</state-flow>
				</template>
			</template>
		</yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>
	</div>
</template>

<script setup lang="ts" name="basic-tms-vehicle">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
const stateFlow = defineAsyncComponent(() => import('./components/stateflow.vue'));

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
	// 状态流加载参数
	stateLoadOptions: {
		prefixRouter: '/basic/tms/vehicleHistory',
		tableName: 'base_vehicle_history',
		idField: 'vehicle_history_id',
		orderBy: '{"vehicle_history_id":"DESC"}',
		pageIndex: 1,
		pageSize: 100,
	},
});
//#endregion

onMounted(() => {});
// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
	switch (authNode) {
		case 'stopUsing':
			// 停用
			stopUsing();
			return true;
		case 'openUsing':
			// 启用
			openUsing();
			return false;
	}
};
// 停用
const stopUsing = async () => {
	let selectInfos: Array<any> = state.dataListSelections;
	let ids = selectInfos.map((item) => item.vehicleId);
	if (!ids.length) {
		proxy.$message.error('至少选择一行！');
		return;
	}
	const url = '/basic/tms/vehicle/stopUsing';
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
};
// 启用
const openUsing = async () => {
	let selectInfos: Array<any> = state.dataListSelections;
	let ids = selectInfos.map((item) => item.vehicleId);
	if (!ids.length) {
		proxy.$message.error('至少选择一行！');
		return;
	}
	const url = '/basic/tms/vehicle/openUsing';
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
};
</script>
