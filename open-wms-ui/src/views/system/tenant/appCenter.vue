<template>
	<div class="app-container">
		<div class="app-left">
			<el-anchor :container="containerRef" direction="vertical" type="default" :marker="false" :offset="0" @change="handleChange" @click="handleClick">
				<template v-for="(item, index) in state.dataList">
					<el-anchor-link :href="item.href">
						<div :class="['link-item', (!state.currentHref && index === 0) || state.currentHref === item.href ? 'active' : '']">{{ item.title }}</div>
					</el-anchor-link>
				</template>
			</el-anchor>
		</div>
		<div class="app-right">
			<div ref="containerRef" class="content">
				<template v-for="item in state.dataList">
					<div :id="item.href.replace('#', '')" class="module-group">
						<div class="group-title">
							{{ item.title }}
						</div>
						<div class="module-box">
							<template v-for="(module, index) in item.modules">
								<div class="module" @click="showAppList(module)">
									<div class="img-box" :style="{ 'background-color': module.bgColor, color: module.color }">
										<svg-icon :name="module.icon" class="text-size-n" :size="38"></svg-icon>
									</div>
									<div class="content-box">
										<div class="title-box">
											<div class="title">{{ module.name }}</div>
											<div v-if="module.tag" :class="['tag', module.tag === '已开通' ? 'tag-green' : '', module.tag === '免费' ? 'tag-blue' : '']">{{ module.tag }}</div>
										</div>
										<div class="description">{{ module.description }}</div>
									</div>
								</div>
							</template>
						</div>
					</div>
				</template>
				<div style="height: 1000px"></div>
			</div>
		</div>

		<!--显示应用详情对话框-->
		<app-center-dialog v-model:visible="state.dialogVisible"></app-center-dialog>
	</div>
</template>

<script setup lang="ts" name="system-tenant-appCenter">
import { ref } from 'vue';
const AppCenterDialog = defineAsyncComponent(() => import('./components/app-center-dialog.vue'));

const containerRef = ref<HTMLElement | null>(null);

//#region 定义变量
const state = reactive({
	dialogVisible: false,
	currentHref: '#part1',
	dataList: [
		{
			title: '最新使用',
			href: '#part1',
			modules: [
				{
					icon: 'ele-Baseball',
					bgColor: '#316ff5',
					color: 'white',
					name: '商品条码',
					description: '设置商品条码，用于扫码收货、扫码入库、扫码盘点等',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#ff6600',
					color: 'white',
					name: '客户商品别名',
					description: '按客户设置商品别名，可打印在发货单上',
					tag: '付费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#339900',
					color: 'white',
					name: '客户商品备注',
					description: '按客户设置商品备注，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#660000',
					color: 'white',
					name: '商品自定义字段',
					description: '在商品档案中增加自定义字段，可打印在发货单上',
					tag: '免费',
				},
			],
		},
		{
			title: '平台对接',
			href: '#part2',
			modules: [
				{
					icon: 'ele-ChatRound',
					bgColor: '#ff6600',
					color: 'white',
					name: '金蝶云星空',
					description: '支持7.3及以上版本，可同步基础资料、应收单、应付单',
					tag: '免费',
				},
				{
					icon: 'ele-Cpu',
					bgColor: '#339900',
					color: 'white',
					name: '金蝶云星辰',
					description: '在蔬东坡系统生成凭证后、将凭证同步至云星辰',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#6600ff',
					color: 'white',
					name: '金蝶云星空',
					description: '支持7.3及以上版本，可同步基础资料、应收单、应付单',
					tag: '已开通',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#66cc00',
					color: 'white',
					name: '金蝶云星辰',
					description: '在蔬东坡系统生成凭证后、将凭证同步至云星辰',
					tag: '付费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#006600',
					color: 'white',
					name: '客户商品备注',
					description: '按客户设置商品备注，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#ff00cc',
					color: 'white',
					name: '商品自定义字段',
					description: '在商品档案中增加自定义字段，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#339900',
					color: 'white',
					name: '客户商品别名',
					description: '按客户设置商品别名，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-ChatRound',
					bgColor: '#ff6600',
					color: 'white',
					name: '金蝶云星空',
					description: '支持7.3及以上版本，可同步基础资料、应收单、应付单',
					tag: '付费',
				},
				{
					icon: 'ele-Cpu',
					bgColor: '#339900',
					color: 'white',
					name: '金蝶云星辰',
					description: '在蔬东坡系统生成凭证后、将凭证同步至云星辰',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#6600ff',
					color: 'white',
					name: '金蝶云星空',
					description: '支持7.3及以上版本，可同步基础资料、应收单、应付单',
					tag: '已开通',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#66cc00',
					color: 'white',
					name: '金蝶云星辰',
					description: '在蔬东坡系统生成凭证后、将凭证同步至云星辰',
					tag: '',
				},
			],
		},
		{
			title: 'WMS模块',
			href: '#part3',
			modules: [
				{
					icon: 'ele-Drizzling',
					bgColor: '#660000',
					color: 'white',
					name: '客户商品别名',
					description: '按客户设置商品别名，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#006600',
					color: 'white',
					name: '客户商品备注',
					description: '按客户设置商品备注，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#ff00cc',
					color: 'white',
					name: '商品自定义字段',
					description: '在商品档案中增加自定义字段，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#339900',
					color: 'white',
					name: '客户商品别名',
					description: '按客户设置商品别名，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#006600',
					color: 'white',
					name: '客户商品备注',
					description: '按客户设置商品备注，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#660000',
					color: 'white',
					name: '商品自定义字段',
					description: '在商品档案中增加自定义字段，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#339900',
					color: 'white',
					name: '客户商品别名',
					description: '按客户设置商品别名，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#66cc00',
					color: 'white',
					name: '客户商品备注',
					description: '按客户设置商品备注，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#cc00ff',
					color: 'white',
					name: '商品自定义字段',
					description: '在商品档案中增加自定义字段，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#339900',
					color: 'white',
					name: '客户商品备注',
					description: '按客户设置商品备注，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#339900',
					color: 'white',
					name: '客户商品别名',
					description: '按客户设置商品别名，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#006600',
					color: 'white',
					name: '客户商品备注',
					description: '按客户设置商品备注，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#ff00cc',
					color: 'white',
					name: '商品自定义字段',
					description: '在商品档案中增加自定义字段，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#ff6600',
					color: 'white',
					name: '客户商品别名',
					description: '按客户设置商品别名，可打印在发货单上',
					tag: '免费',
				},

				{
					icon: 'ele-Drizzling',
					bgColor: '#660000',
					color: 'white',
					name: '商品自定义字段',
					description: '在商品档案中增加自定义字段，可打印在发货单上',
					tag: '免费',
				},
			],
		},
		{
			title: 'TMS模块',
			href: '#part4',
			modules: [
				{
					icon: 'ele-Drizzling',
					bgColor: '#660000',
					color: 'white',
					name: '客户商品别名',
					description: '按客户设置商品别名，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#006600',
					color: 'white',
					name: '客户商品备注',
					description: '按客户设置商品备注，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#ff00cc',
					color: 'white',
					name: '商品自定义字段',
					description: '在商品档案中增加自定义字段，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#339900',
					color: 'white',
					name: '客户商品别名',
					description: '按客户设置商品别名，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#006600',
					color: 'white',
					name: '客户商品备注',
					description: '按客户设置商品备注，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#ff00cc',
					color: 'white',
					name: '商品自定义字段',
					description: '在商品档案中增加自定义字段，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#ff6600',
					color: 'white',
					name: '客户商品别名',
					description: '按客户设置商品别名，可打印在发货单上',
					tag: '付费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#339900',
					color: 'white',
					name: '客户商品备注',
					description: '按客户设置商品备注，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#660000',
					color: 'white',
					name: '商品自定义字段',
					description: '在商品档案中增加自定义字段，可打印在发货单上',
					tag: '免费',
				},
			],
		},
		{
			title: '统计分析',
			href: '#part5',
			modules: [
				{
					icon: 'ele-Drizzling',
					bgColor: '#660000',
					color: 'white',
					name: '客户商品别名',
					description: '按客户设置商品别名，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#006600',
					color: 'white',
					name: '客户商品备注',
					description: '按客户设置商品备注，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#ff00cc',
					color: 'white',
					name: '商品自定义字段',
					description: '在商品档案中增加自定义字段，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#339900',
					color: 'white',
					name: '客户商品别名',
					description: '按客户设置商品别名，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#006600',
					color: 'white',
					name: '客户商品备注',
					description: '按客户设置商品备注，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#ff00cc',
					color: 'white',
					name: '商品自定义字段',
					description: '在商品档案中增加自定义字段，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#006600',
					color: 'white',
					name: '客户商品备注',
					description: '按客户设置商品备注，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#ff00cc',
					color: 'white',
					name: '商品自定义字段',
					description: '在商品档案中增加自定义字段，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#339900',
					color: 'white',
					name: '客户商品别名',
					description: '按客户设置商品别名，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#ff6600',
					color: 'white',
					name: '客户商品别名',
					description: '按客户设置商品别名，可打印在发货单上',
					tag: '付费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#006600',
					color: 'white',
					name: '客户商品备注',
					description: '按客户设置商品备注，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#ff00cc',
					color: 'white',
					name: '商品自定义字段',
					description: '在商品档案中增加自定义字段，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#339900',
					color: 'white',
					name: '客户商品别名',
					description: '按客户设置商品别名，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#339900',
					color: 'white',
					name: '客户商品备注',
					description: '按客户设置商品备注，可打印在发货单上',
					tag: '免费',
				},
				{
					icon: 'ele-Drizzling',
					bgColor: '#660000',
					color: 'white',
					name: '商品自定义字段',
					description: '在商品档案中增加自定义字段，可打印在发货单上',
					tag: '免费',
				},
			],
		},
	],
});
//#endregion

const handleChange = (href: string) => {
	state.currentHref = href;
};

const handleClick = (e: MouseEvent) => {
	e.preventDefault();
};

const showAppList = (module: any) => {
	state.dialogVisible = true;
};
</script>

<style scoped lang="scss">
.app-container {
	display: flex;
	width: 100%;
	height: calc(100vh - 85px);
	background-color: var(--next-bg-main-color);
	padding: 15px;
	.app-left {
		flex: 0 0 auto; /* 当右侧内容超出时会拉伸左侧宽度，设置此样式可解决 */
		padding-top: 10px;
		padding-left: 0px;
		width: 80px;
		background-color: white;
		height: 100%;
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
		.link-item {
			height: 50px;
			width: 50px;
			border-radius: 5px;
			background-color: rgb(186, 235, 231);
			color: rgb(4, 148, 136);
			padding: 8px 10px;
			word-break: break-all;
			text-wrap: pretty;
			line-height: 1.5;
			display: flex;
			flex-direction: column;
			justify-content: center;
			text-align: center;
			&.active {
				background-color: rgb(4, 148, 136);
				color: white;
			}
		}
	}
	.app-right {
		flex-grow: 0;
		background-color: white;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
		.content {
			height: 100%;
			overflow-y: hidden;
			padding-top: 10px;

			&:hover {
				overflow-y: auto; /* 鼠标悬停时显示溢出内容 */
			}
			.module-group {
				.group-title {
					padding: 5px 15px;
					background-color: #e0e0e0;
					position: relative;
					&::before {
						content: ' ';
						position: absolute;
						left: 5px;
						top: 8px;
						background-color: rgb(4, 148, 136);
						display: inline-block;
						width: 5px;
						height: 15px;
						border-radius: 5px;
					}
				}
				.module-box {
					flex-grow: 0;
					padding: 10px;
					display: flex;
					flex-wrap: wrap;
					.module {
						padding: 10px;
						border: 1px solid #e7e7e7;
						height: 80px;
						display: flex;
						border-radius: 5px;
						margin-bottom: 10px;
						cursor: pointer;
						&.module {
							margin-right: 10px;
						}
						.img-box {
							border-radius: 5px;
							height: 50px;
							width: 50px;
							border: 1px solid #e7e7e7;
							display: flex;
							justify-content: center;
							text-align: center;
							padding: 5px;
							color: rgb(255, 255, 255);
							background-color: #316ff5;
						}
						.module-img {
							width: 42px;
							height: 42px;
						}
						.content-box {
							margin-left: 8px;
							width: 170px;
							.title-box {
								display: flex;
								.title {
									color: black;
								}
								.tag {
									border: 1px solid red;
									padding: 1px 3px;
									display: inline-block;
									border-radius: 3px;
									color: red;
									margin-left: 5px;
									font-size: 12px;
									&.tag-green {
										border: 1px solid rgb(16, 196, 0);
										color: rgb(16, 196, 0);
									}
									&.tag-blue {
										border: 1px solid rgb(58, 87, 250);
										color: rgb(58, 87, 250);
									}
								}
							}
							.description {
								margin-top: 5px;
								color: rgb(141, 141, 141);
								font-size: 12px;
							}
						}
					}
				}
			}
		}
	}
}
</style>
