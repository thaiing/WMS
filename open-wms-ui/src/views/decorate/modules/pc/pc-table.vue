<template>
	<div class="module-container" :style="{ 'background-color': config.style?.bgColor, padding: config.style.bgMargin || 0 }">
		<div :class="['inner']" :style="{ 'background-color': config.style?.innerBgColor, 'border-radius': config.style?.borderRadius ? config.style.borderRadius + 'px' : 0, padding: config.style.bgPadding || 0, 'border-width': config.style.innerBorderWidth + 'px' || 0, 'border-color': config.style.innerBorderColor || 'transparent', 'border-style': config.style.innerBorderStyle, height: config.style.height || 'auto' }">
			<pc-header :config="config" :is-viewer="isViewer" @on-search="onSearch"></pc-header>
			<el-table :data="state.tableData" style="width: 100%" :max-height="config.style.maxHeight || undefined" :stripe="config.style.stripe" :height="config.style.tableHeight || undefined">
				<template v-for="(col, index) in config.columns">
					<el-table-column v-if="col.type == 'index'" prop="index" :align="col.align" :header-align="col.headerAlign" :label="col.label" :width="col.width" />
					<el-table-column v-else :prop="col.prop" :align="col.align" :header-align="col.headerAlign" :label="col.label" :width="col.width || undefined">
						<template #default="{ row }">
							<!--通用列插槽-->
							<slot :row="row" :col="col" name="common-column-slot">
								<template v-if="col.prop == col.linkColumn">
									<el-link type="primary">
										{{ common.formatData(row, col) }}
									</el-link>
								</template>
								<template v-else>
									<!-- 通用标签颜色着色 -->
									<template v-if="col.tagColorList && col.tagColorList.length && row[col.prop] !== undefined">
										<el-tag :color="common.getTagBgColor(row, col, row[col.prop])" :style="common.getTagColor(row, col, row[col.prop])">
											{{ common.formatData(row, col) }}
										</el-tag>
									</template>
									<template v-else>
										{{ common.formatData(row, col) }}
									</template>
								</template>
							</slot>
						</template>
					</el-table-column>
				</template>
			</el-table>
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
const state = reactive({
	tableData: [],
});
//#endregion

// 监听
watch(
	() => props.config,
	(newVal: any, oldVal: any) => {
		if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
			init();
		}
	},
	{ deep: true }
);

// 页面加载时
onMounted(() => {
	init();
});
const init = () => {
	try {
		state.tableData = JSON.parse(props.config.options.tableData);
		state.tableData.forEach((row: any, index: number) => {
			row.index = index + 1;
		});
		onSearch();
	} catch (e) {}
};
const onSearch = async () => {
	// 这里写后端接口请求
	// 如果开启了接口地址，按接口地址取数据
	if (props.config.api && props.config.api.openApi) {
		let apiUrl = props.config.api.apiUrl;
		const params = {
			storageId: props.config.search.storageId,
			consignorId: props.config.search.consignorId,
			dateScope: (props.config.search.dateScope = []),
		};
		const [err, res] = await to(postData(apiUrl, params));
		if (err) {
			proxy.$message.error(err.message);
		}
		state.tableData = [];
		if (res) {
			res.data.tableData.forEach((row: any, index: number) => {
				row.index = index + 1;
			});
			state.tableData = res.data.tableData;
		}
	}
};
</script>

<style lang="scss" scoped>
.module-container {
	height: 100%;

	.inner {
		display: flex;
		flex-direction: column;
		height: 100% !important;
		min-height: 0;
		padding: 5px 0;

		:deep(.el-table) {
			flex: 1 1 auto;
			min-height: 0;
		}
	}
	.box-shadow {
		width: 100%;
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
</style>
