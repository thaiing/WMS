<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" @on-detail-delete-after="base.onDetailDeleteAfter"></yrt-editor>
		<!-- 商品选择器 -->
		<yrt-selector ref="selector-dialog" :config="state.selectorConfig" v-model:visible="state.selectorConfig.visible" @on-selected="onSelected"></yrt-selector>
	</div>
</template>

<script setup lang="ts" name="basic-basic-productSet">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import baseHook from '/@/components/hooks/baseHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
	selectorConfig: {
		title: '商品选择器',
		width: '1000px',
		visible: false,
		// 配置路由
		router: '/selector/product',
	},
});
//#endregion

onMounted(() => {});

// 编辑页面按钮事件
base.detailButtonClick = (authNode: string, detail: any, btnOpts: any) => {
	switch (authNode) {
		case 'detailAdd':
			detailAdd();
			return true;
		case 'btnOrderNumber':
			btnOrderNumber();
			return true;
	}
};

// 明细添加
const detailAdd = () => {
	state.selectorConfig.visible = true;
};
// 将选择器选择中的数据填充到明细表中
const onSelected = (rows: Array<any>) => {
	rows.forEach((element) => {
		// element.splitQuantity = 1;
		element.orderNumber = 0;
	});
	base.editorRef.value.addDetailDataRow(rows);
	state.selectorConfig.visible = false;
	btnOrderNumber();
};

// 自动计算权重
const btnOrderNumber = () => {
	// 明细表 【成本价】求和
	const count = base.detailRows.value.reduce((total, currItem) => {
		total += Number(currItem['purchasePrice']);
		return total;
	}, 0);
	let purchasePrice = 0;
	// 循环明细表
	base.detailRows.value?.forEach((item) => {
		// 如果当前明细的成本价不为空
		if (item.purchasePrice) {
			// 计算 当前成本价占比多少   （ 成本价 / 总价 ）  保留四位小数
			item.orderNumber = Math.Round(item.purchasePrice / count, 2);
		} else {
			// 如果为空赋值0
			item.orderNumber = 0;
		}
		item['__ischange__'] = true;
		purchasePrice += Math.Round(item.purchasePrice); // 销售售价
	});
	masterData.value.purchasePrice = purchasePrice;
};

// 保存前事件
base.onSaveBefore = (master: any) => {
	let purchasePrice = 0; // 成本价
	let TotalorderNumber = 0; // 权重合计
	let TotalorderNumber2 = 0; // 权重合计
	let isPurchasePrice = 0; // 成本价
	// 明细表 【成本价】求和
	const count = base.detailRows.value?.reduce((total, currItem) => {
		total += Number(currItem['purchasePrice']);
		return total;
	}, 0);
	base.detailRows.value?.forEach((item) => {
		purchasePrice += Math.Round(item.purchasePrice); // 销售售价
		TotalorderNumber += Number(item.orderNumber);
		TotalorderNumber2 += Math.Round(item.purchasePrice / count, 2);
		isPurchasePrice = item.purchasePrice;
		if (!item.purchasePrice) {
			item.purchasePrice = 0;
		}
		if (!item.salePrice) {
			item.salePrice = 0;
		}
	});
	if (isPurchasePrice) {
		if (TotalorderNumber !== TotalorderNumber2) {
			proxy.$message.error('计算权重与权重之和不匹配');
			return false;
		}
	}
	if (TotalorderNumber !== 1) {
		proxy.$message.error('明细权重相加必须等于100');
		return false;
	}
	masterData.value.purchasePrice = purchasePrice;

	//#region 必填验证
	let flag = false;
	base.detailRows.value?.forEach((item: any) => {
		if (item.splitQuantity <= 0 || !item.splitQuantity) {
			proxy.$message.error('明细数量必须大于0！');
			flag = true;
			return;
		}
	});
	if (flag) {
		return false;
	}
	//#endregion
	return true;
};

// 删除后事件
base.onDetailDeleteAfter = (selectedRows: any, detail: any) => {
	let purchasePrice = 0; //
	base.detailRows.value?.forEach((item) => {
		purchasePrice += item.purchasePrice;
	});
	masterData.value.purchasePrice = purchasePrice;
	btnOrderNumber();
};
</script>
