<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" @on-blur="base.onBlur"></yrt-editor>

    <!-- 商品选择器 -->
    <yrt-selector ref="selector-dialog" :config="state.selectorConfig" v-model:visible="state.selectorConfig.visible" @on-selected="onSelected"></yrt-selector>
  </div>
</template>

<script setup lang="ts" name="inbound-in-qualityCheck">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import baseHook from '/@/components/hooks/baseHook';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();

const { baseState, dataListRefName, editorRefName, buttonClick, detailButtonClick, editorInfo, masterData } = base;

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
  // 自动加载预到货单字段
  loadingOrder: [
    'storageId', // 仓库ID
    'storageName', // 仓库名称
    'consignorId', // 货主ID
    'consignorName', // 货主名称
    'consignorCode', // 货主编号
    'orderId', // 预到货单ID
    'orderCode', // 预到货单编号
  ],
});
//#endregion

onMounted(() => {});
// 主表按钮事件
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    // 转到预到货单
    case 'toInOrder':
      toInOrder();
      return true;
    case 'multiAuditing':
      // 批量审核
      if (state.dataListSelections.length !== 1) {
        proxy.$message.error('请选择一条数据！');
        return;
      }
      multiAuditing();
      return true;
  }
};
// 明细按钮事件
base.detailButtonClick = (authNode: string) => {
  switch (authNode) {
    case 'detailAdd':
      detailAdd();
      return true;
  }
};

// 批量审核
const multiAuditing = async () => {
  // 选中行id
  var openIds: Array<any> = state.dataListSelections;
  if (Array.isArray(state.dataListSelections)) {
    openIds = state.dataListSelections.map((item: any) => {
      return item[state.dataOptions.idField];
    });
  }
  const url = '/inbound/in/qualityCheck/multiAuditing';
  const params = openIds;
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res.result) {
    proxy.common.showMsg(res);
    base.dataListRef.value.reload(); // 刷新列表数据
  }
};

// 打开明细选择器
const detailAdd = () => {
  state.selectorConfig.visible = true;
};
// 选择器选择商品后 给明细赋值
const onSelected = (rows: Array<any>) => {
  rows.forEach((element) => {
    element.quantity = 0;
    element.checkQuantity = 0;
    element.defectiveQuantity = 0;
    element.qualifiedRate = 0;
    element.checkType = '';
  });
  base.editorRef.value.addDetailDataRow(rows);
  state.selectorConfig.visible = false;
};

// 转到预到货单
const toInOrder = async () => {
  let selectInfos: Array<any> = state.dataListSelections;
  if (!selectInfos.length) {
    proxy.$message.error('请至少选择一行数据！');
  }
  if (selectInfos.find((item) => item.auditing !== 2)) {
    proxy.$message.error('单据未审核，不允许操作！');
    return;
  }
  const ids = state.dataListSelections.map((item: any) => item.qualityCheckId);

  const url = '/inbound/in/qualityCheck/toInOrder';
  const params = {
    ids: ids.join(','),
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res.result) {
    proxy.common.showMsg(res);
  }
};

// 输入遇到货单号失去焦点加载主表信息
base.onBlur = async (ref: any, val: any, event: any, field: any) => {
  if (field.label === '预到货单号' && val) {
    // const url = '/api/erp/purchaseReturn/getByCode';
    const url = '/inbound/in/qualityCheck/onBlurGetByCode';
    const params = {
      orderCode: val,
    };
    const [err, res] = await to(postData(url, params));

    if (err) {
      return;
    }
    if (res.result) {
      // state.loadingOrder.forEach((field: any) => {
      if (field.options.prop === 'orderCode') {
        base.masterData.value.orderId = res.data.order.orderId;
        base.masterData.value.orderCode = res.data.order.orderCode;
        base.masterData.value.storageId = res.data.order.storageId;
        base.masterData.value.storageName = res.data.order.storageName;
        base.masterData.value.consignorId = res.data.order.consignorId;
        base.masterData.value.consignorCode = res.data.order.consignorCode;
        base.masterData.value.consignorName = res.data.order.consignorName;
      } else {
        proxy.masterData.field = res.data.order[field];
      }
      // });
      if (res.data.details) {
        // 默认为第一个明细表名称
        // var subTableView = base.editorRef.value.detailFields[0].subTableView;
        res.data.details.forEach((item: any) => {
          // 前新明细，后源明细
          item.productionDate = item.produceDate;
          item.shelfLife = item.shelfLifeDay;
          item.checkQuantity = item.quantity;
          item.qualifiedRate = 100;
          item.checkType = '';

          if (!item.defectiveQuantity) {
            item.defectiveQuantity = 0;
          }
        });
        base.editorRef.value.clearDetailDataRow();
        // base.editorRef.value.formData[subTableView].rows = []; // 清空数据
        base.editorRef.value.addDetailDataRow(res.data.details);
      }
    }
  }
};

// 明细字段触发改变
base.onDetailChange = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  detailRows.forEach((item) => {
    let checkQuantity = 0;
    if (field && field.prop === 'defectiveQuantity') {
      // item.checkQuantity = item.quantity - item.defectiveQuantity;
      // item.qualifiedRate = item.checkQuantity / 100;
      checkQuantity = item.quantity - item.defectiveQuantity;
      if (checkQuantity && item.quantity) {
        item.qualifiedRate = (Number(checkQuantity || 0) / Number(item.quantity || 0)) * 100;
      }
    }
  });
};
</script>
