<template>
  <div class="module-container">
    <div class="module">
      <el-table :data="tableData" highlight-current-row style="width: 100%" @current-change="currentChange">
        <el-table-column label="#" width="80">
          <template #default="{row}">
            <el-radio v-model="currentId" :label="row.id">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="页面名称" width="180">
        </el-table-column>
        <el-table-column prop="address" label="页面链接">
        </el-table-column>
      </el-table>
    </div>
    <div class="card-footer">
      <el-button type="primary" @click="selectFile">
        <i class="iconfont el-icon-yrt-gouxuan1"></i>
        选择
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
			// 表格数据集合
			tableData: [
				{
					id: 1,
					name: "演示站模板（勿动）",
					address: "/pages/annex/special/index?id=38",
				},
				{
					id: 2,
					name: "橘色主题模板",
					address: "/pages/annex/special/index?id=29",
				},
				{
					id: 3,
					name: "绿色主题模板",
					address: "/pages/annex/special/index?id=28",
				},
				{
					id: 4,
					name: "红色主题模板",
					address: "/pages/annex/special/index?id=27",
				},
			],
			currentId: 1,
		});
		//#endregion

		//#region 方法
		let method = {
			// 选中文件
			selectFile() {},
			// 选择表格
			currentChange(currentRow: any, oldCurrentRow: any) {
				proxy.currentId = currentRow.id;
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
