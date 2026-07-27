<template>
  <div class="module-container guide-blank" :style="{'background-color':config.style?.bgColor,'margin-top':config.style.maginTop?config.style.maginTop+'px':0,padding:config.style?.bgMargin?config.style.bgMargin+'px':0}">
    <div class="inner" :style="{'background-color':config.style?.innerBgColor,'border-radius':config.style?.borderRadius?config.style.borderRadius+'px':0,padding:config.style?.bgPadding?config.style.bgPadding+'px':0,height:config.style.height+'px'}">
    </div>
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
	.inner {
		display: flex;
		justify-content: flex-start;
		padding: 5px 0;
		align-items: center;
	}
}
</style>
