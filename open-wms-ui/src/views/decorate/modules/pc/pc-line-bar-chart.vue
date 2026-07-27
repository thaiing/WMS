<template>
	<div class="module-container" :style="{ 'background-color': config.style?.bgColor, padding: config.style.bgMargin || 0 }">
		<div :class="['inner', config.style.boxShadow ? 'box-shadow' : '']" :style="{ 'background-color': config.style?.innerBgColor, 'border-radius': config.style?.borderRadius ? config.style.borderRadius + 'px' : 0, padding: config.style.bgPadding || 0, 'border-width': config.style.innerBorderWidth + 'px' || 0, 'border-color': config.style.innerBorderColor || 'transparent', 'border-style': config.style.innerBorderStyle }">
			<pc-header :config="config" :is-viewer="isViewer"></pc-header>
			<div class="home-card-item">
				<div style="height: 100%" ref="chartRef"></div>
			</div>
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
});
//#endregion

// 折线柱状图
const initChart = () => {
	if (state.chartObj) state.chartObj.dispose();
	state.chartObj = markRaw(echarts.init(chartRef.value, state.charts.theme));
	const option = {
		backgroundColor: state.charts.bgColor,
		title: {
			text: 'Biểu đồ kết hợp',
			x: 'left',
			textStyle: { fontSize: '15', color: state.charts.color },
		},
		tooltip: { trigger: 'axis' },
		legend: { data: ['Nhiệt độ cấp', 'Nhiệt độ hồi', 'Áp suất (MPa)'], right: 0 },
		grid: { top: 70, right: 80, bottom: 30, left: 80 },
		xAxis: [
			{
				type: 'category',
				data: ['1km', '2km', '3km', '4km', '5km', '6km'],
				boundaryGap: true,
				axisTick: { show: false },
			},
		],
		yAxis: [
			{
				name: 'Nhiệt độ cấp/hồi (°C)',
				nameLocation: 'middle',
				nameTextStyle: { padding: [3, 4, 50, 6] },
				splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
				axisLine: { show: false },
				axisTick: { show: false },
				axisLabel: { color: state.charts.color, formatter: '{value} ' },
			},
			{
				name: 'Áp suất (MPa)',
				nameLocation: 'middle',
				nameTextStyle: { padding: [50, 4, 5, 6] },
				splitLine: { show: false },
				axisLine: { show: false },
				axisTick: { show: false },
				axisLabel: { color: state.charts.color, formatter: '{value} ' },
			},
		],
		series: [
			{
				name: 'Nhiệt độ cấp',
				type: 'line',
				smooth: true,
				showSymbol: true,
				// 矢量画五角星
				symbol: 'path://M150 0 L80 175 L250 75 L50 75 L220 175 Z',
				symbolSize: 12,
				yAxisIndex: 0,
				areaStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: 'rgba(250,180,101,0.3)' },
						{ offset: 1, color: 'rgba(250,180,101,0)' },
					]),
					shadowColor: 'rgba(250,180,101,0.2)',
					shadowBlur: 20,
				},
				itemStyle: { color: '#FF8000' },
				// data中可以使用对象，value代表相应的值，另外可加入自定义的属性
				data: [
					{ value: 1, stationName: 's1' },
					{ value: 3, stationName: 's2' },
					{ value: 4, stationName: 's3' },
					{ value: 9, stationName: 's4' },
					{ value: 3, stationName: 's5' },
					{ value: 2, stationName: 's6' },
				],
			},
			{
				name: 'Nhiệt độ hồi',
				type: 'line',
				smooth: true,
				showSymbol: true,
				symbol: 'emptyCircle',
				symbolSize: 12,
				yAxisIndex: 0,
				areaStyle: {
					color: new echarts.graphic.LinearGradient(
						0,
						0,
						0,
						1,
						[
							{ offset: 0, color: 'rgba(199, 237, 250,0.5)' },
							{ offset: 1, color: 'rgba(199, 237, 250,0.2)' },
						],
						false
					),
				},
				itemStyle: {
					color: '#3bbc86',
				},
				data: [
					{ value: 31, stationName: 's1' },
					{ value: 36, stationName: 's2' },
					{ value: 54, stationName: 's3' },
					{ value: 24, stationName: 's4' },
					{ value: 73, stationName: 's5' },
					{ value: 22, stationName: 's6' },
				],
			},
			{
				name: 'Áp suất (MPa)',
				type: 'bar',
				barWidth: 30,
				yAxisIndex: 1,
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: 'rgba(108,80,243,0.3)' },
						{ offset: 1, color: 'rgba(108,80,243,0)' },
					]),
					//柱状图圆角
					borderRadius: [30, 30, 0, 0],
				},
				data: [
					{ value: 11, stationName: 's1' },
					{ value: 34, stationName: 's2' },
					{ value: 54, stationName: 's3' },
					{ value: 39, stationName: 's4' },
					{ value: 63, stationName: 's5' },
					{ value: 24, stationName: 's6' },
				],
			},
		],
	};

	state.chartObj.setOption(option);
};

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
