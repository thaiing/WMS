<template>
	<div class="module-container" :style="{ 'background-color': config.style?.bgColor, 'margin-top': config.style.maginTop ? config.style.maginTop + 'px' : 0, padding: config.style?.bgMargin ? config.style.bgMargin + 'px' : 0, 'font-size': config.style?.fontSize + 'px', color: config.style?.color }">
		<div v-for="content of config.content.split('\n')">
			{{ content }}
		</div>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance, computed } from 'vue';

export default {
	name: 'app-design-left-panel',
	components: {},
	props: {
		// 配置参数
		config: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	setup() {
		const { proxy } = getCurrentInstance() as any;
		const state = reactive({
			form: {
				value: null,
			},
		});

		//#region
		let method = {};

		//#endregion

		return {
			...toRefs(state),
			...method,
		};
	},
};
</script>

<style lang="scss" scoped>
.module-container {
	.widget-view {
		position: relative;
	}
	.widget-view::after {
		position: absolute;
		content: ' ';
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		display: block;
		z-index: 1001;
	}
}
</style>
