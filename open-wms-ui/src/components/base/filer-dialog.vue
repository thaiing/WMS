<template>
	<div class="filer-dialog-container">
		<el-dialog v-model="currentDialogVisible" top="5vh" :width="1200" title="文件选择器" class="filer-dialog">
			<filer :single-select="singleSelect" :is-viewer="isViewer"></filer>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, getCurrentInstance, onMounted, computed } from 'vue';
import filer from '/@/components/base/filer.vue';

export default {
	name: 'base-upload-dialog',
	components: {
		filer,
	},
	props: {
		modelValue: {
			type: Boolean,
			default: false,
		},
		// 文件路径
		path: {
			type: String,
			default: 'bbc/app/',
		},
		// 参数配置
		options: {
			type: Object,
			default: () => {
				return {
					multiple: true,
					disabled: false,
					listType: 'text', // text/picture/picture-card
					buttonType: 'text',
				};
			},
		},
		// 单选
		singleSelect: {
			type: Boolean,
			default: false,
		},
		// 预览模式
		isViewer: {
			type: Boolean,
			default: false,
		},
	},
	setup() {
		const { proxy } = getCurrentInstance() as any;

		//#region 变量
		const state: any = reactive({});
		//#endregion

		let currentDialogVisible = computed({
			get: () => {
				return proxy.modelValue;
			},
			set: (val) => {
				proxy.$emit('update:modelValue', val);
			},
		});

		//#region
		let method = () => {};
		//#endregion

		onMounted(() => {});

		return {
			...toRefs(state),
			currentDialogVisible,
			...method,
		};
	},
};
</script>

<style lang="scss" scoped>
.filer-dialog-container {
	:deep(.el-dialog__body) {
		background-color: #f8f8f8;
	}
}
</style>
