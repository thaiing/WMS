<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="detailButtonClick" :auth-nodes="state.authNodes">
			<template #blank-loginTemplate="{ formData }">
				<div class="img-box">
					<div v-for="(item, index) in state.loginTemplate" :key="item.url" class="img-item">
						<el-image style="width: 180px; height: 100px" :src="item.url + '?x-oss-process=style/200'" fit="fill" :class="['img', formData.loginTemplate === item.name ? 'active' : '']" :preview-src-list="state.loginTemplate.map((m) => m.url)" :initial-index="index" />
						<el-radio v-model="formData.loginTemplate" :value="item.name" size="large">
							<div class="name">{{ item.name }}</div>
						</el-radio>
					</div>
					<div class="img-item"></div>
				</div>
			</template>
			<template #blank-mainTemplate="{ formData }">
				<div class="layout-drawer-content-flex">
					<!-- defaults 布局 -->
					<div class="item-box">
						<div class="layout-drawer-content-item" @click="onSetLayout('defaults', formData)">
							<section class="el-container el-circular" :class="{ 'drawer-layout-active': formData.mainTemplate === 'defaults' }">
								<aside class="el-aside" style="width: 20px"></aside>
								<section class="el-container is-vertical">
									<header class="el-header" style="height: 10px"></header>
									<main class="el-main"></main>
								</section>
							</section>
							<div class="layout-tips-warp" :class="{ 'layout-tips-warp-active': formData.mainTemplate === 'defaults' }">
								<div class="layout-tips-box">
									<p class="layout-tips-txt">{{ $t('message.layout.sixDefaults') }}</p>
								</div>
							</div>
						</div>
						<el-radio v-model="formData.mainTemplate" value="defaults" size="small">
							<div class="name">默认</div>
						</el-radio>
					</div>
					<!-- classic 布局 -->
					<div class="item-box">
						<div class="layout-drawer-content-item" @click="onSetLayout('classic', formData)">
							<section class="el-container is-vertical el-circular" :class="{ 'drawer-layout-active': formData.mainTemplate === 'classic' }">
								<header class="el-header" style="height: 10px"></header>
								<section class="el-container">
									<aside class="el-aside" style="width: 20px"></aside>
									<section class="el-container is-vertical">
										<main class="el-main"></main>
									</section>
								</section>
							</section>
							<div class="layout-tips-warp" :class="{ 'layout-tips-warp-active': formData.mainTemplate === 'classic' }">
								<div class="layout-tips-box">
									<p class="layout-tips-txt">{{ $t('message.layout.sixClassic') }}</p>
								</div>
							</div>
						</div>
						<el-radio v-model="formData.mainTemplate" value="classic" size="small">
							<div class="name">经典</div>
						</el-radio>
					</div>
					<!-- transverse 布局 -->
					<div class="item-box">
						<div class="layout-drawer-content-item" @click="onSetLayout('transverse', formData)">
							<section class="el-container is-vertical el-circular" :class="{ 'drawer-layout-active': formData.mainTemplate === 'transverse' }">
								<header class="el-header" style="height: 10px"></header>
								<section class="el-container">
									<section class="el-container is-vertical">
										<main class="el-main"></main>
									</section>
								</section>
							</section>
							<div class="layout-tips-warp" :class="{ 'layout-tips-warp-active': formData.mainTemplate === 'transverse' }">
								<div class="layout-tips-box">
									<p class="layout-tips-txt">{{ $t('message.layout.sixTransverse') }}</p>
								</div>
							</div>
						</div>
						<el-radio v-model="formData.mainTemplate" value="transverse" size="small">
							<div class="name">横向</div>
						</el-radio>
					</div>
					<!-- columns 布局 -->
					<div class="item-box">
						<div class="layout-drawer-content-item" @click="onSetLayout('columns', formData)">
							<section class="el-container el-circular" :class="{ 'drawer-layout-active': formData.mainTemplate === 'columns' }">
								<aside class="el-aside-dark" style="width: 10px"></aside>
								<aside class="el-aside" style="width: 20px"></aside>
								<section class="el-container is-vertical">
									<header class="el-header" style="height: 10px"></header>
									<main class="el-main"></main>
								</section>
							</section>
							<div class="layout-tips-warp" :class="{ 'layout-tips-warp-active': formData.mainTemplate === 'columns' }">
								<div class="layout-tips-box">
									<p class="layout-tips-txt">{{ $t('message.layout.sixColumns') }}</p>
								</div>
							</div>
						</div>
						<el-radio v-model="formData.mainTemplate" value="columns" size="small">
							<div class="name">分栏</div>
						</el-radio>
					</div>
					<!-- tile 平铺布局 -->
					<div class="item-box">
						<div class="layout-drawer-content-item" @click="onSetLayout('tile', formData)">
							<section class="el-container el-circular" :class="{ 'drawer-layout-active': formData.mainTemplate === 'tile' }">
								<aside class="el-aside" style="width: 20px"></aside>
								<div class="sub-menu">
									<div class="menu-item"></div>
									<div class="menu-item"></div>
									<div class="menu-item"></div>
								</div>
								<section class="el-container is-vertical">
									<header class="el-header" style="height: 10px"></header>
									<main class="el-main"></main>
								</section>
							</section>
							<div class="layout-tips-warp" :class="{ 'layout-tips-warp-active': formData.mainTemplate === 'tile' }">
								<div class="layout-tips-box">
									<p class="layout-tips-txt">{{ $t('message.layout.sixTile') }}</p>
								</div>
							</div>
						</div>
						<el-radio v-model="formData.mainTemplate" value="tile" size="small">
							<div class="name">平铺</div>
						</el-radio>
					</div>
				</div>
			</template>
		</yrt-editor>
	</div>
</template>

<script setup lang="ts" name="system-tenant-tenantPackage">
import YrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';

const base = baseHook();

const { baseState, dataListRefName, editorRefName, buttonClick, detailButtonClick, editorInfo } = base;

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
	loginTemplate: [
		{
			url: 'https://auod-beijing.oss-cn-beijing.aliyuncs.com/wms/dijing/login-01.png',
			name: '天空蓝',
		},
		{
			url: 'https://auod-beijing.oss-cn-beijing.aliyuncs.com/wms/dijing/login-02.png',
			name: '翡翠绿',
		},
		{
			url: 'https://auod-beijing.oss-cn-beijing.aliyuncs.com/wms/dijing/login-03.png',
			name: '智慧蓝',
		},
		{
			url: 'https://auod-beijing.oss-cn-beijing.aliyuncs.com/wms/dijing/login-04.png',
			name: '科技紫',
		},
	],
});
//#endregion

onMounted(() => {});

// 5、布局切换
const onSetLayout = (layout: string, formData: any) => {
	formData.mainTemplate = layout;
};
</script>

<style lang="scss" scoped>
.img-box {
	display: flex;
	flex-direction: row;
	.img-item {
		display: flex;
		flex-direction: column;
		margin-right: 10px;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		.img {
			border: 1px solid rgb(226, 226, 226);
			&.active {
				border: 1px solid rgb(0, 57, 245);
			}
			&:hover {
				border: 1px solid rgb(0, 57, 245);
				transition: all 0.3s ease-in-out;
			}
		}
	}
}
.layout-drawer-content-flex {
	overflow: hidden;
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
	margin: 0 -5px;
	.item-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		::v-deep .name {
			line-height: 1;
			font-size: 14px;
		}
	}
	.layout-drawer-content-item {
		width: 150px;
		height: 100px;
		cursor: pointer;
		border: 1px solid transparent;
		position: relative;
		padding: 5px;
		.el-container {
			position: relative;
			height: 100%;
			.el-aside-dark {
				background-color: var(--next-color-seting-header);
			}
			.el-aside {
				background-color: var(--next-color-seting-aside);
			}
			.sub-menu {
				width: 27px;
				height: 47px;
				position: absolute;
				left: 20px;
				top: 23px;
				background-color: var(--next-color-seting-aside);
				z-index: 100;
				padding: 3px;
				.menu-item {
					width: 100%;
					height: 5px;
					margin-top: 4px;
					background-color: var(--next-color-seting-main);
				}
			}
			.el-header {
				background-color: var(--next-color-seting-header);
			}
			.el-main {
				background-color: var(--next-color-seting-main);
			}
		}
		.el-circular {
			border-radius: 2px;
			overflow: hidden;
			border: 1px solid transparent;
			transition: all 0.3s ease-in-out;
		}
		.drawer-layout-active {
			border: 1px solid;
			border-color: var(--el-color-primary);
		}
		.layout-tips-warp,
		.layout-tips-warp-active {
			transition: all 0.3s ease-in-out;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			border: 1px solid;
			border-color: var(--el-color-primary-light-5);
			border-radius: 100%;
			padding: 4px;
			.layout-tips-box {
				transition: inherit;
				width: 30px;
				height: 30px;
				z-index: 9;
				border: 1px solid;
				border-color: var(--el-color-primary-light-5);
				border-radius: 100%;
				.layout-tips-txt {
					transition: inherit;
					position: relative;
					top: 5px;
					font-size: 12px;
					line-height: 1;
					letter-spacing: 2px;
					white-space: nowrap;
					color: var(--el-color-primary-light-5);
					text-align: center;
					transform: rotate(30deg);
					left: -1px;
					background-color: var(--next-color-seting-main);
					width: 32px;
					height: 17px;
					line-height: 17px;
				}
			}
		}
		.layout-tips-warp-active {
			border: 1px solid;
			border-color: var(--el-color-primary);
			.layout-tips-box {
				border: 1px solid;
				border-color: var(--el-color-primary);
				.layout-tips-txt {
					color: var(--el-color-primary) !important;
					background-color: var(--next-color-seting-main) !important;
				}
			}
		}
		&:hover {
			.el-circular {
				transition: all 0.3s ease-in-out;
				border: 1px solid;
				border-color: var(--el-color-primary);
			}
			.layout-tips-warp {
				transition: all 0.3s ease-in-out;
				border-color: var(--el-color-primary);
				.layout-tips-box {
					transition: inherit;
					border-color: var(--el-color-primary);
					.layout-tips-txt {
						transition: inherit;
						color: var(--el-color-primary) !important;
						background-color: var(--next-color-seting-main) !important;
					}
				}
			}
		}
	}
}
</style>
