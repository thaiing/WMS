<template>
	<div :ref="'settings'" class="settings-sub-container">
		<el-form ref="form" v-model="state.formData" label-width="250px">
			<h2 class="sub-title">{{ $tt('小程序下单设置') }}</h2>
			<el-form-item :label="$tt('默认快递公司')">
				<el-select v-model="state.formData.erp_expressCorp_Id" :placeholder="$tt('请选择')">
					<el-option v-for="item in state.expressCorpList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item :label="$tt('默认出库仓库')">
				<el-select v-model="state.formData.erp_Outstorage_Id" :placeholder="$tt('请选择')">
					<el-option v-for="item in state.storageNames" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item :label="$tt('默认生成出库单')">
				<template>
					<el-radio v-model="state.formData.app_defaultorder" label="计划单">{{ $tt('计划单') }}</el-radio>
					<el-radio v-model="state.formData.app_defaultorder" label="出库单">{{ $tt('出库单') }}</el-radio>
				</template>
			</el-form-item>
			<el-form-item :label="$tt('微商城登录默认角色')">
				<template>
					<el-radio v-model="state.formData.app_defaultRole" label="客户">{{ $tt('客户') }}</el-radio>
					<el-radio v-model="state.formData.app_defaultRole" label="供应商">{{ $tt('供应商') }}</el-radio>
					<el-radio v-model="state.formData.app_defaultRole" label="货主">{{ $tt('货主') }}</el-radio>
					<el-radio v-model="state.formData.app_defaultRole" label="司机">{{ $tt('司机') }}</el-radio>
					<el-radio v-model="state.formData.app_defaultRole" label="平台">{{ $tt('平台') }}</el-radio>
				</template>
			</el-form-item>
			<el-form-item :label="$tt('登录前验证账号是否存在')">
				<el-checkbox-group v-model="state.formData.app_checkAccountBeforeLogin"
					>>
					<el-checkbox :label="1">{{ $tt('客户') }}</el-checkbox>
					<el-checkbox :label="2">{{ $tt('供应商') }}</el-checkbox>
					<el-checkbox :label="3">{{ $tt('司机') }}</el-checkbox>
					<el-checkbox :label="4">{{ $tt('平台') }}</el-checkbox>
					<el-checkbox :label="5">{{ $tt('货主') }}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item :label="$tt('微商城只显示默认端')">
				<el-switch v-model="state.formData.onlyShowDefault" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('微商城是否验证箱号')">
				<el-switch v-model="state.formData.app_checkCase" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('商品采购平均价')">
				<span class="demonstration">{{ $tt('开始日期') }}：</span>
				<el-date-picker v-model="state.formData.wechat_purchasePrice_begin" type="date" :placeholder="$tt('选择日期')"></el-date-picker>
				<span class="margin-left-20">{{ $tt('结束日期') }}：</span>
				<el-date-picker v-model="state.formData.wechat_purchasePrice_end" type="date" :placeholder="$tt('选择日期')"></el-date-picker>
			</el-form-item>
			<h2 class="sub-title">{{ $tt('小程序全部商品图标') }}</h2>
			<el-form-item :label="$tt('上传全部商品图片：')">
				<!-- <el-upload ref="upload-file" :http-request="({file})=>{uploadHttp(file)}" :before-upload="(file)=>beforeAvatarUpload(file)" :multiple="true" :on-preview="(file)=>handlePicPreview(file)" :on-remove="handlePicRemove" :on-change="(file, fileList)=>{handlePicChange(file, fileList)}" :file-list="picList" list-link action="">
          <el-button size="small" type="primary">{{ $tt('点击上传') }}</el-button>
        </el-upload> -->
				<!--预览图片-->
				<!-- <el-dialog v-model:visible="dialogPicVisible" :append-to-body="true">
          <img :src="dialogImageUrl" width="100%" alt="">
        </el-dialog> -->
			</el-form-item>

			<el-form-item class="form-footer">
				<el-button type="primary" @click="onSave">{{ $tt('保存') }}</el-button>
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
		defaultExpress: '',
		erp_expressCorp_Id: '',
		erp_Outstorage_Id: '',
		app_defaultorder: '出库单',
		wechat_purchasePrice_begin: null,
		wechat_purchasePrice_end: null,
		app_checkAccountBeforeLogin: [],
		files: '', // 附件文件
		app_defaultRole: '',
	} as any,
	// 接口数据
	valueList: [] as any[],
	// 快递公司
	expressCorpList: [] as any[],
	storageNames: [] as any[],
});
//#endregion

let base = settingsHook({ state });
onMounted(() => {
	let callback = (configKey: string, configValue: string) => {
		if (['app_checkAccountBeforeLogin'].indexOf(configKey) >= 0) {
			state.formData[configKey] = configValue ? configValue.split(',') : [];
		} else {
			state.formData[configKey] = configValue;
		}
	};
	base.loadParam(callback);
	// 加载快递公司
	getExpressCorpList();
	// 获取仓库
	getStorageList();
});
// 获取仓库
const getStorageList = async () => {
	const url = '/basic/storage/storage/getList';
	const params = {};
	let [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}
	if (res?.result) {
		state.valueList = res.data;
		// 获得参数值列表，将数字转换为对象
		let data = res.data.map((item: any) => {
			item.label = item.storageName;
			item.value = item.storage_Id;
			return item;
		});
		state.storageNames = data;
	}
};
// 加载快递公司
const getExpressCorpList = async () => {
	// 加载快递公司
	const url = '/basic/base/express-corp/getList';
	const params = {};
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
};

// 保存数据
const onSave = () => {
	let callback = (configKey: string, item: any) => {
		let configValue = state.formData[configKey];
		if (['app_checkAccountBeforeLogin'].indexOf(configKey) >= 0) {
			configValue = configValue.join(',');
		}

		if (item) {
			item.configValue = configValue;
		} else {
			state.valueList.push({
				configKey: configKey,
				configType: 'N',
				configValue: configValue,
			});
		}
	};
	base.onSave(callback);
};
</script>

<style lang="scss" scoped>
.settings-sub-container {
	padding-top: 20px;
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
