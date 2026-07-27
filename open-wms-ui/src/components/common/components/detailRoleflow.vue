<template>
	<el-dialog ref="roleflow" v-model="isShowDialog" :append-to-body="true" :title="'库存状况详情'" top="10vh" width="1050px" class="dialog-container">
		<el-table :data="state.tableData" size="small" style="width: 100%" height="450">
			<el-table-column prop="positionName" label="货位名称" width="120"></el-table-column>
			<el-table-column prop="productCode" label="商品编号" width="120"></el-table-column>
			<el-table-column prop="productStorage" label="库存量" width="70"></el-table-column>
			<el-table-column prop="placeholderStorage" label="占位量" width="70"></el-table-column>
			<el-table-column prop="validStorage" label="有效库存" width="70"></el-table-column>
			<el-table-column prop="produceDate" label="生产日期" width="90">
				<template v-slot="scope">
					{{ common.formatDate(scope.row['produceDate'], 'YYYY-MM-DD') }}
				</template>
			</el-table-column>
			<el-table-column prop="purchasePrice" label="成本价" width="70"></el-table-column>
			<el-table-column prop="purchaseMoney" label="成本额" width="70"></el-table-column>
			<el-table-column prop="inStorageDate" label="入库时间" width="150">
				<template v-slot="scope">
					{{ common.formatDate(scope.row['inStorageDate'], 'YYYY-MM-DD HH:mm:ss') }}
				</template>
			</el-table-column>
			<el-table-column prop="consignorName" label="货主名称" width="120"></el-table-column>
			<el-table-column prop="storageName" label="仓库名称" width="120"></el-table-column>
			<el-table-column prop="className" label="类别" width="100"></el-table-column>
			<el-table-column prop="batchNumber" label="批次号" width="180"></el-table-column>

			<el-table-column prop="specifyIssueQuantity" label="指定出库数量" width="180">
				<template v-slot="scope">
					<el-input v-model="scope.row.specifyIssueQuantity" :max="scope.row.validStorage" type="number" placeholder="请输入内容"></el-input>
				</template>
			</el-table-column>
		</el-table>
		<!-- 按钮部分 -->
		<div slot="footer" class="dialog-footer">
			<el-button @click="isShowDialog = false">取 消</el-button>
			<!-- 先不做保存 -->
			<!-- <el-button v-if="hiddenSaveButton" type="primary" @click="save">保 存</el-button> -->
		</div>
	</el-dialog>
</template>

<script setup lang="ts" name="detailRole-flow">
import { ComponentInternalInstance } from 'vue';

import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
import { getPageList, postData } from '/@/api/common/baseApi';
import { orderBy } from 'lodash';
import { DataType, PageListBo, QueryBo, QueryType } from '/@/types/common';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:visible', 'field-change']);

const props = defineProps({
	// 是否显示
	visible: {
		type: Boolean,
		default: false,
	},
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
				where: '',
				pageIndex: 1,
				pageSize: 100,
			};
		},
	},
	// 查询条件
	where: {
		type: Object,
		required: true,
	},
});

// 显示窗口
const isShowDialog = computed({
	get() {
		return props.visible;
	},
	set(val) {
		emit('update:visible', val);
	},
});

const state = reactive({
	tableData: [] as any[],
	dataList: null,
});

const loadData = async (row: any) => {
	state.dataList = row;

	let where: Array<QueryBo> = [];
	where.push({
		column: 'sourceType',
		values: '拣货下架',
		queryType: QueryType.NE,
		dataType: DataType.STRING,
	});
	where.push({
		column: 'productStorage',
		values: 0,
		queryType: QueryType.GT,
		dataType: DataType.INT,
	});
	where.push({
		column: 'validStorage',
		values: 0,
		queryType: QueryType.GT,
		dataType: DataType.INT,
	});
	if (row.productCode) {
		where.push({
			column: 'productCode',
			values: row.productCode,
			queryType: QueryType.EQ,
			dataType: DataType.STRING,
		});
	}

	let pageParams: PageListBo = {
		menuId: props.loadOptions.menuId,
		prefixRouter: props.loadOptions.prefixRouter, // 列表方法名
		tableName: props.loadOptions.tableName,
		pageIndex: 1,
		pageSize: 100,
		orderByColumn: '',
		isAsc: 'DESC',
		queryBoList: where,
	};
	let resResult = await to(getPageList(pageParams));
	let [err, res] = resResult;
	if (err) {
		return;
	}
	if (res?.result) {
		res.rows.map((item: any) => {
			item.productStorage = Number(item.productStorage).toFixed(2);
			item.validStorage = Number(item.validStorage).toFixed(2);
			item.purchasePrice = Number(item.purchasePrice).toFixed(2);
			return item;
		});
		state.tableData = res.rows;
	}
};

defineExpose({
	loadData,
});
</script>
