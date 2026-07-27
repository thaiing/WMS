<!--新闻列表-->
<template>
	<div class="module-container" :style="{ 'margin-top': config.style?.maginTop ? config.style.maginTop + 'px' : 0, 'background-image': 'linear-gradient(' + (config.style?.bgColorDeg || 0) + 'deg, ' + config.style?.bgColor1 + ', ' + config.style?.bgColor2 + ')', padding: config.style?.bgMargin ? config.style.bgMargin + 'px' : 0, 'max-height': config.style?.maxHeight ? config.style.maxHeight + 'px' : '300px', '--track-piece-color': config.style?.bgColor2 }">
		<div class="items" :style="{ 'background-color': config.style?.bgColor, 'border-radius': config.style?.bgBorderRadius ? config.style.bgBorderRadius + 'px' : 0, padding: config.style?.bgPadding ? config.style.bgPadding + 'px' : 0 }">
			<div v-for="(item, index) in newsList" :key="index" class="item" :style="{ 'background-color': config.style?.itemBgColor, 'border-radius': config.style?.itemBorderRadius ? config.style.itemBorderRadius + 'px' : 0, padding: config.style?.itemPadding ? config.style.itemPadding + 'px' : 0, 'margin-bottom': (config.style?.itemMargin === undefined || index === newsList.length - 1 ? 0 : config.style?.itemMargin) + 'px' }">
				<div class="content">
					<div class="title">{{ item.title }}</div>
					<div class="datetime">{{ common.formatDate(item.createDate, 'YYYY-MM-DD HH:mm:ss') }}</div>
				</div>
				<div class="img-box" :style="{ width: (config.style?.iconSize === undefined ? 60 : config.style?.iconSize) + 'px', height: (config.style?.iconSize === undefined ? 60 : config.style?.iconSize) + 'px' }">
					<el-image :src="item.picURL + '?x-oss-process=style/small'" fit="fill" class="img" :style="{ width: '100%', height: '100%', 'border-radius': config.style?.iconStyle === '圆形' ? (config.style?.iconSize || 60) / 2 + 'px' : '' }"></el-image>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance, computed, ComponentInternalInstance, ComponentPublicInstance, onMounted } from 'vue';
interface CustomProperties extends ComponentPublicInstance {
	config: {
		content: {
			/**
			 * 新闻类别ID
			 */
			module_Id: number;
			/**
			 * 新闻行数
			 */
			rowCount: number;
		};
		style: {};
	};
	newsList: Array<any>;
	getNewsList: () => {};
}

export default {
	name: 'app-design-left-panel',
	components: {},
	props: {
		// 配置参数
		config: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	setup() {
		let ins = getCurrentInstance() as ComponentInternalInstance;
		let proxy: CustomProperties;
		if (ins.proxy) {
			proxy = ins.proxy as CustomProperties;
		}

		//#region 属性
		const state = reactive({
			newsList: [] as any[],
		});
		//#endregion

		onMounted(() => {});

		//#region 方法
		let methods = {
			// 加载模块新闻列表
			getNewsList() {
				let url = '/api/common/loadDataList';
				let where = {
					module_Id: proxy.config.content.module_Id,
				};
				let orderBy = { orderNo: 'DESC', module_Id: 'DESC' };
				let params = {
					tableView: 'Cms_Content',
					idField: 'content_Id',
					folder: 'cms/module',
					menu_Id: 2002,
					pageIndex: 1,
					pageSize: proxy.config.content.rowCount || 5,
					where: where,
					orderBy: orderBy,
					select: ['content_Id', 'title', 'createDate', 'picURL'],
				};
				// proxy.common.ajax(
				// 	url,
				// 	params,
				// 	(res: any) => {
				// 		proxy.common.showMsg(res);
				// 		if (res.result) {
				// 			proxy.newsList = res.data.rows;
				// 		}
				// 	},
				// 	false
				// );
			},
		};
		//#endregion

		onMounted(() => {
			proxy.getNewsList();
			// 响应行数改变事件
			// proxy.mittBus.on('onNewList:rowCountChange', () => {
			// 	proxy.getNewsList();
			// });
		});

		return {
			...toRefs(state),
			...methods,
		};
	},
};
</script>

<style lang="scss" scoped>
.module-container {
	min-height: 20px;
	overflow-x: hidden;
	overflow-y: auto;
	&::-webkit-scrollbar {
		width: 4px;
		background: transparent;
	}
	// 滑槽背景色
	&::-webkit-scrollbar-track-piece {
		width: 4px;
		background-color: var(--track-piece-color);
	}
	// 滚动条样式
	&::-webkit-scrollbar-thumb {
		border-radius: 4px;
		background: transparent;
	}
	&:hover {
		&::-webkit-scrollbar-thumb {
			border-radius: 4px;
			background: #ccc;
		}
	}
	&::-webkit-scrollbar-thumb:hover {
		background: #ccc;
	}
	&::-webkit-scrollbar-thumb:active {
		background: rgb(175, 174, 174);
	}
	// 浏览器失焦的样式
	&::-webkit-scrollbar-thumb:window-inactive {
		background: rgba(230, 230, 230, 0.4);
	}
}
.items {
	.item {
		display: flex;
		justify-content: space-between;
		.content {
			width: calc(100% - 65px);
			.title {
				color: var(--el-text-color-regular);
				height: 44px;
			}
			.datetime {
				color: var(--el-text-color-secondary);
			}
		}
		.img-box {
			width: 60px;
			height: 60px;
			text-align: center;
		}
	}
}
</style>
