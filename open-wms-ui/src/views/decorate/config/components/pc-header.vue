<!--轮播图 - 参数设置-->
<template>
	<div class="block-group">
		<el-divider content-position="left">标题参数</el-divider>
		<el-form-item label="标题名称">
			<el-input v-model="config.header.text"></el-input>
		</el-form-item>
		<el-form-item label="标题位置">
			<el-select v-model="config.header.textAlign" clearable filterable allow-create default-first-option :reserve-keyword="false" placeholder="请选择left/right/center或者输入像素单位" style="width: 100%">
				<el-option label="left" value="left" />
				<el-option label="center" value="center" />
				<el-option label="right" value="right" />
			</el-select>
		</el-form-item>
		<el-row :gutter="5">
			<el-col :span="12">
				<el-form-item label="字体大小">
					<el-input v-model="config.header.fontSize"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12" class="padding-left-5">
				<el-form-item label="底边框">
					<el-input v-model="config.header.borderBottom"></el-input>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row :gutter="5">
			<el-col :span="12" class="padding-left-5">
				<el-form-item label="内边距">
					<el-input v-model="config.header.padding"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="外边距">
					<el-input v-model="config.header.margin"></el-input>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row :gutter="5">
			<el-col :span="12">
				<el-form-item label="字体颜色">
					<el-color-picker v-model="config.header.fontColor" :predefine="predefineColors" show-alpha />
				</el-form-item>
			</el-col>
			<el-col :span="12" class="padding-left-5">
				<el-form-item label="背景颜色">
					<el-color-picker v-model="config.header.bgColor" :predefine="predefineColors" show-alpha />
				</el-form-item>
			</el-col>
		</el-row>
	</div>

	<div class="block-group">
		<el-divider content-position="left">查询条件参数</el-divider>
		<el-row :gutter="5">
			<el-col :span="8" class="padding-left-5">
				<el-form-item label="显示查询条件">
					<el-checkbox v-model="config.search.showAll"></el-checkbox>
				</el-form-item>
			</el-col>
			<el-col :span="8">
				<el-form-item label="显示仓库">
					<el-checkbox v-model="config.search.showStorage"></el-checkbox>
				</el-form-item>
			</el-col>
			<el-col :span="8">
				<el-form-item label="显示货主">
					<el-checkbox v-model="config.search.showConsignor"></el-checkbox>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row :gutter="5">
			<el-col :span="8">
				<el-form-item label="显示日期">
					<el-checkbox v-model="config.search.showDateScope"></el-checkbox>
				</el-form-item>
			</el-col>
		</el-row>
	</div>
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
