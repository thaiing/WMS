<template>
	<div :ref="'settings'" class="settings-sub-container">
		<el-form ref="form" v-model="state.formData" label-width="150px">
			<h2 class="sub-title">{{ $tt('出库订货单') }}</h2>
			<el-form-item :label="$tt('审核后生成单据方式')">
				<el-radio v-model="state.formData.retail_createBill" label="出库计划单">{{ $tt('生成出库计划单') }}</el-radio>
				<el-radio v-model="state.formData.retail_createBill" label="出库订单">{{ $tt('生成出库订单') }}</el-radio>
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
	// 编辑数据对象
	formData: {
		retail_createBill: '',
	},
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
		margin-bottom: 20px;
	}
	.form-footer {
		margin-top: 30px;
	}
}
</style>
