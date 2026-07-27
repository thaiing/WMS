<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :quick-search-fields="state.quickSearchFields" :open-expand="true" @on-expand-change="onExpandChange">
			<template #expand-slot="{ row, col }">
				<el-table :data="row.orderDataList" border style="margin-left: 50px; font-size: 12px; width: 1000px" row-key="order_Id">
					<el-table-column :index="(index) => (row.listDataOptions.pageIndex - 1) * row.listDataOptions.pageSize + index + 1" type="index" fixed="left" class="col-index" label="#" width="30" />
					<el-table-column prop="productCode" :label="$tt('商品编号')" width="120"> </el-table-column>
					<el-table-column prop="productName" :label="$tt('商品名称')"> </el-table-column>
					<el-table-column prop="quantity" :label="$tt('预到货数量')" width="80"> </el-table-column>
					<el-table-column prop="enterQuantity" :label="$tt('入库数量')" width="80"> </el-table-column>
					<el-table-column prop="shelvedQuantity" :label="$tt('上架数量')" width="80"> </el-table-column>
					<el-table-column prop="bigQty" :label="$tt('大单位数量')" width="80"> </el-table-column>
					<el-table-column prop="rowWeight" :label="$tt('小计毛重')" width="80"> </el-table-column>
					<el-table-column prop="productSpec" :label="$tt('商品规格')" width="80"> </el-table-column>
					<el-table-column prop="brandName" :label="$tt('品牌')" width="80"> </el-table-column>
				</el-table>
				<div>
					<el-pagination background v-model:current-page="row.listDataOptions.pageIndex" v-if="row.listDataOptions.total > 15" v-model:page-size="row.listDataOptions.pageSize" layout="prev, pager, next" :total="row.listDataOptions.total || 0" @current-change="(value) => handleSizeChange(row, value)"></el-pagination>
				</div>
			</template>

			<!--自定义字段插槽-->
			<template #common-column-slot="{ row, col }">
				<template v-if="col.prop == 'orderStatus'">
					<!-- {{ state.dataOptions.idField }} -->
					<state-flow :load-options="state.stateLoadOptions" :where="{ billId: row[state.dataOptions.idField] }">
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
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :use-detail-slot="['images']" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" :btn-read-only="state.btnReadOnly">
			<!--自定义字段插槽-->
			<template #detail-column-slot="{ row, col }">
				<template v-if="col.prop === 'images'">
					<el-image v-for="(pic, index) in base.getPicList(row[col.prop])" :src="base.showSmallPic(pic)" class="pic-small" fit="contain" preview-teleported :preview-src-list="base.getPicList(row[col.prop])" />
				</template>
			</template>
		</yrt-editor>
	</div>
</template>

<script setup lang="ts" name="inbound-in-order-in">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));

const stateFlow = defineAsyncComponent(() => import('/@/components/common/components/stateflow.vue'));
import baseHook from '/@/components/hooks/baseHook';
import { DataType, QueryBo, QueryType } from '/@/types/common';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
	stateLoadOptions: {
		prefixRouter: '/inbound/in/orderStatusHistory',
		tableName: 'in_order_status_history',
		idField: 'history_id',
		orderBy: '{"history_id":"DESC"}',
		pageIndex: 1,
		pageSize: 100,
	},
	quickSearchFields: [
		{
			label: '商品编号',
			prop: 'orderId',
			type: 'input',
			dataType: 'int',
			value: null,
			// 获取查询条件
			getWhere: (val: any, me: any) => {
				if (!val) return null;

				return {
					dataType: DataType.STRING,
					label: '商品编号',
					column: 'productCode',
					queryType: QueryType.CUSTOM,
					values: val?.toString(),
				} as QueryBo;
			},
		},
	],
});
//#endregion

onMounted(() => {});

// 展开事件
const onExpandChange = async (row: any, expandedRows: any) => {
	row.listDataOptions = {
		pageIndex: 1,
		pageSize: 15,
	};
	LoadData(row);
};

// 分页大小改变
const handleSizeChange = (row: any, value: number) => {
	row.listDataOptions.pageIndex = value;

	LoadData(row);
};
// 展开事件
const LoadData = async (row: any) => {
	const url = '/inbound/in/orderDetail/pageList';
	const params = {
		isAsc: 'desc',
		orderByColumn: 'orderDetailId',
		pageIndex: row.listDataOptions.pageIndex,
		pageSize: row.listDataOptions.pageSize,
		prefixRouter: '/inbound/in/orderDetail',
		queryBoList: [
			{
				column: 'orderId',
				dataType: 'LONG',
				label: '预到货单号',
				queryType: 'EQ',
				values: row.orderId,
			},
		],
		tableName: 'in_order_detail',
		sumColumnNames: [],
	};
	const [err, res] = await to(postData(url, params));
	if (err) {
		proxy.$message.error(err.message);
		return;
	}

	row.listDataOptions.total = res.total;
	if (res.result) {
		row.orderDataList = res.rows.map((item: any) => {
			item.quantity = Number(item.quantity);
			item.enterQuantity = Number(item.enterQuantity);
			item.shelvedQuantity = Number(item.shelvedQuantity);
			item.bigQty = Number(item.bigQty);
			item.rowWeight = Number(item.rowWeight);
			return item;
		});
	}
};
</script>
