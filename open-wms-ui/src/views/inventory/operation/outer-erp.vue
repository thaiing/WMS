<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" :use-detail-slot="['images']">
      <!--自定义字段插槽-->
      <template #detail-column-slot="{ row, col }">
        <template v-if="col.prop === 'images'">
          <el-image v-for="(pic, index) in base.getPicList(row[col.prop])" :src="base.showSmallPic(pic)" class="pic-small" fit="contain" preview-teleported :preview-src-list="base.getPicList(row[col.prop])" />
        </template>
      </template>
    </yrt-editor>

    <!-- 商品选择器 -->
    <yrt-selector ref="selector-dialog" :config="state.selectorConfig" v-model:visible="state.selectorConfig.visible" @on-selected="onSelected"></yrt-selector>

    <!--商品库存选择器-->
    <yrt-selector ref="selector-position-dialog" :config="state.selectorPositionConfig" v-model:visible="state.selectorPositionConfig.visible" @on-selected="onPositionSelected"></yrt-selector>
  </div>
</template>

<script setup lang="ts" name="inventory-operation-outer-erp">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import baseHook from '/@/components/hooks/baseHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import { QueryType } from '/@/types/common';
const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
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

// 明细按钮事件
base.detailButtonClick = (authNode: string, detail: any, btnOpts: any) => {
  switch (authNode) {
    case 'detailAdd':
      detailAdd(); // 打开商品选择器
      return true;
    case 'detailAddPosition':
      detailAddPosition(); // 打开库存选择器
      return true;
  }
};

// 明细添加
const detailAdd = () => {
  state.selectorConfig.visible = true;
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
const onSelected = (rows: Array<any>) => {
  rows.forEach((item) => {
    item.rate = null;
    item.sortingStatus = 1;
    item.subCube = item.rowCube;
    item.outerQuantity = Number(item.outerQuantity);
  });
  base.editorRef.value.addDetailDataRow(rows);
  state.selectorConfig.visible = false;
  let formData = masterData.value; // 主表
  base.detailRows.value?.forEach((item) => {
    item.providerShortName = formData.providerShortName;
    item.providerCode = formData.providerCode;
    item.providerId = formData.providerId;
  });
};

// 将选择器选择中的数据填充到明细表中
const onPositionSelected = (rows: Array<any>) => {
  rows.forEach((element) => {
    element.rate = null;
    element.sortingStatus = 1;
    element.outerQuantity = Number(element.productStorage);
    element.rowWeight = Math.Round((element.weight || 0) * element.outerQuantity, 2);
    element.rowWeightTon = (element.rowWeight || 0) / 1000; // 吨的计算
    element.ratePrice = Math.Round((element.salePrice || 0) * (1 + (element.rate || 0)), 2);
    element.rateAmount = Math.Round(element.ratePrice * element.outerQuantity, 2);
    element.rowCube = Math.Round(element.unitCube * element.outerQuantity, 2);
    element.discountRate = 1;
    element.salePriceDiscount = element.salePrice;
    if (element.unitConvert > 0) {
      element.bigQty = Math.Round(element.outerQuantity / element.unitConvert, 4);
      element.differenceQuantity = element.outerQuantity;
    }
  });
  base.editorRef.value.addDetailDataRow(rows);
  setTotal(base.detailRows.value);

  state.selectorPositionConfig.visible = false;
};

// 明细字段触发改变
base.onDetailChange = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  setTotal(detailRows);
};

const setTotal = (detailRows: Array<any>) => {
  // 合计数量求和
  let totalOuterQuantity = 0; // 合计数量
  let totalAmount = 0.0; // 合计金额
  let totalRateAmount = 0.0; // 合计价税
  let totalWeight = 0.0; // 合计重量
  let totalCube = 0.0; // 合计体积
  let bigQtyTotal = 0.0; // 合计大单位
  detailRows &&
    detailRows.forEach((item: any) => {
      item.ratePrice = Math.Round((item.salePrice || 0) * (1 + (Number(item.rate) || 0)), 5); // 含税单价 = 单价*（1+税率）
      // 明细不含税金额 = 数量 * 不含税单价；
      item.saleAmount = Math.Round((item.outerQuantity || 0) * (item.salePrice || 0), 5);
      // 含税金额 = 数量 * 含税单价；
      item.rateAmount = Math.Round((item.outerQuantity || 0) * (item.ratePrice || 0), 5);

      item.rowWeight = Math.Round(item.weight * item.outerQuantity, 5); //小计毛重
      item.rowCube = Math.Round((item.outerQuantity || 0) * (item.unitCube || 0), 5); // 小计体积
      item.rowWeightTon = Math.Round((item.outerQuantity || 0) * (item.weight || 0), 5) / 1000;
      item.bigQty = Math.ceil((item.outerQuantity || 0) / (item.unitConvert || 0));

      totalOuterQuantity += Number(item.outerQuantity || 0);
      totalAmount += Number(item.saleAmount || 0);
      totalRateAmount += Number(item.rateAmount || 0);
      totalWeight += Number(item.rowWeight || 0);
      totalCube += Number(item.rowCube || 0);
      bigQtyTotal += item.bigQty || 0;
    });
  masterData.value.totalOuterQuantity = Math.Round(totalOuterQuantity, 5);
  masterData.value.totalAmount = Math.Round(totalAmount, 5);
  masterData.value.totalRateAmount = Math.Round(totalRateAmount, 5);
  masterData.value.totalWeight = Math.Round(totalWeight, 5);
  masterData.value.totalCube = Math.Round(totalCube, 5);
  masterData.value.bigQtyTotal = Math.Round(bigQtyTotal, 2);
};

// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    case 'multiAuditing':
      multiAuditing(state.dataListSelections);
      return true;
    case 'validateOut':
      validateOut();
      return true;
    case 'toOutOrder':
      toOutOrder();
      return true;
  }
};
// 审核
const multiAuditing = async (selections: Array<any>) => {
  const url = '/inventory/operation/outer/multiAuditing';
  if (!selections.length) {
    proxy.$message.error('至少选择一项进行审核');
    return;
  }
  for (const item of selections) {
    if (['新建', '待审核'].indexOf(item.outerStatus) == -1) {
      proxy.$message.error('只有新建或者待审核的单据才可以进行审核');
      return;
    }
  }
  let ids = selections.map((item) => item.outerId);

  proxy
    .$confirm('确定要审核单据吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const params = ids;
      const [err, res] = await to(postData(url, params));
      if (err) return;

      if (res.result) {
        proxy.common.showMsg(res);
        base.dataListRef.value.loadData();
      }
    })
    .catch(() => {});
};
// 确认出库
const validateOut = async () => {
  let rows = state.dataListSelections;
  if (!rows.length) {
    proxy.$message.error('至少选中一项');
    return;
  }
  if (rows.filter((item) => item.sortingStatus != 2).length) {
    proxy.$message.error('只有【已分配】的单据才允许操作！');
    return;
  }
  if (rows.filter((item) => item.outerStatus != '审核成功').length) {
    proxy.$message.error('只有【审核成功】的单据才允许操作！');
    return;
  }

  proxy
    .$confirm('确定要确认出库操作吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      let ids = rows.map((item) => item.outerId);
      const url = '/composite/inventory/outer/toOutOrder';
      const params = {
        ids: ids.join(','),
        outType: 'validateOut', // 确认出库
      };
      const [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }
      proxy.common.showMsg(res);
      if (res.result) {
        base.dataListRef.value.reload();
      }
    })
    .catch(() => {
      proxy.$message.info('取消操作');
    });
};
// 转到出库单
const toOutOrder = async () => {
  let rows = state.dataListSelections;
  if (!rows.length) {
    proxy.$message.error('至少选中一项');
    return;
  }
  if (rows.filter((item) => item.sortingStatus != 2).length) {
    proxy.$message.error('只有【已分配】的单据才允许操作！');
    return;
  }
  if (rows.filter((item) => item.outerStatus != '审核成功').length) {
    proxy.$message.error('只有【审核成功】的单据才允许操作！');
  }

  proxy
    .$confirm('确定要操作此功能吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      let ids = rows.map((item) => item.outerId);
      const url = '/composite/inventory/outer/toOutOrder';
      const params = {
        ids: ids.join(','),
        outType: 'toOutOrder', // 转到出库单
      };
      const [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }
      proxy.common.showMsg(res);
      if (res.result) {
        base.dataListRef.value.reload();
      }
    })
    .catch(() => {
      proxy.$message.info('取消操作');
    });
};
</script>
