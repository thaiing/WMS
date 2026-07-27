<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" :detailRemoteMethod="base.detailRemoteMethod"></yrt-editor>

    <!-- 商品选择器 -->
    <yrt-selector ref="selector-dialog" :config="state.selectorConfig" v-model:visible="state.selectorConfig.visible" @on-selected="onSelected"></yrt-selector>

    <!--商品库存选择器-->
    <yrt-selector ref="selector-position-dialog" :config="state.selectorPositionConfig" v-model:visible="state.selectorPositionConfig.visible" @on-selected="onPositionSelected"></yrt-selector>
  </div>
</template>

<script setup lang="ts" name="inventory-operation-adjust">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import { QueryType } from '/@/types/common';
import moment from 'moment';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import useDropdownStore from '/@/stores/modules/dropdown';
import { PositionTypeEnum } from '/@/enums/PositionTypeEnum';
const dropdownStore = useDropdownStore();

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
    },
  },
});
//#endregion

onMounted(() => {});

// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    case 'multiAuditing':
      multiAuditing(state.dataListSelections);
      return true;
  }
};

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
    item.subCube = item.rowCube;
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
    element.sortingStatus = 1;
  });
  base.editorRef.value.addDetailDataRow(rows);
  setTotal({}, base.detailRows.value);

  state.selectorPositionConfig.visible = false;
};

// 明细字段触发改变
base.onDetailChange = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  setTotal(field, detailRows);
};

const setTotal = (field: any, detailRows: Array<any>) => {
  // 合计数量求和
  let totalProductStorage = 0; // 合计账面库存量
  let totalPurchaseAmount = 0.0; // 合计账面成本额
  let totalCheckQuantity = 0; // 合计盘点数量

  let totalProfitQuantity = 0; // 合计盘盈数量
  let totalProfitAmount = 0.0; // 合计盘盈金额

  let totalLossQuantity = 0; // 合计盘亏数量
  let totalLossAmount = 0.0; // 合计盘亏金额
  let totalWeight = 0.0; // 合计重量

  detailRows.forEach((item) => {
    if (!item.productStorage) {
      item.productStorage = 0;
    }

    totalProductStorage += item.productStorage || 0;
    totalPurchaseAmount += item.purchaseAmount || 0;
    totalCheckQuantity += item.checkQuantity || 0;
    item.rowWeight = (item.weight || 0) * item.productStorage;
    totalWeight += item.rowWeight || 0;

    if (item.checkQuantity > item.productStorage) {
      var profitQuantity = (item.checkQuantity || 0) - item.productStorage;
      item.profitQuantity = profitQuantity;
      item.profitAmount = profitQuantity * item.purchasePrice;

      item.lossQuantity = 0;
      item.lossAmount = 0;

      totalProfitQuantity += profitQuantity;
      totalProfitAmount += item.profitAmount;
    } else if (item.checkQuantity < item.productStorage) {
      var lossQuantity = item.productStorage - item.checkQuantity;
      var lossAmount = lossQuantity * item.purchasePrice;

      item.profitQuantity = 0;
      item.profitAmount = 0;

      item.lossQuantity = lossQuantity;
      item.lossAmount = lossAmount;

      totalLossQuantity += lossQuantity;
      totalLossAmount += lossAmount;
    } else {
      item.profitQuantity = 0;
      item.profitAmount = 0;
      item.lossQuantity = 0;
      item.lossAmount = 0;
    }
    item.rowWeight = (item.weight || 0) * item.productStorage;
    if (field.prop === 'checkQuantity' || field.prop === 'weight') {
      // 盘盈重量  =  盘盈数量 * 单位重量
      item.profitWeight = (item.profitQuantity || 0) * (item.weight || 0);
    } else if (field && field.prop === 'rowWeight') {
      // 单位重量：weight=  库存重量:totalWeight/ 盘点数量:checkQuantity
      if (item.checkQuantity) {
        item.weight = (item.totalWeight || 0) / (item.checkQuantity || 0);
      } else {
        item.weight = 0;
      }
    }

    // 到期日期
    if (item.produceDate) {
      const days = Number(item.shelfLifeDay);
      const limitDate = moment(item.produceDate).add(days, 'day');
      // 到期日期
      item.limitDate = limitDate.format('YYYY-MM-DD');
    }
  });

  masterData.value.totalProductStorage = Math.Round(totalProductStorage, 2);
  masterData.value.totalPurchaseAmount = Math.Round(totalPurchaseAmount, 2);
  masterData.value.totalCheckQuantity = Math.Round(totalCheckQuantity, 2);
  masterData.value.totalProfitQuantity = Math.Round(totalProfitQuantity, 2);
  masterData.value.totalProfitAmount = Math.Round(totalProfitAmount, 2);
  masterData.value.totalLossQuantity = Math.Round(totalLossQuantity, 2);
  masterData.value.totalLossAmount = Math.Round(totalLossAmount, 2);
};

//审核
const multiAuditing = async (selections: Array<any>) => {
  const url = '/inventory/operation/adjust/multiAuditing';
  if (!selections.length) {
    proxy.$message.error('至少选择一项进行审核');
    return;
  }
  for (const item of selections) {
    if (['新建', '待审核'].indexOf(item.adjustStatus) == -1) {
      proxy.$message.error('只有新建或者待审核的单据才可以进行审核');
      return;
    }
  }
  let ids = selections.map((item) => item.adjustId);

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

// 加载完毕后事件
base.onEditLoadAfter = async (masterData: any) => {
  positionNameQuery();
};
// 明细下拉框搜索
base.detailRemoteMethod = async (query: string, row: any, col: any) => {
  if (col.prop === 'positionName') {
    await positionNameQuery(query);
  }
};
const positionNameQuery = async (query?: string) => {
  const url = '/basic/storage/position/getList';
  const params = {
    storageId: masterData.value.storageId,
    name: query,
    positionType: PositionTypeEnum.NORMAL, // 上架货位
  };
  const [err, res] = await to(postData(url, params, false));
  if (res?.result) {
    let dataList = res.data.map((m: any) => {
      m.value = m.positionId;
      m.label = m.positionName;
      return m;
    });
    dropdownStore.setDropDown(544, dataList); // 更新货位下拉框值
  }
};
// 加载完毕后事件
base.onChange = async (masterData: any) => {
  positionNameQuery();
};
</script>
