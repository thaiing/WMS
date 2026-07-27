<template>
	<div :ref="'settings'" class="settings-sub-container">
		<el-form ref="form" v-model="state.formData" label-width="350px">
			<h2 class="sub-title">{{ $tt('系统全局设置') }}</h2>
			<el-form-item :label="$tt('波次订单数')" class="padding-top-10">
				<el-input v-model.number="state.formData.batch_count" :max="100" class="w-100"></el-input>
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
import settingsHook from '../hook/settingsHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

//#region 定义变量
const state = reactive({
	// 编辑数据对象
	formData: {
		batch_count: 5, // 波次订单数
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
