<template>
	<div class="module-container" :style="{ 'background-color': config.style?.bgColor, 'margin-top': config.style.maginTop ? config.style.maginTop + 'px' : 0, padding: config.style?.bgMargin ? config.style.bgMargin + 'px' : 0 }">
		<el-form ref="form" :model="form" label-width="90px" class="widget-view">
			<el-form-item :label="config.label" :label-width="config.labelWidth ? config.labelWidth : '90px'" class="u-text-content"> { {{ config.prop }} } </el-form-item>
		</el-form>
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
	.u-text-content {
		overflow: hidden;
		::v-deep .el-form-item__content {
			white-space: nowrap;
		}
	}
}
</style>
