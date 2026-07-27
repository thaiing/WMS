<template>
	<el-dialog v-model="currentDialogVisible" :top="common.getDialogTop()" title="应用列表" class="dialog-container" width="1280px" draggable overflow append-to-body>
		<div class="fx-solution-center-wrapper">
			<div class="solution-center-pc">
				<div class="search-wrapper">
					<div class="center-navigation">
						<div class="navigation-container contain">
							<div class="nav-list">
								<span class="nav-item selected" cate="all">全部场景</span>
								<span class="nav-item" cate="inventory">WMS</span>
								<span class="nav-item" cate="crm">AGV/RGV</span>
								<span class="nav-item" cate="crm">智慧园区</span>
								<span class="nav-item" cate="production">MES</span>
								<span class="nav-item" cate="hr">ERP</span>
								<span class="nav-item" cate="audit">物流/调度</span>
								<span class="nav-item" cate="asset_equipment">设备/巡检</span>
								<span class="nav-item" cate="store">多门店连锁</span>
								<span class="nav-item" cate="supplier">溯源</span>
								<span class="nav-item" cate="supplier">冷链/危化</span>
							</div>
							<div class="search-block">
								<div class="input-wrapper"><input class="search-input" id="solution-search-input" value="" placeholder="按Enter确认搜索" /><i class="iconfont icon-delete keyword-search-close disabled" onclick="handleClearSearchInput()"></i></div>
								<span class="input-prefix" id="input-prefix">
									<svg-icon name="ele-Search" :size="14"></svg-icon>
								</span>
							</div>
						</div>
					</div>
				</div>
				<div id="solution-center-index" style="display: none">
					<div class="topic-solution main-contain">
						<div class="topic-body">
							<div class="solution-header">
								<div class="solution-title">精选专题</div>
								<a class="all-solution-btn" href="/index/topic_center" target="_blank">查看全部</a>
							</div>
							<div class="topic-contain">
								<a class="topic-item" href="/index/topic_center/18848" target="_blank"
									><img class="bg-img" src="https://help-assets.jiandaoyun.com/d8cd3d75-b5ec-480d-8423-8deffd46d864" alt="专题背景" />
									<div class="topic-info">
										<div class="name">HRM一体化人事管理系统</div>
										<div class="description">简道云为企业提供了一体化的HRM人事管理系统，可轻松实现人事业务的全流程跟踪与管理，帮助企业打造更高效的人事管理体系。</div>
									</div>
								</a>
								<a class="topic-item" href="/index/topic_center/18661" target="_blank"
									><img class="bg-img" src="https://help-assets.jiandaoyun.com/adb69a64-7339-4b9e-87c9-55fa782732a2" alt="专题背景" />
									<div class="topic-info">
										<div class="name">「生产小工单」超轻量应用发布！</div>
										<div class="description">生产小工单是一款简道云官方自主设计的超轻量应用，5 分钟上手，3 小时落地，轻松实现生产任务敏捷管理</div>
									</div></a
								>
							</div>
						</div>
					</div>
					<div class="category-solution main-contain">
						<div class="solution-body">
							<div class="solution-header">
								<div class="solution-title">进销存/仓库</div>
								<a class="all-solution-btn" data="进销存/仓库" href="/index/solution_center/cate?category=inventory">查看全部</a>
							</div>
							<div class="solution-list">
								<a class="center-template-item" href="javascript:;">
									<div class="template-info">
										<ul class="item-labels">
											<li class="label blue">官方</li>
											<li class="label red">热门</li>
										</ul>
										<div class="item-img"><img src="https://help-assets.jiandaoyun.com/6dac3627-6916-4a26-b64d-751e24a3e0cc" alt="" /></div>
										<div class="template-des">
											<div class="description">更强自定义的标准 进销存 系统</div>
											<div class="bottom">
												<div class="tags">
													<span class="tag">仓库</span>
													<span class="tag">采购</span>
													<span class="tag">销售</span>
												</div>
												<span class="install-count"><i class="iconfont icon-install"></i><span>62107</span></span>
											</div>
										</div>
									</div>
								</a>
								<a class="center-template-item" href="javascript:;">
									<div class="template-info">
										<ul class="item-labels">
											<li class="label blue">官方</li>
											<li class="label red">热门</li>
										</ul>
										<div class="item-img"><img src="https://help-assets.jiandaoyun.com/1875033b-bfcd-4d27-a36d-9a1d9fcad73b" alt="" /></div>
										<div class="template-des">
											<div class="description">开箱即用的 仓库管理 系统</div>
											<div class="bottom">
												<div class="tags">
													<span class="tag">库存</span>
													<span class="tag">盘点</span>
													<span class="tag">调拨</span>
												</div>
												<span class="install-count"><i class="iconfont icon-install"></i><span>13578</span></span>
											</div>
										</div>
									</div>
								</a>
								<a class="center-template-item" href="javascript:;">
									<div class="template-info">
										<ul class="item-labels">
											<li class="label blue">官方</li>
											<li class="label red">热门</li>
										</ul>
										<div class="item-img"><img src="https://help-assets.jiandaoyun.com/2afd7a27-e087-48b3-9db4-7abbcca66e90" alt="" /></div>
										<div class="template-des">
											<div class="description">财务现结模式，开箱即用 进销存 系统</div>
											<div class="bottom">
												<div class="tags">
													<span class="tag">仓库</span>
													<span class="tag">采购</span>
													<span class="tag">销售</span>
												</div>
												<span class="install-count"><i class="iconfont icon-install"></i><span>12746</span></span>
											</div>
										</div>
									</div>
								</a>
								<a class="center-template-item" href="javascript:;">
									<div class="template-info">
										<ul class="item-labels">
											<li class="label blue">官方</li>
											<li class="label red">热门</li>
										</ul>
										<div class="item-img"><img src="https://help-assets.jiandaoyun.com/3f9782af-f0ab-4e2f-8075-b5d39429b234" alt="" /></div>
										<div class="template-des">
											<div class="description">财务赊销模式，开箱即用 进销存 系统</div>
											<div class="bottom">
												<div class="tags">
													<span class="tag">仓库</span>
													<span class="tag">采购</span>
													<span class="tag">销售</span>
												</div>
												<span class="install-count"><i class="iconfont icon-install"></i><span>7345</span></span>
											</div>
										</div>
									</div></a
								>
							</div>
						</div>
						<div class="solution-body">
							<div class="solution-header">
								<div class="solution-title">客户/销售</div>
								<a class="all-solution-btn" data="客户/销售" href="/index/solution_center/cate?category=crm">查看全部</a>
							</div>
							<div class="solution-list">
								<a class="center-template-item" href="javascript:;">
									<div class="template-info">
										<ul class="item-labels">
											<li class="label blue">官方</li>
											<li class="label red">热门</li>
										</ul>
										<div class="item-img"><img src="https://help-assets.jiandaoyun.com/bf4bb156-179b-4691-bc3d-15cb554581ab" alt="" /></div>
										<div class="template-des">
											<div class="description">更强自定义的标准 CRM 客户管理系统</div>
											<div class="bottom">
												<div class="tags"><span class="tag">CRM</span></div>
												<span class="install-count"><i class="iconfont icon-install"></i><span>5021</span></span>
											</div>
										</div>
									</div>
								</a>
								<a class="center-template-item" href="javascript:;">
									<div class="template-info">
										<ul class="item-labels">
											<li class="label blue">官方</li>
											<li class="label red">热门</li>
										</ul>
										<div class="item-img"><img src="https://help-assets.jiandaoyun.com/3f6c4d0b-a2dc-4a48-a8e6-13c86390103a" alt="" /></div>
										<div class="template-des">
											<div class="description">面向 制造业/软高科 行业的更强自定义 CRM 客户管理系统</div>
											<div class="bottom">
												<div class="tags"><span class="tag">CRM</span></div>
												<span class="install-count"><i class="iconfont icon-install"></i><span>1002</span></span>
											</div>
										</div>
									</div>
								</a>
								<a class="center-template-item" href="javascript:;">
									<div class="template-info">
										<ul class="item-labels">
											<li class="label blue">官方</li>
											<li class="label red">热门</li>
										</ul>
										<div class="item-img"><img src="https://help-assets.jiandaoyun.com/f747e945-d4e1-4526-8a6f-1690067755b9" alt="" /></div>
										<div class="template-des">
											<div class="description">灵活自定义的 销售管理 系统</div>
											<div class="bottom">
												<div class="tags"><span class="tag">销售</span></div>
												<span class="install-count"><i class="iconfont icon-install"></i><span>3215</span></span>
											</div>
										</div>
									</div>
								</a>
								<a class="center-template-item" href="javascript:;">
									<div class="template-info">
										<ul class="item-labels">
											<li class="label blue">官方</li>
											<li class="label red">热门</li>
										</ul>
										<div class="item-img"><img src="https://help-assets.jiandaoyun.com/4bb197f4-71cd-4d3f-a692-adea6be7c293" alt="" /></div>
										<div class="template-des">
											<div class="description">一款轻量级订单管理 CRM 套件</div>
											<div class="bottom">
												<div class="tags"><span class="tag">CRM</span></div>
												<span class="install-count"><i class="iconfont icon-install"></i><span>3033</span></span>
											</div>
										</div>
									</div></a
								>
							</div>
						</div>
						<div class="solution-body">
							<div class="solution-header">
								<div class="solution-title">ERP/生产</div>
								<a class="all-solution-btn" data="ERP/生产" href="/index/solution_center/cate?category=production">查看全部</a>
							</div>
							<div class="solution-list">
								<a class="center-template-item" href="javascript:;">
									<div class="template-info">
										<ul class="item-labels">
											<li class="label blue">官方</li>
											<li class="label red">热门</li>
										</ul>
										<div class="item-img"><img src="https://help-assets.jiandaoyun.com/a5581235-b361-446c-8814-9f50bd91e4c7" alt="" /></div>
										<div class="template-des">
											<div class="description">面向离散制造、按单定制生产、长交货期生产模式企业的专用 ERP 系统</div>
											<div class="bottom">
												<div class="tags">
													<span class="tag">ERP</span>
													<span class="tag">BOM</span>
													<span class="tag">生产</span>
												</div>
												<span class="install-count"><i class="iconfont icon-install"></i><span>21044</span></span>
											</div>
										</div>
									</div>
								</a>
								<a class="center-template-item" href="javascript:;">
									<div class="template-info">
										<ul class="item-labels">
											<li class="label blue">官方</li>
											<li class="label red">热门</li>
										</ul>
										<div class="item-img"><img src="https://help-assets.jiandaoyun.com/c4bedd74-618c-485a-afcd-cfc6f15cea91" alt="" /></div>
										<div class="template-des">
											<div class="description">面向流程制造、按单定制生产、长交货期生产模式企业的专用 ERP 系统</div>
											<div class="bottom">
												<div class="tags">
													<span class="tag">ERP</span>
													<span class="tag">BOM</span>
													<span class="tag">生产</span>
												</div>
												<span class="install-count"><i class="iconfont icon-install"></i><span>8532</span></span>
											</div>
										</div>
									</div>
								</a>
								<a class="center-template-item" href="javascript:;">
									<div class="template-info">
										<ul class="item-labels">
											<li class="label blue">官方</li>
											<li class="label red">热门</li>
										</ul>
										<div class="item-img"><img src="https://help-assets.jiandaoyun.com/aa3f9e62-4e01-441b-b403-97a1ad36e6f7" alt="" /></div>
										<div class="template-des">
											<div class="description">面向离散制造、按单装配型、短交货期生产模式企业的专用 ERP 系统</div>
											<div class="bottom">
												<div class="tags">
													<span class="tag">ERP</span>
													<span class="tag">BOM</span>
													<span class="tag">生产</span>
												</div>
												<span class="install-count"><i class="iconfont icon-install"></i><span>11352</span></span>
											</div>
										</div>
									</div>
								</a>
								<a class="center-template-item" href="javascript:;">
									<div class="template-info">
										<ul class="item-labels">
											<li class="label blue">官方</li>
											<li class="label red">热门</li>
										</ul>
										<div class="item-img"><img src="https://help-assets.jiandaoyun.com/768f2f15-5d1d-46da-b4f6-1a9dec23fc5c" alt="" /></div>
										<div class="template-des">
											<div class="description">面向流程制造、标品 按库存生产、短交货期生产模式企业的专用 ERP 系统</div>
											<div class="bottom">
												<div class="tags">
													<span class="tag">ERP</span>
													<span class="tag">BOM</span>
													<span class="tag">生产</span>
												</div>
												<span class="install-count"><i class="iconfont icon-install"></i><span>8233</span></span>
											</div>
										</div>
									</div></a
								>
							</div>
						</div>
					</div>
				</div>
				<div id="solution-center-result" style="display: block">
					<div class="main-contain">
						<div class="result-count">
							<div>筛选出<span class="count">50</span>个模板</div>
							<div class="sort-block">
								<div class="sort-value"><span class="cate-name">默认排序</span><i class="iconfont icon-cate-select icon-arrow-down cate-select-show"></i></div>
								<div class="dropdown-list">
									<div class="dropdown-item selected" data-key="rank">默认排序</div>
									<div class="dropdown-item" data-key="install_count">安装量</div>
									<div class="dropdown-item" data-key="like_count">点赞量</div>
								</div>
							</div>
						</div>
						<div class="category-result">
							<template v-for="(item, index) in state.packageList">
								<div class="center-template-item" @click="selectItem(item)">
									<div :class="['template-info', state.currentItem === item ? 'active' : '']">
										<ul class="item-labels">
											<li v-if="item.official" class="label blue">官方</li>
											<li v-if="item.hot" class="label red">热门</li>
										</ul>
										<div :class="['item-img-box', 'bg-image' + (index % 5)]">
											<div class="item-title">{{ item.packageName }}</div>
											<img class="item-img" :src="item.packageImage" alt="" @error="(e:any)=> e.target.src = state.defaultImg" />
										</div>
										<div class="template-des">
											<div class="description">{{ item.remark }}</div>
											<div class="bottom">
												<div v-if="item.tags" class="tags">
													<template v-for="(tag, index) in item.tags.split(',')">
														<span class="tag">{{ tag }}</span>
													</template>
												</div>
												<span class="install-count" title="使用次数">
													<svg-icon name="icon-zan1"></svg-icon>
													<span>{{ item.frequency || 1 }}</span>
												</span>
											</div>
										</div>
									</div>
								</div>
							</template>
						</div>
						<div id="search-empty" style="display: none">
							<div class="solution-empty">
								<img class="empty-img" src="https://blog-assets.jiandaoyun.com/v319/index/empty_img.png" alt="搜索为空" />
								<p class="empty-tip">没找到相关内容</p>
								<a class="back-home" href="/index/solution_center" target="_blank">回到首页</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<template #footer>
			<span class="flex-end">
				<el-button @click="currentDialogVisible = false">取 消</el-button>
				<el-dropdown :loading="state.isLoading" split-button type="primary" @click="useApp('all')" @command="useApp">
					安装应用及数据
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item command="onlyApp">仅安装应用</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="app-list-dialog">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy: BaseProperties = ins.proxy as BaseProperties;
// 事件定义
const emit = defineEmits(['update:visible', 'on-closed']);
import { DataType, OrderByType, OrderItem, QueryBo, QueryType } from '/@/types/common';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';

//#region 定义属性
const props = defineProps({
	// 是否显示
	visible: {
		type: Boolean,
		default: false,
	},
});
//#endregion

//#region 定义变量
const state = reactive({
	// 当前选中菜单下的导出模板列表
	vueDataList: [],
	// 当前选中模板
	currentTemplate: {},
	isLoading: false,
	packageList: [] as any[],
	defaultImg: 'https://auod-beijing.oss-cn-beijing.aliyuncs.com/wms/dijing/packageface01.png',
	currentItem: null as any,
});
//#endregion

//#region 计算属性
// 显示窗口
const currentDialogVisible = computed({
	get() {
		return props.visible;
	},
	set(val) {
		emit('update:visible', val);
	},
});
//#endregion

onMounted(() => {
	getPackageList();
});

// 获取套餐列表
const getPackageList = async () => {
	// 查询条件
	let queryBoList: Array<QueryBo> = [
		{
			column: 'status',
			values: 1,
			queryType: QueryType.EQ,
			dataType: DataType.BYTE,
		},
	];

	let url = '/system/tenant/tenantPackage/getMapList';
	let params = queryBoList;

	const [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}

	if (res.result) {
		state.packageList = res.data.map((m: any) => {
			if (m.packageImage) {
				m.packageImage = JSON.parse(m.packageImage)[0].url;
			} else {
				m.packageImage = '';
			}
			return m;
		});
	}
};

// 选中当前项
const selectItem = (item: any) => {
	state.currentItem = item;
};

// 申请app
const useApp = async (command: any) => {
	let url = '/system/tenant/tenantPackage/useApp';
	let params = {
		packageId: state.currentItem.packageId,
		command: command,
	};

	const [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}

	if (res.result) {
		emit('on-closed'); // 关闭事件
		currentDialogVisible.value = false;
	}
};
</script>

<style lang="scss">
.dialog-container {
	position: relative;
	.el-dialog__body {
		padding: 0px !important;
		padding-bottom: 10px !important;
	}
}

.fx-solution-center-wrapper {
	background: #fff;
}

.fx-solution-center-wrapper .contain {
	height: 100%;
	margin: 0 auto;
	width: 1200px;
}

.fx-solution-center-wrapper .main-contain {
	height: 100%;
	margin: 0 auto;
	width: 1220px;
}

.fx-solution-center-wrapper .solution-center-mobile {
	display: none;
}

.fx-solution-center-wrapper .solution-center-pc {
	display: block;
}

.fx-solution-center-wrapper .search-wrapper {
	background: #fff;
	position: -webkit-sticky;
	position: sticky;
	z-index: 10;
}

.fx-solution-center-wrapper .center-navigation {
	background: #f4f6f9;
	height: 64px;
	padding-top: 8px;
	width: 100%;
}

.fx-solution-center-wrapper .center-navigation .navigation-container {
	-webkit-box-pack: justify;
	-ms-flex-pack: justify;
	-webkit-justify-content: space-between;
	justify-content: space-between;
}

.fx-solution-center-wrapper .center-navigation .navigation-container,
.fx-solution-center-wrapper .center-navigation .navigation-container .nav-list {
	-webkit-box-align: center;
	-ms-flex-align: center;
	-webkit-align-items: center;
	align-items: center;
	display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
}

.fx-solution-center-wrapper .center-navigation .navigation-container .nav-list {
	-webkit-box-flex: 1;
	-webkit-flex: auto;
	-ms-flex: auto;
	flex: auto;
	height: 100%;
}

.fx-solution-center-wrapper .center-navigation .navigation-container .nav-list .nav-item {
	color: #141e31;
	cursor: pointer;
	font-size: 16px;
	height: 100%;
	line-height: 56px;
	margin-right: 24px;
	position: relative;
	text-align: center;
}

.fx-solution-center-wrapper .center-navigation .navigation-container .nav-list .nav-item:after {
	background: #00c29a;
	bottom: 0;
	content: '';
	height: 3px;
	left: 0;
	opacity: 0;
	position: absolute;
	width: 100%;
}

.fx-solution-center-wrapper .center-navigation .navigation-container .nav-list .nav-item.selected,
.fx-solution-center-wrapper .center-navigation .navigation-container .nav-list .nav-item:hover {
	color: #00c29a;
	-webkit-transition: all 0.2s linear;
	transition: all 0.2s linear;
}

.fx-solution-center-wrapper .center-navigation .navigation-container .nav-list .nav-item.selected:after {
	opacity: 1;
}

.fx-solution-center-wrapper .center-navigation .navigation-container .search-block {
	-webkit-box-align: center;
	-ms-flex-align: center;
	-webkit-box-pack: justify;
	-ms-flex-pack: justify;
	-webkit-align-items: center;
	align-items: center;
	background: #fff;
	border-radius: 3px;
	display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	height: 32px;
	-webkit-justify-content: space-between;
	justify-content: space-between;
	width: 200px;
}

.fx-solution-center-wrapper .center-navigation .navigation-container .search-block:hover {
	border-color: #00c29a;
}

.fx-solution-center-wrapper .center-navigation .navigation-container .search-block .input-wrapper {
	-webkit-box-pack: justify;
	-ms-flex-pack: justify;
	-webkit-box-align: center;
	-ms-flex-align: center;
	-webkit-align-items: center;
	align-items: center;
	border: 1px solid #ddd;
	border-radius: 4px 0 0 4px;
	border-right: none;
	display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	height: 100%;
	-webkit-justify-content: space-between;
	justify-content: space-between;
	padding: 0 12px;
	width: 160px;
}

.fx-solution-center-wrapper .center-navigation .navigation-container .search-block .input-prefix {
	-webkit-box-align: center;
	-ms-flex-align: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	-webkit-align-items: center;
	align-items: center;
	background: #00c29a;
	border-radius: 0 4px 4px 0;
	cursor: pointer;
	display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	height: 100%;
	-webkit-justify-content: center;
	justify-content: center;
	width: 40px;
}

.fx-solution-center-wrapper .center-navigation .navigation-container .search-block .input-prefix i {
	color: #fff;
	font-size: 15px;
}

.fx-solution-center-wrapper .center-navigation .navigation-container .search-block .search-input {
	color: #141e31;
	font-size: 14px;
	width: 125px;
	background: transparent;
	background: none;
	border: 0;
	font-size: 100%;
	margin: 0;
	outline: 0;
	outline: none;
	padding: 0;
	vertical-align: middle;

	&:focus {
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		-webkit-user-modify: read-write-plaintext-only;
		outline: none;
	}

	&::-ms-clear,
	&::-ms-reveal {
		display: none;
	}
}

.fx-solution-center-wrapper .center-navigation .navigation-container .search-block .search-input::-webkit-input-placeholder {
	color: #b5b8be;
}

.fx-solution-center-wrapper .center-navigation .navigation-container .search-block .icon-delete {
	color: #838892;
	cursor: pointer;
	font-size: 15px;
}

.fx-solution-center-wrapper .center-navigation .navigation-container .search-block .icon-delete.disabled {
	display: none;
}

.fx-solution-center-wrapper .center-navigation .navigation-container .search-block .icon-delete:hover {
	color: #00c29a;
}

.fx-solution-center-wrapper .solution-header {
	-webkit-box-align: center;
	-ms-flex-align: center;
	-webkit-box-pack: justify;
	-ms-flex-pack: justify;
	-webkit-align-items: center;
	align-items: center;
	display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	-webkit-justify-content: space-between;
	justify-content: space-between;
	margin-bottom: 20px;
	padding: 0 10px;
}

.fx-solution-center-wrapper .solution-header.quality-header {
	margin-bottom: 10px;
}

.fx-solution-center-wrapper .solution-header .solution-title {
	color: #141e31;
	font-size: 24px;
	font-weight: 500;
	line-height: 32px;
}

.fx-solution-center-wrapper .solution-header .all-solution-btn,
.fx-solution-center-wrapper .solution-header .more-btn {
	-webkit-box-align: center;
	-ms-flex-align: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	-webkit-align-items: center;
	align-items: center;
	color: #00c29a;
	cursor: pointer;
	display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	font-size: 16px;
	-webkit-justify-content: center;
	justify-content: center;
}

.fx-solution-center-wrapper .solution-header .all-solution-btn .iconfont,
.fx-solution-center-wrapper .solution-header .more-btn .iconfont {
	font-size: 22px;
}

.fx-solution-center-wrapper .solution-header .all-solution-btn .iconfont.icon-arrow-down,
.fx-solution-center-wrapper .solution-header .more-btn .iconfont.icon-arrow-down {
	font-size: 20px;
}

.fx-solution-center-wrapper .solution-header .all-solution-btn:hover,
.fx-solution-center-wrapper .solution-header .more-btn:hover {
	color: #56cac1;
}

.fx-solution-center-wrapper .result-count {
	-webkit-box-align: center;
	-ms-flex-align: center;
	-webkit-box-pack: space-between;
	-ms-flex-pack: space-between;
	-webkit-align-items: center;
	align-items: center;
	color: #141e31;
	display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	font-size: 20px;
	font-weight: 500;
	-webkit-justify-content: space-between;
	justify-content: space-between;
	line-height: 28px;
	margin-bottom: 16px;
	padding: 10px 10px 0;
}

.fx-solution-center-wrapper .result-count .count {
	margin: 0 10px;
}

.fx-solution-center-wrapper .result-count .sort-block {
	-webkit-box-align: center;
	-ms-flex-align: center;
	-webkit-box-pack: justify;
	-ms-flex-pack: justify;
	-webkit-align-items: center;
	align-items: center;
	background: #fff;
	border: 1px solid #d7d9dc;
	border-radius: 3px;
	color: #141e31;
	cursor: pointer;
	display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	font-size: 14px;
	font-weight: 400;
	height: 32px;
	-webkit-justify-content: space-between;
	justify-content: space-between;
	line-height: 30px;
	position: relative;
	-webkit-transition: border 0.2s ease;
	transition: border 0.2s ease;
	width: 160px;
}

.fx-solution-center-wrapper .result-count .sort-block:hover {
	border-color: #00c29a;
}

.fx-solution-center-wrapper .result-count .sort-block:hover i {
	color: #00c29a;
}

.fx-solution-center-wrapper .result-count .sort-block .sort-value {
	-webkit-box-flex: 1;
	-webkit-box-align: center;
	-ms-flex-align: center;
	-webkit-box-pack: justify;
	-ms-flex-pack: justify;
	-webkit-align-items: center;
	align-items: center;
	display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	-webkit-flex: 1;
	-ms-flex: 1;
	flex: 1;
	-webkit-justify-content: space-between;
	justify-content: space-between;
	padding: 0 8px;
}

.fx-solution-center-wrapper .result-count .sort-block .cate-name {
	font-size: 14px;
	margin-right: 6px;
}

.fx-solution-center-wrapper .result-count .sort-block .icon-close-o {
	color: #91a1b7;
	cursor: pointer;
	display: none;
	font-size: 15px;
}

.fx-solution-center-wrapper .result-count .sort-block .icon-close-o:hover {
	color: #00c29a;
}

.fx-solution-center-wrapper .result-count .sort-block.active .dropdown-list {
	display: inline-block;
}

.fx-solution-center-wrapper .result-count .sort-block .dropdown-list {
	background: #fff;
	border-radius: 3px;
	-webkit-box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
	box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
	display: none;
	left: 0;
	padding: 4px;
	position: absolute;
	top: 40px;
	width: 100%;
	z-index: 1;
}

.fx-solution-center-wrapper .result-count .sort-block .dropdown-list .dropdown-item {
	border-radius: 3px;
	padding: 0 5px;
}

.fx-solution-center-wrapper .result-count .sort-block .dropdown-list .dropdown-item:hover {
	background: #edeff3;
}

.fx-solution-center-wrapper .result-count .sort-block .dropdown-list .dropdown-item.selected {
	background: #00c29a;
	color: #fff;
}

.fx-solution-center-wrapper .topic-contain {
	-webkit-box-pack: justify;
	-ms-flex-pack: justify;
	display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	-webkit-justify-content: space-between;
	justify-content: space-between;
	padding: 0 10px 40px;
	width: 100%;
}

.fx-solution-center-wrapper .topic-contain .topic-item {
	background: #eaf3fe;
	border: 1px solid #ebecee;
	border-radius: 8px;
	-webkit-box-shadow: 0 6px 18px 2px rgba(0, 0, 0, 0.06);
	box-shadow: 0 6px 18px 2px rgba(0, 0, 0, 0.06);
	height: 200px;
	overflow: hidden;
	padding: 40px;
	position: relative;
	-webkit-transition: all 0.3s linear;
	transition: all 0.3s linear;
	width: 49%;
	z-index: 1;
}

.fx-solution-center-wrapper .topic-contain .topic-item .bg-img {
	bottom: 0;
	height: 100%;
	position: absolute;
	right: 0;
	top: 0;
	width: auto;
	z-index: -1;
}

.fx-solution-center-wrapper .topic-contain .topic-item .topic-info .name {
	border-radius: 3px;
	color: #141e31;
	font-size: 20px;
	font-weight: 500;
	line-height: 28px;
	margin-bottom: 12px;
	max-width: 280px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.fx-solution-center-wrapper .topic-contain .topic-item .topic-info .description {
	word-wrap: break-word;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	color: #525967;
	display: -webkit-box;
	font-size: 14px;
	line-height: 24px;
	max-width: 280px;
	overflow: hidden;
	text-overflow: ellipsis;
	word-break: break-all;
	word-break: break-word;
}

.fx-solution-center-wrapper .topic-contain .topic-item:hover {
	-webkit-box-shadow: 0 15px 30px 0 rgba(16, 20, 40, 0.1);
	box-shadow: 0 15px 30px 0 rgba(16, 20, 40, 0.1);
	-webkit-transform: translateY(-6px);
	transform: translateY(-6px);
}

.fx-solution-center-wrapper .category-result,
.fx-solution-center-wrapper .solution-list {
	-webkit-box-align: center;
	-ms-flex-align: center;
	-webkit-align-items: center;
	align-items: center;
	display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	-webkit-flex-wrap: wrap;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap;
	height: auto;
	padding-bottom: 40px;
}

.fx-solution-center-wrapper .category-result {
	padding: 0;
}

.fx-solution-center-wrapper .center-template-item {
	cursor: pointer;
	height: auto;
	margin-bottom: 20px;
	padding: 0 10px;
	width: 25%;
}

.fx-solution-center-wrapper .center-template-item .template-info {
	background: #fff;
	border: 1px solid #e9e9e9;
	border-radius: 8px;
	-webkit-box-shadow: 0 5px 20px -5px rgba(34, 31, 100, 0.06);
	box-shadow: 0 5px 20px -5px rgba(34, 31, 100, 0.06);
	height: 100%;
	overflow: hidden;
	position: relative;
	-webkit-transition: all 0.3s linear;
	transition: all 0.3s linear;
	width: 100%;
	&.active {
		border: 1px solid #5c00c5;
	}
	&.active::after {
		content: '√';
		position: absolute;
		right: 0;
		bottom: 0;
		width: 20px;
		height: 20px;
		background-color: #5c00c5;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.item-img-box {
		position: relative;
		height: 180px;
		width: 100%;
		background-image: linear-gradient(115deg, rgba(0, 127, 255, 0.8) 0px, rgba(0, 127, 255, 0.3) 50%, rgba(0, 127, 255, 0) 100%);
		&.bg-image0 {
			background-image: linear-gradient(115deg, rgba(143, 53, 255, 0.4) 0px, rgba(143, 53, 255, 0.25) 50%, rgba(143, 53, 255, 0) 100%);
		}
		&.bg-image1 {
			background-image: linear-gradient(115deg, rgb(0 150 136 / 81%) 0px, rgb(0 150 136 / 35%) 50%, rgba(143, 53, 255, 0) 100%);
		}
		&.bg-image2 {
			background-image: linear-gradient(115deg, rgb(54 10 247 / 39%) 0px, rgb(132 107 243 / 51%) 50%, rgba(143, 53, 255, 0) 100%);
		}
		&.bg-image3 {
			background-image: linear-gradient(115deg, rgba(231, 10, 213, 0.34) 0px, rgb(162 92 247 / 35%) 50%, rgba(143, 53, 255, 0) 100%);
		}
		&.bg-image4 {
			background-image: linear-gradient(115deg, rgba(17, 1, 165, 0.31) 0px, rgba(238, 135, 233, 0.3) 50%, rgba(143, 53, 255, 0) 100%);
		}
		.item-title {
			font-size: 16px;
			font-weight: bold;
			color: rgb(75, 75, 75);
			padding: 10px 0 0 25px;
		}
		.item-img {
			height: 140px;
			width: 260px;
			position: absolute;
			bottom: 0;
			right: 0;
			border-top-left-radius: 5px;
		}
	}
}

.fx-solution-center-wrapper .center-template-item .template-info:hover {
	-webkit-box-shadow: 0 15px 30px 0 rgba(16, 20, 40, 0.1);
	box-shadow: 0 15px 30px 0 rgba(16, 20, 40, 0.1);
	-webkit-transform: translateY(-6px);
	transform: translateY(-6px);
}

.fx-solution-center-wrapper .center-template-item .template-info .item-labels {
	-webkit-box-align: center;
	-ms-flex-align: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	-webkit-box-orient: horizontal;
	-webkit-box-direction: normal;
	-webkit-align-items: center;
	align-items: center;
	display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	-webkit-flex-direction: row;
	-ms-flex-direction: row;
	flex-direction: row;
	-webkit-justify-content: center;
	justify-content: center;
	padding: 0 16px;
	position: absolute;
	right: 0;
	top: 0;
}

.fx-solution-center-wrapper .center-template-item .template-info .item-labels .label {
	color: #fff;
	font-size: 12px;
	height: 40px;
	margin: 0 2px;
	padding: 4px 2px;
	writing-mode: vertical-lr;
	-webkit-writing-mode: vertical-lr;
	-ms-writing-mode: vertical-lr;
}

.fx-solution-center-wrapper .center-template-item .template-info .item-labels .label.blue {
	background: linear-gradient(-20deg, transparent 20%, #5285cc 0), linear-gradient(20deg, transparent 20%, #5285cc 0);
}

.fx-solution-center-wrapper .center-template-item .template-info .item-labels .label.red {
	background: linear-gradient(-20deg, transparent 20%, #e65555 0), linear-gradient(20deg, transparent 20%, #e65555 0);
}

.fx-solution-center-wrapper .center-template-item .template-info .item-labels .label.yellow {
	background: linear-gradient(-20deg, transparent 20%, #cca37a 0), linear-gradient(20deg, transparent 20%, #cca37a 0);
}

.fx-solution-center-wrapper .center-template-item img {
	height: 180px;
	width: 100%;
}

.fx-solution-center-wrapper .center-template-item .template-des {
	padding: 16px 20px 20px;
}

.fx-solution-center-wrapper .center-template-item .template-des .description {
	word-wrap: break-word;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	color: #5e6d82;
	display: -webkit-box;
	font-size: 14px;
	height: 40px;
	line-height: 20px;
	margin-bottom: 8px;
	overflow: hidden;
	text-overflow: ellipsis;
	word-break: break-word;
}

.fx-solution-center-wrapper .center-template-item .template-des .bottom {
	-webkit-box-align: center;
	-ms-flex-align: center;
	-webkit-box-pack: space-between;
	-ms-flex-pack: space-between;
	-webkit-align-items: center;
	align-items: center;
	display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	-webkit-justify-content: space-between;
	justify-content: space-between;
}

.fx-solution-center-wrapper .center-template-item .template-des .bottom .install-count {
	color: #525967;
	font-size: 14px;
	line-height: 20px;
}

.fx-solution-center-wrapper .center-template-item .template-des .bottom .install-count i {
	font-size: 14px;
	margin-right: 5px;
}

.fx-solution-center-wrapper .center-template-item .tags {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.fx-solution-center-wrapper .center-template-item .tags .tag {
	background: #f0f1f4;
	border-radius: 3px;
	color: #5e6d82;
	display: inline-block;
	font-size: 12px;
	line-height: 20px;
	margin-right: 4px;
	max-width: 80px;
	overflow: hidden;
	padding: 0 8px;
	text-align: center;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.fx-solution-center-wrapper .loading-block {
	padding-bottom: 40px;
	text-align: center;
	width: 100%;
}

.fx-solution-center-wrapper .loading-block .spin-rotate {
	-webkit-animation: x-rotate 0.8s cubic-bezier(0.43, 0.1, 0.54, 0.85) infinite;
	animation: x-rotate 0.8s cubic-bezier(0.43, 0.1, 0.54, 0.85) infinite;
	border: 2px solid #b6e8e4;
	border-radius: 50%;
	border-top-color: #0db3a6;
	height: 30px;
	margin: 0 auto;
	-webkit-transform-origin: 50% 50%;
	transform-origin: 50% 50%;
	width: 30px;
}

.fx-solution-center-wrapper .search-bottom {
	padding: 0 0 60px;
	text-align: center;
}

.fx-solution-center-wrapper .search-bottom a {
	color: #00c29a;
	font-size: 16px;
	line-height: 24px;
	outline: 0;
	text-decoration: underline;
}

.fx-solution-center-wrapper #search-empty {
	display: none;
	padding-bottom: 50px;
	text-align: center;
}

.fx-solution-center-wrapper #search-empty .empty-card {
	-webkit-box-align: center;
	-ms-flex-align: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-webkit-align-items: center;
	align-items: center;
	background: url(https://blog-assets.jiandaoyun.com/v319/index/solutioncenter/search_footer.png) no-repeat 50%;
	background-size: cover;
	border-radius: 10px;
	display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	-webkit-flex-direction: column;
	-ms-flex-direction: column;
	flex-direction: column;
	height: 180px;
	-webkit-justify-content: center;
	justify-content: center;
	text-align: center;
}

.fx-solution-center-wrapper #search-empty .empty-card p {
	color: #141e31;
	font-size: 24px;
	font-weight: 500;
	line-height: 42px;
}

.fx-solution-center-wrapper #search-empty .empty-card a {
	margin-top: 16px;
}

.fx-solution-center-wrapper .solution-empty {
	-webkit-box-align: center;
	-ms-flex-align: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-webkit-align-items: center;
	align-items: center;
	display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	-webkit-flex-direction: column;
	-ms-flex-direction: column;
	flex-direction: column;
	-webkit-justify-content: center;
	justify-content: center;
	padding: 0 0 20px;
}

.fx-solution-center-wrapper .solution-empty .empty-img {
	width: 242px;
}

.fx-solution-center-wrapper .solution-empty .empty-tip {
	color: #91a1b7;
	font-size: 14px;
	line-height: 24px;
	margin: 10px 0 4px;
}

.fx-solution-center-wrapper .solution-empty .empty-submit-btn {
	color: #00c29a;
	font-size: 16px;
	line-height: 24px;
	outline: 0;
	text-decoration: underline;
}

.fx-solution-center-wrapper .solution-empty .back-home {
	color: #00c29a;
	font-size: 16px;
	line-height: 35px;
	text-decoration: underline;
}

.fx-solution-center-wrapper .solution-empty .back-home:hover {
	color: #4dd4b8;
}
</style>
