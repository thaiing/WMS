<template>
	<div :ref="'settings'" class="settings-sub-container">
		<el-form ref="form" v-model="state.formData" label-width="150px">
			<h2 class="sub-title">{{ $tt('ERP接口账号1') }}</h2>
			<el-form-item :label="$tt('接口Url地址')">
				<el-input v-model="state.formData.erp_url" class="w-500"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('账号appId')">
				<el-input v-model="state.formData.erp_appId" class="w-500"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('密码appSecret')">
				<el-input v-model="state.formData.erp_appSecret" type="textarea" class="w-800"></el-input>
			</el-form-item>
			<h2 class="sub-title">{{ $tt('ERP接口账号2') }}</h2>
			<el-form-item :label="$tt('接口Url地址')">
				<el-input v-model="state.formData.erp_url2" class="w-500"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('账号appId')">
				<el-input v-model="state.formData.erp_appId2" class="w-500"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('密码appSecret')">
				<el-input v-model="state.formData.erp_appSecret2" type="textarea" class="w-800"></el-input>
			</el-form-item>
			<h2 class="sub-title">{{ $tt('ERP售后接口账号') }}</h2>
			<el-form-item :label="$tt('接口Url地址')">
				<el-input v-model="state.formData.erp_url3" class="w-500"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('账号appkey')">
				<el-input v-model="state.formData.erp_appkey3" class="w-500"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('密码appSecret')">
				<el-input v-model="state.formData.erp_appSecret3" type="textarea" class="w-800"></el-input>
			</el-form-item>
			<h2 class="sub-title">{{ $tt('718物流轨迹接口参数') }}</h2>
			<el-form-item :label="$tt('接口Url地址')">
				<el-input v-model="state.formData.track718_url" class="w-500"></el-input>
			</el-form-item>
			<el-form-item label="key">
				<el-input v-model="state.formData.track718_key" class="w-500"></el-input>
			</el-form-item>
			<h2 class="sub-title">{{ $tt('默认设置') }}</h2>
			<el-form-item :label="$tt('默认快递公司')">
				<el-select v-model="state.formData.erp_expressCorp_Id" :placeholder="$tt('请选择')">
					<el-option v-for="item in state.expressCorpList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item :label="$tt('接口推送时需要仓库')">
				<el-switch v-model="state.formData.erp_storage_Id" :active-value="1" :inactive-value="0"></el-switch>
				<span>{{ $tt('关闭时，接口推送不验证仓库，仓库值为空') }}</span>
			</el-form-item>
			<h2 class="sub-title">{{ $tt('上架扫描配置') }}</h2>
			<el-form-item :label="$tt('上架后实时推送库存到前端ERP')" label-width="250px">
				<el-switch v-model="state.formData.in_sendInventoryToErp" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<h2 class="sub-title">{{ $tt('金蝶接口账号') }}</h2>
			<el-form-item :label="$tt('url')">
				<el-input v-model="state.formData.erp_kingdee_url" class="w-700"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('账套Id')">
				<el-input v-model="state.formData.erp_kingdee_acctID" class="w-500"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('用户名')">
				<el-input v-model="state.formData.erp_kingdee_username" class="w-500"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('密码')">
				<el-input v-model="state.formData.erp_kingdee_password" class="w-500"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('lcid')">
				<el-input v-model="state.formData.erp_kingdee_lcid" class="w-500"></el-input>
			</el-form-item>

			<h2 class="sub-title">{{ $tt('easydispatch接口账号') }}</h2>
			<el-form-item :label="$tt('url')">
				<el-input v-model="state.formData.erp_easydispatch_url" class="w-700"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('用户名')">
				<el-input v-model="state.formData.erp_easydispatch_username" class="w-500"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('密码')">
				<el-input v-model="state.formData.erp_easydispatch_password" class="w-500"></el-input>
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
import settingsHook from '../hook/settingsHook';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';

//#region 定义变量
const state = reactive({
	// 编辑数据对象
	formData: {
		erp_url: null,
		erp_appId: null,
		erp_appSecret: null,
		erp_url2: null,
		erp_appId2: null,
		erp_appSecret2: null,
		erp_url3: null,
		erp_appkey3: null,
		erp_appSecret3: null,
		in_sendInventoryToErp: 0,
		// 默认快递公司
		erp_expressCorp_Id: null,
		erp_storage_Id: 0,
		track718_url: null,
		track718_key: null,
		erp_kingdee_url: null,
		erp_kingdee_acctID: null,
		erp_kingdee_username: null,
		erp_kingdee_password: null,
		erp_kingdee_lcid: null,
		erp_easydispatch_url: null,
		erp_easydispatch_username: null,
		erp_easydispatch_password: null,
	} as any,
	valueList: [] as any[],
	expressCorpList: [] as any[],
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
