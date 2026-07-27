<!--活动魔方-->
<template>
  <div class="module-container" :style="{'margin-top':config.style?.maginTop?config.style.maginTop+'px':0}">
    <div class="header-box" :style="{'background-color':config.header?.bgColor,'padding-left':config.header?.bgMargin?config.header.bgMargin+'px':0,'padding-right':config.header?.bgMargin?config.header.bgMargin+'px':0}">
      <div class="inner" :style="{'background-color':config.header?.innerBgColor,'border-radius':config.header?.borderRadius?config.header.borderRadius+'px':0,padding:config.header?.bgPadding?config.header.bgPadding+'px':0}">
        <div v-if="config.header.image" class="img" :style="{width:(config.header.width||24)+'px',height:(config.header.height||24)+'px'}">
          <el-image :src="config.header.image" :fit="config.header.fit" class="img" :style="{width:(config.header.width||24)+'px',height:(config.header.height||24)+'px'}">
          </el-image>
        </div>
        <div class="title-box" :style="{color:config.header.color,'font-size':config.header.fontSize?config.header.fontSize+'px':null,'text-align':config.header.align}">
          {{config.header.title}}
        </div>
        <div v-if="config.header.subTitle" class="sub-title" :style="{'margin-left':config.header.align==='left'?'auto':0}">
          {{config.header.subTitle}}
        </div>
      </div>
    </div>
    <div v-if="config.style?.displayMode==='单列'" class="items-1" :style="{'background-color':config.style?.bgColor,'border-radius':config.style?.bgBorderRadius?config.style.bgBorderRadius+'px':0,margin:config.style?.bgMargin?config.style.bgMargin+'px':0,padding:config.style?.bgPadding?config.style.bgPadding+'px':0}">
      <div v-for="(item, itemIndex) in config.items" class="item" :style="{'margin-top':(config.style?.productMaginTop&&itemIndex>0)?config.style.productMaginTop+'px':0, 'background-color':config.style?.productBgColor,'border-radius':config.style?.productBorderRadius?config.style.productBorderRadius+'px':0}">
        <div class="img-box">
          <el-image class="img" :src="item.image+'?x-oss-process=style/200'" fit="contain">
          </el-image>
        </div>
        <div class="main">
          <div class="title" :style="{color: config.style.titleColor}">{{item.title}}</div>
          <div class="desc" :style="{color: config.style.originPriceColor}">{{item.desc}}</div>
          <div class="btn" :class="'bg'+(itemIndex+1)">
            GO!
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="config.style?.displayMode==='两列1'" class="items-2-1" :style="{'background-color':config.style?.bgColor,'border-radius':config.style?.bgBorderRadius?config.style.bgBorderRadius+'px':0,margin:config.style?.bgMargin?config.style.bgMargin+'px':0,padding:config.style?.bgPadding?config.style.bgPadding+'px':0}">
      <div v-for="(item, itemIndex) in config.items" class="item" :style="{'margin-bottom':(config.style?.productMaginTop&&itemIndex<config.items.length-(config.items.length%2===0?2:1))?config.style.productMaginTop+'px':0, 'margin-right':(config.style?.productMaginTop&&itemIndex%2===0)?config.style.productMaginTop+'px':0,width:(config.style?.productMaginTop)?'calc(50% - ' + (config.style.productMaginTop/2)+'px)':'50%','background-color':config.style?.productBgColor,'border-radius':config.style?.productBorderRadius?config.style.productBorderRadius+'px':0}">
        <div class="img-box">
          <el-image class="img" :src="item.image+'?x-oss-process=style/200'" fit="contain">
          </el-image>
        </div>
        <div class="main">
          <div class="title" :style="{color: config.style.titleColor}">{{item.title}}</div>
          <div class="desc" :style="{color: config.style.originPriceColor}">{{item.desc}}</div>
          <div class="btn" :class="'bg'+(itemIndex+1)">
            GO!
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="config.style?.displayMode==='两列2'" class="items-2-2" :style="{'background-color':config.style?.bgColor,'border-radius':config.style?.bgBorderRadius?config.style.bgBorderRadius+'px':0,margin:config.style?.bgMargin?config.style.bgMargin+'px':0,padding:config.style?.bgPadding?config.style.bgPadding+'px':0}">
      <div v-for="(item, itemIndex) in config.items" class="item" :style="{'margin-bottom':(config.style?.productMaginTop&&itemIndex<config.items.length-(config.items.length%2===0?2:1))?config.style.productMaginTop+'px':0, 'margin-right':(config.style?.productMaginTop&&itemIndex%2===0)?config.style.productMaginTop+'px':0,width:(config.style?.productMaginTop)?'calc(50% - ' + (config.style.productMaginTop/2)+'px)':'50%','background-color':config.style?.productBgColor,'border-radius':config.style?.productBorderRadius?config.style.productBorderRadius+'px':0}">
        <div class="main">
          <div class="title" :style="{color: config.style.titleColor}">{{item.title}}</div>
          <div class="desc" :style="{color: config.style.originPriceColor}">{{item.desc}}</div>
          <div class="btn" :class="'bg'+(itemIndex+1)">
            GO!
          </div>
        </div>
        <div class="img-box">
          <el-image class="img" :src="item.image+'?x-oss-process=style/200'" fit="contain">
          </el-image>
        </div>
      </div>
    </div>
    <div v-else-if="config.style?.displayMode==='三列'" class="items-3" :style="{'background-color':config.style?.bgColor,'border-radius':config.style?.bgBorderRadius?config.style.bgBorderRadius+'px':0,margin:config.style?.bgMargin?config.style.bgMargin+'px':0,padding:config.style?.bgPadding?config.style.bgPadding+'px':0}">
      <div v-for="(item, itemIndex) in config.items" class="item" :style="{'margin-bottom':(config.style?.productMaginTop&&itemIndex<config.items.length-(config.items.length%3===0?3:(config.items.length%3===1?1:2)))?config.style.productMaginTop+'px':0, 'margin-right':(config.style?.productMaginTop&&itemIndex%3<2)?config.style.productMaginTop+'px':0,width:(config.style?.productMaginTop)?'calc(33% - ' + (config.style.productMaginTop*2/3)+'px)':'33.3333%','background-color':config.style?.productBgColor,'border-radius':config.style?.productBorderRadius?config.style.productBorderRadius+'px':0}">
        <div class="img-box">
          <el-image class="img" :src="item.image+'?x-oss-process=style/200'" fit="contain">
          </el-image>
        </div>
        <div class="main">
          <div class="title" :style="{color: config.style.titleColor}">{{item.title}}</div>
          <div class="desc" :style="{color: config.style.originPriceColor}">{{item.desc}}</div>
          <div class="btn" :class="'bg'+(itemIndex+1)">
            GO!
          </div>
        </div>
      </div>
      <div v-if="config.items.length%3===1" class="item-empty" :style="{'margin-right':(config.style?.productMaginTop&&itemIndex%3<2)?config.style.productMaginTop+'px':0,width:(config.style?.productMaginTop)?'calc(33% - ' + (config.style.productMaginTop*2/3)+'px)':'33.3333%'}"></div>
      <div v-if="config.items.length%3===2" class="item-empty" :style="{width:(config.style?.productMaginTop)?'calc(33% - ' + (config.style.productMaginTop*2/3)+'px)':'33.3333%'}"></div>
    </div>
    <div v-else-if="config.style?.displayMode==='大图'" class="items-4" :style="{'background-color':config.style?.bgColor,'border-radius':config.style?.bgBorderRadius?config.style.bgBorderRadius+'px':0,margin:config.style?.bgMargin?config.style.bgMargin+'px':0,padding:config.style?.bgPadding?config.style.bgPadding+'px':0}">
      <div v-for="(item, itemIndex) in config.items" class="item" :style="{'margin-top':(config.style?.productMaginTop&&itemIndex>0)?config.style.productMaginTop+'px':0, 'background-color':config.style?.productBgColor,'border-radius':config.style?.productBorderRadius?config.style.productBorderRadius+'px':0}">
        <div class="img-box">
          <el-image class="img" :src="item.image+'?x-oss-process=style/500'" fit="contain">
          </el-image>
        </div>
        <div class="main">
          <div class="title" :style="{color: config.style.titleColor}">{{item.title}}</div>
          <div class="desc" :style="{color: config.style.originPriceColor}">{{item.desc}}</div>
          <div class="btn" :class="'bg'+(itemIndex+1)">
            GO!
          </div>
        </div>
      </div>
    </div>
    <div v-else class="display-mode-none">商品列表未设置模式</div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance, computed, onMounted } from "vue";

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
			currentItem: null, // 选择类别
		});

		//#region 方法
		let methods = {
			// 获得图片列表
			getFirstImage(url: any, style: string) {
				let imgUrl = "";
				if (!url) url = "";
				const imgs = url.split(",");
				if (imgs.length) {
					imgUrl = imgs[0] + "?x-oss-process=style/" + (style || "small");
				}
				return imgUrl;
			},
		};
		//#endregion

		// 页面加载完毕事件
		onMounted(() => {
			proxy.mittBus.on("onReload:bargaining", (res: any) => {});
		});

		return {
			...toRefs(state),
			...methods,
		};
	},
};
</script>

<style lang="scss" scoped>
.module-container {
	min-height: 20px;
	.header-box {
		.inner {
			display: flex;
			justify-content: flex-start;
			padding: 5px 10px;
			align-items: center;
		}
		.img {
			width: 24px;
			height: 24px;
		}
		.title-box {
			text-align: left;
			padding-left: 10px;
			padding-right: 10px;
		}
		.sub-title {
			padding: 2px 10px;
			font-size: 12px;
			color: white;
			border-top-left-radius: 10px;
			border-bottom-right-radius: 10px;
			background-image: linear-gradient(90deg, rgb(246, 44, 44), rgb(249, 110, 41));
			box-shadow: 3px 1px 1px 1px rgba(255, 203, 199, 0.8);
		}

		.item {
			text-align: center;
			line-height: 1.8;
			.title {
				font-size: 14px;
			}
			.desc {
				font-size: 12px;
				color: var(--el-text-color-secondary);
			}
			&.active {
				font-weight: bolder;
				.title {
					color: var(--color-red);
				}
				.desc {
					color: var(--color-active);
					background-color: var(--bgcolor-active) !important;
					border-radius: 15px;
					padding: 0 5px;
				}
			}
		}
	}
	.items-1 {
		padding: 10px;

		.item {
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			padding: 5px;
			+ .item {
				margin-top: 10px;
			}
			.img-box {
				width: 80px;
				padding: 10px 0;
				.img {
					width: 70px;
					height: 70px;
				}
			}
			.main {
				.title {
					font-size: 14px;
				}
				.desc {
					color: var(--color-info);
					font-size: 12px;
				}
				.btn {
					color: var(--el-color-white);
					margin-top: 10px;
					line-height: 1.5;
					font-size: 14px;
					background-image: linear-gradient(90deg, #4bc4ff, #207eff 100%);
					border-radius: 20px;
					text-align: center;
					width: 60px;
					&.bg1 {
						background-image: linear-gradient(90deg, #4bc4ff, #207eff 100%);
					}
					&.bg2 {
						background-image: linear-gradient(90deg, #ff9043, #ff531d 100%);
					}
					&.bg3 {
						background-image: linear-gradient(90deg, #96e187, #48ce2c 100%);
					}
					&.bg4 {
						background-image: linear-gradient(90deg, #ffc560, #ff9c00 100%);
					}
				}
			}
		}
	}
	.items-2-1 {
		padding: 10px;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		.item {
			padding: 5px;
			width: 50%;
			margin-bottom: 10px;
			.img-box {
				padding: 10px 0;
				.img {
					width: 100%;
					height: 100%;
				}
			}
			.main {
				.title {
					font-size: 14px;
				}
				.desc {
					color: var(--color-info);
					font-size: 12px;
				}
				.btn {
					color: var(--el-color-white);
					margin-top: 10px;
					line-height: 1.5;
					font-size: 14px;
					background-image: linear-gradient(90deg, #4bc4ff, #207eff 100%);
					border-radius: 20px;
					text-align: center;
					width: 60px;
					&.bg1 {
						background-image: linear-gradient(90deg, #4bc4ff, #207eff 100%);
					}
					&.bg2 {
						background-image: linear-gradient(90deg, #ff9043, #ff531d 100%);
					}
					&.bg3 {
						background-image: linear-gradient(90deg, #96e187, #48ce2c 100%);
					}
					&.bg4 {
						background-image: linear-gradient(90deg, #ffc560, #ff9c00 100%);
					}
				}
			}
		}
	}
	.items-2-2 {
		padding: 10px;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		.item {
			padding: 5px;
			width: 50%;
			margin-bottom: 10px;
			display: flex;
			justify-content: space-between;
			.img-box {
				width: 50%;
				padding: 10px 0;
				.img {
					width: 100%;
					height: 100%;
				}
			}
			.main {
				width: 50%;
				.title {
					font-size: 14px;
				}
				.desc {
					color: var(--color-info);
					font-size: 12px;
				}
				.btn {
					color: var(--el-color-white);
					margin-top: 10px;
					line-height: 1.5;
					font-size: 14px;
					background-image: linear-gradient(90deg, #4bc4ff, #207eff 100%);
					border-radius: 20px;
					text-align: center;
					width: 60px;
					&.bg1 {
						background-image: linear-gradient(90deg, #4bc4ff, #207eff 100%);
					}
					&.bg2 {
						background-image: linear-gradient(90deg, #ff9043, #ff531d 100%);
					}
					&.bg3 {
						background-image: linear-gradient(90deg, #96e187, #48ce2c 100%);
					}
					&.bg4 {
						background-image: linear-gradient(90deg, #ffc560, #ff9c00 100%);
					}
				}
			}
		}
	}
	.items-3 {
		padding: 10px;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		.item {
			padding: 5px;
			width: 33.3333%;
			margin-bottom: 10px;
			.img-box {
				padding: 10px 0;
				.img {
					width: 100%;
					height: 100%;
				}
			}
			.main {
				.title {
					font-size: 14px;
				}
				.desc {
					color: var(--color-info);
					font-size: 12px;
				}
				.btn {
					color: var(--el-color-white);
					margin-top: 10px;
					line-height: 1.5;
					font-size: 14px;
					background-image: linear-gradient(90deg, #4bc4ff, #207eff 100%);
					border-radius: 20px;
					text-align: center;
					width: 60px;
					&.bg1 {
						background-image: linear-gradient(90deg, #4bc4ff, #207eff 100%);
					}
					&.bg2 {
						background-image: linear-gradient(90deg, #ff9043, #ff531d 100%);
					}
					&.bg3 {
						background-image: linear-gradient(90deg, #96e187, #48ce2c 100%);
					}
					&.bg4 {
						background-image: linear-gradient(90deg, #ffc560, #ff9c00 100%);
					}
				}
			}
		}
		.item-empty {
			width: calc(33% - 5px);
			height: 0;
		}
	}
	.items-4 {
		padding: 10px;

		.item {
			padding: 5px;
			+ .item {
				margin-top: 10px;
			}
			.img-box {
				padding: 10px 0;
				.img {
					width: 100%;
					height: 100%;
				}
			}
			.main {
				.title {
					font-size: 14px;
				}
				.desc {
					color: var(--color-info);
					font-size: 12px;
				}
				.btn {
					color: var(--el-color-white);
					margin-top: 10px;
					line-height: 1.5;
					font-size: 14px;
					background-image: linear-gradient(90deg, #4bc4ff, #207eff 100%);
					border-radius: 20px;
					text-align: center;
					width: 60px;
					&.bg1 {
						background-image: linear-gradient(90deg, #4bc4ff, #207eff 100%);
					}
					&.bg2 {
						background-image: linear-gradient(90deg, #ff9043, #ff531d 100%);
					}
					&.bg3 {
						background-image: linear-gradient(90deg, #96e187, #48ce2c 100%);
					}
					&.bg4 {
						background-image: linear-gradient(90deg, #ffc560, #ff9c00 100%);
					}
				}
			}
		}
	}
	.display-mode-none {
		padding: 10px;
		color: var(--color-red);
	}
}
</style>
