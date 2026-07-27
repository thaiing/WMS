<!--轮播图 - 参数设置-->
<template>
	<el-form-item label="外背景颜色">
		<el-color-picker v-model="config.style.bgColor" :predefine="predefineColors" show-alpha />
	</el-form-item>
	<el-form-item label="内背景颜色">
		<el-color-picker v-model="config.style.innerBgColor" :predefine="predefineColors" show-alpha />
	</el-form-item>
	<el-form-item label="内边框粗细">
		<el-row :gutter="5">
			<el-col :span="16" class="padding-left-5">
				<el-slider v-model.number="config.style.innerBorderWidth"></el-slider>
			</el-col>
			<el-col :span="8">
				<el-input-number controls-position="right" v-model.number="config.style.innerBorderWidth" :min="0" class="w-100pc" />
			</el-col>
		</el-row>
	</el-form-item>
	<el-form-item label="内边框颜色">
		<el-color-picker v-model="config.style.innerBorderColor" :predefine="predefineColors" show-alpha />
	</el-form-item>
	<el-form-item label="内边框样式">
		<el-select v-model="config.style.innerBorderStyle" placeholder="选择边框样式" style="width: 100%">
			<el-option label="无边框" value="none" />
			<el-option label="实线边框" value="solid" />
			<el-option label="点状边框" value="dotted" />
			<el-option label="虚线边框" value="dashed" />
			<el-option label="双实线边框" value="double" />
			<el-option label="隐藏边框" value="hidden" />
		</el-select>
	</el-form-item>
	<el-form-item label="内边圆角半径">
		<el-row :gutter="5">
			<el-col :span="16" class="padding-left-5">
				<el-slider v-model.number="config.style.borderRadius"></el-slider>
			</el-col>
			<el-col :span="8">
				<el-input-number controls-position="right" v-model.number="config.style.borderRadius" :min="0" class="w-100pc" />
			</el-col>
		</el-row>
	</el-form-item>
	<el-form-item label="显示悬停阴影">
		<el-checkbox v-model="config.style.boxShadow" />
	</el-form-item>
	<el-form-item label="背景外边距">
		<el-input v-model="config.style.bgMargin" />
	</el-form-item>
	<el-form-item label="背景内边距">
		<el-input v-model="config.style.bgPadding" />
	</el-form-item>
	<el-form-item label="模块高度">
		<el-input v-model="config.style.height" />
	</el-form-item>
</template>

<script setup lang="ts" name="pc-stat-config">
import { reactive, toRefs, onMounted, onUnmounted, nextTick, getCurrentInstance } from 'vue';
import { predefineColors } from '/@/utils/commonFunction';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
// 引入图标组件
const IconSelector = defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

//#region 定义属性
const props = defineProps({
	// 配置参数
	config: {
		type: Object,
		default: () => {
			return {};
		},
	},
	// 预览模式
	isViewer: {
		type: Boolean,
		default: false,
	},
});
//#endregion

const state = reactive({
	formData: {}, // 参数设置
});

// 页面加载事件
onMounted(async () => {});

// 页面卸载事件
onUnmounted(() => {});
</script>

<style lang="scss" scoped>
@import '../scss/config.scss';
</style>
