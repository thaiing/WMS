<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :cell-style="cellStyle" :tab-nav-list="state.tabNavList" :fixed-where="state.fixedWhere">
			<template #button-tool2-slot>
				<el-checkbox v-model="state.showAll" @change="onShowAll" label="显示全部" />
			</template>
		</yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>
	</div>
</template>

<script setup lang="ts" name="inventory-stat-early">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import baseHook from '/@/components/hooks/baseHook';
import { QueryType, DataType, QueryBo } from '/@/types/common';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
	// 导航筛选条件
	tabNavList: [
		{
			type: 'radio', // checkbox=多选, radio=单选
			field: 'statusText',
			items: [
				{
					value: '0',
					label: '全部',
				},
				{
					value: '1',
					label: '库存有效期天数大于1/3且小于2/3',
				},
				{
					value: '2',
					label: '库存有效期天数大于0且小于1/3',
				},
				{
					value: '3',
					label: '已过期',
				},
			],
			showCount: 8, // 显示平铺项个数
			value: null, // 选中值：当type=radio时value为数组，当type=checkbox时value为字符串
			getWhere(tab: any, tabs: any) {
				let where: Array<QueryBo> = [];
				if (tab.value === '1') {
					where.push({
						column: '1',
						values: '',
						queryType: QueryType.CUSTOM, // 运算符号
						dataType: DataType.BIGDECIMAL,
					});
				} else if (tab.value === '2') {
					where.push({
						column: '2',
						values: '',
						queryType: QueryType.CUSTOM, // 运算符号
						dataType: DataType.BIGDECIMAL,
					});
				} else if (tab.value === '3') {
					where.push({
						column: '3',
						values: '',
						queryType: QueryType.LT, // 运算符号
						dataType: DataType.BIGDECIMAL,
					});
				}

				return where;
			},
		},
	],
	//显示全部
	showAll: false,
	fixedWhere: {
		productStorage: {
			queryType: QueryType.GT,
			value: 0,
		},
	},
});
//#endregion

onMounted(() => {});

// 设置行颜色
const cellStyle = (params: any) => {
	let { row, column, rowIndex, columnIndex } = params;
	const validityDay = row.validityDay; // 库存有效期天数
	const shelfLifeDay = row.shelfLifeDay; // 保质期天数

	if (validityDay > shelfLifeDay / 3 && validityDay < (shelfLifeDay * 2) / 3) {
		// 当库存效库存有效期天数大于保质期天数的1/3，小于保质期天数的2/3时，背景颜色将提示提示为橙黄色；
		return { 'background-color': '#ff9900 !important', color: '#eee' };
	} else if (validityDay > 0 && validityDay < shelfLifeDay / 3) {
		// 当库存效库存有效期天数大于0，小于保质期天数的1/3时，背景颜色将提示提示为红色；
		return { 'background-color': '#ff0033', color: '#eee' };
	} else if (validityDay < 0) {
		// 当库存效库存有效期天数小于0，也就是保质期已过，背景颜色将提示提示为深红色；
		return { 'background-color': '#990000', color: '#eee' };
	} else {
		return {
			'background-color': '',
			color: 'black',
		};
	}
};
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
</script>
