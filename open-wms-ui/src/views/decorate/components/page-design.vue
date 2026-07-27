<template>
	<div class="right-container">
		<div class="app-container">
			<center-panel v-model:selectModule="selectModule" :app-config="appConfig" :is-viewer="true"></center-panel>
		</div>
		<div class="app-list">
			<el-row class="mb-4">
				<el-button type="primary" @click="addModule">添加模板</el-button>
				<el-button type="primary" @click="copyModule">复制模板</el-button>
				<el-button type="primary" @click="getAppDecorateList">刷新</el-button>
			</el-row>

			<el-table :data="tableData" stripe size="small" style="width: 100%" max-height="680px" @selection-change="handleSelectionChange">
				<el-table-column fixed type="selection" width="55" />
				<el-table-column prop="pageId" label="页面ID" width="70" />
				<el-table-column prop="decorateName" label="页面名称" width="140" />
				<el-table-column prop="pageName" label="模块名称" />
				<el-table-column prop="appName" label="app名称" width="80" />
				<el-table-column prop="orderNo" label="排序号" width="70" />
				<el-table-column prop="createDate" label="添加时间" width="160" header-align="center">
					<template #default="{ row }">
						{{ common.formatDate(row.createDate, 'YYYY-MM-DD HH:mm:ss') }}
					</template>
				</el-table-column>
				<el-table-column prop="modifyDate" label="更新时间" width="160" header-align="center">
					<template #default="{ row }">
						{{ common.formatDate(row.modifyDate, 'YYYY-MM-DD HH:mm:ss') }}
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="180" header-align="center">
					<template #default="{ row }">
						<el-button link size="small" @click="design(row)">编辑</el-button>
						<el-button link size="small">删除</el-button>
						<el-button v-if="!row.isDefault" link size="small" @click="setIsDefault(row)">设为首页</el-button>
						<el-button link size="small">预览</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!--新建模板对话框-->
		<el-dialog v-model="moduleDialogVisible" width="500px" append-to-body>
			<!--自定义对话框标题，可拖动-->
			<template #title>
				<div v-drag>新建模板</div>
			</template>
			<el-form ref="formRef" :model="appInfo" label-width="120px">
				<el-form-item label="appId">
					{{ appInfo.app_Id }}
				</el-form-item>
				<el-form-item label="app名称">
					{{ appInfo.appName }}
				</el-form-item>
				<el-form-item label="页面">
					{{ appInfo.moduleName }}
				</el-form-item>
				<el-form-item label="模板名称" required>
					<el-input v-model="appInfo.decorateName" class="w-300"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<div class="footer-left"></div>
					<div class="footer-right">
						<el-button @click="moduleDialogVisible = false">关闭</el-button>
						<el-button type="primary" @click="moduleSave">保存</el-button>
					</div>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance, computed, onMounted } from 'vue';
import centerPanel from './centerPanel.vue';

export default {
	name: 'components-home',
	components: {
		centerPanel,
	},
	props: {
		// 当前app信息
		appInfo: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	setup() {
		const { proxy } = getCurrentInstance() as any;
		const state = reactive({
			tableData: [],
			appDialogVisible: false,
			moduleDialogVisible: false,
			// app参数
			appConfig: {
				global: {
					pageId: 0,
					type: 'global',
					title: '页面设置',
					header: '易软通采购系统',
					decorateName: '默认模板',
					enable: 1,
				},
				modules: [],
			},
			// 选中项
			selectModule: {
				type: 'global',
			},
			multipleSelection: [], // 选中项
		});

		//#region 方法
		let methods = {
			// 选择事件
			handleSelectionChange(val: any) {
				proxy.multipleSelection = val;
			},
			// 跳转装修设计页面
			design(row: any) {
				window.open('/decorate/design?id=' + row.pageId);
			},
			// 加载app模板列表
			getAppDecorateList() {
				let userInfo = proxy.common.getUserInfo();
				let url = '/api/common/loadDataList';
				let where = {
					userProduct_Id: userInfo.userProduct_Id,
					app_Id: proxy.appInfo.app_Id,
					moduleName: proxy.appInfo.moduleName,
				};
				let orderBy = { orderNo: 'DESC', pageId: 'ASC' };
				let params = {
					tableView: 'App_Decorate',
					idField: 'pageId',
					folder: 'app/design',
					menu_Id: 2040,
					pageIndex: 1,
					pageSize: 50,
					where: where,
					orderBy: orderBy,
					select: ['pageId', 'app_Id', 'appName', 'moduleName', 'pageName', 'isDefault', 'decorateName', 'createDate', 'modifyDate', 'orderNo'],
				};
				proxy.common.ajax(
					url,
					params,
					(res: any) => {
						proxy.common.showMsg(res);
						if (res.result) {
							proxy.tableData = res.data.rows; // 获取列表数据
							if (proxy.tableData.length) {
								let row = proxy.tableData.find((item: any) => item.isDefault);
								if (row) {
									proxy.appConfig.global.pageId = row.pageId;
									proxy.decorateLoad();
								}
							}
						}
					},
					true
				);
			},
			selectApp(row: any) {
				proxy.appInfo = row;
				proxy.appDialogVisible = false;
			},
			// 新建模板
			addModule() {
				if (!proxy.appInfo?.app_Id) {
					proxy.$message.error('请选择app应用');
					return;
				}
				proxy.moduleDialogVisible = true;
			},
			// 复制模板
			copyModule() {
				if (!proxy.multipleSelection.length) {
					proxy.$message.error('至少选择一行');
					return;
				}
				proxy
					.$confirm('确定要复制选择项吗?', '复制操作', {
						confirmButtonText: '复制',
						cancelButtonText: '取消',
						type: 'warning',
					})
					.then(() => {
						let url = '/api/app/decorate/copyModule';
						let params = {
							ids: proxy.multipleSelection.map((m: any) => m.pageId),
						};
						proxy.common.ajax(
							url,
							params,
							(res: any) => {
								proxy.common.showMsg(res);
								if (res.result) {
									proxy.reload(); // 刷新页面数据
								}
							},
							true
						);
					})
					.catch(() => {
						proxy.$message('取消复制');
					});
			},
			// 保存模块
			moduleSave() {
				let url = '/api/app/decorate/addModuleSave';
				let params = proxy.appInfo;
				proxy.common.ajax(
					url,
					params,
					(res: any) => {
						proxy.common.showMsg(res);
						if (res.result) {
							proxy.getAppDecorateList();
							proxy.moduleDialogVisible = false;
						}
					},
					true
				);
			},
			// 设为默认页
			setIsDefault(row: any) {
				let url = '/api/app/decorate/setIsDefault';
				let params = row;
				proxy.common.ajax(
					url,
					params,
					(res: any) => {
						proxy.common.showMsg(res);
						if (res.result) {
							proxy.getAppDecorateList();
						}
					},
					true
				);
			},
			// 加载UI模板
			decorateLoad() {
				let pageId = proxy.appConfig.global.pageId;
				if (!pageId) {
					proxy.$message.error('模块ID不能为空');
					return;
				}
				let url = '/api/app/decorate/decorateLoad';
				let params = {
					pageId: pageId,
				};
				proxy.common.ajax(
					url,
					params,
					(res: any) => {
						proxy.common.showMsg(res);
						proxy.appConfig = JSON.parse(res.data.jsonData);
						proxy.selectModule = proxy.appConfig.global;
						proxy.appConfig.global.pageId = res.data.pageId;
					},
					false
				);
			},
			// 重新加载
			reload() {
				proxy.getAppDecorateList();
				proxy.decorateLoad();
			},
		};
		//#endregion

		onMounted(() => {
			proxy.getAppDecorateList();
			// proxy.decorateLoad();
		});

		return {
			...toRefs(state),
			...methods,
		};
	},
};
</script>

<style scoped lang="scss">
.right-container {
	display: flex;
	.app-container {
		width: 400px;
		padding: 5px;
		.app {
			border: 1px solid var(--el-border-color-light);
			height: 560px;
			border-radius: 5px;
		}
	}
	.app-list {
		padding: 5px;
		flex-grow: 1;
	}
}
</style>
