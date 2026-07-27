<template>
  <div class="bottom-container">
    <div :class="['items', currentSelectModule===config?'active':'']" :style="{'background-image': 'linear-gradient('+(config.style?.bgColorDeg||0)+'deg, '+config.style?.bgColor1+', '+config.style?.bgColor2+')','border-radius':config.style?.bgBorderRadius?config.style.bgBorderRadius+'px':0,'margin-left':config.style?.bgMargin?config.style.bgMargin+'px':0,'margin-right':config.style?.bgMargin?config.style.bgMargin+'px':0,padding:config.style?.bgPadding?config.style.bgPadding+'px':0}" @click="selectTitle">
      <div class="item" v-for="(item, index) in config.items" :key="index" :class="index==0?'active':''" :style="{'--active-bg-color':config.style?.activeBgColor,'--active-bg-border-radius':config.style.activeBgBorderRadius+'px'}">
        <div class="img-item img">
          <el-image class="img" :src="index==0?item.image1:item.image2">
            <template #error>
              <div class="image-slot">
                <el-icon>
                  <icon-picture />
                </el-icon>
              </div>
            </template>
          </el-image>
        </div>
        <div class="txt" :class="index==0?'active':''" :style="{'font-size':(config.style?.fontSize|| 12)+'px',color:config.style?.fontColor,'--active-font-size':(config.style?.activeFontSize|| 12)+'px',color:config.style?.fontColor,'--active-font-color':config.style?.activeFontColor}">
          {{item.name}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance, computed } from "vue";
import { Picture as iconPicture } from "@element-plus/icons-vue";

export default {
	name: "app-design-left-panel",
	components: {
		iconPicture,
	},
	props: {
		// app配置参数
		config: {
			type: Object,
			default: () => {
				return {};
			},
		},
		// 选中项
		selectModule: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	setup() {
		const { proxy } = getCurrentInstance() as any;
		const state = reactive({});

		// 当前选中模块双向绑定
		const currentSelectModule = computed({
			get() {
				return proxy.selectModule;
			},
			set(value) {
				proxy.$emit("update:selectModule", value);
			},
		});

		//#region
		let method = {
			// 选中标题
			selectTitle() {
				proxy.currentSelectModule = proxy.config;
			},
		};
		//#endregion

		return {
			...toRefs(state),
			currentSelectModule,
			...method,
		};
	},
};
</script>

<style lang="scss" scoped>
.bottom-container {
	width: 379px;
	margin: 0px auto;
	position: relative;
	left: -2px;
	.items {
		display: flex;
		justify-content: space-between;
		&.active {
			border: 1px solid var(--color-primary);
		}
		.item {
			position: relative;
			width: 25%;
			text-align: center;
			&.active {
				background-color: var(--active-bg-color) !important;
				border-radius: var(--active-bg-border-radius) !important;
			}
			.img-item {
				text-align: center;
				margin: auto;
			}
			.img {
				width: 32px;
				height: 32px;
				cursor: pointer;
				font-size: 28px;
			}
			.image-slot {
				align-items: center;
				display: flex;
				justify-content: center;
				background-color: var(--el-bg-color);
				height: 100%;
				width: 100%;
				color: var(--color-info-light-1);
				cursor: pointer;
			}
			.txt {
				bottom: 0;
				left: 0;
				right: 0;
				text-align: center;
				line-height: 1.8;
				font-size: 12px;
				&.active {
					color: var(--active-font-color) !important;
					font-size: var(--active-font-size);
				}
			}
		}
	}
}
</style>