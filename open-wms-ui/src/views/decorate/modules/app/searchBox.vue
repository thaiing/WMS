<template>
  <div class="module-container" :style="{'margin-top':config.style.maginTop?config.style.maginTop+'px':0, 'background-color':config.style.bgColor}">
    <div class="img">
      <el-image class="img" :src="config.image" fit="contain" :style="{width:config.style.logoWidth+'px',height:config.style.logoHeight+'px'}">
      </el-image>
    </div>
    <div class="search-box">
      <el-input v-model="searchKey" class="search-input" placeholder="搜索商品">
        <template #prefix>
          <el-icon class="margin-top-10">
            <search />
          </el-icon>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance, computed } from "vue";
import { Search } from "@element-plus/icons-vue";

export default {
	name: "app-design-left-panel",
	components: {
		Search,
	},
	props: {
		// 配置参数
		config: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	setup() {
		const { proxy } = getCurrentInstance() as any;
		const state = reactive({
			searchKey: null,
		});

		//#region
		let method = {};
		//#endregion

		return {
			...toRefs(state),
			...method,
		};
	},
};
</script>

<style lang="scss" scoped>
.module-container {
	display: flex;
	justify-content: flex-start;
	padding: 5px 0;
	.img {
		width: 100px;
		height: 24px;
		padding-top: 2px;
	}
	.search-box {
		width: calc(100% - 110px);
		padding-top: 0px;
		padding-left: 5px;
	}
	.search-input {
		:deep(.el-input__inner) {
			border-radius: 20px;
			text-align: center;
		}
	}
}
.items {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	padding: 10px 0;

	.item {
		width: calc(25% - 5px);
		text-align: center;
		margin-bottom: 10px;
		+ .item {
			margin-left: 5px;
		}
		.img {
			width: 60px;
			height: 60px;
		}
		.name {
			color: var(--el-text-color-regular);
		}
	}
}
</style>
