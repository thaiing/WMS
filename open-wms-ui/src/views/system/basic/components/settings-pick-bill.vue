<template>
	<div :ref="'settings'" class="settings-sub-container">
		<el-form ref="form" v-model="state.formData" label-width="200px">
			<h2 class="sub-title">{{ $tt('出库拣配单字段设置') }}</h2>
			<el-form-item :label="$tt('显示字段')">
				<el-checkbox-group v-model="state.formData.pickOrder_fields"
					>>
					<el-checkbox label="areaCode">{{ $tt('库区') }}</el-checkbox>
					<el-checkbox label="channelCode">{{ $tt('通道') }}</el-checkbox>
					<el-checkbox label="positionName">{{ $tt('货位') }}</el-checkbox>
					<el-checkbox label="productModel">{{ $tt('条形码') }}</el-checkbox>
					<el-checkbox label="productCode">{{ $tt('商品编号') }}</el-checkbox>
					<el-checkbox label="productName">{{ $tt('商品名称') }}</el-checkbox>
					<el-checkbox label="productSpec">{{ $tt('商品规格') }}</el-checkbox>
					<el-checkbox label="smallUnit">{{ $tt('小单位') }}</el-checkbox>
					<el-checkbox label="bigUnit">{{ $tt('大单位') }}</el-checkbox>
					<el-checkbox label="produceDate">{{ $tt('生产日期') }}</el-checkbox>
					<el-checkbox label="salePrice">{{ $tt('销售价') }}</el-checkbox>
					<el-checkbox label="rowTotal">{{ $tt('销售金额') }}</el-checkbox>
					<el-checkbox label="orderCode">{{ $tt('出库单号') }}</el-checkbox>
					<el-checkbox label="storeOrderCode">{{ $tt('店铺单号') }}</el-checkbox>
					<el-checkbox label="remark">{{ $tt('订单备注') }}</el-checkbox>
					<el-checkbox label="giftMessage">{{ $tt('客户留言') }}</el-checkbox>
					<el-checkbox label="quantityOrderOrign">{{ $tt('拣货数量') }}</el-checkbox>
					<el-checkbox label="allotPositionName">{{ $tt('配货位') }}</el-checkbox>
					<el-checkbox label="allotQty">{{ $tt('配货数量') }}</el-checkbox>
					<el-checkbox label="clientShortName">{{ $tt('客户名称') }}</el-checkbox>
					<el-checkbox label="bigQty">{{ $tt('大单位数量') }}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item :label="$tt('字体大小')"> <el-input v-model="state.formData.pickOrder_fontSize" class="w-150"></el-input> px </el-form-item>
			<el-form-item :label="$tt('最大商品名称字长')">
				<el-input-number v-model.number="state.formData.pickOrder_productName_length" :min="0" controls-position="right" class="w-150"></el-input-number>
			</el-form-item>
			<el-form-item :label="$tt('列宽设置')">
				<el-input v-model="state.formData.pickOrder_colWidth" class="w-700" type="textarea" rows="5"></el-input>
				<span>{{ $tt('配置json串例如') }}：{"库区": 60,"货位": 100}</span>
			</el-form-item>
			<el-form-item :label="$tt('拣货路径')">
				<el-radio-group v-model="state.formData.pickOrder_firstMode">
					<el-radio label="col">{{ $tt('列优先') }}</el-radio>
					<el-radio label="row">{{ $tt('层优先') }}</el-radio>
					<el-radio label="product">{{ $tt('商品编号优先') }}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item class="form-footer fixed-footer">
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
		pickOrder_fields: [],
		pickOrder_fontSize: 18,
		pickOrder_productName_length: 20,
		pickOrder_firstMode: 'row',
	} as any,
	// 接口数据
	valueList: [] as any[],
});
//#endregion

let base = settingsHook({ state });
onMounted(() => {
	let callback = (configKey: string, configValue: string) => {
		if (['pickOrder_fields'].indexOf(configKey) >= 0) {
			state.formData[configKey] = configValue ? configValue.split(',') : [];
		} else {
			state.formData[configKey] = configValue;
		}
	};
	// 加载数据
	base.loadParam(callback);
});

//#region 保存
const onSave = () => {
	let callback = (configKey: string, item: any) => {
		let configValue = state.formData[configKey];
		if (['pickOrder_fields'].indexOf(configKey) >= 0) {
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
//#endregion
</script>

<style lang="scss" scoped>
.settings-sub-container {
	margin-bottom: 90px;
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
		&.fixed-footer {
			position: fixed;
			bottom: 0;
			left: 472px;
			right: 10px;
			background-color: white;
			border-top: 1px solid #ebeef5;
			padding: 20px;
		}
	}
	::v-deep .el-checkbox {
		margin-left: 0px !important;
	}
}
</style>
