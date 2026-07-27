<template>
	<div class="module-container" :style="{ 'background-color': config.style?.bgColor, 'margin-top': config.style.maginTop ? config.style.maginTop + 'px' : 0, padding: config.style?.bgMargin ? config.style.bgMargin + 'px' : 0 }">
		<div class="inner" :style="{ 'background-color': config.style?.innerBgColor, 'border-radius': config.style?.borderRadius ? config.style.borderRadius + 'px' : 0, padding: config.style?.bgPadding ? config.style.bgPadding + 'px' : 0 }">
			<div v-if="config.content.image" class="img">
				<el-image class="img" :src="config.content.image" fit="contain"> </el-image>
			</div>
			<div class="title-box" :style="{ color: config.style.color, 'font-size': config.style.fontSize ? config.style.fontSize + 'px' : undefined, fontSize: 'calc(100% - ' + (config.content.image ? '80px' : '0px') + ' - ' + (config.content.showMore ? '20px' : 0) + ')', 'text-align': config.style.align }">
				{{ config.content.title }}
			</div>
			<div v-if="config.content.showMore" class="arrow-right" :style="{ 'margin-left': config.style.align === 'left' ? 'auto' : 0 }">
				<i class="el-icon-yrt-youjiantou5"></i>
			</div>
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
	.img {
		width: 80px;
		height: 24px;
	}
	.title-box {
		text-align: left;
		padding-right: 5px;
	}
	.arrow-right {
		width: 20px;
		padding-top: 0px;
		padding-left: 5px;
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
