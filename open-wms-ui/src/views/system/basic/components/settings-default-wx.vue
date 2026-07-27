<template>
	<div :ref="'settings'" class="settings-sub-container">
		<el-form ref="form" v-model="state.formData" label-width="350px">
			<h2 class="sub-title">{{ $tt('微信公众号参数设置') }}</h2>
			<el-form-item :label="$tt('微信公众号appid')" class="margin-bottom-10">
				<el-input v-model="state.formData.wx_appid" class="w-300"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('微信公众号secret')" class="margin-bottom-10">
				<el-input v-model="state.formData.wx_secret" class="w-300"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('微信公众号消息模板id')" class="margin-bottom-10">
				<el-input v-model="state.formData.wx_template_id" class="w-300"></el-input>
			</el-form-item>
			<h2 class="sub-title">{{ $tt('慕晨企业微信参数设置') }}</h2>
			<el-form-item :label="$tt('企业微信corpid')" class="margin-bottom-10">
				<el-input v-model="state.formData.muchen_wx_corpid" class="w-300"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('企业微信secret')" class="margin-bottom-10">
				<el-input v-model="state.formData.muchen_wx_secret" class="w-300"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('企业微信agentid')" class="margin-bottom-10">
				<el-input v-model="state.formData.muchen_wx_agentid" class="w-300"></el-input>
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
		api_autoCheck: 0,
		api_noAutoSorting: 0,
		api_purchaseOrderStatusZaiTu: 0,
		api_sale_order_dongJie_del: 0,
		api_sale_order_dongJie_delPlaceHolder: 0,
		wx_appid: '',
		wx_secret: '',
		wx_template_id: '',
		muchen_wx_corpid: '',
		muchen_wx_secret: '',
		muchen_wx_agentid: '',
	} as any,
	// 接口数据
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
		margin-bottom: 0px;
	}
	.form-footer {
		margin-top: 30px;
	}
}
</style>
