<template>
  <div class="module-container">
    <template v-for="module in modules">
      <div class="module">
        <div class="title">{{module.title}}</div>
        <div class="items">
          <template v-for="item in module.items">
            <div :class="['item', currentItem===item?'active':'']" @click="selectItem(item)">{{item.name}}</div>
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
import { toRefs, reactive, getCurrentInstance, onMounted } from "vue";

export default {
	name: "market-link",
	components: {},
	props: {},
	setup() {
		const { proxy } = getCurrentInstance() as any;

		//#region 变量
		const state: any = reactive({
			// 模块数据
			modules: [
				{
					title: "优惠券",
					items: [
						{
							name: "我的优惠券",
							url: "/pages/index",
						},
						{
							name: "优惠券列表",
							url: "/pages/index",
						},
					],
				},
				{
					title: "秒杀",
					items: [
						{
							name: "秒杀列表",
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

