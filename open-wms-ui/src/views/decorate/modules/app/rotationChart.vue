<template>
  <div class="module-container" :style="{'background-image': 'linear-gradient('+config.style?.moduleBgColor1+', '+config.style?.moduleBgColor2+')','border-radius':config.style?.moduleBorderRadius?config.style.moduleBorderRadius+'px':0,'margin-top':config.style.moduleMarginTop+'px','margin-bottom':config.style.moduleMarginBottom+'px','margin-left':config.style.moduleMarginLeft+'px','margin-right':config.style.moduleMarginRight+'px','padding-top':config.style.modulePaddingTop+'px','padding-bottom':config.style.modulePaddingBottom+'px','padding-left':config.style.modulePaddingLeft+'px','padding-right':config.style.modulePaddingRight+'px', border: config.style.moduleBorderStyle+' '+(config.style.moduleBorderWidth+'px')+' '+config.style.moduleBorderColor, '--indicator-olor': config.style.indicatorColor}">
    <el-carousel :height="config.style.imageHeight?config.style.imageHeight+'px':'150px'" arrow="never" :indicator-position="config.style.indicatorStyle=='none'?'none':''" :class="[config.style.indicatorStyle=='round'?'carousel-circle':'']">
      <el-carousel-item v-for="(item, index) in config.items" :key="index">
        <el-image :src="item.image" fit="fill" :style="{'border-radius':config.style?.imageBorderRadius?config.style.imageBorderRadius+'px':0}"></el-image>
      </el-carousel-item>
    </el-carousel>
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
	overflow: auto;
}
.carousel-circle {
	:deep(.el-carousel__button) {
		width: 8px;
		height: 8px;
		border-radius: 4px;
		background-color: var(--indicator-olor);
	}
}
</style>