<template>
  <div class="module-container" :style="{'margin-top':config.style?.maginTop?config.style.maginTop+'px':0}">
    <div v-if="config.style.type===1" class="style-1" :style="{'background-color':config.style?.bgColor,'border-radius':config.style?.bgBorderRadius?config.style.bgBorderRadius+'px':0,margin:config.style?.bgMargin?config.style.bgMargin+'px':0,padding:config.style?.bgPadding?config.style.bgPadding+'px':0}">
      <el-image :src="config.items.item1.image+'?x-oss-process=style/300'" fit="fill" class="img" :style="{width:'100%',height:'100%', 'border-radius':(config.style?.imageBorderRadius?config.style?.imageBorderRadius+'px':0)}"></el-image>
    </div>
    <div v-if="config.style.type===2" class="style-2" :style="{'background-color':config.style?.bgColor,'border-radius':config.style?.bgBorderRadius?config.style.bgBorderRadius+'px':0,margin:config.style?.bgMargin?config.style.bgMargin+'px':0,padding:config.style?.bgPadding?config.style.bgPadding+'px':0}">
      <div class="item" :style="{'margin-right':config.style?.imageMargin?config.style?.imageMargin+'px':0, width:'calc(50% - '+((config.style.imageMargin)/2)+' px)'}">
        <el-image :src="config.items.item1.image+'?x-oss-process=style/300'" fit="fill" class="img" :style="{width:'100%',height:'100%', 'border-radius':(config.style?.imageBorderRadius?config.style?.imageBorderRadius+'px':0)}"></el-image>
      </div>
      <div class="item" :style="{width:'calc(50% - '+((config.style.imageMargin)/2)+'px)'}">
        <el-image :src="config.items.item2.image+'?x-oss-process=style/300'" fit="fill" class="img" :style="{width:'100%',height:'100%', 'border-radius':(config.style?.imageBorderRadius?config.style?.imageBorderRadius+'px':0)}"></el-image>
      </div>
    </div>
    <div v-if="config.style.type===3" class="style-3" :style="{'background-color':config.style?.bgColor,'border-radius':config.style?.bgBorderRadius?config.style.bgBorderRadius+'px':0,margin:config.style?.bgMargin?config.style.bgMargin+'px':0,padding:config.style?.bgPadding?config.style.bgPadding+'px':0}">
      <div class="item" :style="{'margin-right':config.style?.imageMargin?config.style?.imageMargin+'px':0, width:'calc(33.3333333% - '+((config.style.imageMargin)*2/3)+' px)'}">
        <el-image :src="config.items.item1.image+'?x-oss-process=style/300'" fit="fill" class="img" :style="{width:'100%',height:'100%', 'border-radius':(config.style?.imageBorderRadius?config.style?.imageBorderRadius+'px':0)}"></el-image>
      </div>
      <div class="item" :style="{'margin-right':config.style?.imageMargin?config.style?.imageMargin+'px':0,width:'calc(33.3333333% - '+((config.style.imageMargin)*2/3)+'px)'}">
        <el-image :src="config.items.item2.image+'?x-oss-process=style/300'" fit="fill" class="img" :style="{width:'100%',height:'100%', 'border-radius':(config.style?.imageBorderRadius?config.style?.imageBorderRadius+'px':0)}"></el-image>
      </div>
      <div class="item" :style="{width:'calc(33.3333333% - '+((config.style.imageMargin)*2/3)+'px)'}">
        <el-image :src="config.items.item3.image+'?x-oss-process=style/300'" fit="fill" class="img" :style="{width:'100%',height:'100%', 'border-radius':(config.style?.imageBorderRadius?config.style?.imageBorderRadius+'px':0)}"></el-image>
      </div>
    </div>
    <div v-if="config.style.type===4" class="style-4" :style="{'background-color':config.style?.bgColor,'border-radius':config.style?.bgBorderRadius?config.style.bgBorderRadius+'px':0,margin:config.style?.bgMargin?config.style.bgMargin+'px':0,padding:config.style?.bgPadding?config.style.bgPadding+'px':0}">
      <div class="item" :style="{'margin-right':config.style?.imageMargin?config.style?.imageMargin+'px':0, width:'calc(50% - '+((config.style.imageMargin)/2)+' px)'}">
        <el-image :src="config.items.item1.image+'?x-oss-process=style/300'" fit="fill" class="img" :style="{width:'100%',height:'100%', 'border-radius':(config.style?.imageBorderRadius?config.style?.imageBorderRadius+'px':0)}"></el-image>
      </div>
      <div class="item" :style="{width:'calc(50% - '+((config.style.imageMargin)/2)+'px)'}">
        <el-image :src="config.items.item2.image+'?x-oss-process=style/300'" fit="fill" class="img-right" :style="{'margin-bottom':config.style?.imageMargin?config.style?.imageMargin+'px':0,width:'100%',height:'85px', 'border-radius':(config.style?.imageBorderRadius?config.style?.imageBorderRadius+'px':0)}"></el-image>
        <el-image :src="config.items.item3.image+'?x-oss-process=style/300'" fit="fill" class="img-right" :style="{width:'100%',height:'85px', 'border-radius':(config.style?.imageBorderRadius?config.style?.imageBorderRadius+'px':0)}"></el-image>
      </div>
    </div>
    <div v-if="config.style.type===5" class="style-5" :style="{'background-color':config.style?.bgColor,'border-radius':config.style?.bgBorderRadius?config.style.bgBorderRadius+'px':0,margin:config.style?.bgMargin?config.style.bgMargin+'px':0,padding:config.style?.bgPadding?config.style.bgPadding+'px':0}">
      <div class="item" :style="{'margin-right':config.style?.imageMargin?config.style?.imageMargin+'px':0, width:'calc(25% - '+((config.style.imageMargin)/2)+' px)'}">
        <el-image :src="config.items.item1.image+'?x-oss-process=style/300'" fit="fill" class="img" :style="{width:'100%',height:'100%', 'border-radius':(config.style?.imageBorderRadius?config.style?.imageBorderRadius+'px':0)}"></el-image>
      </div>
      <div class="item" :style="{'margin-right':config.style?.imageMargin?config.style?.imageMargin+'px':0, width:'calc(25% - '+((config.style.imageMargin)/2)+'px)'}">
        <el-image :src="config.items.item2.image+'?x-oss-process=style/300'" fit="fill" class="img" :style="{width:'100%',height:'100%', 'border-radius':(config.style?.imageBorderRadius?config.style?.imageBorderRadius+'px':0)}"></el-image>
      </div>
      <div class="item" :style="{'margin-right':config.style?.imageMargin?config.style?.imageMargin+'px':0, width:'calc(25% - '+((config.style.imageMargin)/2)+'px)'}">
        <el-image :src="config.items.item3.image+'?x-oss-process=style/300'" fit="fill" class="img" :style="{width:'100%',height:'100%', 'border-radius':(config.style?.imageBorderRadius?config.style?.imageBorderRadius+'px':0)}"></el-image>
      </div>
      <div class="item" :style="{width:'calc(25% - '+((config.style.imageMargin)/2)+'px)'}">
        <el-image :src="config.items.item4.image+'?x-oss-process=style/300'" fit="fill" class="img" :style="{width:'100%',height:'100%', 'border-radius':(config.style?.imageBorderRadius?config.style?.imageBorderRadius+'px':0)}"></el-image>
      </div>
    </div>
    <div v-if="config.style.type===6" class="style-6" :style="{'background-color':config.style?.bgColor,'border-radius':config.style?.bgBorderRadius?config.style.bgBorderRadius+'px':0,margin:config.style?.bgMargin?config.style.bgMargin+'px':0,padding:config.style?.bgPadding?config.style.bgPadding+'px':0}">
      <div class="item" :style="{'margin-right':config.style?.imageMargin?config.style?.imageMargin+'px':0, width:'calc(50% - '+((config.style.imageMargin)/2)+' px)'}">
        <el-image :src="config.items.item1.image+'?x-oss-process=style/300'" fit="fill" class="img" :style="{'margin-bottom':config.style?.imageMargin?config.style?.imageMargin+'px':0,width:'100%',height:'85px', 'border-radius':(config.style?.imageBorderRadius?config.style?.imageBorderRadius+'px':0)}"></el-image>
        <el-image :src="config.items.item2.image+'?x-oss-process=style/300'" fit="fill" class="img" :style="{width:'100%',height:'85px', 'border-radius':(config.style?.imageBorderRadius?config.style?.imageBorderRadius+'px':0)}"></el-image>
      </div>
      <div class="item" :style="{width:'calc(50% - '+((config.style.imageMargin)/2)+'px)'}">
        <el-image :src="config.items.item3.image+'?x-oss-process=style/300'" fit="fill" class="img-right" :style="{'margin-bottom':config.style?.imageMargin?config.style?.imageMargin+'px':0,width:'100%',height:'85px', 'border-radius':(config.style?.imageBorderRadius?config.style?.imageBorderRadius+'px':0)}"></el-image>
        <el-image :src="config.items.item4.image+'?x-oss-process=style/300'" fit="fill" class="img-right" :style="{width:'100%',height:'85px', 'border-radius':(config.style?.imageBorderRadius?config.style?.imageBorderRadius+'px':0)}"></el-image>
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
		style: {
			/**
			 * 显示行数
			 */
			lineCount: number;
			/**
			 * 显示个数
			 */
			showCount: number;
			iconSize: number;
			iconMargin: number;
		};
	};
}

export default {
	name: "image-magic",
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

		onMounted(() => {});

		//#region 方法
		let methods = {
			// 获取当前页数据
			getCurrentPage(pageIndex: number) {
				let dataList = proxy.config.items.filter((item: any, index: number) => {
					let pageSize = (proxy.config.style.lineCount || 1) * (proxy.config.style.showCount || 4);

					return index >= pageIndex * pageSize && index < (pageIndex + 1) * pageSize;
				});

				return dataList;
			},
			loadBScroll() {
				// 单行时，加载betterScoll组件
				loadBetterScroll(() => {
					let wrapper = document.getElementById("nav-group-wrapper");
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
			proxy.mittBus.on("onNavGroup:typeChange", () => {});
		});

		return {
			...toRefs(state),
			...methods,
		};
	},
};
</script>

<style lang="scss" scoped>
.style-1 {
	width: 100%;
}
.style-2 {
	display: flex;
	justify-content: space-between;
	.item {
		width: 50%;
	}
}
.style-3 {
	display: flex;
	justify-content: space-between;
	.item {
		width: 33.3333333%;
	}
}
.style-4 {
	display: flex;
	justify-content: space-between;
	.item {
		width: 50%;
		.img-right {
			height: 50%;
		}
	}
}
.style-5 {
	display: flex;
	justify-content: space-between;
	.item {
		width: 25%;
	}
}
.style-6 {
	display: flex;
	justify-content: space-between;
	.item {
		width: 50%;
	}
}
</style>
