<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>
    <!--商品库存选择器-->
    <yrt-selector ref="selector-position-dialog" :config="state.selectorPositionConfig" v-model:visible="state.selectorPositionConfig.visible" @on-selected="onPositionSelected"></yrt-selector>
  </div>
</template>

<script setup lang="ts" name="inventory-allocate-allocateEnter">
import { ComponentInternalInstance } from 'vue';
import { DataType, OrderByType, OrderItem, QueryBo, QueryType } from '/@/types/common';
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
  // 库存选择器
  selectorPositionConfig: {
    title: '商品库存选择器',
    width: '1000px',
    visible: false,
    // 配置路由
    router: '/selector/product-inventory',
    url: '/api/common/groupDataList',
    fixedWhere: {
      productStorage: {
        operator: QueryType.GT,
        value: 0,
      },
      validStorage: {
        operator: QueryType.GT,
        value: 0,
      },
      positionType: {
        operator: QueryType.NOTIN,
        value: '4,5',
      },
    },
  },
});
//#endregion

onMounted(() => {});

// 编辑页面按钮事件
base.detailButtonClick = (authNode: string, detail: any, btnOpts: any) => {
  switch (authNode) {
    case 'detailAddPosition':
      // 打开库存选择器
      detailAddPosition();
      return true;
  }
};
// 打开库存选择器
const detailAddPosition = () => {
  let formData = masterData.value; // 主表
  if (!formData.consignorName) {
    proxy.$message.error('请选择货主！');
    return;
  } else if (!formData.storageName) {
    proxy.$message.error('请选择仓库！');
    return;
  }
  const selector = proxy.$refs['selector-position-dialog'];
  selector.setSearchValue('storageId', formData.storageId);
  selector.setSearchValue('storageName', formData.storageName);
  selector.setSearchValue('consignorId', formData.consignorId);
  selector.setSearchValue('consignorName', formData.consignorName);

  state.selectorPositionConfig.visible = true;
};
// 将选择器选择中的数据填充到明细表中
const onPositionSelected = (rows: Array<any>) => {
  rows.forEach((element) => {
    element.isPurchase = 0;
    element.sortingStatus = 1;
    element.applyQuantity = element.productStorage;
    element.quantityOrderOrigin = element.productStorage;
    element.saleAmount = element.salePrice;
    element.totalWeight = Math.Round((element.weight || 0) * element.applyQuantity, 2);
    element.totalWeightTon = (element.totalWeight || 0) / 1000; // 吨的计算
    element.ratePrice = Math.Round((element.salePrice || 0) * (1 + (element.rate || 0)), 2);
    element.rateAmount = Math.Round(element.ratePrice * element.applyQuantity, 2);
    element.salePriceDiscount = element.salePrice;
    // element.subTotal = element.saleAmount;
    element.validQuantity = element.usingStorage;
    element.subCube = element.rowCube;
    if (element.unitConvert > 0) {
      element.bigQty = element.applyQuantity / (element.unitConvert || 0);
    } else {
      element.bigQty = Number(element.bigQty);
    }
  });
  base.editorRef.value.addDetailDataRow(rows);
  state.selectorPositionConfig.visible = false;
};
// 求和
const setTotal = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  // 合计数量求和
  let totalQuantity = 0; // 合计数量
  let totalAmount = 0.0; // 合计金额
  let totalWeight = 0.0; // 合计重量
  let taxAmount = 0.0; // 含税金额

  detailRows &&
    detailRows.forEach((item: any) => {
      item.ratePrice = Math.Round((item.purchasePrice || 0) * (1 + Number(item.rate || 0)), 5); // 含税单价 = 单价*（1+税率）
      item.rateAmount = Math.Round(Number(item.applyQuantity || 0) * (item.ratePrice || 0), 5); // 含税金额 = 数量 * 含税单价；
      item.purchaseAmount = Math.Round(Number(item.applyQuantity || 0) * (item.purchasePrice || 0), 5); // 不含税(销售)金额 = 数量 * 销售单价；

      item.rowWeight = Math.Round((item.weight || 0) * Number(item.applyQuantity || 0), 5); // 小计毛重
      item.rowCube = Math.Round(Number(item.applyQuantity || 0) * (item.unitCube || 0), 5); // 小计体积
      item.rowWeightTon = Math.Round(Number(item.applyQuantity || 0) * (item.weight || 0), 5) / 1000; // 合计重量(吨)
      item.bigQty = item.applyQuantity / (item.unitConvert || 0);

      totalQuantity += Number(item.applyQuantity) || 0;
      totalAmount += Number(item.purchaseAmount) || 0;
      totalWeight += Number(item.rowWeight) || 0;
      taxAmount += Number(item.rateAmount) || 0;
    });
  masterData.value.totalQuantity = Math.Round(totalQuantity, 5);
  masterData.value.totalAmount = Math.Round(totalAmount, 2); // 合计金额
  masterData.value.taxAmount = Math.Round(taxAmount, 2); // 含税金额
  masterData.value.totalWeight = Math.Round(totalWeight, 5);
};
// 明细字段触发改变
base.onDetailChange = (ref: any, val: any, row: any, field: DetailField, detailRows: Array<any>) => {
  setTotal(ref, val, row, field, detailRows);
};
</script>
