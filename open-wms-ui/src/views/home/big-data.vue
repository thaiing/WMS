<template>
	<div class="home-container layout-pd">
		<center-panel v-model:selectModule="state.selectModule" :app-config="state.appConfig" is-viewer></center-panel>
	</div>
</template>

<script setup lang="ts" name="big-data">
import { reactive, onMounted, ref, watch, nextTick, onActivated, markRaw, ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import * as echarts from 'echarts';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import centerPanel from '/@/views/decorate/components/centerPanel.vue';
import { BaseObject, DataType, QueryType, QueryBo, PageListBo } from '/@/types/common';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';

const route = useRoute();
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const storesTagsViewRoutes = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);
const state = reactive({
	// 选中项
	selectModule: {
		type: 'global',
	},
	// app参数
	appConfig: {
		global: {
			pageId: 0,
			type: 'global',
			title: '页面设置',
			header: 'DTI WMS',
			decorateName: '默认模板',
			enable: 1,
			orderNo: 0,
			buttons: [] as any[],
			pageType: 'PC',
			isPC: true,
			isAPP: false,
		},
		modules: [],
	},
	myCharts: [] as EmptyArrayType,
	charts: {
		theme: '',
		bgColor: '',
		color: '#303133',
	},
});
// 批量设置 echarts resize
const initEchartsResizeFun = () => {
	nextTick(() => {
		for (let i = 0; i < state.myCharts.length; i++) {
			setTimeout(() => {
				state.myCharts[i].resize();
			}, i * 1000);
		}
	});
};
// 批量设置 echarts resize
const initEchartsResize = () => {
	window.addEventListener('resize', initEchartsResizeFun);
};

// 加载数据
const decorateLoad = async () => {
	const pageCode = route.params && (route.params.pageCode as string);
	if (!pageCode) {
		proxy.$message.error('请正确设置菜单页面编号');
		return;
	}

	let queryBoList: Array<QueryBo> = [
		{
			column: 'pageCode',
			values: pageCode,
			queryType: QueryType.EQ,
			dataType: DataType.STRING,
		},
	];
	let url = '/system/decorate/page/selectOne';
	const [err, res] = await to(postData(url, queryBoList));
	if (err) {
		return;
	}

	if (res.data.jsonData) {
		state.appConfig = JSON.parse(res.data.jsonData);
		if (!state.appConfig.global.buttons) {
			state.appConfig.global.buttons = [];
		}
		state.selectModule = state.appConfig.global;
		state.appConfig.global.pageId = res.data.pageId;
		state.appConfig.global.pageType = res.data.pageType;
		state.appConfig.global.isPC = res.data.pageType === 'PC';
		state.appConfig.global.isAPP = res.data.pageType === 'APP';
	}
};

// 页面加载时
onMounted(() => {
	// initEchartsResize();
	decorateLoad();
});
// 由于页面缓存原因，keep-alive
onActivated(() => {
	initEchartsResizeFun();
});
// 监听 pinia 中的 tagsview 开启全屏变化，重新 resize 图表，防止不出现/大小不变等
watch(
	() => isTagsViewCurrenFull.value,
	() => {
		initEchartsResizeFun();
	}
);
// 监听 pinia 中是否开启深色主题
watch(
	() => themeConfig.value.isIsDark,
	(isIsDark) => {
		nextTick(() => {});
	},
	{
		deep: true,
		immediate: true,
	}
);
</script>

<style scoped lang="scss">
$homeNavLengh: 8;
.home-container {
	overflow: hidden;
	.home-card-one,
	.home-card-two,
	.home-card-three {
		.home-card-item {
			width: 100%;
			height: 130px;
			border-radius: 4px;
			transition: all ease 0.3s;
			padding: 20px;
			overflow: hidden;
			background: var(--el-color-white);
			color: var(--el-text-color-primary);
			border: 1px solid var(--next-border-color-light);
			&:hover {
				box-shadow: 0 2px 12px var(--next-color-dark-hover);
				transition: all ease 0.3s;
			}
			&-icon {
				width: 70px;
				height: 70px;
				border-radius: 100%;
				flex-shrink: 1;
				i {
					color: var(--el-text-color-placeholder);
				}
			}
			&-title {
				font-size: 15px;
				font-weight: bold;
				height: 30px;
			}
		}
	}
	.home-card-one {
		@for $i from 0 through 3 {
			.home-one-animation#{$i} {
				opacity: 0;
				animation-name: error-num;
				animation-duration: 0.5s;
				animation-fill-mode: forwards;
				animation-delay: calc($i/4) + s;
			}
		}
	}
	.home-card-two,
	.home-card-three {
		.home-card-item {
			height: 400px;
			width: 100%;
			overflow: hidden;
			.home-monitor {
				height: 100%;
				.flex-warp-item {
					width: 25%;
					height: 111px;
					display: flex;
					.flex-warp-item-box {
						margin: auto;
						text-align: center;
						color: var(--el-text-color-primary);
						display: flex;
						border-radius: 5px;
						background: var(--next-bg-color);
						cursor: pointer;
						transition: all 0.3s ease;
						&:hover {
							background: var(--el-color-primary-light-9);
							transition: all 0.3s ease;
						}
					}
					@for $i from 0 through $homeNavLengh {
						.home-animation#{$i} {
							opacity: 0;
							animation-name: error-num;
							animation-duration: 0.5s;
							animation-fill-mode: forwards;
							animation-delay: calc($i/10) + s;
						}
					}
				}
			}
		}
	}
}
</style>
