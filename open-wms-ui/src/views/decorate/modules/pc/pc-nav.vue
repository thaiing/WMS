<!--导航组-->
<template>
	<div :class="['module-container', config.style.boxShadow ? 'box-shadow' : '']" :style="{ 'background-color': config.style?.moduleBgColor, 'border-radius': config.style.moduleBorderRadius + 'px', 'margin-top': config.style.moduleMarginTop + 'px', 'margin-bottom': config.style.moduleMarginBottom + 'px', 'margin-left': config.style.moduleMarginLeft + 'px', 'margin-right': config.style.moduleMarginRight + 'px', 'padding-top': config.style.modulePaddingTop + 'px', 'padding-bottom': config.style.modulePaddingBottom + 'px', 'padding-left': config.style.modulePaddingLeft + 'px', 'padding-right': config.style.modulePaddingRight + 'px', border: config.style.moduleBorderStyle + ' ' + (config.style.moduleBorderWidth + 'px') + ' ' + config.style.moduleBorderColor }">
		<div v-if="config.header?.showHeader" class="header-box" :style="{ 'background-color': config.header?.bgColor, 'padding-left': config.header?.bgMargin ? config.header.bgMargin + 'px' : 0, 'padding-right': config.header?.bgMargin ? config.header.bgMargin + 'px' : 0 }">
			<div class="inner" :style="{ 'background-color': config.header?.innerBgColor, 'border-radius': config.header?.borderRadius ? config.header.borderRadius + 'px' : 0, padding: config.header?.bgPadding ? config.header.bgPadding + 'px' : 0, 'line-height': config.header.lineHeight + 'px' }">
				<div v-if="config.header.image" class="img" :style="{ width: (config.header.width || 24) + 'px', height: (config.header.height || 24) + 'px' }">
					<el-image :src="config.header.image" :fit="config.header.fit" class="img" :style="{ width: (config.header.width || 24) + 'px', height: (config.header.height || 24) + 'px' }"> </el-image>
				</div>
				<div class="title-box" :style="{ color: config.header.titleColor, 'font-size': config.header.fontSize ? config.header.fontSize + 'px' : undefined, 'text-align': config.header.align }">
					{{ config.header.title }}
				</div>
				<div v-if="config.header.subTitle" class="sub-title" :style="{ color: config.header.subColor, 'margin-left': config.header.align === 'left' ? 'auto' : 0 }">
					{{ config.header.subTitle }}
				</div>
				<div v-if="config.header.showMore" class="more" :style="{ color: config.header.moreColor, 'margin-left': config.header.align === 'left' ? 'auto' : 0 }">{{ config.header.moreText }} <i class="el-icon-yrt-youjiantou5"></i></div>
			</div>
		</div>
		<div v-if="config.style.type === '单行展示'" class="items-1" :style="{ 'background-color': config.style?.bgColor, 'border-radius': config.style?.bgBorderRadius ? config.style.bgBorderRadius + 'px' : 0, margin: config.style?.bgMargin ? config.style.bgMargin + 'px' : 0, padding: config.style?.bgPadding ? config.style.bgPadding + 'px' : 0 }">
			<div id="nav-group-wrapper" class="scroll-wrapper" ref="scroll">
				<div class="scroll-content">
					<div v-for="(item, index) in config.items" :key="index" class="item" :style="{ 'margin-right': (config.style?.iconMargin === undefined ? 10 : config.style?.iconMargin) + 'px' }">
						<el-image :src="item.image" fit="fill" class="img" :style="{ width: (config.style?.iconSize === undefined ? 60 : config.style?.iconSize) + 'px', height: (config.style?.iconSize === undefined ? 60 : config.style?.iconSize) + 'px', 'border-radius': config.style?.iconStyle === '圆形' ? (config.style?.iconSize || 60) / 2 + 'px' : '' }"></el-image>
						<div class="name" :style="{ 'font-size': (config.style?.fontSize === undefined ? 12 : config.style?.fontSize) + 'px', color: config.style?.fontColor }">{{ item.name }}</div>
					</div>
				</div>
			</div>
		</div>
		<div v-else class="items-2" :style="{ 'background-color': config.style?.bgColor, 'border-radius': config.style?.bgBorderRadius ? config.style.bgBorderRadius + 'px' : 0, margin: config.style?.bgMargin ? config.style.bgMargin + 'px' : 0, padding: config.style?.bgPadding ? config.style.bgPadding + 'px' : 0, '--indicator-olor': config.style.indicatorColor }">
			<el-carousel arrow="never" :autoplay="false" :height="(config.style.contentHeight || 160) + 'px'" :indicator-position="config.style.indicatorStyle == 'none' ? 'none' : 'outside'" :class="[config.style.indicatorStyle == 'circle' ? 'carousel-circle' : '']">
				<el-carousel-item v-for="(item, index) in pageCount" :key="item">
					<div class="items">
						<template v-for="(item, index2) in getCurrentPage(index)">
							<div class="item" :style="{ width: 100 / config.style.showCount + '%', 'margin-bottom': config.style.iconMargin + 'px' }" @click="goUrl(item.url)">
								<div style="{ width: (config.style?.iconSize === undefined ? 60 : config.style?.iconSize) + 'px', height: (config.style?.iconSize === undefined ? 60 : config.style?.iconSize) + 'px', 'border-radius': config.style?.iconStyle === '圆形' ? (config.style?.iconSize || 60) / 2 + 'px' : '' }">
									<svg-icon :name="item.icon" :size="config.style.iconSize" :color="item.iconColor"></svg-icon>
								</div>
								<div class="name" :style="{ 'font-size': (config.style?.fontSize === undefined ? 12 : config.style?.fontSize) + 'px', color: config.style?.fontColor, 'line-height': config.style.lineHeight + 'px' }">{{ item.name }}</div>
							</div>
						</template>
						<div v-for="index in blankItems" itemid="item-empty" :style="{ width: 100 / config.style.showCount + '%' }"></div>
					</div>
				</el-carousel-item>
			</el-carousel>
		</div>
	</div>
</template>

<script setup lang="ts" name="pc-nav">
import { reactive, toRefs, getCurrentInstance, computed, ComponentInternalInstance, ComponentPublicInstance, onMounted } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import BetterScroll from 'better-scroll';
import { useRouter } from 'vue-router';

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const router = useRouter();

//#region 定义属性
const props = defineProps({
	// 配置参数
	config: {
		type: Object,
		default: () => {
			return {};
		},
	},
	// 预览模式
	isViewer: {
		type: Boolean,
		default: false,
	},
});
//#endregion

//#region 属性
const state = reactive({
	carouselCount: 1,
});
//#endregion

//#region 计算属性
// 总页数
let pageCount = computed(() => {
	let count = props.config.items.length;
	let pages = Math.ceil(count / ((props?.config.style.lineCount || 1) * (props.config.style.showCount || 4)));

	return pages;
});
// 空白标签个数
let blankItems = computed(() => {
	let count = props.config.items.length;
	let blankCount = count % (props.config.style.showCount || 4);

	return blankCount;
});
//#endregion

//#region 方法
// 获取当前页数据
const getCurrentPage = (pageIndex: number) => {
	let dataList = props.config.items.filter((item: any, index: number) => {
		let pageSize = (props.config.style.lineCount || 1) * (props.config.style.showCount || 4);

		return index >= pageIndex * pageSize && index < (pageIndex + 1) * pageSize;
	});

	return dataList;
};

const loadBScroll = () => {
	// 加载betterScoll组件
	let wrapper = document.getElementById('nav-group-wrapper');
	if (!wrapper) return;

	let bs = BetterScroll(wrapper, {
		bindToTarget: true,
		scrollX: true,
		scrollY: false,
		freeScroll: true,
		bounce: true,
		movable: true, // for movable plugin
	});
};

// 改变指示器颜色
const indicatorChange = () => {
	let circle = document.getElementsByClassName('carousel-circle');
};

// 跳转页面
const goUrl = (path: string) => {
	if (path && props.isViewer) router.push({ path });
};
//#endregion

onMounted(() => {
	loadBScroll();
	// 响应样式事件
	proxy.mittBus.on('onNavGroup:typeChange', () => {
		loadBScroll();
	});
	// 相应指示器事件
	proxy.mittBus.on('onNavGroup:indicatorChange', () => {
		indicatorChange();
	});
});
</script>

<style lang="scss" scoped>
.header-box {
	.inner {
		display: flex;
		justify-content: space-between;
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
	.scroll-wrapper {
		position: relative;
		display: flex;
		align-content: center;
		white-space: nowrap;
		overflow: hidden;
		.scroll-content {
			display: inline-block;
			align-self: center;
		}
		.item {
			+ .item {
				margin-left: 10px;
			}
			box-sizing: border-box;
			width: 60px;
			display: inline-block;
			text-align: center;
			.name {
				color: var(--el-text-color-regular);
				font-size: 12px;
			}
		}
	}
}

.items-2 {
	.carousel-circle {
		:deep(.el-carousel__button) {
			width: 8px;
			height: 8px;
			border-radius: 4px;
		}
		:deep(.el-carousel__indicators--outside button) {
			background-color: var(--indicator-olor);
		}
	}
	.items {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		overflow: hidden;
		.item {
			width: 25%;
			text-align: center;
			box-sizing: border-box;
			width: 60px;
			display: inline-block;
			text-align: center;
			.name {
				color: var(--el-text-color-regular);
				font-size: 12px;
			}
		}
		.item-empty {
			width: calc(25% - 5px);
			margin-bottom: 0px;
			margin-left: 5px;
			height: 0;
		}
	}
}
.box-shadow {
	width: 100%;
	&:hover {
		box-shadow: 0 2px 12px var(--next-color-dark-hover);
		transition: all ease 0.3s;
	}
	&-icon {
		width: 70px;
		height: 70px;
		border-radius: 100%;
		flex-shrink: 1;
		i {
			color: var(--el-text-color-placeholder);
		}
	}
	&-title {
		font-size: 15px;
		font-weight: bold;
		height: 30px;
	}
}
</style>
