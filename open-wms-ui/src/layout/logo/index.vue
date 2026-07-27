<template>
	<div :class="['layout-logo', themeConfig.layout === 'tile' ? 'tile' : '']" v-if="setShowLogo" @click="onThemeConfigChange">
		<img id="leftSideLogoRef" :src="logoMini" :class="themeConfig.layout === 'tile' ? 'layout-logo-tile-img' : 'layout-logo-medium-img'" alt="DTI" />
		<!-- <span>{{ themeConfig.layout === 'tile' ? userStore.tenantInfo.sysShortName : userStore.tenantInfo.sysFullName }}</span> -->
	</div>
	<div class="layout-logo-size" v-else @click="onThemeConfigChange">
		<img :src="logoMini" class="layout-logo-size-img" />
	</div>
</template>

<script setup lang="ts" name="layoutLogo">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';

// 定义变量内容
const logoMini = '/dti-logo-white.png';
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

// 设置 logo 的显示。classic 经典布局默认显示 logo
const setShowLogo = computed(() => {
	let { isCollapse, layout } = themeConfig.value;
	return !isCollapse || layout === 'classic' || document.body.clientWidth < 1000;
});
// logo 点击实现菜单展开/收起
const onThemeConfigChange = () => {
	if (themeConfig.value.layout === 'transverse') return false;
	themeConfig.value.isCollapse = !themeConfig.value.isCollapse;
};
</script>

<style scoped lang="scss">
.layout-logo {
	width: 220px;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: rgb(0 21 41 / 2%) 0px 1px 4px;
	color: var(--el-color-primary);
	font-size: 16px;
	cursor: pointer;
	&.tile {
		width: 114px;
	}
	animation: logoAnimation 0.3s ease-in-out;
	span {
		white-space: nowrap;
		display: inline-block;
	}
	&:hover {
		span {
			color: var(--color-primary-light-2);
		}
	}
	&-medium-img {
		width: calc(100% - 20px);
		height: 44px;
		object-fit: contain;
		padding: 2px 10px;
	}
	&-tile-img {
		width: calc(100% - 8px);
		height: 44px;
		object-fit: contain;
	}
}
.layout-logo-size {
	width: 100%;
	height: 50px;
	display: flex;
	cursor: pointer;
	animation: logoAnimation 0.3s ease-in-out;
	&-img {
		width: calc(100% - 8px);
		height: 44px;
		object-fit: contain;
		margin: auto;
	}
	&:hover {
		img {
			animation: logoAnimation 0.3s ease-in-out;
		}
	}
}
</style>
