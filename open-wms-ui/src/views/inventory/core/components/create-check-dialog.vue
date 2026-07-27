<template>
	<div>
		<el-dialog draggable v-model="currentVisible" title="生成盘点数据" width="30%" class="dialog-container">
			<el-form ref="form" :model="state.formData" label-width="150px">
				<el-form-item :label="$tt('仓库名称')">
					<el-select v-model="state.formData.storageName" disabled :placeholder="$tt('请选择仓库')" class="input-300">
						<el-option v-for="item in state.storageNames" :key="item.storageId" :label="item.storageName" :value="item.storageId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item :label="$tt('货主名称')">
					<el-select v-model="state.formData.consignorName" disabled :placeholder="$tt('请选择货主')" class="input-300">
						<el-option v-for="item in state.consignorNames" :key="item.consignorId" :label="item.consignorName" :value="item.consignorId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item :label="$tt('库区')">
					<el-input v-model="state.formData.areaCode" disabled link style="width: 200px"></el-input>
				</el-form-item>
				<el-form-item :label="$tt('通道')">
					<el-input v-model="state.formData.channelCode" disabled link style="width: 200px"></el-input>
				</el-form-item>
				<el-form-item :label="$tt('盘点类型')">
					<el-select v-model="state.formData.checkType" filterable clearable placeholder="请选择盘点类型" @change="currentSel">
						<el-option label="全盘" value="全盘" />
						<el-option label="动态盘" value="动态盘" />
						<el-option label="常规盘" value="常规盘" />
					</el-select>
				</el-form-item>
				<el-form-item :label="$tt('是否盲盘')">
					<el-switch v-model="state.formData.checked" :active-value="1" :inactive-value="0"></el-switch>
				</el-form-item>
				<el-form-item v-if="state.isdifference" label="差异天数">
					<el-input v-model="state.formData.input" :disabled="!state.isdifference" style="width: 200px" link placeholder="请输天数"></el-input>
				</el-form-item>
			</el-form>
			<template class="right" #footer>
				<span>
					<el-button @click="currentVisible = false">取 消</el-button>
					<el-button type="primary" @click="createOrderCheck">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="create-check-dialog">
import { ComponentInternalInstance } from 'vue';

import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import { QueryBo } from '/@/types/common';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

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
});
//#endregion

//#region 定义变量
const state = reactive({
	number: 0,
	isdifference: false,
	formData: {
		storageId: '',
		storageName: '',
		consignorId: '',
		consignorName: '',
		areaCode: '',
		channelCode: '',
		checkType: '',
		checked: 0,
		input: '',
	},
	// 仓库
	storageNames: [] as any[],
	consignorNames: [] as any[],
	allWhere: {},
});
//#endregion

//#region onMounted
onMounted(async () => {
	await getStorageList();
	await getConsignorList();
});
//#endregion

// 接受预到货单主表信息
const initData = (storageId: any, consignorId: any, areaCode: any, channelCode: any, allWhere: Array<QueryBo>) => {
	state.formData.storageId = storageId;
	const filterStorage = state.storageNames.filter((f) => f.storageId == storageId);
	state.formData.storageName = filterStorage[0].storageName;
	state.formData.consignorId = consignorId;
	const filterConsignor = state.consignorNames.filter((f) => f.consignorId == consignorId);
	state.formData.consignorName = filterConsignor[0].consignorName;
	state.formData.areaCode = areaCode;
	state.formData.channelCode = channelCode;
	state.allWhere = allWhere;
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
// 获取仓库
const getStorageList = async () => {
	const url = '/basic/storage/storage/getList';
	const params = {};
	const [err, res] = await to(postData(url, params));
	if (res?.result) {
		state.storageNames = res.data;
	}
};
// 获取货主名称下拉框
const getConsignorList = async () => {
	const url = '/basic/base/consignor/getList';
	const params = {};
	const [err, res] = await to(postData(url, params));
	if (res?.result) {
		state.consignorNames = res.data;
	}
};

// 获取货主名称下拉框
const currentSel = async (value: string) => {
	state.isdifference = false;
	if (value === '动态盘') {
		state.isdifference = true;
	}
};

// 生成盘点单
const createOrderCheck = async () => {
	if (!state.formData.checkType) {
		proxy.$message.error('请输入盘点类型');
		return;
	}
	var diffDate = state.formData.input;
	if (state.formData.checkType === '动态盘' && !diffDate) {
		proxy.$message.error('请输入差异天数');
		return;
	}

	const url = '/inventory/operation/check/createOrderCheck';
	const params = {
		storageId: state.formData.storageId,
		storageName: state.formData.storageName,
		consignorId: state.formData.consignorId,
		consignorName: state.formData.consignorName,
		areaCode: state.formData.areaCode,
		channelCode: state.formData.channelCode,
		checkType: state.formData.checkType,
		checked: state.formData.checked,
		diffDate: diffDate,
		inventoryIds: props.dataListSelections.map((m: any) => m.inventoryId).join(','),
		allWhere: state.allWhere,
	};
	let [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}
	proxy.common.showMsg(res);
	currentVisible.value = false;
	emit('on-closed'); // 关闭窗口事件
};

// 对外暴露属性和方法
defineExpose({
	initData,
	state,
});
</script>
