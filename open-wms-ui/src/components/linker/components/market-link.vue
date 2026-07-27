<template>
	<div class="module-container">
		<template v-for="module in modules">
			<div class="module">
				<div class="title">{{ module.title }}</div>
				<div class="items">
					<template v-for="item in module.items">
						<div :class="['item', currentItem === item ? 'active' : '']" @click="selectItem(item)">{{ item.name }}</div>
					</template>
					<div class="item-empty"></div>
					<div class="item-empty"></div>
					<div class="item-empty"></div>
					<div class="item-empty"></div>
					<div class="item-empty"></div>
					<div class="item-empty"></div>
				</div>
			</div>
		</template>
		<div class="card-footer">
			<el-button type="primary" @click="confirm">
				<i class="iconfont el-icon-yrt-gouxuan1"></i>
				确认选择
			</el-button>
		</div>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, getCurrentInstance, onMounted, ComponentInternalInstance } from "vue";
import { BaseProperties } from "../../common/base-layout";
interface CustomProperties extends BaseProperties {
	// 模块数据
	modules: Array<any>;
	// 选中模块
	currentItem: any;
}

export default {
	name: "market-link",
	components: {},
	props: {},
	setup() {
		let ins = getCurrentInstance() as ComponentInternalInstance;
		let proxy: CustomProperties;
		if (ins.proxy) {
			proxy = ins.proxy as CustomProperties;
		}

		//#region 变量
		const state: any = reactive({
			// 模块数据
			modules: [
				{
					title: "基础链接",
					items: [
						{
							name: "商城首页",
							url: "/pages/index",
						},
						{
							name: "商城分类",
							url: "/pages/index",
						},
						{
							name: "分类商品列表",
							url: "/pages/index",
						},
						{
							name: "退款列表",
							url: "/pages/index",
						},
						{
							name: "我的订单",
							url: "/pages/index",
						},
						{
							name: "精品推荐",
							url: "/pages/index",
						},
						{
							name: "热门榜单",
							url: "/pages/index",
						},
						{
							name: "首发新品",
							url: "/pages/index",
						},
						{
							name: "促销单品",
							url: "/pages/index",
						},
						{
							name: "文章列表",
							url: "/pages/index",
						},
					],
				},
				{
					title: "个人中心",
					items: [
						{
							name: "付费会员",
							url: "/pages/index",
						},
						{
							name: "收银页面",
							url: "/pages/index",
						},
						{
							name: "充值页面",
							url: "/pages/index",
						},
						{
							name: "订单核销",
							url: "/pages/index",
						},
						{
							name: "统计管理",
							url: "/pages/index",
						},
						{
							name: "联系客服",
							url: "/pages/index",
						},
						{
							name: "佣金排行",
							url: "/pages/index",
						},
						{
							name: "推广人排行",
							url: "/pages/index",
						},
						{
							name: "推广人订单",
							url: "/pages/index",
						},
						{
							name: "提现页面",
							url: "/pages/index",
						},
						{
							name: "用户等级",
							url: "/pages/index",
						},
						{
							name: "个人资料",
							url: "/pages/index",
						},
						{
							name: "我的账户",
							url: "/pages/index",
						},
						{
							name: "地址列表",
							url: "/pages/index",
						},
					],
				},
				{
					title: "分销",
					items: [
						{
							name: "推广人列表",
							url: "/pages/index",
						},
						{
							name: "分销海报",
							url: "/pages/index",
						},
						{
							name: "我的推广",
							url: "/pages/index",
						},
					],
				},
			],
			// 选中模块
			currentItem: null,
		});
		//#endregion

		//#region 方法
		let method = {
			// 加载数据
			loadLinkList() {
				let url = "/api/app/link/";
			},
			// 确认选择
			confirm() {
				if (!proxy.currentItem) {
					proxy.$message.error("请选择一项！");
					return;
				}

				// 触发选中事件
				proxy.mittBus.emit("onSelectLink", proxy.currentItem);
			},
			// 选中项
			selectItem(item: any) {
				proxy.currentItem = item;
			},
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
.module-container {
	min-height: 500px;
	position: relative;
	.module {
		padding: 0 10px;
		.title {
			font-weight: bold;
			padding: 5px 10px 10px 0;
		}
		.items {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.item {
				margin-right: 10px;
				padding: 5px 5px;
				background-color: var(--color-primary-light-8);
				border-radius: 5px;
				min-width: 100px;
				text-align: center;
				margin-bottom: 10px;
				cursor: pointer;
				&:hover {
					background-color: var(--el-color-primary-light-3);
					color: var(--el-color-white);
				}
				&.active {
					background-color: var(--color-primary);
					color: var(--el-color-white);
				}
			}
			.item-empty {
				margin-right: 10px;
				border-radius: 5px;
				min-width: 100px;
				height: 0;
			}
		}
	}
	.card-footer {
		position: absolute;
		bottom: 0;
		right: 0;
		left: 0;
		border-top: 1px solid var(--el-border-color-light);
		padding: 10px;
		text-align: right;
	}
}
</style>
