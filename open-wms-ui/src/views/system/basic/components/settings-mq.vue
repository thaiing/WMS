<template>
	<div :ref="'settings'" class="settings-sub-container">
		<el-form ref="form" v-model="state.formData" label-width="250px">
			<h2 class="sub-title">{{ $tt('入库上架完成后') }}</h2>
			<el-form-item :label="$tt('上架单转到渠道分货进行渠道占位')">
				<el-switch v-model="state.formData.mq_channelPlaceHolder" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('上架后自动分拣出库单')">
				<el-switch v-model="state.formData.mq_shelveSortingSaleOrder" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<h2 class="sub-title">{{ $tt('打包出库完成后') }}</h2>
			<el-form-item :label="$tt('更新ERP计划单明细出库数量')">
				<el-switch v-model="state.formData.mq_updateErpOutQty" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('自动生成打包单账单结算')">
				<el-switch v-model="state.formData.mq_autoCreatePayableBill" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('自动生成打包单生成货主过户')">
				<el-switch v-model="state.formData.mq_autoCreateConsignorTransfer" :active-value="1" :inactive-value="0"></el-switch>
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
import settingsHook from '../hook/settingsHook';

//#region 定义变量
const state = reactive({
	formData: {
		mq_updateErpOutQty: 0,
		mq_autoCreatePayableBill: 0,
		mq_autoCreateConsignorTransfer: 0,
		mq_shelveSortingSaleOrder: 0,
		mq_channelPlaceHolder: 0,
	} as any,
	valueList: [] as any[],
	expressCorpList: [] as any[],
	storageNames: [] as any[],
});
//#endregion

let base = settingsHook({ state });
onMounted(() => {
	base.loadParam();
});
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
