<template>
	<div class="module-container" :style="{ 'background-color': config.style?.bgColor, padding: config.style.bgMargin || 0 }">
		<div :class="['inner', config.style.boxShadow ? 'box-shadow' : '']" :style="{ 'background-color': config.style?.innerBgColor, 'border-radius': config.style?.borderRadius ? config.style.borderRadius + 'px' : 0, padding: config.style.bgPadding || 0, 'border-width': config.style.innerBorderWidth + 'px' || 0, 'border-color': config.style.innerBorderColor || 'transparent', 'border-style': config.style.innerBorderStyle, height: config.style.height || '400px' }">
			<pc-header :config="config" :is-viewer="isViewer" @on-search="onSearch"></pc-header>
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
import { translateViText } from '/@/i18n/business.vi';
import { useThemeConfig } from '/@/stores/themeConfig';
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
import pcHeader from '../components/pc-header.vue';
import { postData } from '/@/api/common/baseApi';

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
	legendData: null as any,
	seriesData: null as any,
});
//#endregion

// echart饼图
const initChart = () => {
	if (state.chartObj) state.chartObj.dispose();
	state.chartObj = markRaw(echarts.init(chartRef.value, state.charts.theme));
	let getname = '';
	let getvalue = '';
	if (state.legendData && state.seriesData) {
		getname = state.legendData.split(',').map((item: string) => translateViText(item)); // 后端返回图例标题
		getvalue = state.seriesData.split(','); // 后端返回图例数据
	} else {
		getname = props.config.legend.data.split(',').map((item: string) => translateViText(item)); // 默认图例标题
		getvalue = props.config.series.data.split(','); // 默认图例数据
	}
	let data = [];
	for (let i = 0; i < getname.length; i++) {
		data.push({ name: getname[i], value: getvalue[i] });
	}
	const colorList = ['#51A3FC', '#36C78B', '#FEC279', '#968AF5', '#E790E8'];
	const centerList = (props.config.series.center || '39%,50%').split(',');
	const option = {
		backgroundColor: state.charts.bgColor,
		title: {
			// text: props.config.header.text,
			left: props.config.header.left,
			textStyle: { fontSize: props.config.header.fontSize, color: props.config.header.fontColor },
		},
		// title: {
		// 	text: props.config.header.text,
		// 	left: props.config.header.left,
		// 	textStyle: { fontSize: props.config.header.fontSize, color: props.config.header.fontColor },
		// },
		tooltip: { trigger: 'item', formatter: '{b} <br/> {c}%' },
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
		series: [
			{
				type: 'pie',
				radius: [props.config.series.radius0, props.config.series.radius1],
				center: centerList,
				padAngle: props.config.series.padAngle || 0,
				itemStyle: {
					borderRadius: props.config.series.borderRadius || null,
					color: function (params: any) {
						return colorList[params.dataIndex];
					},
				},
				label: { show: props.config.series.showLabel },
				labelLine: { show: props.config.series.showLabel },
				data: data,
			},
		],
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
	onSearch();
});
const onSearch = async () => {
	// 这里写后端接口请求
	if (props.config.api && props.config.api.openApi) {
		const apiUrl = props.config.api.apiUrl;
		const url = apiUrl;
		// const url = '/composite/bigScreen/home/inventoryProductType';
		const params = {
			storageId: props.config.search.storageId,
		};
		const [err, res] = await to(postData(url, params));
		if (res && res.data) {
			state.legendData = res.data.typeName;
			state.seriesData = res.data.ratio;
		}
		initChart();
	}
};
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
