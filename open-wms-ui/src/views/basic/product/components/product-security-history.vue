<template>
	<el-popover placement="top" title="防伪码轨迹" width="820" trigger="click" @show="loadData">
		<template #reference>
			<div style="cursor: pointer">
				<slot name="content"></slot>
			</div>
		</template>
		<el-table :data="state.tableData" size="small" style="width: 100%">
			<el-table-column prop="createDate" label="操作时间"> </el-table-column>
			<el-table-column prop="creator" label="操作人"> </el-table-column>
			<el-table-column prop="operationType" label="操作类型"> </el-table-column>
			<el-table-column prop="billCode" label="单据号"> </el-table-column>
			<el-table-column prop="fromStatus" label="变更前状态"> </el-table-column>
			<el-table-column prop="toStatus" label="变更后状态"> </el-table-column>
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
		state.tableData = res.data.rows.map((m: any) => {
			m.createDate = proxy.common.formatDate(m.createDate, 'YYYY-MM-DD HH:mm:ss');
			return m;
		});
	}
};
</script>
