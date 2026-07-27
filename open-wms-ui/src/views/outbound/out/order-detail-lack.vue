<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes">
			<template #common-column-slot="{ row, col }">
				<template v-if="col.prop === 'providerShortName'">
					<el-select v-model="row.providerShortName" filterable clearable placeholder="请选择供应商" @change="(providerShortName) => providerChange(providerShortName, row)" style="width: 130px">
						<el-option v-for="(item, index) in state.providerList" :key="index" :label="item.providerShortName" :value="item.providerShortName"> </el-option>
					</el-select>
				</template>

				<!-- 采购数量 -->
				<template v-else-if="col.prop === 'purchaseStorage'">
					<el-input-number v-model="row.purchaseStorage" controls-position="right" style="width: 80px"></el-input-number>
				</template>
				<!-- 采购单价 -->
				<template v-else-if="col.prop === 'purchasePrice'">
					<el-input-number v-model="row.purchasePrice" controls-position="right" style="width: 80px"></el-input-number>
				</template>
			</template>
		</yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>
	</div>
</template>

<script setup lang="ts" name="outbound-out-order-list-lack">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import baseHook from '/@/components/hooks/baseHook';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
	providerList: [] as any[],
});
//#endregion

onMounted(() => {
	getProvider();
});
// 选择供应商

// 获取供应商列表
const getProvider = async () => {
	const url = '/basic/product/provider/getList';
	const params = {};
	const [err, res] = await to(postData(url, params, false));
	if (res?.result) {
		state.providerList = res.data;
	}
};

//供应商选之后事件
const providerChange = (providerShortName: any, row: any) => {
	const providerInfo = state.providerList.find((item) => item.providerShortName === providerShortName);
	row.providerId = providerInfo.providerId;
	row.providerCode = providerInfo.providerCode;
	row.providerShortName = providerInfo.providerShortName;
};

// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
	switch (authNode) {
		//生成预到货单
		case 'topurchaseOrder':
			topurchaseOrder(state.dataListSelections);
			return true;
		//生成入库计划单
		case 'totmsQuotation':
			totmsQuotation(state.dataListSelections);
			return true;
	}
};
//生成预到货单
const topurchaseOrder = (rows: any[]) => {
	if (!rows.length) {
		proxy.$message.error('请至少选择一行数据！');
	}

	proxy
		.$confirm('确定要操作此功能吗?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		})
		.then(async () => {
			const url = '/composite/out/outOrderLack/toPurchaseOrder';
			const params = rows;
			const [err, res] = await to(postData(url, params));
			if (err) {
				return;
			}
			if (res.result) {
				proxy.common.showMsg(res);
				base.dataListRef.value.loadData();
			}
		})
		.catch(() => {
			proxy.$message.error('已取消');
		});
};

//生成入库计划单
const totmsQuotation = (rows: any[]) => {
	if (!rows.length) {
		proxy.$message.error('请至少选择一行数据！');
	}
	proxy
		.$confirm('确定要操作此功能吗?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		})
		.then(async () => {
			const url = '/composite/out/outOrderLack/totmsQuotation';
			const params = rows;
			const [err, res] = await to(postData(url, params));
			if (err) {
				return;
			}
			if (res.result) {
				proxy.common.showMsg(res);
				base.dataListRef.value.loadData();
			}
		})
		.catch(() => {
			proxy.$message.error('已取消审核');
		});
};
</script>
