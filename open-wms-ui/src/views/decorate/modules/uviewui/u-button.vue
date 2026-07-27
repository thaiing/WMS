<template>
  <div class="module-container" :style="{'background-color':config.style?.bgColor,'margin-top':config.style.maginTop?config.style.maginTop+'px':0,padding:config.style?.bgMargin?config.style.bgMargin+'px':0}">
    <el-button :type="getType(config.options.type)" :plain="config.options.plain" :size="getSize(config.options.size)">{{config.options.label}}</el-button>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance, computed } from "vue";

export default {
	name: "app-design-left-panel",
	components: {},
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
		let method = {
			getType(type: string) {
				let _type = type;
				switch (type) {
					case "error":
						_type = "danger";
						break;
				}
				return _type;
			},
			getSize(size: string) {
				let _size = "default";
				switch (size) {
					case "normal":
						_size = "default";
						break;
					case "large":
						_size = "large";
						break;
					case "mini":
						_size = "small";
						break;
				}
				return _size;
			},
		};
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
</style>
