<template>
	<div class="module-container" :style="{ 'background-color': config.style?.bgColor, padding: config.style.bgMargin || 0 }">
		<div :class="['inner', config.style.boxShadow ? 'box-shadow' : '']" :style="{ 'background-color': config.style?.innerBgColor, 'border-radius': config.style?.borderRadius ? config.style.borderRadius + 'px' : 0, padding: config.style.bgPadding || 0, 'border-width': config.style.innerBorderWidth + 'px' || 0, 'border-color': config.style.innerBorderColor || 'transparent', 'border-style': config.style.innerBorderStyle, height: config.style.height || '400px' }">
			<pc-header :config="config" :is-viewer="isViewer"></pc-header>
			<div :style="{ height: config.style.gridHeight || '100%' }" ref="chartRef"></div>
		</div>
	</div>
</template>

<script setup lang="ts" name="pc-stat">
import { reactive, toRefs, getCurrentInstance, computed } from 'vue';
import { to } from 'await-to-js';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import * as echarts from 'echarts';
import pcHeader from '../components/pc-header.vue';

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

//#region 定义属性
const props = defineProps({
	// 预览模式
	isViewer: {
		type: Boolean,
		default: false,
	},
	// 配置参数
	config: {
		type: Object,
		default: () => {
			return {};
		},
	},
});
//#endregion

//#region 定义变量
const chartRef = ref();

const state = reactive({
	chartObj: null as any,
	charts: {
		theme: '',
		bgColor: '',
		color: '#303133',
	},
	formData: {
		storageId: undefined,
		consignorId: undefined,
		dateScope: undefined,
	},
});
//#endregion

// 初始化柱状图
const initChart = () => {
	if (state.chartObj) state.chartObj.dispose();
	state.chartObj = markRaw(echarts.init(chartRef.value, state.charts.theme));
	let getname = props.config.series.map((item: any) => item.name); // 图例标题
	let series = props.config.series.map((item: any) => {
		return {
			name: item.name,
			type: 'bar',
			barWidth: item.barWidth || null,
			yAxisIndex: 0,
			itemStyle: {
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{ offset: 0, color: item.itemStyleColor1 || 'rgba(255, 69, 0, 0.68)' },
					{ offset: 1, color: item.itemStyleColor2 || 'rgba(108,80,243,0)' },
				]),
				//柱状图圆角
				borderRadius: item.borderRadius ? item.borderRadius.split(',').map((item: any) => Number(item)) : null,
			},
			data: item.data.split(','),
		};
	});

	const option = {
		backgroundColor: state.charts.bgColor,
		title: {
			// text: props.config.header.text,
			left: props.config.header.left,
			textStyle: { fontSize: props.config.header.fontSize, color: props.config.header.fontColor },
		},
		grid: props.config.grid || { top: 70, right: 20, bottom: 30, left: 30 },
		tooltip: { trigger: 'axis' },
		legend: {
			type: props.config.legend.type,
			orient: props.config.legend.orient,
			left: props.config.legend.left || null,
			right: props.config.legend.right || null,
			top: props.config.legend.top || null,
			bottom: props.config.legend.bottom || null,
			itemWidth: props.config.legend.itemWidth || 14,
			itemHeight: props.config.legend.itemHeight || 14,
			data: getname,
		},
		xAxis: {
			type: 'category',
			data: props.config.xAxis.data.split(','),
			boundaryGap: true,
			axisTick: { show: false },
		},
		yAxis: [
			{
				type: props.config.yAxis.type,
				name: props.config.yAxis.name,
				nameLocation: 'middle',
				nameTextStyle: { padding: [3, 4, 50, 6] },
				splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
				axisLine: { show: false },
				axisTick: { show: false },
				axisLabel: { color: state.charts.color, formatter: '{value} ' },
			},
		],
		series,
	};

	state.chartObj.setOption(option);
};

// 监听
watch(
	() => props.config,
	() => {
		initChart();
	},
	{ deep: true }
);

// 页面加载时
onMounted(() => {
	initChart();
	initEchartsResize();
});
// 批量设置 echarts resize
const initEchartsResizeFun = () => {
	nextTick(() => {
		setTimeout(() => {
			state.chartObj.resize();
		}, 1000);
	});
};
// 批量设置 echarts resize
const initEchartsResize = () => {
	window.addEventListener('resize', initEchartsResizeFun);
};
</script>

<style lang="scss" scoped>
@import '../scss/module.scss';
</style>
