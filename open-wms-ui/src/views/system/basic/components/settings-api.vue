<template>
	<div :ref="'settings'" class="settings-sub-container">
		<el-form ref="form" v-model="state.formData" label-width="350px">
			<h2 class="sub-title">{{ $tt('API接口参数配置') }}</h2>
			<el-form-item :label="$tt('接受出库单时自动审核成功')">
				<el-switch v-model="state.formData.api_saleOrderAutoAuditing" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('接受出库单时自动分拣')">
				<el-switch v-model="state.formData.api_saleOrderAutoSorting" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('接受预到货单时状态为审核成功')">
				<el-switch v-model="state.formData.api_purchaseOrderStatusSuccess" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('出库单状态为“冻结中”删除订单')">
				<el-switch v-model="state.formData.api_sale_order_dongJie_del" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('冻结订单时删除占位')">
				<el-switch v-model="state.formData.api_sale_order_dongJie_delPlaceHolder" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>

			<h2 class="sub-title">{{ $tt('ERP接口参数设置') }}</h2>
			<el-form-item :label="$tt('推送成功后自动分拣销售单')">
				<el-switch v-model="state.formData.erp_api_erpSaleOrder_autoSorting" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('自动下发到出库单')">
				<el-switch v-model="state.formData.erp_api_erpSaleOrder_toSaleOrder" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>

			<h2 class="sub-title">{{ $tt('推送管家婆ERP接口参数设置') }}</h2>
			<el-form-item :label="$tt('ERP接口url')" class="margin-bottom-10">
				<el-input v-model="state.formData.api_erp_gjp_url" class="w-300"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('ERP接口appid')" class="margin-bottom-10">
				<el-input v-model="state.formData.api_erp_gjp_appid" class="w-300"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('ERP接口secret')" class="margin-bottom-10">
				<el-input v-model="state.formData.api_erp_gjp_secret" class="w-300"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('ERP接口accesstoken')" class="margin-bottom-10">
				<el-input v-model="state.formData.api_erp_gjp_accesstoken" class="w-300"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('出库单接口')" class="margin-bottom-10">
				<el-input v-model="state.formData.api_erp_gjp_sale_order_method" class="w-300"></el-input>
			</el-form-item>

			<el-form-item :label="$tt('是否过账')" class="margin-bottom-10">
				<el-checkbox-group v-model="state.formData.isPost_fields"
					>>
					<el-checkbox label="saleOrder">{{ $tt('出库单') }}</el-checkbox>
					<el-checkbox label="purchaseReturn">{{ $tt('退货单') }}</el-checkbox>
					<el-checkbox label="lossReport">{{ $tt('盘盈盘亏单') }}</el-checkbox>
					<el-checkbox label="storageOuter">{{ $tt('其他出库') }}</el-checkbox>
					<el-checkbox label="allocateSame">{{ $tt('同价调拨单') }}</el-checkbox>
					<el-checkbox label="allocateChange">{{ $tt('变价调拨单') }}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>

			<el-form-item :label="$tt('销售退货单类型回推ERP')" class="margin-bottom-10">
				<el-checkbox-group v-model="state.formData.isSaleReturn_fields"
					>>
					<el-checkbox label="salesReturn">{{ $tt('销售退货单') }}</el-checkbox>
					<el-checkbox label="salesErpReturn">{{ $tt('ERP回退单') }}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>

			<h2 class="sub-title">{{ $tt('推送云流水接口参数设置') }}</h2>
			<el-form-item :label="$tt('云流水接口url')" class="margin-bottom-10">
				<el-input v-model="state.formData.api_yls_gjp_url" class="w-300"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('云流水接口appid')" class="margin-bottom-10">
				<el-input v-model="state.formData.api_yls_gjp_appid" class="w-300"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('云流水接口secret')" class="margin-bottom-10">
				<el-input v-model="state.formData.api_yls_gjp_secret" class="w-300"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('云流水接口accesstoken')" class="margin-bottom-10">
				<el-input v-model="state.formData.api_yls_gjp_accesstoken" class="w-300"></el-input>
			</el-form-item>

			<h2 class="sub-title">{{ $tt('默认供应商设置') }}</h2>
			<el-form-item :label="$tt('默认供应商')">
				<el-select v-model="state.formData.erp_provider_Id" :placeholder="$tt('请选择')" filterable remote :remote-method="remoteMethod">
					<el-option v-for="item in state.providerNames" :key="item.provider_Id" :label="item.providerShortName" :value="item.provider_Id"></el-option>
				</el-select>
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
		isPost_fields: [],
		isSaleReturn_fields: [],
		api_autoCheck: 0,
		api_noAutoSorting: 0,
		api_purchaseOrderStatusZaiTu: 0,
		api_sale_order_dongJie_del: 0,
		api_sale_order_dongJie_delPlaceHolder: 0,
		api_erp_gjp_url: '',
		api_erp_gjp_appid: '',
		api_erp_gjp_secret: '',
		api_erp_gjp_accesstoken: '',
		api_erp_gjp_sale_order_method: '',
		erp_provider_Id: '',
		api_yls_gjp_url: '',
		api_yls_gjp_appid: '',
		api_yls_gjp_secret: '',
		api_yls_gjp_accesstoken: '',
		erp_api_erpSaleOrder_autoSorting: '',
		erp_api_erpSaleOrder_toSaleOrder: '',
	} as any,
	valueList: [] as any[],
	providerNames: [] as any[],
});
//#endregion

let base = settingsHook({ state });
onMounted(() => {
	getproviderOptions();

	let callback = (configKey: string, configValue: string) => {
		if (['isPost_fields', 'isSaleReturn_fields'].indexOf(configKey) >= 0) {
			state.formData[configKey] = configValue ? configValue.split(',') : [];
		} else {
			state.formData[configKey] = configValue;
		}
	};
	base.loadParam(callback);
});
// 获取仓库数据
const getproviderOptions = async () => {
	let url = '/basic/storage/storage/getList';
	let params = {
		where: '33',
	};
	let [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}
	if (res?.result) {
		state.providerNames = res.data.dropdown33;
	}
};

// 保存数据
const onSave = () => {
	let callback = (configKey: string, item: any) => {
		let configValue = state.formData[configKey];
		if (['isPost_fields', 'isSaleReturn_fields'].indexOf(configKey) >= 0) {
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

const remoteMethod = async (query: any) => {
	const url = '/basic/product/provider/getList';
	const params = {
		name: query,
	};
	let [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}
	proxy.common.showMsg(res);
	if (res?.result) {
		state.providerNames = res.data;
	}
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
		margin-bottom: 0px;
	}
	.form-footer {
		margin-top: 30px;
	}
}
</style>
