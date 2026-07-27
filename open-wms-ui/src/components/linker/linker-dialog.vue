<template>
	<div class="linker-dialog-container">
		<el-dialog v-model="currentDialogVisible" draggable top="5vh" :width="1200" title="链接选择器" class="filer-dialog">
			<linker :single-select="singleSelect" :is-viewer="isViewer"></linker>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, getCurrentInstance, onMounted, computed } from 'vue';
import linker from './linker.vue';

export default {
	name: 'base-upload-dialog',
	components: {
		linker,
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
.linker-dialog-container {
	:deep(.el-dialog__body) {
		background-color: #f8f8f8;
	}
}
</style>
