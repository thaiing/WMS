<template>
	<i v-if="isShowIconSvg" class="el-icon" :class="className" :style="setIconSvgStyle">
		<component :is="getIconName" />
	</i>
	<div v-else-if="isShowIconImg" :style="setIconImgOutStyle">
		<img :src="getIconName" :style="setIconSvgInsStyle" />
	</div>
	<svg v-else-if="isSvg" :class="svgClass" :style="setIconSvgStyle" aria-hidden="true">
		<use :xlink:href="iconName" :fill="color" />
	</svg>
	<i v-else :class="getIconName" :style="setIconSvgStyle" />
</template>

<script setup lang="ts" name="svgIcon">
import { computed } from 'vue';

// 定义父组件传过来的值
const props = defineProps({
	// svg 图标组件名字
	name: {
		type: String,
	},
	// svg 大小
	size: {
		type: Number,
		default: () => 14,
	},
	// svg 颜色
	color: {
		type: String,
	},
	// svg class
	className: {
		type: String,
	},
});

// 在线链接、本地引入地址前缀
// https://gitee.com/lyt-top/vue-next-admin/issues/I62OVL
const linesString = ['https', 'http', '/src', '/assets', 'data:image', import.meta.env.VITE_PUBLIC_PATH];

// 获取 icon 图标名称
const getIconName = computed(() => {
	if (props?.name && props?.name.indexOf('fa-') === 0) {
		return 'fa ' + props?.name;
	} else {
		return props?.name;
	}
});
// 用于判断 element plus 自带 svg 图标的显示、隐藏
const isShowIconSvg = computed(() => {
	return props?.name?.startsWith('ele-');
});
// 用于判断在线链接、本地引入等图标显示、隐藏
const isShowIconImg = computed(() => {
	return linesString.find((str) => props.name?.startsWith(str));
});
// 用于SVG图标
const isSvg = computed(() => {
	return props?.name?.startsWith('s-');
});
// 设置图标样式
const setIconSvgStyle = computed(() => {
	return `font-size: ${props.size}px;color: ${props.color};`;
});
// 设置图片样式
const setIconImgOutStyle = computed(() => {
	return `width: ${props.size}px;height: ${props.size}px;display: inline-block;overflow: hidden;`;
});
// 设置图片样式
// https://gitee.com/lyt-top/vue-next-admin/issues/I59ND0
const setIconSvgInsStyle = computed(() => {
	const filterStyle: string[] = [];
	const compatibles: string[] = ['-webkit', '-ms', '-o', '-moz'];
	compatibles.forEach((j) => filterStyle.push(`${j}-filter: drop-shadow(${props.color} 30px 0);`));
	return `width: ${props.size}px;height: ${props.size}px;position: relative;left: -${props.size}px;${filterStyle.join('')}`;
});

const iconName = computed(() => `#icon-${props.name}`);
const svgClass = computed(() => {
	if (props.className) {
		return `svg-icon ${props.className}`;
	}
	return 'svg-icon';
});
</script>

<style scope lang="scss">
.svg-icon {
	width: 1em;
	height: 1em;
	position: relative;
	fill: currentColor;
	vertical-align: -2px;
}
</style>
