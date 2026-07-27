<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :fixed-where="state.fixedWhere" :loadDataBefore="loadDataBefore" @on-load-data-after="onLoadDataAfter">
			<template #button-tool2-slot>
				<el-button v-popover="popoverRef" @change="onClickOutside">聚合设置</el-button>
				<el-popover ref="popoverRef" trigger="click" width="600" placement="bottom" virtual-triggering persistent>
					<el-alert :title="$tt('勾选需要需要分组的字段，查询结果根据勾选的字段进行聚合分组')" type="success" :closable="false" effect="dark"></el-alert>
					<el-checkbox-group v-model="state.checkList" class="check-box" @change="checkboxChange">
						<el-checkbox v-for="(item, index) in state.groupFields" :key="index" :label="$tt(item.label)"></el-checkbox>
					</el-checkbox-group>
					<el-button @click="base.dataListRef.value.loadData()">{{ $tt('重新查询') }}</el-button>
				</el-popover>

				<el-checkbox v-model="state.showAll" @change="onShowAll" label="显示全部" />
			</template>
		</yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>
	</div>
</template>

<script setup lang="ts" name="inventory-core-product-position-group">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import baseHook from '/@/components/hooks/baseHook';
import { DataType, PageListBo, QueryType } from '/@/types/common';
import { FORMERR } from 'dns';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;
const popoverRef = ref();

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
	fixedWhere: {
		productStorage: {
			queryType: QueryType.GT,
			value: 0,
		},
	},
	//显示全部
	showAll: false,
	groupFields: [] as any[],
	checkList: [] as any[],
});
//#endregion

onMounted(() => {
	const checkList = localStorage.getItem('pp-checkList'); // 记录设置
	if (checkList) {
		state.checkList = JSON.parse(checkList);
	}
});

const onShowAll = () => {
	if (!state.showAll) {
		state.fixedWhere = {
			productStorage: {
				queryType: QueryType.GT,
				value: 0,
			},
		};
	} else {
		state.fixedWhere = {} as any;
	}
	nextTick(() => {
		base.dataListRef.value.loadData();
	});
};

// 加载前事件
const loadDataBefore = (pageParams: PageListBo, searchFields: any) => {
	// 将分组条件加入到查询集合
	const fields = state.dataListOptions.fields.filter((f: any) => f.groupBy === 'GROUP');
	for (let field of fields) {
		if (state.checkList.find((item) => item == field.label)) {
			pageParams.queryBoList.push({
				column: field.prop,
				dataType: DataType.STRING,
				queryType: QueryType.GROUPBY,
				values: field.prop,
			});
		}
	}

	return true;
};

const onLoadDataAfter = (dataList: Array<any>) => {
	if (!state.groupFields.length) {
		let fields = [];
		if (state.dataListOptions.fields) {
			fields = state.dataListOptions.fields.filter((item: any) => item.groupBy === 'GROUP');
		}
		state.groupFields = proxy.common.deepCopy(fields);
		if (!state.checkList.length) {
			state.checkList = state.groupFields.map((m) => m.label);
		}
	}
};

const checkboxChange = () => {
	for (const item of state.groupFields) {
		const field = state.dataListOptions.fields.find((f: any) => f.prop === item.prop);
		if (state.checkList.some((s) => s === field.label)) {
			field.groupBy = 'GROUP';
			field.hidden = false;
		} else {
			field.groupBy = 'MAX';
			field.hidden = true;
		}
	}
	localStorage.setItem('pp-checkList', JSON.stringify(state.checkList)); // 记录设置
};
const onClickOutside = () => {
	unref(popoverRef).popperRef?.delayHide?.();
};

// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
	switch (authNode) {
		case 'printBarcode':
			printBarcode(state.dataListSelections);
			return true;
	}
};
const printBarcode = (rows: any) => {
	if (!rows.length) {
		proxy.$message.error('请至少选择一行进行打印操作！');
		return false;
	}

	let key = proxy.common.getGUID();
	sessionStorage.setItem('static_' + key, JSON.stringify(rows));
	var url = `/system/print/base-template-id/12002/0/1?key=${key}&autoPrint=false`;
	window.open(url);
};
</script>
