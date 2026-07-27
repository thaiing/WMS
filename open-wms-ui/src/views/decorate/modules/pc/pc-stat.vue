<template>
	<div :class="['module-container', { 'is-viewer': isViewer }]" :style="{ 'background-color': config.style?.bgColor, padding: config.style.bgMargin || 0 }">
		<div :class="['inner']" :style="{ 'background-color': config.style?.innerBgColor, 'border-radius': config.style?.borderRadius ? config.style.borderRadius + 'px' : 0, padding: config.style.bgPadding || 0, 'border-width': config.style.innerBorderWidth + 'px' || 0, 'border-color': config.style.innerBorderColor || 'transparent', 'border-style': config.style.innerBorderStyle, height: config.style.height || 'auto' }">
			<pc-header :config="config" :is-viewer="isViewer" @on-search="onSearch"></pc-header>

			<el-row :justify="config.options.justify" :align="config.options.align" :gutter="config.options.gutter ? config.options.gutter : 0" :style="{ 'background-color': config.style.bgColor || 'transport' }" class="widget-grid" type="flex">
				<el-col v-for="(col, colIndex) in config.columns" :key="colIndex" :span="col.span ? col.span : 0">
					<div :class="['col-content', config.style.boxShadow ? 'box-shadow' : '']" :style="{ border: isViewer ? '' : '1px dashed #999', padding: col.field.padding, 'background-color': col.field.backgroundColor, 'border-width': col.field.borderWidth + 'px' || 0, 'border-color': col.field.borderColor || 'transparent', 'border-style': col.field.borderStyle, 'border-radius': col.field.borderRadius + 'px' }">
						<div class="flex-margin flex w100 home-one-animation0">
							<div class="flex-auto">
								<span class="font30">{{ col.field.num1 }}</span>
								<span v-if="col.field.num2 && col.field.num2 !== col.field.num1" class="ml5 font16" :style="{ color: col.field.num2Color }">
									{{ formatStatSecondary(col.field.num2) }}
								</span>
								<div class="mt10">{{ col.field.title }}</div>
							</div>
							<div class="home-card-item-icon flex flex-row-center-center" :style="{ background: col.field.iconBackgroundColor, 'border-radius': col.field.iconBorderRadius + 'px', padding: col.field.iconPadding + 'px', width: col.field.iconWidth + 'px', height: col.field.iconHeight + 'px' }">
								<svg-icon :name="col.field.icon" :size="col.field.iconFontSize" :color="col.field.iconColor"></svg-icon>
							</div>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script setup lang="ts" name="pc-stat">
import { reactive, toRefs, getCurrentInstance, computed } from 'vue';
import { to } from 'await-to-js';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
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
const state = reactive({});
const formatStatSecondary = (value: unknown) => {
	const text = String(value ?? '').trim();
	const unitMap: Record<string, string> = {
		'Độc thân': 'đơn',
		'độc thân': 'đơn',
	};
	return unitMap[text] || text;
};
//#endregion
// 页面加载时
onMounted(() => {
	onSearch();
});
const onSearch = async () => {
	// 这里写后端接口请求
	if (props.config.api && props.config.api.openApi) {
		const apiUrl = props.config.api.apiUrl;
		const url = apiUrl;
		// const url = '/composite/bigScreen/home/inventoryAlert';
		const params = {
			storageId: props.config.search.storageId,
			consignorId: props.config.search.consignorId,
			dateScope: (props.config.search.dateScope = []),
		};
		const [err, res] = await to(postData(url, params));
		if (res) {
			props.config.columns.forEach((item: any, index: any) => {
				let data = res.data.columns[index]; // 后端的数据
				if (data) {
					item.field.num1 = data.num1;
					item.field.num2 = data.num2;
				} else {
					item.field.num1 = 'unknown';
					item.field.num2 = 'unknown';
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../scss/module.scss';

.widget-grid {
	row-gap: 12px;

	:deep(.el-col) {
		min-width: 0;
	}
}

.col-content {
	min-width: 0;

	.flex-auto {
		min-width: 0;
		overflow: visible;
		overflow-wrap: anywhere;
	}
}

.module-container.is-viewer {
	background: transparent !important;
	padding: 0 !important;
	overflow: hidden;
	border: 1px solid #e4e9f2;
	border-radius: 10px;
	box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);

	> .inner {
		height: auto !important;
		padding: 0 !important;
		background: #fff !important;
		border: 0 !important;
	}

	.widget-grid {
		margin: 0 !important;
		padding: 14px 7px;
		background: #fff !important;
		gap: 14px 0;

		:deep(.el-col) {
			padding-left: 7px !important;
			padding-right: 7px !important;
		}
	}

	.col-content {
		height: 100%;
		min-height: 104px;
		padding: 16px !important;
		border: 1px solid #edf0f5 !important;
		border-radius: 8px !important;
		background: #f8fafc !important;
		box-shadow: none;
		transition: border-color 0.2s ease, background 0.2s ease;

		&:hover {
			border-color: #d6dde8 !important;
			background: #f5f8fc !important;
		}

		.font30 {
			color: #172033;
			font-size: 30px !important;
			font-weight: 700;
			letter-spacing: -0.02em;
		}

		.font16 {
			display: inline-block;
			margin-left: 8px !important;
			padding: 3px 7px;
			border-radius: 999px;
			background: #eff6ff;
			font-size: 12px !important;
			font-weight: 600;
			vertical-align: middle;
		}

		.mt10 {
			margin-top: 8px !important;
			color: #64748b;
			font-size: 14px;
			font-weight: 500;
		}
	}

	.home-card-item-icon {
		flex: 0 0 auto;
		max-width: 60px;
		max-height: 60px;
	}
}

@media screen and (max-width: 900px) {
	.widget-grid {
		:deep(.el-col) {
			flex: 0 0 50%;
			max-width: 50%;
		}
	}
}

@media screen and (max-width: 600px) {
	.widget-grid {
		:deep(.el-col) {
			flex: 0 0 100%;
			max-width: 100%;
		}
	}
}
</style>
