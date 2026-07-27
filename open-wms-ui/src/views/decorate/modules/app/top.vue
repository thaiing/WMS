<template>
	<div class="overflowy" :style="{ '--page-width': appConfig.global.isPC ? '1100px' : '379px' }">
		<div v-if="appConfig.global.isAPP" class="picture">
			<img
				src="data:image/png;base64,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"
			/>
		</div>
		<div :class="['page-title', currentSelectModule === appConfig.global ? 'select-item' : '']" @click="selectTitle">
			{{ appConfig.global.decorateName }}
		</div>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance, computed } from 'vue';

export default {
	name: 'app-design-left-panel',
	components: {},
	props: {
		// app配置参数
		appConfig: {
			type: Object,
			default: () => {
				return {};
			},
		},
		// 选中项
		selectModule: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	setup() {
		const { proxy } = getCurrentInstance() as any;
		const state = reactive({});

		// 当前选中模块双向绑定
		const currentSelectModule = computed({
			get() {
				return proxy.selectModule;
			},
			set(value) {
				proxy.$emit('update:selectModule', value);
			},
		});

		//#region
		let method = {
			// 选中标题
			selectTitle() {
				proxy.currentSelectModule = proxy.appConfig.global;
			},
		};
		//#endregion

		return {
			...toRefs(state),
			currentSelectModule,
			...method,
		};
	},
};
</script>

<style lang="scss" scoped>
.overflowy {
	overflow-x: hidden;
	overflow-y: hidden;
	&::-webkit-scrollbar {
		width: 4px;
		background: transparent;
	}
	&::-webkit-scrollbar-track-piece {
		width: 4px;
		background-color: var(--color-info-light-8);
	}
	.picture {
		width: var(--page-width);
		height: 20px;
		margin: 0px auto;
		background-color: rgb(255, 255, 255);
	}
	.page-title {
		position: relative;
		height: 35px;
		line-height: 35px;
		background: rgb(255, 255, 255);
		font-size: 15px;
		color: rgb(51, 51, 51);
		text-align: center;
		width: var(--page-width);
		margin: 0px auto;
		border: 1px dashed var(--color-whites);
		cursor: pointer;
		&.select-item {
			border: 1px solid var(--color-primary);
		}
	}
}
</style>
