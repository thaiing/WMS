<!--商品类别 - 预览-->
<template>
  <div class="module-container" :style="{'margin-top':config.style?.maginTop?config.style.maginTop+'px':0,'background-color': config.style?.bgColor}">
    <div class="items" :style="{'background-color':config.style?.bgColor,'border-radius':config.style?.bgBorderRadius?config.style.bgBorderRadius+'px':0,margin:config.style?.bgMargin?config.style.bgMargin+'px':0,padding:config.style?.bgPadding?config.style.bgPadding+'px':0}">
      <div id="coupon-wrapper" class="scroll-wrapper" ref="scroll">
        <div class="scroll-content">
          <div v-for="(item, index) in config.items" :key="index" class="item" :style="{'background-color': config.style?.itemBgColor,'margin-right':(config.style?.itemMargin===undefined?10:config.style?.itemMargin)+'px','font-size':(config.style?.fontSize===undefined?12:config.style?.fontSize)+'px',color:(config.style?.fontColor||'#000000'),'border-radius':config.style?.itemBorderRadius?config.style.itemBorderRadius+'px':0}">
            <div class="content">
              <div class="money">￥{{item.money}}</div>
              <div class="desc">{{item.desc}}</div>
            </div>
            <div class="receive">
              立刻领取
            </div>
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
					let wrapper = document.getElementById("coupon-wrapper");
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
		overflow: hidden;

		transition: all 0.6s;
		-moz-transition: all 0.6s; /* Firefox 4 */
		-webkit-transition: all 0.6s; /* Safari and Chrome */
		-o-transition: all 0.6s; /* Opera */
		.scroll-content {
			display: inline-block;
			align-self: center;
			white-space: nowrap;
		}
		.item {
			margin-right: 10px;
			width: auto;
			display: inline-flex;
			text-align: center;
			word-wrap: break-word;
			white-space: normal;
			align-items: center;
			line-height: 1.2;
			.content {
				position: relative;
				width: 120px;
				&::after {
					content: " ";
					top: -11px;
					right: -3px;
					width: 14px;
					height: 7px;
					display: inline-block;
					position: absolute;
					z-index: 10;
					border: 1px solid white;
					background-color: white;
					border-radius: 0px 0px 20px 20px;
				}
				&::before {
					content: " ";
					bottom: -11px;
					right: -3px;
					width: 14px;
					height: 7px;
					display: inline-block;
					position: absolute;
					z-index: 10;
					border: 1px solid white;
					background-color: white;
					border-radius: 20px 20px 0px 0px;
				}
				.money {
					font-size: 30px;
				}
			}
			.receive {
				position: relative;
				padding: 5px 3px 5px 0;
				width: 24px;
				&::before {
					content: " ";
					position: absolute;
					top: 10px;
					bottom: 10px;
					left: -5px;
					border-right: 1px dotted white;
				}
			}
		}
	}
}
</style>
