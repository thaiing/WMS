<template>
  <div class="home-container">
    <div class="box-card space-between">
      <div class="title">主题风格</div>
      <el-button type="primary">保存</el-button>
    </div>
    <el-card class="box-card" shadow="hover">
      <el-form ref="formRef" label-width="120px" class="margin-top-5">
        <el-form-item label="选择配色方案：">
          <el-radio-group v-model="styleType" size="small">
            <template v-for="item in styleList">
              <el-radio :label="item.style" border class="radio-blue">{{item.title}}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="当前风格示例：">
          <el-image style="width: 1000px;" :src="styleList.find(item=>item.style===styleType)?.url" fit="contain">
            <template #placeholder>
              <div class="image-slot">Loading<span class="dot">...</span></div>
            </template>
          </el-image>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, getCurrentInstance } from "vue";

export default {
	name: "decorate-theme-style",
	setup() {
		const { proxy } = getCurrentInstance() as any;
		proxy;

		//#region 变量
		const state: any = reactive({
			styleType: "blue",
			styleList: [
				{
					style: "blue",
					title: "天空蓝",
					url: "https://auod-beijing.oss-cn-beijing.aliyuncs.com/bbc/app/blue.01.jpg",
				},
				{
					style: "green",
					title: "生鲜绿",
					url: "https://auod-beijing.oss-cn-beijing.aliyuncs.com/bbc/app/green.01.jpg",
				},
				{
					style: "orange",
					title: "热情红",
					url: "https://auod-beijing.oss-cn-beijing.aliyuncs.com/bbc/app/orange.01.jpg",
				},
				{
					style: "pink",
					title: "魅力粉",
					url: "https://auod-beijing.oss-cn-beijing.aliyuncs.com/bbc/app/pink.01.jpg",
				},
				{
					style: "red",
					title: "活力橙",
					url: "https://auod-beijing.oss-cn-beijing.aliyuncs.com/bbc/app/red.01.jpg",
				},
			],
		});
		//#endregion

		return {
			...toRefs(state),
		};
	},
};
</script>

<style lang="scss" scoped>
@import "/@/theme/page.scss";
.box-card {
	+ .box-card {
		margin-top: 10px;
	}
	border-radius: var(--border-radius);
	border: 1px solid var(--el-border-color-light);
	background-color: var(--el-color-white);
	padding: 20px;
	.title {
		font-size: 20px;
	}
}
.date-type {
	display: inline-flex;
	margin-right: 5px;
}
:deep(.el-card__body) {
	padding: 5px;
}

.radio-blue {
	&.is-checked {
		border-color: #1db0fc !important;
		:deep(.el-radio__inner) {
			background-color: #1db0fc;
			border-color: #1db0fc;
		}
		:deep(.el-radio__input.is-checked + .el-radio__label),
		:deep(.el-radio-button__inner:hover) {
			color: #1db0fc !important;
		}
	}
}
.radio-green {
	&.is-checked {
		border-color: #42ca4d !important;
		:deep(.el-radio__inner) {
			background-color: #42ca4d;
			border-color: #42ca4d;
		}
		:deep(.el-radio__input.is-checked + .el-radio__label),
		:deep(.el-radio-button__inner:hover) {
			color: #42ca4d !important;
		}
	}
}
.radio-red {
	&.is-checked {
		border-color: #e93323 !important;
		:deep(.el-radio__inner) {
			background-color: #e93323;
			border-color: #e93323;
		}
		:deep(.el-radio__input.is-checked + .el-radio__label),
		:deep(.el-radio-button__inner:hover) {
			color: #e93323 !important;
		}
	}
}
.radio-pink {
	&.is-checked {
		border-color: #ff448f !important;
		:deep(.el-radio__inner) {
			background-color: #ff448f;
			border-color: #ff448f;
		}
		:deep(.el-radio__input.is-checked + .el-radio__label),
		:deep(.el-radio-button__inner:hover) {
			color: #ff448f !important;
		}
	}
}
.radio-orange {
	&.is-checked {
		border-color: #fe5c2d !important;
		:deep(.el-radio__inner) {
			background-color: #fe5c2d;
			border-color: #fe5c2d;
		}
		:deep(.el-radio__input.is-checked + .el-radio__label),
		:deep(.el-radio-button__inner:hover) {
			color: #fe5c2d !important;
		}
	}
}
</style>
