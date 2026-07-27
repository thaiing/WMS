<!--商品类别 - 预览-->
<template>
  <div class="module-container" :style="{'margin-top':config.style?.maginTop?config.style.maginTop+'px':0,'background-image': 'linear-gradient('+(config.style?.bgColorDeg||0)+'deg, '+config.style?.bgColor1+', '+config.style?.bgColor2+')'}">
    <div class="items" :style="{'background-color':config.style?.bgColor,'border-radius':config.style?.bgBorderRadius?config.style.bgBorderRadius+'px':0,margin:config.style?.bgMargin?config.style.bgMargin+'px':0,padding:config.style?.bgPadding?config.style.bgPadding+'px':0}">
      <div id="product-type-wrapper" class="scroll-wrapper" ref="scroll">
        <div class="scroll-content">
          <div v-for="(item, index) in config.items" :key="index" :class="[item.isDefault?'active':'']" class="item" :style="{'margin-right':(config.style?.itemMargin===undefined?10:config.style?.itemMargin)+'px','border-radius':config.style?.activeBgBorderRadius?config.style.activeBgBorderRadius+'px':0}">
            <div v-if="item.isDefault" :style="{'font-size':(config.style?.activeFontSize===undefined?12:config.style?.activeFontSize)+'px',color:(config.style?.activeFontColor===undefined?'#000000':config.style?.activeFontColor),'padding-top':config.style?.activeBgPadding1?config.style.activeBgPadding1+'px':0,'padding-bottom':config.style?.activeBgPadding1?config.style.activeBgPadding1+'px':0,'padding-left':config.style?.activeBgPadding2?config.style.activeBgPadding2+'px':0,'padding-right':config.style?.activeBgPadding2?config.style.activeBgPadding2+'px':0}">{{item.title}}</div>
            <div v-else :style="{'font-size':(config.style?.fontSize===undefined?12:config.style?.fontSize)+'px',color:(config.style?.fontColor===undefined?'#000000':config.style?.fontColor)}">{{item.title}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance, computed, ComponentInternalInstance, ComponentPublicInstance, onMounted } from "vue";
import { loadBetterScroll } from "/@/utils/commonFunction";
interface CustomProperties extends ComponentPublicInstance {
	config: {
		items: Array<any>;
		style: {};
	};
	loadBScroll: () => {};
}

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
		let ins = getCurrentInstance() as ComponentInternalInstance;
		let proxy: CustomProperties;
		if (ins.proxy) {
			proxy = ins.proxy as CustomProperties;
		}

		//#region 属性
		const state = reactive({
			carouselCount: 1,
		});
		//#endregion

		onMounted(() => {
			proxy.loadBScroll();
		});

		//#region 方法
		let methods = {
			loadBScroll() {
				// 单行时，加载betterScoll组件
				loadBetterScroll(() => {
					let wrapper = document.getElementById("product-type-wrapper");
					if (!wrapper) return;

					let bs = window.BetterScroll.createBScroll(wrapper, {
						bindToTarget: true,
						scrollX: true,
						scrollY: false,
						freeScroll: true,
						bounce: true,
						movable: true, // for movable plugin
					});
				});
			},
		};
		//#endregion

		onMounted(() => {
			// 响应样式事件
			proxy.mittBus.on("onNavGroup:typeChange", () => {
				proxy.loadBScroll();
			});
		});

		return {
			...toRefs(state),
			...methods,
		};
	},
};
</script>

<style lang="scss" scoped>
.items {
	.scroll-wrapper {
		position: relative;
		display: flex;
		align-content: center;
		white-space: nowrap;
		overflow: hidden;

		transition: all 0.6s;
		-moz-transition: all 0.6s; /* Firefox 4 */
		-webkit-transition: all 0.6s; /* Safari and Chrome */
		-o-transition: all 0.6s; /* Opera */
		.scroll-content {
			display: inline-block;
			align-self: center;
		}
		.item {
			margin-right: 10px;
			box-sizing: border-box;
			width: auto;
			display: inline-block;
			text-align: center;
			&.active {
				background-color: #fff;
				.name {
					color: red;
				}
			}
			.name {
				color: var(--el-text-color-regular);
				font-size: 12px;
			}
		}
	}
}
</style>
