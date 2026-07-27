<template>
	<div :ref="'settings'" class="settings-sub-container">
		<el-form ref="form" v-model="state.formData" label-width="150px">
			<h2 class="sub-title">{{ $tt('二维码设置') }}</h2>
			<el-form-item :label="$tt('二维码访问地址')">
				<el-input v-model="state.formData.qrCode_url" class="w-500"></el-input>
			</el-form-item>
			<h2 class="sub-title">{{ $tt('货位条码参数设置') }}</h2>
			<el-form-item :label="$tt('条码纸张大小')">
				<span class="margin-right-20"> {{ $tt('宽') }}： <el-input v-model="state.formData.positionPage_width" class="w-50"></el-input> mm </span>
				<span class="margin-right-20"> {{ $tt('高') }}： <el-input v-model="state.formData.positionPage_height" class="w-50"></el-input> mm </span>
			</el-form-item>
			<el-form-item :label="$tt('条码大小')">
				<span class="margin-right-20"> {{ $tt('宽') }}： <el-input v-model="state.formData.positionBar_width" class="w-50"></el-input> mm </span>
				<span class="margin-right-20"> {{ $tt('高') }}： <el-input v-model="state.formData.positionBar_height" class="w-50"></el-input> mm </span>
			</el-form-item>
			<el-form-item :label="$tt('条码边距')">
				<span class="margin-right-20"> {{ $tt('左边距') }}： <el-input v-model="state.formData.positionBar_left" class="w-50"></el-input> mm </span>
				<span class="margin-right-20"> {{ $tt('上边距') }}： <el-input v-model="state.formData.positionBar_top" class="w-50"></el-input> mm </span>
			</el-form-item>
			<el-form-item :label="$tt('条码字体大小')"> <el-input v-model="state.formData.positionBar_fontSize" class="w-50"></el-input> px </el-form-item>
			<h2 class="sub-title">{{ $tt('SKU条码参数设置') }}</h2>
			<el-form-item :label="$tt('显示规格')">
				<el-switch v-model="state.formData.skuPage_displaySpec" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('SKU纸张大小')">
				<span class="margin-right-20"> {{ $tt('宽') }}： <el-input v-model="state.formData.skuPage_width" class="w-50"></el-input> mm </span>
				<span class="margin-right-20"> {{ $tt('高') }}： <el-input v-model="state.formData.skuPage_height" class="w-50"></el-input> mm </span>
			</el-form-item>
			<el-form-item :label="$tt('条码大小')">
				<span class="margin-right-20"> {{ $tt('宽') }}： <el-input v-model="state.formData.skuBar_width" class="w-50"></el-input> mm </span>
				<span class="margin-right-20"> {{ $tt('高') }}： <el-input v-model="state.formData.skuBar_height" class="w-50"></el-input> mm </span>
			</el-form-item>
			<el-form-item :label="$tt('条码边距')">
				<span class="margin-right-20"> {{ $tt('左边距') }}： <el-input v-model="state.formData.skuBar_left" class="w-50"></el-input> mm </span>
				<span class="margin-right-20"> {{ $tt('上边距') }}： <el-input v-model="state.formData.skuBar_top" class="w-50"></el-input> mm </span>
			</el-form-item>
			<el-form-item :label="$tt('条码字体大小')"> <el-input v-model="state.formData.skuBar_fontSize" class="w-50"></el-input> px </el-form-item>
			<el-form-item>
				<el-button type="primary" @click="base.onSave">{{ $tt('保存') }}</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup lang="ts" name="settings-consignor">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import settingsHook from '../hook/settingsHook';
//#region 定义变量
const state = reactive({
	formData: {
		qrCode_url: null,

		positionPage_width: null,
		positionPage_height: null,
		positionBar_width: null,
		positionBar_height: null,
		positionBar_left: null,
		positionBar_top: null,
		positionBar_fontSize: null,

		skuPage_displaySpec: 0,
		skuPage_width: null,
		skuPage_height: null,
		skuBar_width: null,
		skuBar_height: null,
		skuBar_left: null,
		skuBar_top: null,
		skuBar_fontSize: null,
	} as any,
	valueList: [] as any[],
});
//#endregion

let base = settingsHook({ state });
onMounted(() => {
	base.loadParam();
});
</script>

<style lang="scss" scoped>
.settings-sub-container {
	::v-deep .sub-title {
		font-size: 14px;
		padding-bottom: 10px;
		border-bottom: 1px solid #ebeef5;
		padding-top: 20px;
		margin-bottom: 10px;
	}
	::v-deep .el-form-item__label {
		font-weight: normal;
	}
	.remark {
		color: #888;
	}
	::v-deep .el-form-item {
		margin-bottom: 10px;
	}
	.form-footer {
		margin-top: 30px;
	}
}
</style>
