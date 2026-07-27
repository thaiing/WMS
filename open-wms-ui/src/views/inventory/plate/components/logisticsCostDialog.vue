<template>
	<div>
		<el-dialog draggable v-model="currentVisible" title="添加物流费用" width="600px" class="dialog-container">
			<el-form v-model="state.tableData" style="width: 100%">
				<el-form-item label="科目名称">
					<el-select v-model="state.tableData.feeItemName" filterable clearable placeholder="科目名称">
						<el-option v-for="(item, index) in state.feeItemSelect" :key="item.index" :label="item.feeItemName" :value="item.feeItemName"> </el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="pricingManner" label="计费方式" width="140">
					<el-select v-model="state.tableData.pricingManner" filterable clearable placeholder="计费方式">
						<el-option v-for="(item, index) in state.pricingMannerSelect" :key="item.label" :label="item.label" :value="item.value"> </el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<template class="right" #footer>
				<span>
					<el-button @click="currentVisible = false">取 消</el-button>
					<el-button type="primary" @click="createCost">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="logisticsCostDialog">
import { ComponentInternalInstance } from 'vue';

import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
import useDropdownStore from '/@/stores/modules/dropdown';
import { postData } from '/@/api/common/baseApi';

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const dropdownStore = useDropdownStore();

const emit = defineEmits(['update:visible', 'on-closed']);
//#region 定义属性
const props = defineProps({
	visible: Boolean,
	ids: Number,
	// 选中的订单ID
	dataListSelections: {
		type: Array,
		default: () => {
			return [];
		},
		required: true,
	},
	dataBase: {} as any,
});
//#endregion

//#region 定义变量
const state = reactive({
	tableData: [
		{
			feeItemName: '',
			pricingManner: '',
		},
	] as any,
	feeItemSelect: [] as any[], // 科目下拉框
	pricingMannerSelect: [] as any[], // 计费方式
	formData: {} as any, // 主表数据
	detailRows: [] as any, // 明细数据
	detailRows2: [] as any, // 明细数据2
});

//#endregion

//#region onMounted
onMounted(async () => {
	await getloadDropdown();
});
//#endregion

// 获取下拉框
const getloadDropdown = async () => {
	// 获取科目下拉框值
	await dropdownStore.loadDropDownById([722]);
	state.feeItemSelect = dropdownStore.getDropdown(722)?.value || [];

	// 计费方式
	await dropdownStore.loadDropDownById([1070]);
	state.pricingMannerSelect = dropdownStore.getDropdown(1070)?.value || [];
};

// 是否显示dialog
const currentVisible = computed({
	get() {
		return props.visible;
	},
	set(newValue) {
		emit('update:visible', newValue); // 双向绑定prop.action，通知父级组件变量值同步更新
	},
});

// 接受主表信息
const initData = (formData: any, detailRows: any) => {
	state.formData = formData;
	state.detailRows = detailRows;
};

// 确定
const createCost = async () => {
	if (state.tableData.feeItemName === '空桶单反') {
		const url = '/composite/plate/in/logisticsCost';
		const params = {
			feeItemName: state.tableData.feeItemName, // 弹窗费用科目
			pricingManner: state.tableData.pricingManner, // 弹窗计价方式
			carrierName: state.formData.carrierName, // 主表承运商
			placeOrigin: state.formData.placeOrigin, // 主表出发地
			placeDestination: state.formData.placeDestination, // 主表目的地
		};
		const [err, res] = await to(postData(url, params));
		if (err) {
			proxy.$message.error(err.message);
			return;
		}
		// 求和
		let total: any = state.detailRows.reduce(
			(totalItem: any, currItem: any) => {
				totalItem.totalQuantity += currItem.returnQty;
				totalItem.totalWeight += currItem.rowWeight;
				totalItem.totalCube += currItem.rowCube;
				return totalItem;
			},
			{ totalQuantity: 0, totalWeight: 0, totalCube: 0 }
		);
		if (res.result) {
			//单条
			props.dataBase.editorRef.value.addDetailDataRow(
				[
					{
						feeItemId: state.tableData.feeItemId,
						feeItemName: state.tableData.feeItemName,
						pricingManner: state.tableData.pricingManner,
						costPrice: res.data, // 费用单价
						subCost: res.data,
						billableValue: 0,
						plateType: '',
						plateSpec: '',
						plateName: '',
						totalQuantity: total.totalQuantity,
						totalWeight: total.totalWeight,
						totalCube: total.totalCube,
					},
				],
				'base_plate_in_cost'
			);
			currentVisible.value = false;
			// 合计主表运费
			let totalFreight = 0;
			let detailRows2 = props.dataBase.detailRows2.value;
			detailRows2.forEach((item: any) => {
				totalFreight += Number(item.subCost) || 0;
			});
			props.dataBase.masterData.value.totalFreight = totalFreight; // 合计运费
		}
	} else {
		// 根据容器类别和容器规格给明细表1进行分组处理
		let groupList = state.detailRows.reduce((all: any, next: any) => (all.some((item: any) => item.plateType == next.plateType && item.plateSpec == next.plateSpec) ? all : [...all, next]), []);
		// 循环明细
		for (let item of groupList) {
			const url = '/composite/plate/in/logisticsCost';
			const params = {
				feeItemName: state.tableData.feeItemName, // 弹窗费用科目
				pricingManner: state.tableData.pricingManner, // 弹窗计价方式
				clientShortName: state.formData.clientShortName, // 主表客户名称
				carrierName: state.formData.carrierName, // 主表承运商
				placeOrigin: state.formData.placeOrigin, // 主表出发地
				placeDestination: state.formData.placeDestination, // 主表目的地
				plateType: item.plateType, // 明细容器类型
				plateSpec: item.plateSpec, // 明细容器规格
				plateName: item.plateName, // 明细容器名称
			};
			const [err, res] = await to(postData(url, params));
			if (err) {
				proxy.$message.error(err.message);
				return;
			}
			// 分组求和
			let list = state.detailRows.filter((i: any) => i.plateType == item.plateType && item.plateSpec == i.plateSpec);
			let total: any = list.reduce(
				(totalItem: any, currItem: any) => {
					totalItem.totalQuantity += currItem.returnQty;
					totalItem.totalWeight += currItem.rowWeight;
					totalItem.totalCube += currItem.rowCube;
					return totalItem;
				},
				{ totalQuantity: 0, totalWeight: 0, totalCube: 0 }
			);
			if (res.result) {
				let billableValue = 0; //
				if (state.tableData.pricingManner === '重量+规格') {
					billableValue = total.totalQuantity;
				} else if (state.tableData.pricingManner === '体积+规格') {
					billableValue = total.totalCube;
				} else if (state.tableData.pricingManner === '按数量') {
					billableValue = total.totalQuantity;
				}
				//单条
				props.dataBase.editorRef.value.addDetailDataRow(
					[
						{
							feeItemId: state.tableData.feeItemId,
							feeItemName: state.tableData.feeItemName,
							pricingManner: state.tableData.pricingManner,
							costPrice: res.data, // 费用单价
							subCost: res.data * billableValue,
							billableValue: billableValue,
							plateType: item.plateType,
							plateSpec: item.plateSpec,
							plateName: item.plateName, // 明细容器名称
							totalQuantity: total.totalQuantity,
							totalWeight: total.totalWeight,
							totalCube: total.totalCube,
						},
					],
					'base_plate_in_cost'
				);
				currentVisible.value = false;
				// 合计主表运费
				let totalFreight = 0;
				let detailRows2 = props.dataBase.detailRows2.value;
				detailRows2.forEach((item: any) => {
					totalFreight += Number(item.subCost) || 0;
				});
				props.dataBase.masterData.value.totalFreight = totalFreight; // 合计运费
			}
		}
	}
};

// 对外暴露属性和方法
defineExpose({
	initData,
});
</script>
