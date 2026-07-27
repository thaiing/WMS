<template>
	<div class="home-container">
		<el-card shadow="hover" header="店铺装修" class="card-container">
			<template #header>
				<div class="card-header">
					<span class="margin-right-10">店铺装修</span>
					<span class="margin-right-10">{{ appInfo.appName || '[请选择app模板]' }}</span>
					<el-button class="text-button" link @click="appDialogVisible = true">选择app应用</el-button>
				</div>
			</template>
			<split-pane :max-width="500" :default-width="220" split="vertical">
				<!--右侧主区-->
				<template #paneL>
					<el-menu active-text-color="#ffd04b" background-color="#fff" class="el-menu-vertical" default-active="1" text-color="#303133">
						<el-menu-item index="1" @click="changeMenu('pageDesign', '商城首页')">
							<span>商城首页</span>
						</el-menu-item>
						<el-menu-item index="2" @click="changeMenu('productType', '商品分类')">
							<span>商品分类</span>
						</el-menu-item>
						<el-menu-item index="3" @click="changeMenu('pageDesign', '个人中心')">
							<span>个人中心</span>
						</el-menu-item>
					</el-menu>
				</template>

				<!--右侧主区-->
				<template #paneR>
					<component ref="dynamicCom" :is="appInfo.componentName" :app-info="appInfo"></component>
				</template>
			</split-pane>
		</el-card>

		<!--选择app-->
		<el-dialog v-model="appDialogVisible" width="900px">
			<!--自定义对话框标题，可拖动-->
			<template #title>
				<div v-drag>app选择器</div>
			</template>
			<div class="app-list">
				<el-table :data="appList" stripe style="width: 100%">
					<el-table-column fixed prop="app_Id" label="appId" width="80" />
					<el-table-column prop="appName" label="app名称" />
					<el-table-column prop="consignorName" label="门店名称" />
					<el-table-column prop="modifyDate" label="更新时间" />
					<el-table-column fixed="right" label="操作" width="80" align="center" header-align="center">
						<template #default="{ row }">
							<el-button link size="small" @click="selectApp(row)">选择</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<div class="footer-left"></div>
					<div class="footer-right">
						<el-button @click="appDialogVisible = false">关闭</el-button>
					</div>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance, computed, onMounted } from 'vue';
import splitPane from '/@/components/splitPane/index.vue';
import centerPanel from './components/centerPanel.vue';
import pageDesign from './components/page-design.vue';
import productType from './components/product-type.vue';

export default {
	name: 'funCountup',
	components: {
		splitPane, // 分割器
		centerPanel,
		pageDesign,
		productType,
	},
	setup() {
		const { proxy } = getCurrentInstance() as any;
		const state = reactive({
			tableData: [],
			appList: [], // app列表
			appDialogVisible: false,
			appInfo: {
				appName: '',
				componentName: 'pageDesign', // 右侧动态组件名
				moduleName: '商城首页', // 模块类别
			}, // 当前app信息
		});

		//#region 方法
		let methods = {
			design(row: any) {
				window.open('/decorate/design?id=' + row.pageId);
			},
			// 加载app列表
			getAppList() {
				let url = '/api/common/loadDataList';
				let where = {};
				let orderBy = { app_Id: 'ASC' };
				let params = {
					tableView: 'App_List',
					idField: 'app_Id',
					folder: 'app/design',
					menu_Id: 2040,
					pageIndex: 1,
					pageSize: 50,
					where: where,
					orderBy: orderBy,
					select: ['app_Id', 'appName', 'consignorName', 'createDate', 'modifyDate'],
				};
				proxy.common.ajax(
					url,
					params,
					(res: any) => {
						proxy.common.showMsg(res);
						if (res.result) {
							proxy.appList = res.data.rows; // 获取列表数据
							if (proxy.appList.length) {
								proxy.appInfo = Object.assign(proxy.appList[0], proxy.appInfo);
							}
						}
					},
					true
				);
			},
			selectApp(row: any) {
				proxy.appInfo = Object.assign(row, proxy.appInfo);
				proxy.appDialogVisible = false;
			},
			// 切换左侧导航
			changeMenu(componentName: string, moduleName: string) {
				// 组件已加载，重新刷新数据
				if (proxy.$refs.dynamicCom.reload && proxy.appInfo.componentName === componentName) {
					proxy.appInfo.componentName = componentName;
					proxy.appInfo.moduleName = moduleName;
					proxy.$refs.dynamicCom.reload();
				} else {
					proxy.appInfo.componentName = componentName;
					proxy.appInfo.moduleName = moduleName;
				}
			},
		};
		//#endregion

		onMounted(() => {
			proxy.getAppList();
		});

		return {
			...toRefs(state),
			...methods,
		};
	},
};
</script>

<style scoped lang="scss">
.card-header {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}
.card-container {
	:deep(.el-card__body) {
		padding: 0px;
	}
	.el-menu-vertical {
		width: 100%;
	}
	:deep(.splitter-paneL) {
		border-right: 1px solid #ebeef5 !important;
	}

	.el-menu-item {
		color: rgb(100, 100, 100);
		&.is-active {
			color: var(--color-primary);
			background-color: var(--color-primary-light-9);
			border-right: 2px solid var(--color-primary-light-2);
		}
	}
	.el-menu-item:hover,
	.el-sub-menu__title:hover {
		background-color: var(--color-primary-light-6) !important;
	}
}
</style>
