<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>

		<el-dialog v-dialogDrag title="归还审核" draggable v-model="state.auditDialogVisible" width="30%" append-to-body>
			<el-form-item label="归还日期">
				<el-date-picker v-model="state.returnDate" type="date" placeholder="归还日期"></el-date-picker>
			</el-form-item>
			<span slot="footer" class="dialog-footer">
				<el-button @click="state.auditDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="save">提 交</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="inventory-plate-backPlate">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import baseHook from '/@/components/hooks/baseHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import { postData } from '/@/api/common/baseApi';
import useDropdownStore from '/@/stores/modules/dropdown';
const dropdownStore = useDropdownStore();
import to from 'await-to-js';

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
	logisticsCostDialog: {
		// 添加物流费用对话框
		isShowDialog: false,
		title: '添加物流费用',
	} as any,
	auditDialogVisible: false,
	returnDate: new Date(),
});
//#endregion

onMounted(() => {});
// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
	switch (authNode) {
		case 'multiAuditing':
			multiAuditing();
			return true;
	}
};
// 明细按钮事件
base.detailButtonClick = (authNode: string, detail: any, btnOpts: any) => {
	switch (authNode) {
		case 'addLogisticsCost':
			addLogisticsCost();
			return true;
		case 'detailAdd':
			//单条
			base.editorRef.value.addDetailDataRow(
				[
					{
						plateType: '',
						plateSpec: '',
						plateName: '',
						plateAttribute: '正常',
					},
				],
				'base_plate_in_Detail'
			);
			return true;
	}
};
//明细改变事件
base.onDetailChange = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
	if (field.prop === 'plateType') {
		// 改变容器名称下拉框
		getPlateSpecInfo(val, 1136);
	}
	if (field.prop === 'plateName') {
		// 改变单位重量,单位体积
		getWeightCube(val, row);
	}
	total();
};
// 根据容器类型获得容器名称下拉值内容
const getPlateSpecInfo = async (val: any, dropdownId: any) => {
	if (!val) {
		return;
	}
	let url = '/basic/storage/plate/getPlateSpec';
	let params = {
		plateType: val,
	};
	let res = await postData(url, params);
	if (res.result) {
		res.data = res.data.map((m: any) => {
			return {
				value: m.plateId,
				label: m.plateSpec,
				plateId: m.plateId,
				plateSpec: m.plateSpec,
			};
		});
		var data = res.data;
		dropdownStore.setDropDown(dropdownId, data);
	} else {
		proxy.$message.error(res.msg);
	}
};
//明细合计到主表
const total = () => {
	let formData = masterData.value; // 主表

	let totalReturnQty = 0; // 合计归还数量
	let totalWeight = 0; // 合计重量
	let totalCube = 0; // 合计体积

	base.detailRows.value?.forEach((item: any) => {
		item.returnQty = Number(item.returnQty);
		item.rowWeight = Math.Round(Number(item.weight * item.returnQty || 0), 4);
		item.rowCube = Math.Round(Number(item.unitCube * item.returnQty || 0), 4);
		totalReturnQty += item.returnQty;
		totalWeight += item.rowWeight;
		totalCube += item.rowCube;
	});

	// 合计主表运费
	let totalFreight = 0;
	base.detailRows2.value?.forEach((item: any) => {
		totalFreight += Number(item.subCost) || 0;
	});
	formData.totalFreight = totalFreight; // 合计运费
	formData.totalReturnQty = Math.Round(totalReturnQty, 5);
	formData.totalFreight = Math.Round(totalFreight, 5);
	formData.totalWeight = Math.Round(totalWeight, 4);
	formData.totalCube = Math.Round(totalCube, 4);
};
// 明细删除后事件
base.onDetailDeleteAfter = (deletedRows: Array<any>, detailInfo: any) => {
	total();
};

// 字段值改变事件
base.onRowChange = (ref: any, val: any, field: any, formData: any) => {
	if (field.options.prop === 'clientShortName') {
		// 改变容器名称下拉框
		getSourceInfo(val, 9999);
		// 改变出发地
		changePlaceOrigin(val);
	}
	if (field.options.prop === 'storageName') {
		// 改变目的地
		changePlaceDestination(val);
	}
};
base.onChange = async (ref: any, val: any, field: any, master: any) => {
	if (field.options.prop === 'sourceOutCode') {
		// 带出明细数据
		getOrderInfo(val);
	}
};
// 根据容器类型获得容器名称下拉值内容
const getSourceInfo = async (val: any, dropdownId: any) => {
	if (!val) {
		return;
	}
	let url = '/inventory/plate/plateOut/getSourceInfo';
	let params = {
		clientShortName: val.clientShortName,
	};
	let res = await postData(url, params);
	if (res.result) {
		res.data = res.data.map((m: any) => {
			return {
				value: m.outId,
				label: m.customerOrderCode + `------${m.outCode}`,
				outId: m.outId,
				sourceOutCode: m.customerOrderCode,
			};
		});
		masterData.value.sourceOutCode = '';
		var data = res.data;
		dropdownStore.setDropDown(dropdownId, data);
	} else {
		proxy.$message.error(res.msg);
	}
};
// 根据源借出单号查询对应的借出单信息
const getOrderInfo = async (val: any) => {
	if (!val) {
		return;
	}
	let url = '/inventory/plate/plateOut/getOrderInfo';
	let params = {
		outId: val,
	};
	let res = await postData(url, params);
	if (res.result) {
		base.editorRef.value.clearDetailDataRow();
		res.data.details.forEach((item: any) => {
			// 前新明细，后源明细
			item.sourceMainId = item.outId;
			item.sourceDetailId = item.outDetailId;
			item.returnQty = item.unreturnedQty;
			item.plateAttribute = '正常';
		});
		// base.editorRef.value.formData[subTableView].rows = []; // 清空数据
		base.editorRef.value.addDetailDataRow(res.data.details);
		masterData.value.storageName = res.data.order.storageName;
		masterData.value.consignorIdSale = res.data.order.consignorIdSale;
		masterData.value.consignorNameSale = res.data.order.consignorNameSale;
		masterData.value.sourceOutCode = res.data.order.customerOrderCode;
		masterData.value.outId = res.data.order.outId;
		masterData.value.placeDestinationId = res.data.siteId;
		masterData.value.placeDestination = res.data.siteName;
		masterData.value.applyDate = res.data.applyDate;
	} else {
		proxy.$message.error(res.msg);
	}
};
// 根据容器规格默认重量，体积
const getWeightCube = async (val: any, row: any) => {
	if (!val) {
		return;
	}
	let url = '/basic/storage/plate/getWeightCube';
	let params = {
		plateId: val,
	};
	let res = await postData(url, params);
	if (res.result) {
		row.weight = res.data.weight;
		row.unitCube = res.data.unitCube;
		row.plateName = res.data.plateName;
	} else {
		proxy.$message.error(res.msg);
	}
};
// 审核
const multiAuditing = () => {
	let selectInfos: Array<any> = state.dataListSelections;
	if (!selectInfos.length) {
		proxy.$message.error('至少选择一项进行审核');
		return;
	}
	for (const item of selectInfos) {
		if (['新建', '待审核'].indexOf(item.statusText) == -1) {
			proxy.$message.error('只有新建或者待审核的单据才可以进行审核');
			return;
		}
	}
	state.auditDialogVisible = true;

	if (selectInfos[0].returnDate) {
		state.returnDate = selectInfos[0].returnDate;
	}
};

// 审核弹窗确定
const save = async () => {
	const url = '/inventory/plate/plateIn/backPlateAudit';
	let selectInfos: Array<any> = state.dataListSelections;
	let ids = selectInfos.map((item) => item.inId);

	ElMessageBox.confirm('确定要审核单据吗', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const params = {
				ids: ids.join(','),
				returnDate: state.returnDate,
			};
			const [err, res] = await to(postData(url, params));
			if (err) {
				proxy.$message.error(err.message);
				return;
			}

			if (res.result) {
				proxy.common.showMsg(res);
				state.auditDialogVisible = false;
				base.dataListRef.value.loadData();
			}
		})
		.catch(() => {});
};
// 根据仓库名称，带出目的地值（所属网点）
const changePlaceDestination = async (val: any) => {
	if (!val.storageName) {
		return;
	}
	let url = '/basic/storage/storage/changePlaceDestination';
	let params = {
		storageName: val.storageName,
	};
	let res = await postData(url, params);
	if (res.result) {
		masterData.value.placeDestinationId = res.data.siteId;
		masterData.value.placeDestination = res.data.siteName;
	} else {
		proxy.$message.error(res.msg);
	}
};
// 根据客户名称，带出出发地值（所属网点）
const changePlaceOrigin = async (val: any) => {
	if (!val.clientId) {
		return;
	}
	let url = '/basic/client/client/getClientInfo';
	let params = {
		clientId: val.clientId,
	};
	let res = await postData(url, params);
	if (res.result) {
		masterData.value.placeOriginId = res.data.siteId;
		masterData.value.placeOrigin = res.data.siteName;
	} else {
		proxy.$message.error(res.msg);
	}
};
// 添加物流费用
const addLogisticsCost = () => {
	let formData = masterData.value;
	if (!formData.carrierName) {
		proxy.$message.error('承运商必填！');
		return false;
	}
	if (!formData.placeOrigin) {
		proxy.$message.error('出发地必填！');
		return false;
	}
	if (!formData.placeDestination) {
		proxy.$message.error('目的地必填！');
		return false;
	}
	let detailRows = base.detailRows.value;
	proxy.$refs.logisticsCostDialog.initData(formData, detailRows);
	state.logisticsCostDialog.isShowDialog = true;
};

// 关闭窗口刷新列表
const onClose = () => {
	base.dataListRef.value.reload();
	base.editorRef.value.loadEditData(masterData.value.orderId);
	state.logisticsCostDialog = false;
};
// // 保存前事件
base.onSaveBefore = (formData: any) => {
	total();
	return true;
};
</script>
