<template>
	<div ref="container" class="filer-container">
		<split-pane :max-width="500" :default-width="260" split="vertical">
			<template #paneL>
				<div class="left-container">
					<el-form class="form-tool">
						<el-form-item class="padding-left-5">
							<el-input v-model="filterText" placeholder="搜索名称" prefix-icon="el-icon-search" class="search-input margin-right-5"> </el-input>
							<el-button title="刷新" class="btn-refresh" @click="treeRefresh">
								<i class="iconfont el-icon-yrt-zhongzhi2"></i>
							</el-button>
						</el-form-item>
						<el-form-item class="align-center">
							<!--数据tree-->
							<el-tree ref="tree" :data="treeList" :expand-on-click-node="false" :filter-node-method="filterTreeNode" :props="props" :default-expand-all="true" :current-node-key="currentData.path" node-key="path" @node-click="nodeClick">
								<template #default="{ node, data }">
									<span class="custom-tree-node" @mouseover="() => treeNodeOver(node, data)" @mouseout="() => treeNodeOut(node, data)">
										<span>
											<i v-if="data.children" class="el-icon-menu"></i>
											<i v-else class="el-icon-tickets"></i>
											{{ node.label }}
										</span>
										<!-- <span v-show="data.label==treeNodeOverId">
                      <el-button link size="small" @click="() => treeNodeAppend(node, data, 'samelevel')">
                        <i class="el-icon-yrt-tianjiajiahaowubiankuang" title="新建同级目录"></i>
                      </el-button>
                      <el-button link size="small" @click="() => treeNodeAppend(node, data, 'nextlevel')">
                        <i class="el-icon-circle-plus-outline" title="新建子级目录"></i>
                      </el-button>
                      <el-button link size="small" @click="() => treeNodeEdit(node, data)">
                        <i class="el-icon-edit-outline" title="修改目录"></i>
                      </el-button>
                      <el-button link size="small" @click="() => treeNodeRemove(node, data)">
                        <i class="el-icon-delete" title="删除目录"></i>
                      </el-button>
                    </span> -->
									</span>
								</template>
							</el-tree>
							<el-button v-if="!treeList.length" link @click="treeNodeAppend">新建文件夹</el-button>
						</el-form-item>
					</el-form>
				</div>
			</template>
			<!--右侧主区-->
			<template #paneR>
				<el-card shadow="hover" class="card-right">
					<div v-loading="loading" class="img-box">
						<component :is="currentData.path"></component>
					</div>
				</el-card>
			</template>
		</split-pane>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, getCurrentInstance, onMounted } from 'vue';
import splitPane from '/@/components/splitPane/index.vue';
import marketLink from './components/market-link.vue';
import marketingLink from './components/marketing-link.vue';
import topicLink from './components/topic-link.vue';

export default {
	name: 'filer',
	components: {
		splitPane,
		marketLink,
		marketingLink,
		topicLink,
	},
	props: {
		// 单选
		singleSelect: {
			type: Boolean,
			default: false,
		},
		// 预览模式
		isViewer: {
			type: Boolean,
			default: false,
		},
	},
	setup() {
		const { proxy } = getCurrentInstance() as any;

		//#region 变量
		const state: any = reactive({
			filterText: '',
			currentData: {
				label: '商城链接',
				path: 'market-link',
			}, // 当前选择目录
			// 鼠标滑过的ID
			treeNodeOverId: 0,
			props: {
				label: 'label',
				children: 'children',
			},
			// 文件夹列表
			treeList: [
				{
					label: '商城页面',
					children: [
						{ label: '商城链接', path: 'market-link' },
						{ label: '营销链接', path: 'marketing-link' },
						{ label: '专题页面', path: 'topic-link' },
					],
				},
				{
					label: '商品页面',
					children: [
						{ label: '商品分类', path: 'type-link' },
						{ label: '商品', path: 'product-link' },
						{ label: '秒杀商品', path: 'miaosha-link' },
						{ label: '砍价商品', path: 'kanjia-link' },
						{ label: '拼团商品', path: 'pintuan-link' },
						{ label: '积分商品', path: 'jifen-link' },
					],
				},
				{
					label: '文章页面',
					children: [{ label: '文章', path: 'article-link' }],
				},
				{ label: '自定义', children: [{ label: '自定义链接', path: 'custom-link' }] },
			],
			// 加载
			loading: false,
		});
		//#endregion

		//#region 方法
		let method = {
			// 搜索导航
			filterTreeNode(value: any, data: any) {
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			// 点击tree导航节点
			nodeClick(data: any) {
				proxy.currentData = data;
			},
			// 刷新tree
			treeRefresh() {
				proxy.filterText = '';
				var root = proxy.$refs.tree.store.root;
				while (root.childNodes.length) {
					proxy.$refs.tree.remove(root.childNodes[0]);
				}
				proxy.loadTreeNode(root, (data: any) => {
					root.doCreateChildren(data);
				});
				proxy.isTreeLoaded = false;
			},
			// 新建节点
			treeNodeAppend(node: any, data: any, level: any) {
				let title = level === 'samelevel' ? '新建同级目录' : '新建子级目录';
				proxy
					.$prompt('请输入新名称', title, {
						confirmButtonText: '确认',
						cancelButtonText: '取消',
					})
					.then(async ({ value }: { value: any }) => {})
					.catch((e: any) => {
						proxy.$message.success(`取消操作${e.message}`);
					});
			},
			// 编辑节点
			treeNodeEdit(node: any, data: any) {
				proxy
					.$prompt('请输入新名称', '修改文件夹', {
						confirmButtonText: '确认',
						cancelButtonText: '取消',
					})
					.then(async ({ value }: { value: any }) => {})
					.catch(() => {
						proxy.$message.success(`取消操作`);
					});
			},
			// 删除
			treeNodeRemove(node: any, data: any) {
				proxy
					.$confirm('确定要删除文件夹吗，文件夹内的文件也将删除', '删除文件夹', {
						confirmButtonText: '确认',
						cancelButtonText: '取消',
					})
					.then(async ({ value }: { value: any }) => {})
					.catch(() => {
						proxy.$message.success(`取消操作`);
					});
			},
			treeNodeOver(node: any, data: any) {
				proxy.treeNodeOverId = data.label;
			},
			treeNodeOut() {
				proxy.treeNodeOverId = -1;
			},
			// 选中文件
			selectItem(item: any) {},
			// 选中文件
			selectFile() {},
		};
		//#endregion

		onMounted(async () => {});

		return {
			...toRefs(state),
			...method,
		};
	},
};
</script>

<style lang="scss" scoped>
.filer-container {
	background-color: #f8f8f8;
}
.left-container {
	width: 100%;
	height: 100%;
	background-color: white;
	border-radius: 4px;
	border-radius: var(--border-radius);
	border: 1px solid var(--el-border-color-light);
	background-color: var(--el-color-white);

	.form-tool {
		padding-top: 10px;

		.el-form-item {
			padding: 0 0px;
		}

		.search-input {
			width: calc(100% - 48px);
		}

		.btn-refresh {
			padding: 10px 3px 10px 8px;
		}
	}

	:deep(.el-tree-node.is-current > .el-tree-node__content) {
		background-color: #a7ccf7;
		color: white;

		.el-button--text {
			color: white;
		}
	}

	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}
}

.card-right {
	:deep(.el-card__body) {
		padding: 0;
	}
	.right-tool {
		padding: 10px 10px 0;
	}
}
.card-footer {
	border-top: 1px solid var(--el-border-color-light);
	padding: 10px;
}
</style>
