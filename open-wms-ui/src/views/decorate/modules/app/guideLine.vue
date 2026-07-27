<template>
  <div class="module-container" :style="{'--el-border-color-base':config.style?.lineColor,'background-color':config.style?.bgColor,'margin-top':config.style.maginTop?config.style.maginTop+'px':0,'padding-left':config.style?.bgMargin?config.style.bgMargin+'px':0,'padding-right':config.style?.bgMargin?config.style.bgMargin+'px':0,height:config.style.height===undefined?0:config.style.height+'px'}">
    <el-divider :border-style="config.style.borderStyle" class="guide-divider">{{config.desc}}</el-divider>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance, computed } from "vue";

export default {
	name: "app-design-left-panel",
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
		const state = reactive({});

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
	display: flex;
	align-items: center;
	.inner {
		display: flex;
		justify-content: flex-start;
		padding: 5px 0;
		align-items: center;
	}
	.guide-divider {
		margin: 0;
	}
}
</style>