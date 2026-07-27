<template>
	<div class="module-container" :style="{ 'background-color': config.style?.bgColor, padding: config.style.bgMargin || 0 }">
		<div :class="['inner']" :style="{ 'background-color': config.style?.innerBgColor, 'border-radius': config.style?.borderRadius ? config.style.borderRadius + 'px' : 0, padding: config.style.bgPadding || 0, 'border-width': config.style.innerBorderWidth + 'px' || 0, 'border-color': config.style.innerBorderColor || 'transparent', 'border-style': config.style.innerBorderStyle, height: config.style.height || 'auto' }">
			<pc-header :config="config" :is-viewer="isViewer" @on-search="onSearch"></pc-header>

			<el-row :justify="config.options.justify" :align="config.options.align" :gutter="config.options.gutter ? config.options.gutter : 0" :style="{ 'background-color': config.style.bgColor || 'transport' }" class="widget-grid" type="flex">
				<el-col v-for="(col, colIndex) in config.columns" :key="colIndex" :span="col.span ? col.span : 0">
					<div :class="['col-content', config.style.boxShadow ? 'box-shadow' : '']" :style="{ border: isViewer ? '' : '1px dashed #999', padding: col.field.padding, 'background-color': col.field.backgroundColor, 'border-width': col.field.borderWidth + 'px' || 0, 'border-color': col.field.borderColor || 'transparent', 'border-style': col.field.borderStyle, 'border-radius': col.field.borderRadius + 'px' }">
						<div class="flex-margin flex w100 home-one-animation0">
							<div class="flex-auto">
								<span class="font30">{{ col.field.num1 }}</span>
								<span class="ml5 font16" :style="{ color: col.field.num2Color }">
									{{ col.field.num2 }}
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
