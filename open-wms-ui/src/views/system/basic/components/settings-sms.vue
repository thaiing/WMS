<template>
	<div :ref="'settings'" class="settings-sub-container">
		<el-form ref="form" v-model="state.formData" label-width="150px">
			<h2 class="sub-title">{{ $tt('阿里云短信接口参数设置') }}</h2>
			<el-form-item label="*accessKeyId">
				<el-input v-model="state.formData.sms_accessKeyId" class="w-500"></el-input>
			</el-form-item>
			<el-form-item label="accessKeySecret">
				<el-input v-model="state.formData.sms_accessKeySecret" class="w-500"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('*签名名称')">
				<el-input v-model="state.formData.sms_signName" class="w-500"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('*模板Id')">
				<el-input v-model="state.formData.sms_templateCode" class="w-500"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('手机号')">
				<el-input v-model="state.mobile" class="w-500"></el-input>
			</el-form-item>
			<el-form-item class="form-footer">
				<el-button type="primary" @click="base.onSave">{{ $tt('保存') }}</el-button>
				<el-button type="success" @click="sendSMS">{{ $tt('发送短信校验') }}</el-button>
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
		sms_accessKeyId: null,
		sms_accessKeySecret: null,
		sms_signName: null,
		sms_templateCode: null,
	} as any,
	// 接口数据
	valueList: [] as any[],
	// 快递公司
	expressCorpList: [] as any[],
	// 短信校验手机号
	mobile: null,
});
//#endregion

let base = settingsHook({ state });
onMounted(async () => {
	base.loadParam();
	// 加载快递公司
	const url = '/basic/base/express-corp/getList';

	var params = {};
	let [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}
	if (res?.result) {
		state.valueList = res.data;
		// 获得参数值列表，将数字转换为对象
		let data = res.data.forEach((item: any) => {
			item.label = item.expressCorpName;
			item.value = item.expressCorp_Id;
			return item;
		});
		state.expressCorpList = data;
	}
});

// 短信校验
const sendSMS = async () => {
	var url = '/api/sys/param/sendSMS';
	var params = {
		mobile: state.mobile,
	};

	let [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}
	proxy.common.showMsg(res);
};
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
