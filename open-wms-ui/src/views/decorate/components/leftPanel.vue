<template>
	<div class="left-container">
		<el-tabs v-model="leftTabActive" class="left-tabs">
			<el-tab-pane label="组件库" name="t1" class="tab-pane">
				<el-collapse v-model="collapseActives">
					<template v-for="(group, index) in componentLibs">
						<el-collapse-item :title="group.groupName" :name="index">
							<draggable class="component-lab" :list="group.libs" tag="div" :group="{ name: 'app', pull: 'clone', put: false }" :sort="false" :clone="cloneModule" item-key="title">
								<template #item="{ element }">
									<div class="item">
										<svg-icon :name="element.icon" class="text-size-n" :size="30" />
										<div class="txt">{{ element.title }}</div>
									</div>
								</template>
							</draggable>
						</el-collapse-item>
					</template>
				</el-collapse>
			</el-tab-pane>
			<el-tab-pane label="页面链接" name="t2" class="tab-pane">
				<div class="link-lib">
					<div class="link-item">
						<div class="title-box">
							<span class="title">抽奖中奖记录</span>
							<el-button>复制</el-button>
						</div>
						<div class="url">地址：/pages/activity/lottery/grids/record</div>
						<div class="params">
							参数：
							<span class="value">id=积分商品id</span>
						</div>
						<div class="sample">例如：/pages/activity/lottery/grids/record</div>
					</div>
					<div class="link-item">
						<div class="title-box">
							<span class="title">抽奖中奖记录</span>
							<el-button>复制</el-button>
						</div>
						<div class="url">地址：/pages/activity/lottery/grids/record</div>
						<div class="params">
							参数：
							<span class="value">id=积分商品id</span>
						</div>
						<div class="sample">例如：/pages/activity/lottery/grids/record?id=60</div>
					</div>
					<div class="link-item">
						<div class="title-box">
							<span class="title">抽奖中奖记录</span>
							<el-button>复制</el-button>
						</div>
						<div class="url">地址：/pages/activity/lottery/grids/record</div>
						<div class="params">
							参数：
							<span class="value">id=积分商品id</span>
						</div>
						<div class="sample">例如：/pages/activity/lottery/grids/record?id=60</div>
					</div>
					<div class="link-item">
						<div class="title-box">
							<span class="title">抽奖中奖记录</span>
							<el-button>复制</el-button>
						</div>
						<div class="url">地址：/pages/activity/lottery/grids/record</div>
						<div class="params">
							参数：
							<span class="value">id=积分商品id</span>
						</div>
						<div class="sample">例如：/pages/activity/lottery/grids/record?id=60</div>
					</div>
					<div class="link-item">
						<div class="title-box">
							<span class="title">抽奖中奖记录</span>
							<el-button>复制</el-button>
						</div>
						<div class="url">地址：/pages/activity/lottery/grids/record</div>
						<div class="params">
							参数：
							<span class="value">id=积分商品id</span>
						</div>
						<div class="sample">例如：/pages/activity/lottery/grids/record?id=60</div>
					</div>
					<div class="link-item">
						<div class="title-box">
							<span class="title">抽奖中奖记录</span>
							<el-button>复制</el-button>
						</div>
						<div class="url">地址：/pages/activity/lottery/grids/record</div>
						<div class="params">
							参数：
							<span class="value">id=积分商品id</span>
						</div>
						<div class="sample">例如：/pages/activity/lottery/grids/record?id=60</div>
					</div>
					<div class="link-item">
						<div class="title-box">
							<span class="title">抽奖中奖记录</span>
							<el-button>复制</el-button>
						</div>
						<div class="url">地址：/pages/activity/lottery/grids/record</div>
						<div class="params">
							参数：
							<span class="value">id=积分商品id</span>
						</div>
						<div class="sample">例如：/pages/activity/lottery/grids/record?id=60</div>
					</div>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs } from 'vue';
import draggable from 'vuedraggable';
import { componentLibs } from './componentLibs';

export default {
	name: 'app-design-left-panel',
	components: {
		draggable,
	},
	setup() {
		// const { proxy } = getCurrentInstance() as any;
		const state = reactive({
			leftTabActive: 't1', // 左侧tab导航
			collapseActives: ['1', '2', '3'],
			componentLibs: componentLibs, // 组件库
		});

		let cloneModule = (item: any) => {
			return {
				...item,
			};
		};

		return {
			...toRefs(state),
			cloneModule,
		};
	},
};
</script>

<style lang="scss" scoped>
.left-container {
	position: fixed;
	left: 0;
	top: 53px;
	bottom: 0;
	width: 300px;
	background-color: var(--color-whites);
}

.left-tabs {
	.tab-pane {
		overflow-x: hidden;
		overflow-y: auto;
		height: calc(100vh - 92px);
		&::-webkit-scrollbar {
			width: 4px;
			background: transparent;
		}
		// 滑槽背景色
		&::-webkit-scrollbar-track-piece {
			width: 4px;
			background-color: var(--el-color-white);
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
	:deep(.el-tabs__header) {
		margin: 0;
	}
	:deep(.el-tabs__item) {
		width: 150px;
		text-align: center;
	}
	:deep(.el-collapse-item__header) {
		padding-left: 10px;
		font-weight: bolder;
	}
	:deep(.el-collapse-item__content) {
		padding-bottom: 10px;
	}
	.component-lab {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 0px 10px;
		.item {
			width: 80px;
			height: 80px;
			text-align: center;
			padding-top: 10px;
			color: var(--el-text-color-regular);
			line-height: 1.3;
			cursor: pointer;
			i {
				font-size: 28px;
				color: var(--color-primary);
				height: 34px;
				display: inline-block;
				overflow: hidden;
			}
			&:hover {
				box-shadow: 0 0 5px 0 rgba(24, 144, 255, 0.3);
				border-right: 5px;
			}
			.txt {
				margin-top: 5px;
			}
		}
		.itemempty {
			height: 0px;
			width: 80px;
		}
	}
	.link-lib {
		padding: 10px;
		.link-item {
			color: var(--el-text-color-regular);
			margin-bottom: 10px;
			line-height: 1.8;
			+ .link-item {
				border-top: 1px solid var(--el-border-color-light);
				padding-top: 10px;
			}
			.title-box {
				color: var(--color-primary);
				display: flex;
				justify-content: space-between;
				padding-bottom: 10px;
				.title {
					line-height: 32px;
				}
			}
			.params {
				.value {
					color: var(--color-success);
				}
			}
		}
	}
}

.item.ghost-item {
	border: 1px dashed var(--color-info-light-4) !important;
	position: relative;
	height: 60px;
	min-width: 120px;
	&::after {
		content: '释放鼠标创建组件';
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		text-align: center;
		line-height: 60px;
		background-color: var(--color-whites);
	}
}
.chosen-item {
	border: 1px dashed var(--color-info-light-4);
}
</style>
