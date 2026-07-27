<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>
	</div>
</template>

<script setup lang="ts" name="inventory-plate-plateOut">
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
const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
});
//#endregion

onMounted(() => {});

// 保存后事件
base.onSaveAfter = (formData: any) => {
	total(); // 明细计算
};
//明细改变事件
base.onDetailChange = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
	total(); // 明细计算
	if (field.prop === 'plateType') {
		// 改变容器名称下拉框
		getPlateSpecInfo(val, 1136);
	}
	if (field.prop === 'plateSpec') {
		// 改变单位重量,单位体积
		getWeightCube(val, row);
	}
};
//明细合计到主表
const total = () => {
	let formData = masterData.value; // 主表

	let totalOutQty = 0; // 合计借出数量
	let totalReturnedQty = 0; // 已归还数量
	let totalUnreturnedQty = 0; // 未归还数量

	base.detailRows.value?.forEach((item: any) => {
		item.nowOutQty = item.nowOutQty;
		item.returnedQty = Number(item.returnedQty);
		item.unreturnedQty = Number(item.nowOutQty);
		item.rowWeight = Number(item.weight * item.nowOutQty);
		item.rowCube = Number(item.unitCube * item.nowOutQty);
		totalOutQty += item.nowOutQty;
		totalReturnedQty += item.returnedQty;
		totalUnreturnedQty += item.unreturnedQty;
	});
	formData.totalOutQty = Math.Round(totalOutQty, 5);
	formData.totalReturnedQty = Math.Round(totalReturnedQty, 5);
	formData.totalUnreturnedQty = Math.Round(totalUnreturnedQty, 5);
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
// 根据容器规格默认重量，体积
const getWeightCube = async (val: any, row: any) => {
	if (!val) {
		return;
	}
	let url = '/basic/storage/plate/getWeightCube';
	let params = {
		plateSpec: val,
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
</script>
