<template>
	<div :class="['module-container', { 'is-viewer': isViewer }]" :style="{ 'background-color': config.style?.bgColor, padding: config.style.bgMargin || 0 }">
		<div :class="['inner', config.style.boxShadow ? 'box-shadow' : '']" :style="{ 'background-color': config.style?.innerBgColor, 'border-radius': config.style?.borderRadius ? config.style.borderRadius + 'px' : 0, padding: config.style.bgPadding || 0, 'border-width': config.style.innerBorderWidth + 'px' || 0, 'border-color': config.style.innerBorderColor || 'transparent', 'border-style': config.style.innerBorderStyle, height: config.style.height || 'auto' }">
			<pc-header :config="config" :is-viewer="isViewer" @on-search="onSearch"></pc-header>

			<div class="stat-row flex flex-row-center-center">
				<template v-for="column in config.columns">
					<div class="stat-col" :style="{ width: 100 / config.columns.length + '%', padding: column.padding, margin: column.margin }">
						<div class="w100" :class="` home-one-animation0`">
							<div :style="{ 'line-height': column.nameLineHeight }" class="flex flex-row-center-start">
								<span class="mr-20" :style="{ 'font-size': column.nameFontSize, color: column.nameColor }">{{ column.name }}</span>
								<el-tag v-if="column.name2" class="mr-20" effect="dark" :color="column.name2BgColor" :style="{ 'font-size': column.name2FontSize, color: column.name2Color, 'border-color': column.name2BgColor }">{{ column.name2 }}</el-tag>
							</div>
							<div v-if="column.subName1 || column.subName2" :style="{ 'line-height': column.subNameLineHeight }">
								<span class="mr-20" :style="{ 'font-size': column.subName1FontSize, color: column.subName1Color }">{{ column.subName1 }}</span>
								<span class="mr-20" :style="{ 'font-size': column.subName2FontSize, color: column.subName2Color }">{{ column.subName2 }}</span>
							</div>
							<div class="column-rows">
								<template v-for="row in column.rows">
									<div class="column-row flex flex-row-center-center" :style="{ 'line-height': column.contentLineHeight }">
										<div class="stat-title" :style="{ 'font-size': row.titleFontSize, color: row.titleColor }">{{ row.title }}：</div>
										<div class="stat-value" :style="{ 'font-size': row.valueFontSize, color: row.valueColor }">{{ row.value }}</div>
									</div>
								</template>
							</div>
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="pc-stat">
import { reactive, toRefs, getCurrentInstance, computed } from 'vue';
import { to } from 'await-to-js';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
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
const state = reactive({});
//#endregion
// 页面加载时
onMounted(() => {
	onSearch();
});
const onSearch = async () => {
	// 这里写后端接口请求
	// 如果开启了接口地址，按接口地址取数据
	if (props.config.api && props.config.api.openApi) {
		const apiUrl = props.config.api.apiUrl;
		const url = apiUrl;
		// const url = '/composite/bigScreen/home/inventoryStatus';
		const params = {
			storageId: props.config.search.storageId,
			consignorId: props.config.search.consignorId,
			dateScope: (props.config.search.dateScope = []),
		};
		const [err, res] = await to(postData(url, params));
		if (res) {
			props.config.columns.forEach((item: any, index: any) => {
				let data = res.data.columns[index]; // 后端的数据
				let data2 = res.data.columns[index].rows; // 后端的rows数据
				if (data) {
					item.name = data.name;
					item.name2 = data.name2;
				} else {
					item.name = 'unknown';
					item.name2 = 'unknown';
				}
				// 处理rows明细数据
				item.rows.forEach((item2: any, index: any) => {
					// 明细中的
					if (data2) {
						data2.forEach((item3: any, index: any) => {
							if (item3.title == item2.title) {
								item2.title = item3.title;
								item2.value = item3.value;
							}
						});
					} else {
						item2.title = 'unknown';
						item2.value = 'unknown';
					}
				});
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../scss/module.scss';
</style>

<style lang="scss" scoped>
.stat-row {
	display: grid !important;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	align-items: stretch;
	gap: 12px;

	.stat-col {
		width: auto !important;
		min-width: 0;
		text-align: left !important;
		padding: 12px !important;
		margin: 0 !important;
		border: 1px solid var(--el-border-color-lighter, #ebeef5);
		border-radius: 8px;

		+ .stat-col {
			border-left: 1px solid var(--el-border-color-lighter, #ebeef5);
		}

		.flex-row-center-start {
			flex-wrap: wrap;
			align-items: flex-start;
			justify-content: flex-start !important;
			text-align: left !important;
			gap: 6px;
		}

		.flex-row-center-start > .mr-20 {
			margin-right: 0 !important;
			overflow-wrap: anywhere;
		}

		:deep(.el-tag) {
			max-width: 100%;
			height: auto;
			white-space: normal;
			line-height: 1.35;
			padding-top: 5px;
			padding-bottom: 5px;
		}
	}
}

.module-container.is-viewer {
	padding: 0 !important;
	background: transparent !important;

	> .inner {
		height: auto !important;
		padding: 0 !important;
		border: 0 !important;
		background: transparent !important;
		box-shadow: none !important;
	}

	.stat-row {
		gap: 14px;

		.stat-col {
			min-height: 124px;
			padding: 17px 18px 16px !important;
			overflow: hidden;
			border: 1px solid #e4e9f2 !important;
			border-radius: 10px;
			background: #fff;
			box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
			transition: border-color 0.2s ease, box-shadow 0.2s ease;

			&:hover {
				border-color: #cbd5e1 !important;
				box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
			}

			.flex-row-center-start > span:first-child {
				color: #172033 !important;
				font-size: 18px !important;
				font-weight: 650;
				line-height: 1.35;
			}
		}
	}

	.column-rows {
		display: flex;
		flex-direction: column;
		gap: 5px;
		margin-top: 10px;

		.column-row {
			color: #64748b;
			font-size: 13px;
			line-height: 1.45 !important;

			.stat-title {
				color: #64748b !important;
			}

			.stat-value {
				color: #172033 !important;
				font-weight: 650;
			}
		}
	}

	:deep(.el-tag) {
		border: 0 !important;
		border-radius: 7px;
	}
}
.column-rows {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 4px 12px;

	.column-row {
		width: 100%;
		min-width: 0;
		justify-content: flex-start !important;
		align-items: flex-start;
		text-align: left !important;

		.stat-title {
			min-width: 0;
			overflow-wrap: anywhere;
		}

		.stat-value {
			flex-shrink: 0;
		}
	}
}

@media screen and (max-width: 1200px) {
	.module-container > .inner {
		height: auto !important;
	}
}

@media screen and (max-width: 600px) {
	.stat-row {
		grid-template-columns: 1fr;
		gap: 10px;
	}
}
</style>
