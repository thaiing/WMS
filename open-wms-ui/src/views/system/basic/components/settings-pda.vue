<template>
	<div :ref="'settings'" class="settings-sub-container">
		<el-form ref="form" v-model="state.formData" label-width="240px">
			<h2 class="sub-title">{{ $tt('局域网打印机设置') }}</h2>
			<el-form-item :label="$tt('打印服务器IP地址')">
				<el-input v-model="state.formData.pda_printip" class="w-300"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('打印服务器端口号')"> <el-input v-model="state.formData.pda_printPort" class="w-300"></el-input> {{ $tt('采用默认端口8000即可') }} </el-form-item>

			<!-- <h2 class="sub-title">PDA扫描设置</h2>
      <el-form-item label="扫描数量累加">
        <el-switch v-model="state.formData.pda_scannQtyAdd" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="关闭点击明细选中条码">
        <el-switch v-model="state.formData.pda_closeSelectProductModel" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="选中条码时带入扫描数量">
        <el-switch v-model="state.formData.pda_selectProductModelQuantityBrought" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="收货上架时可以看到所有上架单">
        <el-switch v-model="state.formData.pda_shelveListAll" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item> -->

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

//#region 定义变量
const state = reactive({
	formData: {
		pda_printip: null,
		pda_printPort: '8000',
	} as any,
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
