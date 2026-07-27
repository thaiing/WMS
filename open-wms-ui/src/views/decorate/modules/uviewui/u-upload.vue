<template>
  <div class="module-container" :style="{'background-color':config.style?.bgColor,'margin-top':config.style.maginTop?config.style.maginTop+'px':0,padding:config.style?.bgMargin?config.style.bgMargin+'px':0}">
    <el-form ref="form" :model="form" label-width="90px" class="widget-view">
      <el-form-item :label="config.options.label" :label-width="config.options.labelWidth?config.options.labelWidth:'90px'" class="u-text-content">
        <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :show-file-list="false" :style="{width:config.options.width,height:config.options.height}">
          <el-icon class="avatar-uploader-icon" :style="{width:config.options.width,height:config.options.height}">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance, computed } from "vue";
import { Plus } from "@element-plus/icons-vue";

export default {
	name: "app-design-left-panel",
	components: {
		Plus,
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
			form: {
				value: null,
			},
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
	.widget-view {
		position: relative;
	}
	.widget-view::after {
		position: absolute;
		content: " ";
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		display: block;
		z-index: 1001;
	}
	.u-text-content {
		::v-deep .el-form-item__content {
			font-size: 8px;
		}
	}
}
.avatar-uploader .avatar {
	width: 80px;
	height: 80px;
	display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
	border: 1px dashed rgb(212, 212, 212);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
	border-color: rgb(212, 212, 212);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 80px;
	height: 80px;
	text-align: center;
}
</style>