<template>
	<el-popover placement="top" title="占位详情" width="820" trigger="click" @show="loadData">
		<template #reference>
			<div style="cursor: pointer">
				<slot name="content"></slot>
			</div>
		</template>
		<el-table :data="state.tableData" size="small" style="width: 100%">
			<el-table-column prop="billCode" label="单据编号" width="120"></el-table-column>
			<el-table-column prop="storageName" label="仓库名称" width="90"></el-table-column>
			<el-table-column prop="positionName" label="货位名称" width="100"></el-table-column>
			<el-table-column prop="productCode" label="商品编号"></el-table-column>
			<el-table-column prop="holderStorage" label="占位量" width="60">
				<template v-slot="{ row }">
					{{ proxy.common.formatNumber(row.holderStorage, '0.#') }}
				</template>
			</el-table-column>
			<el-table-column prop="orignHolderStorage" label="原始占位量" width="80">
				<template v-slot="{ row }">
					{{ proxy.common.formatNumber(row.orignHolderStorage, '0.#') }}
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="占位时间" width="155">
				<template v-slot="{ row }">
					{{ common.formatDate(row.createTime, 'YYYY-MM-DD HH:mm:ss') }}
				</template>
			</el-table-column>
			<el-table-column prop="produceDate" label="生产日期" width="90">
				<template v-slot="{ row }">
					{{ common.formatDate(row.produceDate, 'YYYY-MM-DD') }}
				</template>
			</el-table-column>
		</el-table>
	</el-popover>
</template>

<script setup lang="ts" name="detailstate-flow">
import { ComponentInternalInstance } from 'vue';

import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
import { getPageList, postData } from '/@/api/common/baseApi';
import { DataType, PageListBo, QueryBo, QueryType } from '/@/types/common';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const props = defineProps({
	// 加载参数
	loadOptions: {
		type: Object,
		required: true,
		default: () => {
			return {
				projectName: '',
				tableView: '',
				idField: '',
				orderBy: '',
				where: {},
				pageIndex: 1,
				pageSize: 100,
				listMethod: '',
				prefixRouter: '',
			};
		},
	},
	// 查询条件
	where: {
		type: Object,
		required: true,
	},
});
const state = reactive({
	tableData: [],
});

const loadData = async () => {
	let queryBoList: Array<QueryBo> = [];
	Object.keys(props.where).forEach((key) => {
		queryBoList.push({
			column: key,
			values: props.where[key],
			queryType: QueryType.EQ,
			dataType: DataType.INT,
		});
	});
	let pageParams: PageListBo = {
		menuId: props.loadOptions.menuId,
		prefixRouter: props.loadOptions.prefixRouter, // 列表方法名
		tableName: props.loadOptions.tableName,
		pageIndex: 1,
		pageSize: 100,
		orderByColumn: '',
		isAsc: 'DESC',
		queryBoList: queryBoList,
	};

	let resResult = await to(getPageList(pageParams));
	let [err, res] = resResult;
	if (err) {
		return;
	}
	proxy.common.showMsg(resResult);
	if (res?.result) {
		res.rows.forEach((item: any) => {
			if (item.produceDate) {
				item.produceDate = proxy.common.formatDate(item.produceDate);
			}
		});
		if (props.loadOptions.codeType && props.loadOptions.codeType === 'inventory') {
			state.tableData = res.rows;
		} else {
			const tableData = res.rows.reduce((all: any, next: any) => {
				const exist = all.find((item: any) => item.positionName === next.positionName && item.produceDate === next.produceDate);
				if (exist) {
					exist.holderStorage = parseFloat(exist.holderStorage) + parseFloat(next.holderStorage);
					exist.orignHolderStorage = parseFloat(exist.orignHolderStorage) + parseFloat(next.orignHolderStorage);
					return all;
				} else {
					return [...all, next];
				}
			}, []);
			state.tableData = tableData;
		}
	}
};
</script>
