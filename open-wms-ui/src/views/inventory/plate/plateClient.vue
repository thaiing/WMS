<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>
	</div>
</template>

<script setup lang="ts" name="inventory-plate-plateClient">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import baseHook from '/@/components/hooks/baseHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;
import { postData } from '/@/api/common/baseApi';
import useDropdownStore from '/@/stores/modules/dropdown';
const dropdownStore = useDropdownStore();

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
});
//#endregion

onMounted(() => {});

// 字段值改变事件
base.onChange = (ref: any, val: any, field: any, formData: any) => {
	if (field.options.prop === 'plateType') {
		// 改变容器名称下拉框
		getPlateSpecInfo(val, 1136);
	}
	if (field.options.prop === 'plateSpec') {
		// 改变单位重量,单位体积
		getWeightCube(val);
	}
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
		// masterData.value.plateSpec = '';
		var data = res.data;
		dropdownStore.setDropDown(dropdownId, data);
	} else {
		proxy.$message.error(res.msg);
	}
};
// 根据容器规格
const getWeightCube = async (val: any) => {
	if (!val) {
		return;
	}
	let url = '/basic/storage/plate/getWeightCube';
	let params = {
		plateSpec: val,
	};
	let res = await postData(url, params);
	if (res.result) {
		masterData.value.weight = res.data.weight;
		masterData.value.unitCube = res.data.unitCube;
		masterData.value.plateName = res.data.plateName;
	} else {
		proxy.$message.error(res.msg);
	}
};
</script>
