<template>
  <div class="type-container">
    <div class="type-left">
      <el-form ref="formRef" label-width="0px" class="margin-top-5">
        <el-form-item>
          <div class="style-list">
            <el-image class="img active" :src="currentTypeName.url" fit="contain">
              <template #placeholder>
                <div class="image-slot">Loading<span class="dot">...</span></div>
              </template>
            </el-image>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="productTypeSave">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="type-right">
      <product-type-config :config="config"></product-type-config>
    </div>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, getCurrentInstance, onMounted, computed } from "vue";
import productTypeConfig from "./product-type-config.vue";

export default {
	name: "product-type",
	components: {
		productTypeConfig,
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
		proxy;

		//#region 变量
		const state: any = reactive({
			styleList: [
				{
					style: "type1",
					title: "样式1",
					url: "https://auod-beijing.oss-cn-beijing.aliyuncs.com/bbc/app/t1.jpg?x-oss-process=style/800",
				},
				{
					style: "type2",
					title: "样式2",
					url: "https://auod-beijing.oss-cn-beijing.aliyuncs.com/bbc/app/t2.jpg?x-oss-process=style/800",
				},
				{
					style: "type3",
					title: "样式3",
					url: "https://auod-beijing.oss-cn-beijing.aliyuncs.com/bbc/app/t3.jpg?x-oss-process=style/800",
				},
			],
			config: {
				title: "参数设置",
				productType: "type1",
				items: [],
				style: {},
			},
		});
		//#endregion

		// 当前选中模块双向绑定
		const currentTypeName = computed({
			get() {
				return proxy.styleList.find((item: any) => item.style === proxy.config.productType) || {};
			},
			set() {},
		});

		//#region 方法
		let methods = {
			// 加载数据
			getProductType() {
				if (!proxy.appInfo.app_Id) {
					proxy.config.productType = "";
					return;
				}
				let url = "/api/common/loadDataList";
				let where = { app_Id: proxy.appInfo.app_Id };
				let orderBy = { app_Id: "ASC" };
				let params = {
					tableView: "App_List",
					idField: "app_Id",
					folder: "app/design",
					menu_Id: 2040,
					pageIndex: 1,
					pageSize: 50,
					where: where,
					orderBy: orderBy,
					select: ["productType"],
				};
				proxy.common.ajax(
					url,
					params,
					(res: any) => {
						proxy.common.showMsg(res);
						if (res.result && res.data.rows.length) {
							let productType = res.data.rows[0].productType; // 获取列表数据
							proxy.config = JSON.parse(productType);
						}
					},
					true
				);
			},
			// 保存app商品类别样式
			productTypeSave() {
				if (!proxy.appInfo.app_Id) {
					proxy.$message.error("appId不能为空！");
					return;
				}
				if (!proxy.config.productType) {
					proxy.$message.error("请选择样式！");
					return;
				}
				let url = "/api/app/decorate/productTypeSave";
				let params = {
					app_Id: proxy.appInfo.app_Id,
					productType: proxy.config,
				};
				proxy.common.ajax(
					url,
					params,
					(res: any) => {
						proxy.common.showMsg(res);
					},
					true
				);
			},
		};
		//#endregion

		onMounted(() => {
			proxy.getProductType();
		});

		return {
			...toRefs(state),
			currentTypeName,
			...methods,
		};
	},
};
</script>

<style lang="scss" scoped>
@import "/@/theme/page.scss";
.type-container {
	padding: 10px;
	display: flex;
	justify-content: flex-start;
	.type-left {
		width: 310px;
	}
	.type-right {
		position: relative;
		height: 700px;
	}
	.style-list {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.img {
			width: 300px;
			height: 530px;
			border: var(--el-border-base);
			border-radius: 5px;
			cursor: pointer;
			+ .img {
				margin-left: 10px;
			}
			&.active {
				border-color: var(--el-color-primary);
			}
		}
	}
}
</style>
