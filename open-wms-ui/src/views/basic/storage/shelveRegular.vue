<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" @on-row-change="onRowChange"> </yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" @on-row-change="onRowChange" @on-add-load-after="base.onAddLoadAfter">
			<template #blank-jsonData="{ formData }">
				<el-row :gutter="20" class="margin-bottom-10" style="width: 100%">
					<el-col :span="12">
						<el-card class="json-card">
							<div slot="header" class="clearfix">
								<span>已选条件</span>
							</div>
							<el-form ref="form" :model="state.jsonData" label-width="150px" class="json-form">
								<el-form-item v-if="state.jsonData.condition.brandInfo.isSelect" label="按商品品牌" class="json-item">
									<el-select v-model="state.jsonData.condition.brandInfo.brandList" multiple placeholder="指定品牌" class="input-300">
										<el-option v-for="item in state.brandList" :key="item.brandId" :label="item.brandName" :value="item.brandId"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item v-if="state.jsonData.condition.typeInfo.isSelect" label="按商品类别">
									<el-link type="primary" @click="orderSource">请选择商品类别：{{ state.typeNameList }}</el-link>
								</el-form-item>
								<el-form-item v-if="state.jsonData.condition.productInfo.isSelect" label="按商品">
									<el-button link @click="selectProduct(state.jsonData.condition.productInfo.products)">指定商品</el-button>
									<div v-for="(items, indexs) in state.jsonData.condition.productInfo.products" :key="indexs" class="margin-top-5 line-height-1_5">[{{ items.productCode }}] {{ items.productName }}</div>
								</el-form-item>
								<el-form-item v-if="state.jsonData.condition.turnoverInfo.isSelect" label="按商品周转率" style="margin-top: 5px">
									<el-input v-model="state.jsonData.condition.turnoverInfo.turnoverMin" style="width: 50px"></el-input>
									~
									<el-input v-model="state.jsonData.condition.turnoverInfo.turnoverMax" style="width: 50px"></el-input>
								</el-form-item>
								<el-form-item v-if="state.jsonData.condition.volumeInfo.isSelect" label="按商品单位体积" style="margin-top: 5px">
									<el-input v-model="state.jsonData.condition.volumeInfo.volumeMin" style="width: 50px"></el-input>
									~
									<el-input v-model="state.jsonData.condition.volumeInfo.volumeMax" style="width: 50px"></el-input>
								</el-form-item>
								<el-form-item v-if="state.jsonData.condition.weightInfo.isSelect" label="按商品单位重量" style="margin-top: 5px">
									<el-input v-model="state.jsonData.condition.weightInfo.weightMin" style="width: 50px"></el-input>
									~
									<el-input v-model="state.jsonData.condition.weightInfo.weightMax" style="width: 50px"></el-input>
								</el-form-item>
								<el-form-item v-if="state.jsonData.condition.quantityInfo.isSelect" label="按到货单商品数量" style="margin-top: 5px">
									<el-input v-model="state.jsonData.condition.quantityInfo.quantityMin" style="width: 50px"></el-input>
									~
									<el-input v-model="state.jsonData.condition.quantityInfo.quantityMax" style="width: 50px"></el-input>
								</el-form-item>
								<el-form-item v-if="state.jsonData.condition.consignorInfo.isSelect" label="按货主" class="json-item" style="margin-top: 5px">
									<el-select v-model="state.jsonData.condition.consignorInfo.consignorList" multiple placeholder="指定货主" class="input-300">
										<el-option v-for="item in state.consignorList" :key="item.consignorId" :label="item.consignorName" :value="item.consignorId"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item v-if="state.jsonData.condition.providerInfo.isSelect" multiple label="供应商" class="json-item" style="margin-top: 5px">
									<el-select v-model="state.jsonData.condition.providerInfo.providerShortName" placeholder="指定供应商" class="input-300">
										<el-option v-for="item in state.providerNames" :key="item.providerId" :label="item.providerShortName" :value="item.providerShortName"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item v-if="state.jsonData.condition.batchNumberInfo.isSelect" label="同批次" class="json-item">
									<!-- <el-input v-model="state.jsonData.condition.batchNumberInfo.batchNumber" placeholder="请输入内容"> </el-input> -->
									<el-checkbox v-model="state.jsonData.condition.batchNumberInfo.batchNumber" disabled></el-checkbox>
								</el-form-item>
								<el-form-item v-if="state.jsonData.condition.noCondition.isSelect" label="无条件" class="json-item"> * </el-form-item>
							</el-form>
						</el-card>
					</el-col>
					<el-col :span="12">
						<el-card class="json-card">
							<div slot="header" class="clearfix">
								<span>待选条件</span>
							</div>
							<el-form ref="form" :model="state.jsonData" label-width="80px" label-position="top">
								<el-form-item label="货品">
									<el-checkbox v-model="state.jsonData.condition.brandInfo.isSelect">按商品品牌</el-checkbox>
									<el-checkbox v-model="state.jsonData.condition.typeInfo.isSelect">按商品类别</el-checkbox>
									<el-checkbox v-model="state.jsonData.condition.productInfo.isSelect">按商品</el-checkbox>
								</el-form-item>
								<el-form-item style="margin-top: 5px" v-if="state.jsonData.condition.brandInfo.isSelect || state.jsonData.condition.typeInfo.isSelect || state.jsonData.condition.productInfo.isSelect">
									<el-checkbox v-model="state.jsonData.condition.quantityInfo.isSelect">按到货单商品数量</el-checkbox>
								</el-form-item>
								<el-form-item style="margin-top: 5px">
									<el-checkbox v-model="state.jsonData.condition.turnoverInfo.isSelect">按商品周转率 选择商品周转率范围</el-checkbox>
								</el-form-item>
								<el-form-item style="margin-top: 5px">
									<el-checkbox v-model="state.jsonData.condition.volumeInfo.isSelect">按商品单位体积</el-checkbox>
									<el-checkbox v-model="state.jsonData.condition.weightInfo.isSelect">按商品单位重量</el-checkbox>
									<el-checkbox v-model="state.jsonData.condition.consignorInfo.isSelect">按货主</el-checkbox>
									<el-checkbox v-model="state.jsonData.condition.providerInfo.isSelect">供应商</el-checkbox>
									<el-checkbox v-model="state.jsonData.condition.batchNumberInfo.isSelect">同批次</el-checkbox>
									<el-checkbox v-model="state.jsonData.condition.noCondition.isSelect" title="无条件">*</el-checkbox>
								</el-form-item>
							</el-form>
						</el-card>
					</el-col>
				</el-row>

				<el-row :gutter="20" class="margin-bottom-10" style="width: 100%">
					<el-col :span="12">
						<el-card class="json-card">
							<div slot="header" class="clearfix">
								<span>设定动作</span>
							</div>
							<el-form ref="form" :model="state.jsonData" label-width="150px" class="json-form">
								<el-form-item v-if="state.jsonData.target.storageAreaInfo.isSelect" label="按库区推荐" class="json-item">
									<el-select v-model="state.jsonData.target.storageAreaInfo.areas" multiple placeholder="选择库区" class="input-300" @change="chAreaCodes">
										<el-option v-for="item in state.areaCodes" :key="item" :label="item" :value="item"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item v-if="state.jsonData.target.channelInfo.isSelect" label="按通道推荐" class="json-item">
									<el-select v-model="state.jsonData.target.channelInfo.channelCodes" multiple placeholder="选择通道" class="input-300" @change="chChannelCodes">
										<el-option v-for="item in state.channelCodes" :key="item" :label="item" :value="item"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item v-if="state.jsonData.target.shelveInfo.isSelect" label="按货架推荐" class="json-item">
									<el-select v-model="state.jsonData.target.shelveInfo.shelveCodes" multiple placeholder="选择货架" class="input-300">
										<el-option v-for="item in state.shelveCodes" :key="item" :label="item" :value="item"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item v-if="state.jsonData.target.positionInfo.isSelect" label="按货位推荐" class="json-item">
									<el-input v-model="state.jsonData.target.positionInfo.positionNames" type="textarea" :rows="2" placeholder="请输入内容" @change="positionNameChange"> </el-input>
								</el-form-item>
								<el-form-item v-if="state.jsonData.target.positionTypeInfo.isSelect" label="按货位类型推荐" class="json-item">
									<el-select v-model="state.jsonData.target.positionTypeInfo.positionTypes" multiple placeholder="选择货位类型" class="input-300">
										<el-option v-for="item in state.seatTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item v-if="state.jsonData.target.thermoclineInfo.isSelect" label="按仓库温层推荐" class="json-item">
									<el-select v-model="state.jsonData.target.thermoclineInfo.thermocline" multiple placeholder="选择仓库温层" class="input-300">
										<el-option label="常温库" value="常温库"></el-option>
										<el-option label="冷藏库" value="冷藏库"></el-option>
										<el-option label="冷冻库" value="冷冻库"></el-option>
										<el-option label="深冷库" value="深冷库"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item v-if="state.jsonData.target.noCondition.isSelect" label="无条件" class="json-item"> * </el-form-item>
								<el-form-item label="货位优先级" class="json-item">
									<el-select v-model="state.jsonData.positionOrderBy" multiple placeholder="选择库区" class="input-300">
										<el-option v-for="(item, index) in state.positionTypes" :key="index" :label="item" :value="item"></el-option>
									</el-select>
								</el-form-item>
							</el-form>
						</el-card>
					</el-col>
					<el-col :span="12">
						<el-card class="json-card">
							<div slot="header" class="clearfix">
								<span>待选动作</span>
							</div>
							<el-form ref="form" :model="state.jsonData" label-width="80px" label-position="top">
								<el-form-item>
									<el-checkbox v-model="state.jsonData.target.storageAreaInfo.isSelect">按库区推荐</el-checkbox>
								</el-form-item>
								<el-form-item style="margin-top: 5px">
									<el-checkbox v-model="state.jsonData.target.channelInfo.isSelect">按通道推荐</el-checkbox>
								</el-form-item>
								<el-form-item style="margin-top: 5px">
									<el-checkbox v-model="state.jsonData.target.shelveInfo.isSelect">按货架推荐</el-checkbox>
								</el-form-item>
								<el-form-item style="margin-top: 5px">
									<el-checkbox v-model="state.jsonData.target.positionInfo.isSelect">按货位推荐</el-checkbox>
								</el-form-item>
								<el-form-item style="margin-top: 5px">
									<el-checkbox v-model="state.jsonData.target.positionTypeInfo.isSelect">按货位类型推荐</el-checkbox>
								</el-form-item>
								<el-form-item style="margin-top: 5px">
									<el-checkbox v-model="state.jsonData.target.thermoclineInfo.isSelect">按仓库温层推荐</el-checkbox>
								</el-form-item>
								<el-form-item style="margin-top: 5px">
									<el-checkbox v-model="state.jsonData.target.noCondition.isSelect" title="无条件">*</el-checkbox>
								</el-form-item>
							</el-form>
						</el-card>
					</el-col>
				</el-row>
			</template>
		</yrt-editor>

		<!--明细选择器-->

		<yrt-selector ref="selector-dialog" :config="state.selectorConfig" v-model:visible="state.selectorConfig.visible" @on-selected="onSelected"></yrt-selector>
		<el-dialog draggable title="选择类别" v-model="state.typesVisible" width="30%" append-to-body>
			<el-form label-width="85px">
				<el-form-item class="align-center">
					<!--数据tree-->
					<el-tree
						ref="tree"
						show-checkbox
						:load="
							(node, resolve) => {
								loadTreeNode(node, resolve);
							}
						"
						:default-expanded-keys="[2, 3]"
						:default-checked-keys="[5]"
						:expand-on-click-node="false"
						:props="state.props"
						:default-expand-all="false"
						node-key="treeKey"
						highlight-current
						lazy
						@node-click="nodeClick"
					>
						<template #slot-scope="{ node, data }" class="custom-tree-node">
							<i v-if="data.hasChild" class="el-icon-menu"></i>
							<i v-else class="el-icon-tickets"></i>
							{{ node.label }}
						</template>
					</el-tree>
				</el-form-item>
			</el-form>
			<template #footer>
				<span slot="footer" class="dialog-footer">
					<el-button @click="state.typesVisible = false">取消</el-button>
					<el-button type="danger" @click="getCheckedNodes">确认选择</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basic-storage-shelveRegular">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));

import baseHook from '/@/components/hooks/baseHook';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import { DataType, OrderByType, QueryBo, QueryType } from '/@/types/common';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
	...toRefs(baseState),

	typesVisible: false,
	typeNameList: '',
	// 库区
	areaCodes: [] as any[],
	// 品牌
	brandList: [] as any[],
	// 货主
	consignorList: [] as any[],
	// 供应商
	providerNames: [] as any[],
	// 通道号
	channelCodes: [] as any[],
	// 货架
	shelveCodes: [] as any[],
	// 货位类型
	seatTypes: [] as any[],
	// 货位类型
	positionTypes: ['未使用的货位', '已有库存货位', '同供应商货位', '同品牌货位', '同批次货位'],
	// 选择货位对话框
	jsonData: {
		condition: {
			// 按商品品牌
			brandInfo: {
				brandList: [],
				isSelect: false,
			},
			// 按商品
			productInfo: {
				products: [] as any[],
				isSelect: false,
			},
			// 订单货品属于 指定分类
			typeInfo: {
				types: [],
				isSelect: false,
			},
			// 按商品周转率
			turnoverInfo: {
				turnoverMin: null,
				turnoverMax: null,
				isSelect: false,
			},
			// 按商品单位体积
			volumeInfo: {
				volumeMin: null,
				volumeMax: null,
				isSelect: false,
			},
			// 按商品单位重量
			weightInfo: {
				weightMin: null,
				weightMax: null,
				isSelect: false,
			},
			// 按到货单商品数量
			quantityInfo: {
				quantityMin: null,
				quantityMax: null,
				isSelect: false,
			},
			// 按货主
			consignorInfo: {
				consignorList: [],
				isSelect: false,
			},
			// 供应商
			providerInfo: {
				providerShortName: '',
				isSelect: false,
			},
			// 同批次
			batchNumberInfo: {
				batchNumber: true,
				isSelect: true,
			},
			// 无条件
			noCondition: {
				isSelect: false,
			},
		},
		target: {
			// 按库区推荐
			storageAreaInfo: {
				areas: [],
				isSelect: false,
			},
			// 按货位推荐
			positionInfo: {
				positionNames: '',
				isSelect: false,
			},
			// 按通道推荐
			channelInfo: {
				channelCodes: [],
				isSelect: false,
			},
			// 按货架推荐
			shelveInfo: {
				shelveCodes: [],
				isSelect: false,
			},
			// 按货位类型推荐
			positionTypeInfo: {
				positionTypes: [],
				isSelect: false,
			},
			// 按仓库温层推荐
			thermoclineInfo: {
				thermocline: [],
				isSelect: false,
			},
			// 无条件
			noCondition: {
				isSelect: false,
			},
		},
		positionOrderBy: '',
	},
	// 选择器配置参数
	selectorConfig: {
		title: '商品选择器',
		width: '1000px',
		visible: false,
		// 配置路由
		router: '/selector/product',
	},
	storageName: null,
	props: {
		children: 'children',
		label: 'label',
	},
	currMaizeng: null,
});
//#endregion

onMounted(() => {
	// 获取库区
	// getAreaCodes();
	// 获取品牌
	getBrandNames();
	// 获取货主
	getConsignorNames();
	// 获取供应商
	getProviderNames();
	// 获取货架
	// getShelveCodes();
	// 获取货位类型
	getSeatTypes();
});

// 促销规则选择商品
const selectProduct = (item: any) => {
	state.currMaizeng = item;
	// 明细添加
	state.selectorConfig.visible = true;
};
// 将明细选择器选择中的数据填充到明细表中
const onSelected = (rows: any) => {
	var productList = rows.map((item: any) => {
		return {
			productId: item.productId,
			productCode: item.productCode,
			productName: item.productName,
			productModel: item.productModel,
		};
	});

	state.jsonData.condition.productInfo.products = productList;
	state.selectorConfig.visible = false;
};
// 保存前事件
base.onSaveBefore = (master: any) => {
	if (!state.jsonData.positionOrderBy.length) {
		proxy.$message.error('货位优先级不允许为空');
		return false;
	}
	let positionNames: any = state.jsonData.target.positionInfo.positionNames;
	positionNames = positionNames ? positionNames.replace(/,/gi, '\n').replace(/\\r/gi, '').split('\n') : [];
	let validPositionNames = positionNames.filter((item: any) => item);
	validPositionNames = validPositionNames.map((item: any) => item.trim());
	state.jsonData.target.positionInfo.positionNames = validPositionNames.join(',');
	state.jsonData.condition.batchNumberInfo.batchNumber = true;
	var jsonData = JSON.stringify(state.jsonData);
	let formData = masterData.value; // 主表
	formData.jsonData = jsonData;
	return true;
};
// 数据加载后
base.onEditLoadAfter = (master: any) => {
	if (master.storageName) {
		getAreaCodes(master.storageName); // 获取库区
		// getChannelCodes(master.storageName); // 获取通道号
		// getShelveCodes(master.storageName); // 获取货架
	}
	if (master.jsonData) {
		const jsonData = master.jsonData;
		state.jsonData = JSON.parse(jsonData);
		state.typeNameList = state.jsonData.condition.typeInfo.types
			.map((item: any) => {
				return item.typeName;
			})
			.join(',');
	} else {
		refresh();
	}
	// 处理历史数据，添加没有的condition项
	if (!state.jsonData.condition.brandInfo) {
		state.jsonData.condition.brandInfo = {
			brandList: [],
			isSelect: false,
		};
	}
	if (!state.jsonData.condition.productInfo) {
		state.jsonData.condition.productInfo = {
			products: [],
			isSelect: false,
		};
	}
	if (!state.jsonData.condition.typeInfo) {
		state.jsonData.condition.typeInfo = {
			types: [],
			isSelect: false,
		};
	}
	if (!state.jsonData.condition.turnoverInfo) {
		state.jsonData.condition.turnoverInfo = {
			turnoverMin: null,
			turnoverMax: null,
			isSelect: false,
		};
	}
	if (!state.jsonData.condition.volumeInfo) {
		state.jsonData.condition.volumeInfo = {
			volumeMin: null,
			volumeMax: null,
			isSelect: false,
		};
	}
	if (!state.jsonData.condition.weightInfo) {
		state.jsonData.condition.weightInfo = {
			weightMin: null,
			weightMax: null,
			isSelect: false,
		};
	}
	if (!state.jsonData.condition.quantityInfo) {
		state.jsonData.condition.quantityInfo = {
			quantityMin: null,
			quantityMax: null,
			isSelect: false,
		};
	}
	if (!state.jsonData.condition.consignorInfo) {
		state.jsonData.condition.consignorInfo = {
			consignorList: [],
			isSelect: false,
		};
	}
	if (!state.jsonData.condition.providerInfo) {
		state.jsonData.condition.providerInfo = {
			providerShortName: '',
			isSelect: false,
		};
	}
	if (!state.jsonData.condition.batchNumberInfo) {
		state.jsonData.condition.batchNumberInfo = {
			batchNumber: true,
			isSelect: false,
		};
	}
	if (!state.jsonData.condition.noCondition) {
		state.jsonData.condition.noCondition = {
			isSelect: false,
		};
	}

	// 处理历史数据，添加没有的target项
	if (!state.jsonData.target.storageAreaInfo) {
		state.jsonData.target.storageAreaInfo = {
			areas: [],
			isSelect: false,
		};
	}
	if (!state.jsonData.target.channelInfo) {
		state.jsonData.target.channelInfo = {
			channelCodes: [],
			isSelect: false,
		};
	}
	if (!state.jsonData.target.shelveInfo) {
		state.jsonData.target.shelveInfo = {
			shelveCodes: [],
			isSelect: false,
		};
	}
	if (!state.jsonData.target.positionInfo) {
		state.jsonData.target.positionInfo = {
			positionNames: '',
			isSelect: false,
		};
	}
	if (!state.jsonData.target.positionTypeInfo) {
		state.jsonData.target.positionTypeInfo = {
			positionTypes: [],
			isSelect: false,
		};
	}
	if (!state.jsonData.target.thermoclineInfo) {
		state.jsonData.target.thermoclineInfo = {
			thermocline: [],
			isSelect: false,
		};
	}
	if (!state.jsonData.target.noCondition) {
		state.jsonData.target.noCondition = {
			isSelect: false,
		};
	}
};
const getAreaCodes = async (storageName: any) => {
	const url = '/basic/storage/storageArea/getAreaCodes';
	const params = {
		storageName: storageName,
	};
	const [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}
	if (res.result) {
		state.areaCodes = res.data;
	}
};
// 获取品牌
const getBrandNames = async () => {
	const url = '/basic/product/brand/pageList';
	const params = {
		isAsc: 'desc',
		menuId: 1761,
		orderByColumn: 'brandId',
		pageIndex: 1,
		pageSize: 100,
		prefixRouter: '/basic/product/brand',
		queryBoList: [],
		sumColumnNames: [],
		tableName: 'base_brand',
	};
	const [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}
	if (res.result) {
		state.brandList = res.rows;
	}
};
// 获取货位类型
const getSeatTypes = async () => {
	const url = '/system/core/common/loadDropDown';
	const params = [
		{
			column: 'dropdownId',
			dataType: 'LONG',
			queryType: 'IN',
			values: '501',
		},
	];
	const [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}
	if (res.result) {
		state.seatTypes = res.data.dropdown501;
	}
};
// 获取货架
const getShelveCodes = async (storageName: any, channelCodes: any) => {
	const url = '/basic/storage/position/getShelveCodes';
	const params = {
		storageName: storageName,
		areas: state.jsonData.target.storageAreaInfo.areas.join(','),
		channelCodes: channelCodes.join(','),
	};
	const [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}
	if (res.result) {
		state.shelveCodes = res.data;
	}
};
// 获取货主
const getConsignorNames = async () => {
	const url = '/basic/base/consignor/getList';
	const params = {};
	const [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}
	if (res.result) {
		state.consignorList = res.data;
	}
};
// 获取供应商
const getProviderNames = async () => {
	const url = '/basic/product/provider/getList';
	const params = {};
	const [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}
	if (res.result) {
		state.providerNames = res.data;
	}
};
// 获取通道号
const getChannelCodes = async (storageName: any, areas: any) => {
	const url = '/basic/storage/position/getChannelCodes';
	const params = {
		storageName: storageName,
		areas: areas.join(','),
	};

	const [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}
	if (res.result) {
		state.channelCodes = res.data;
	}
};
// 选择商品类别
const orderSource = () => {
	// 打开选择货位弹窗
	state.typesVisible = true;
};
// 刷新数据
const refresh = () => {
	state.jsonData = {
		condition: {
			// 按商品品牌
			brandInfo: {
				brandList: [],
				isSelect: false,
			},
			// 按商品
			productInfo: {
				products: [],
				isSelect: false,
			},
			// 订单货品属于 指定分类
			typeInfo: {
				types: [],
				isSelect: false,
			},
			// 按商品周转率
			turnoverInfo: {
				turnoverMin: null,
				turnoverMax: null,
				isSelect: false,
			},
			// 按商品单位体积
			volumeInfo: {
				volumeMin: null,
				volumeMax: null,
				isSelect: false,
			},
			// 按商品单位重量
			weightInfo: {
				weightMin: null,
				weightMax: null,
				isSelect: false,
			},
			// 按到货单商品数量
			quantityInfo: {
				quantityMin: null,
				quantityMax: null,
				isSelect: false,
			},
			// 按货主
			consignorInfo: {
				consignorList: [],
				isSelect: false,
			},
			// 供应商
			providerInfo: {
				providerShortName: '',
				isSelect: false,
			},
			// 同批次
			batchNumberInfo: {
				batchNumber: true,
				isSelect: false,
			},
			// 无条件
			noCondition: {
				isSelect: false,
			},
		},
		target: {
			// 按库区推荐
			storageAreaInfo: {
				areas: [],
				isSelect: false,
			},
			// 按货位推荐
			positionInfo: {
				positionNames: '',
				isSelect: false,
			},
			// 按通道推荐
			channelInfo: {
				channelCodes: [],
				isSelect: false,
			},
			// 按货架推荐
			shelveInfo: {
				shelveCodes: [],
				isSelect: false,
			},
			// 按货位类型推荐
			positionTypeInfo: {
				positionTypes: [],
				isSelect: false,
			},
			// 按仓库温层推荐
			thermoclineInfo: {
				thermocline: [],
				isSelect: false,
			},
			// 无条件
			noCondition: {
				isSelect: false,
			},
		},

		positionOrderBy: '',
	};
};
// 获得左侧类目导航节点数据
const loadTreeNode = async (node: any, resolve: any) => {
	let whereList: Array<QueryBo> = []; // 查询条件

	if (node.level === 0) {
		whereList.push({
			column: 'parentId',
			values: 0,
			queryType: QueryType.EQ,
			dataType: DataType.LONG,
		});
	} else {
		whereList.push({
			column: 'parentId',
			values: node.data.typeId,
			queryType: QueryType.EQ,
			dataType: DataType.LONG,
		});
	}
	let url = '/system/core/common/loadTreeNode';
	let params = {
		tableName: 'base_product_type',
		keyName: 'typeId',
		nodeName: 'typeName',
		fixHasChild: false,
		showOutsideNode: false,
		parentName: 'parentId',
		whereList: whereList, // 查询条件
		orderByList: [
			{
				column: 'typeId',
				orderByType: OrderByType.DESC,
			},
		], // 排序字段
		extendColumns: '',
	};
	const [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}
	if (res.result) {
		res.data.forEach((element: any) => {
			element.isLeaf = !element.hasChild;
		});
		resolve(res.data);
	} else {
		proxy.$message.error(res.msg);
	}
};
// 点击tree导航节点
const nodeClick = (data: any, node: any, el: any) => {
	data;
	node;
	el;
};
const getCheckedNodes = () => {
	var getCheckedNodes = proxy.$refs.tree.getCheckedNodes();
	getCheckedNodes;
	var typeList = getCheckedNodes.map((item: any) => {
		return {
			typeId: item.typeId,
			typeName: item.typeName,
		};
	});
	state.jsonData.condition.typeInfo.types = typeList;

	state.typeNameList = getCheckedNodes
		.map((item: any) => {
			return item.typeName;
		})
		.join(',');
	state.typesVisible = false;
};
// 改变货位
const positionNameChange = () => {
	let positionNames: any = state.jsonData.target.positionInfo.positionNames;
	positionNames = positionNames.replace(/\\r/gi, '').split('\n').join(',');
	state.jsonData.target.positionInfo.positionNames = positionNames;
};
// 客户名称下拉改变事件
const onRowChange = (ref: any, val: any, field: any) => {
	if (field.options.prop === 'storageName') {
		getAreaCodes(val.storageName); // 获取库区
		// getChannelCodes(val.storageName); // 获取通道号
		// getShelveCodes(val.storageName); // 获取货架
	}
};
// 选择库区后事件
const chAreaCodes = (areas: any) => {
	getChannelCodes(masterData.value.storageName, areas); // 获取通道号
};
// 选择通道后事件
const chChannelCodes = (channelCodes: any) => {
	getShelveCodes(masterData.value.storageName, channelCodes); // 获取货架
};
// 新建后
base.onAddLoadAfter = () => {
	state.jsonData = {
		condition: {
			// 按商品品牌
			brandInfo: {
				brandList: [],
				isSelect: false,
			},
			// 按商品
			productInfo: {
				products: [] as any[],
				isSelect: false,
			},
			// 订单货品属于 指定分类
			typeInfo: {
				types: [],
				isSelect: false,
			},
			// 按商品周转率
			turnoverInfo: {
				turnoverMin: null,
				turnoverMax: null,
				isSelect: false,
			},
			// 按商品单位体积
			volumeInfo: {
				volumeMin: null,
				volumeMax: null,
				isSelect: false,
			},
			// 按商品单位重量
			weightInfo: {
				weightMin: null,
				weightMax: null,
				isSelect: false,
			},
			// 按到货单商品数量
			quantityInfo: {
				quantityMin: null,
				quantityMax: null,
				isSelect: false,
			},
			// 按货主
			consignorInfo: {
				consignorList: [],
				isSelect: false,
			},
			// 供应商
			providerInfo: {
				providerShortName: '',
				isSelect: false,
			},
			// 同批次
			batchNumberInfo: {
				batchNumber: true,
				isSelect: false,
			},
			// 无条件
			noCondition: {
				isSelect: false,
			},
		},
		target: {
			// 按库区推荐
			storageAreaInfo: {
				areas: [],
				isSelect: false,
			},
			// 按货位推荐
			positionInfo: {
				positionNames: '',
				isSelect: false,
			},
			// 按通道推荐
			channelInfo: {
				channelCodes: [],
				isSelect: false,
			},
			// 按货架推荐
			shelveInfo: {
				shelveCodes: [],
				isSelect: false,
			},
			// 按货位类型推荐
			positionTypeInfo: {
				positionTypes: [],
				isSelect: false,
			},
			// 按仓库温层推荐
			thermoclineInfo: {
				thermocline: [],
				isSelect: false,
			},
			// 无条件
			noCondition: {
				isSelect: false,
			},
		},
		positionOrderBy: '',
	};
};
</script>

<style lang="scss" scoped>
.json-card {
	::v-deep .el-card__header {
		padding: 0px 10px;
	}
	::v-deep .el-form-item__content {
		line-height: 28px !important;
	}
	::v-deep .el-form-item__label {
		line-height: 31px !important;
	}
}
.json-form {
	.json-item {
		margin-bottom: 10px !important;
	}
}
</style>
