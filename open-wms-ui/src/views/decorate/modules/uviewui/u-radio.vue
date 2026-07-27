<template>
	<div class="module-container">
		<el-form ref="form" :model="form" label-width="90px" class="widget-view">
			<el-form-item :label="config.label" :label-width="config.labelWidth ? config.labelWidth : '90px'">
				<draggable :list="config.radioOptions" item-key="value" :group="{ name: 'radioOptions' }" ghostClass="ghost" handle=".drag-item" tag="ul">
					<template #item="{ element, index }">
						<div :style="{ display: !config.inline ? 'inline-block' : '' }">
							<!--  -->
							<el-radio :label="element.value" style="margin-right: 5px">
								<el-text class="mx-1" :style="{ color: config.style?.color, 'background-color': config.style?.bgColor, 'margin-top': config.style.maginTop ? config.style.maginTop + 'px' : 0, padding: config.style?.bgMargin ? config.style.bgMargin + 'px' : 0 }">{{ element.label }}</el-text>
							</el-radio>
						</div>
					</template>
				</draggable>
			</el-form-item>
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
}
</style>
