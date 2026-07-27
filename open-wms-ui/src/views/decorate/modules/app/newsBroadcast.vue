<template>
  <div class="module-container" :style="{'margin-top':config.style.maginTop?config.style.maginTop+'px':0}">
    <div class="img">
      <el-image class="img" :src="config.image" fit="contain">
      </el-image>
    </div>
    <div class="carousel-box">
      <el-carousel height="30px" direction="horizontal" :autoplay="true" indicator-position="none" arrow="never" :interval="3000">
        <el-carousel-item v-for="(item, index) in config.items" :key="index">{{ item.name }} </el-carousel-item>
      </el-carousel>
    </div>
    <div class="arrow-right">
      <i class="el-icon-yrt-youjiantou5"></i>
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
	display: flex;
	justify-content: flex-start;
	padding: 5px 0 0;
	.img {
		width: 100px;
		height: 24px;
	}
	.carousel-box {
		width: calc(100% - 110px);
		padding-top: 0px;
		padding-left: 5px;
	}
	.arrow-right {
		width: 20px;
		padding-top: 5px;
	}
}
.items {
	display: flex;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	padding: 10px 0;

	.item {
		width: calc(25% - 5px);
		text-align: center;
		margin-bottom: 10px;
		+ .item {
			margin-left: 5px;
		}
		.img {
			width: 60px;
			height: 60px;
		}
		.name {
			color: var(--el-text-color-regular);
		}
	}
	.item-empty {
		width: calc(25% - 5px);
		margin-bottom: 10px;
		margin-left: 5px;
		height: 0;
	}
}
</style>