<template>
	<div :ref="'settings'" class="settings-sub-container">
		<el-form ref="form" v-model="state.formData" label-width="150px">
			<h2 class="sub-title">{{ $tt('小程序&app全局参数') }}</h2>
			<el-form-item label="预约入库选择器">
				<el-checkbox-group v-model="state.formData.app_global_in_selector">
					<el-checkbox label="商品选择器"></el-checkbox>
					<el-checkbox label="库存选择器"></el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="预约出库选择器">
				<el-checkbox-group v-model="state.formData.app_global_out_selector">
					<el-checkbox label="商品选择器"></el-checkbox>
					<el-checkbox label="库存选择器"></el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<h2 class="sub-title">{{ $tt('PDA参数设置') }}</h2>
			<el-form-item :label="$tt('SN重量提取类型')">
				<el-radio v-model="state.formData.app_in_extractWeightType" label="毛重">{{ $tt('毛重') }}</el-radio>
				<el-radio v-model="state.formData.app_in_extractWeightType" label="净重">{{ $tt('净重') }}</el-radio>
			</el-form-item>
			<el-form-item class="form-footer">
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
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import settingsHook from '../hook/settingsHook';

//#region 定义变量
const state = reactive({
	// 编辑数据对象
	formData: {
		app_global_in_selector: [],
		app_global_out_selector: [],
		app_in_extractWeightType: null,
	} as any,
	valueList: [] as any[],
});
//#endregion

let base = settingsHook({ state });
onMounted(() => {
	let callback = (configKey: string, configValue: string) => {
		if (['app_global_in_selector', 'app_global_out_selector'].indexOf(configKey) >= 0) {
			state.formData[configKey] = configValue ? ('' + configValue).split(',') : [];
			state.formData[configKey].forEach((p: any, index: string | number) => {
				state.formData[configKey][index] = p;
			});
		} else {
			state.formData[configKey] = configValue;
		}
	};
	// 加载数据
	base.loadParam(callback);
});
// 短信校验
// const sendSMS = () => {
//   let url = "/api/sys/param/sendSMS";
//   let params = {
//     mobile: state.mobile
//   };
//   let [err, res] = await to(postData(url, params));
// 	if (err) {
// 		return;
// 	}
// 	if (res?.result) {
//     state.mobile = null;
// 	}
// }
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
		margin-bottom: 20px;
	}

	.form-footer {
		margin-top: 30px;
	}
}
</style>
