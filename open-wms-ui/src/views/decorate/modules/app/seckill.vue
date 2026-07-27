<!--促销列表 - 参数设置-->
<template>
	<div class="module-container" :style="{ 'margin-top': config.style?.maginTop ? config.style.maginTop + 'px' : 0 }">
		<div class="header-box" :style="{ 'background-color': config.header?.bgColor, 'padding-left': config.header?.bgMargin ? config.header.bgMargin + 'px' : 0, 'padding-right': config.header?.bgMargin ? config.header.bgMargin + 'px' : 0 }">
			<div class="inner" :style="{ 'background-color': config.header?.innerBgColor, 'border-radius': config.header?.borderRadius ? config.header.borderRadius + 'px' : 0, padding: config.header?.bgPadding ? config.header.bgPadding + 'px' : 0 }">
				<div v-if="config.header.image" class="img">
					<el-image class="img" :src="config.header.image" fit="scale-down" :style="{ width: (config.header.width || 24) + 'px', height: (config.header.height || 24) + 'px' }"> </el-image>
				</div>
				<div class="title-box" :style="{ color: config.header.color, 'font-size': config.header.fontSize ? config.header.fontSize + 'px' : null, 'text-align': config.header.align }">
					{{ config.header.title }}
				</div>
				<div v-if="config.header.showMore" class="arrow-right" :style="{ 'margin-left': config.header.align === 'left' ? 'auto' : 0 }">
					<i class="el-icon-yrt-youjiantou5"></i>
				</div>
			</div>
		</div>
		<div v-if="config.style?.displayMode === '单列'" class="items-1" :style="{ 'background-color': config.style?.bgColor, 'border-radius': config.style?.bgBorderRadius ? config.style.bgBorderRadius + 'px' : 0, margin: config.style?.bgMargin ? config.style.bgMargin + 'px' : 0, padding: config.style?.bgPadding ? config.style.bgPadding + 'px' : 0 }">
			<div v-for="(item, itemIndex) in productList" class="item" :style="{ 'margin-top': config.style?.productMaginTop && itemIndex > 0 ? config.style.productMaginTop + 'px' : 0, 'background-color': config.style?.productBgColor, 'border-radius': config.style?.productBorderRadius ? config.style.productBorderRadius + 'px' : 0 }">
				<div class="img-box">
					<el-image class="img" :src="getFirstImage(item.images)" fit="contain"> </el-image>
				</div>
				<div class="main">
					<div v-if="config.common.showTitle" class="title" :style="{ color: config.style.titleColor }">{{ item.productName }}</div>
					<div v-if="config.common.showOriginPrice" class="origin-price" :style="{ color: config.style.originPriceColor }">{{ common.formatNumber(item.dayPrice, '￥0.00') }}</div>
					<div v-if="config.common.showPrice" class="sale-price">
						<span class="price" :style="{ color: config.style.salePriceColor }">
							{{ common.formatNumber(item.salePrice, '￥0.00') }}
						</span>
						<span v-if="config.common.showCoupon" class="quan" :style="{ color: config.style.labelColor, 'border-color': config.style.labelColor }">券</span>
					</div>
				</div>
			</div>
		</div>
		<div v-else-if="config.style?.displayMode === '两列'" class="items-2" :style="{ 'background-color': config.style?.bgColor, 'border-radius': config.style?.bgBorderRadius ? config.style.bgBorderRadius + 'px' : 0, margin: config.style?.bgMargin ? config.style.bgMargin + 'px' : 0, padding: config.style?.bgPadding ? config.style.bgPadding + 'px' : 0 }">
			<div v-for="(item, itemIndex) in productList" class="item" :style="{ 'margin-bottom': config.style?.productMaginTop && itemIndex < productList.length - (productList.length % 2 === 0 ? 2 : 1) ? config.style.productMaginTop + 'px' : 0, 'margin-right': config.style?.productMaginTop && itemIndex % 2 === 0 ? config.style.productMaginTop + 'px' : 0, width: config.style?.productMaginTop ? 'calc(50% - ' + config.style.productMaginTop / 2 + 'px)' : '50%', 'background-color': config.style?.productBgColor, 'border-radius': config.style?.productBorderRadius ? config.style.productBorderRadius + 'px' : 0 }">
				<div class="img-box">
					<el-image class="img" :src="getFirstImage(item.images, 200)" fit="contain"> </el-image>
				</div>
				<div class="main">
					<div v-if="config.common.showTitle" class="title" :style="{ color: config.style.titleColor }">{{ item.productName }}</div>
					<div v-if="config.common.showOriginPrice" class="origin-price" :style="{ color: config.style.originPriceColor }">{{ common.formatNumber(item.dayPrice, '￥0.00') }}</div>
					<div v-if="config.common.showPrice" class="sale-price">
						<span class="price" :style="{ color: config.style.salePriceColor }">
							{{ common.formatNumber(item.salePrice, '￥0.00') }}
						</span>
						<span v-if="config.common.showCoupon" class="quan" :style="{ color: config.style.labelColor, 'border-color': config.style.labelColor }">券</span>
					</div>
				</div>
			</div>
		</div>
		<div v-else-if="config.style?.displayMode === '三列'" class="items-3" :style="{ 'background-color': config.style?.bgColor, 'border-radius': config.style?.bgBorderRadius ? config.style.bgBorderRadius + 'px' : 0, margin: config.style?.bgMargin ? config.style.bgMargin + 'px' : 0, padding: config.style?.bgPadding ? config.style.bgPadding + 'px' : 0 }">
			<div v-for="(item, itemIndex) in productList" class="item" :style="{ 'margin-bottom': config.style?.productMaginTop && itemIndex < productList.length - (productList.length % 3 === 0 ? 3 : productList.length % 3 === 1 ? 1 : 2) ? config.style.productMaginTop + 'px' : 0, 'margin-right': config.style?.productMaginTop && itemIndex % 3 < 2 ? config.style.productMaginTop + 'px' : 0, width: config.style?.productMaginTop ? 'calc(33% - ' + (config.style.productMaginTop * 2) / 3 + 'px)' : '33.3333%', 'background-color': config.style?.productBgColor, 'border-radius': config.style?.productBorderRadius ? config.style.productBorderRadius + 'px' : 0 }">
				<div class="img-box">
					<el-image class="img" :src="getFirstImage(item.images, 200)" fit="contain"> </el-image>
				</div>
				<div class="main">
					<div v-if="config.common.showTitle" class="title" :style="{ color: config.style.titleColor }">{{ item.productName }}</div>
					<div v-if="config.common.showOriginPrice" class="origin-price" :style="{ color: config.style.originPriceColor }">{{ common.formatNumber(item.dayPrice, '￥0.00') }}</div>
					<div v-if="config.common.showPrice" class="sale-price">
						<span class="price" :style="{ color: config.style.salePriceColor }">
							{{ common.formatNumber(item.salePrice, '￥0.00') }}
						</span>
						<span v-if="config.common.showCoupon" class="quan" :style="{ color: config.style.labelColor, 'border-color': config.style.labelColor }">券</span>
					</div>
				</div>
			</div>
			<div v-if="productList.length % 3 === 1" class="item-empty" :style="{ 'margin-right': config.style?.productMaginTop && itemIndex % 3 < 2 ? config.style.productMaginTop + 'px' : 0, width: config.style?.productMaginTop ? 'calc(33% - ' + (config.style.productMaginTop * 2) / 3 + 'px)' : '33.3333%' }"></div>
			<div v-if="productList.length % 3 === 2" class="item-empty" :style="{ width: config.style?.productMaginTop ? 'calc(33% - ' + (config.style.productMaginTop * 2) / 3 + 'px)' : '33.3333%' }"></div>
		</div>
		<div v-else-if="config.style?.displayMode === '大图'" class="items-4" :style="{ 'background-color': config.style?.bgColor, 'border-radius': config.style?.bgBorderRadius ? config.style.bgBorderRadius + 'px' : 0, margin: config.style?.bgMargin ? config.style.bgMargin + 'px' : 0, padding: config.style?.bgPadding ? config.style.bgPadding + 'px' : 0 }">
			<div v-for="(item, itemIndex) in productList" class="item" :style="{ 'margin-top': config.style?.productMaginTop && itemIndex > 0 ? config.style.productMaginTop + 'px' : 0, 'background-color': config.style?.productBgColor, 'border-radius': config.style?.productBorderRadius ? config.style.productBorderRadius + 'px' : 0 }">
				<div class="img-box">
					<el-image class="img" :src="getFirstImage(item.images, 500)" fit="contain"> </el-image>
				</div>
				<div class="main">
					<div v-if="config.common.showTitle" class="title" :style="{ color: config.style.titleColor }">{{ item.productName }}</div>
					<div v-if="config.common.showOriginPrice" class="origin-price" :style="{ color: config.style.originPriceColor }">{{ common.formatNumber(item.dayPrice, '￥0.00') }}</div>
					<div v-if="config.common.showPrice" class="sale-price">
						<span class="price" :style="{ color: config.style.salePriceColor }">
							{{ common.formatNumber(item.salePrice, '￥0.00') }}
						</span>
						<span v-if="config.common.showCoupon" class="quan" :style="{ color: config.style.labelColor, 'border-color': config.style.labelColor }">券</span>
					</div>
				</div>
			</div>
		</div>
		<div v-else class="display-mode-none">商品列表未设置模式</div>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance, computed, onMounted } from 'vue';

export default {
	name: 'app-design-left-panel',
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
			productList: [], // 商品列表
			currentItem: null, // 选择类别
		});

		//#region 方法
		let methods = {
			// 根据类别获取商品信息
			getProductList() {
				let typeId = proxy.config.auto?.typeId;
				let url = '/api/common/loadDataList';
				let where = {
					typeId: {
						operator: 'raw2',
						menu_Id: 'recursionTypeId',
						value: typeId,
					},
				};
				let orderByType = proxy.config.auto?.orderByType || 'DESC';
				let orderByField = proxy.config.auto?.orderByField || '综合';
				let orderBy = {};
				if (orderByField === '综合') {
					orderBy = {
						productId: orderByType,
					};
				} else if (orderByField === '销量') {
					orderBy = {
						buyNum: orderByType,
					};
				} else if (orderByField === '价格') {
					orderBy = {
						salePrice: orderByType,
					};
				}
				let params = {
					projectName: 'Rattan.BasicInfo',
					tableView: 'Base_ProductInfo',
					idField: 'productId',
					folder: 'basicInfo/base',
					menu_Id: 6,
					pageIndex: 1,
					pageSize: proxy.config.auto.productCount || 5,
					where: where,
					orderBy: orderBy,
					select: ['productId', 'productCode', 'productName', 'images', 'dayPrice', 'salePrice'],
				};
				proxy.common.ajax(
					url,
					params,
					(res: any) => {
						proxy.common.showMsg(res);
						if (res.result) {
							proxy.productList = res.data.rows;
						}
						proxy.initLoading = false;
					},
					false
				);
			},
			// 获得图片列表
			getFirstImage(url: any, style: string) {
				let imgUrl = '';
				if (!url) url = '';
				const imgs = url.split(',');
				if (imgs.length) {
					imgUrl = imgs[0] + '?x-oss-process=style/' + (style || 'small');
				}
				return imgUrl;
			},
		};
		//#endregion

		// 页面加载完毕事件
		onMounted(() => {
			proxy.getProductList();
			proxy.mittBus.on('onReload:seckill', (res: any) => {
				proxy.getProductList();
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
.module-container {
	min-height: 20px;
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
			width: 100%;
		}
		.arrow-right {
			width: 20px;
			padding-top: 0px;
			padding-left: 5px;
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
				width: calc(100% - 80px);
				.title {
					font-size: 14px;
				}
				.origin-price {
					color: var(--color-info);
					line-height: 28px;
					text-decoration: line-through;
				}
				.sale-price {
					color: var(--color-red);
					line-height: 28px;
					font-size: 18px;
					.quan {
						border: 1px solid var(--color-red);
						padding: 2px;
						font-size: 12px;
						margin-left: 5px;
					}
				}
			}
		}
	}
	.items-2 {
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
				.origin-price {
					color: var(--color-info);
					line-height: 28px;
					text-decoration: line-through;
				}
				.sale-price {
					color: var(--color-red);
					line-height: 28px;
					font-size: 18px;
					.quan {
						border: 1px solid var(--color-red);
						padding: 2px;
						font-size: 12px;
						margin-left: 5px;
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
				.origin-price {
					color: var(--color-info);
					line-height: 28px;
					text-decoration: line-through;
				}
				.sale-price {
					color: var(--color-red);
					line-height: 28px;
					font-size: 18px;
					.quan {
						border: 1px solid var(--color-red);
						padding: 2px;
						font-size: 12px;
						margin-left: 5px;
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
				.origin-price {
					color: var(--color-info);
					line-height: 28px;
					text-decoration: line-through;
				}
				.sale-price {
					color: var(--color-red);
					line-height: 28px;
					font-size: 18px;
					.quan {
						border: 1px solid var(--color-red);
						padding: 2px;
						font-size: 12px;
						margin-left: 5px;
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
