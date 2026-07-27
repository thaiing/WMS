<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes">
      <!--自定义字段插槽-->
      <template #common-column-slot="{ row, col }">
        <template v-if="col.prop == 'planStatus'">
          <!-- {{ state.dataOptions.idField }} -->
          <state-flow :load-options="state.stateLoadOptions" :where="{ billId: row[state.dataOptions.idField] }">
            <template #content>
              <el-tag :overlay-style="{ color: '#13ce66', 'font-size': '30px' }" :color="common.getTagBgColor(row, col, row[col.prop])" :style="common.getTagColor(row, col, row[col.prop])">
                {{ proxy.common.formatData(row, col) }}
              </el-tag>
            </template>
          </state-flow>
        </template>
      </template>
    </yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" :btn-read-only="state.btnReadOnly" @on-row-change="base.onRowChange"></yrt-editor>

    <!-- 商品选择器 -->
    <yrt-selector ref="selector-dialog" :config="state.selectorConfig" v-model:visible="state.selectorConfig.visible" @on-selected="onSelected"></yrt-selector>
  </div>
</template>

<script setup lang="ts" name="inbound-in-orderPlan">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import baseHook from '/@/components/hooks/baseHook';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
// import yrtEditor from '/@/components/common/yrtEditor.vue';
const yrtSelector = defineAsyncComponent(() => import('/@/components/common/yrtSelector.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();
const stateFlow = defineAsyncComponent(() => import('/@/components/common/components/stateflow.vue'));
const { baseState, dataListRefName, editorRefName, editorInfo, detailRows, masterData } = base;

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
  // 状态流加载参数
  stateLoadOptions: {
    prefixRouter: '/inbound/in/orderPlanStatusHistory',
    tableName: 'in_order_plan_status_history',
    idField: 'history_id',
    orderBy: '{"history_id":"DESC"}',
    pageIndex: 1,
    pageSize: 100,
  },
});
//#endregion

onMounted(() => {});

// 列表按钮事件
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    case 'multiAuditing':
      // 批量审核
      if (!state.dataListSelections.length) {
        proxy.$message.error('请选择一条数据！');
        return;
      }
      multiAuditing();
      return true;
    case 'toInOrder':
      // 转预到货单
      if (!state.dataListSelections.length) {
        proxy.$message.error('请选择一条数据！');
        return;
      }
      // if (state.dataListSelections.filter((item) => item.planStatus != '审核成功').length > 0) {
      //   proxy.$message.error('单据未审核不允许转出库单！');
      //   return;
      // }
      toInOrder();
      return true;
  }
};

// 明细按钮事件
base.detailButtonClick = (authNode: string, detail: any, btnOpts: any) => {
  switch (authNode) {
    case 'detailAdd':
      detailAdd();
      return true;
  }
};

// 字段值改变事件
base.onRowChange = (ref: any, val: any, field: any, formData: any) => {
  debugger;
  if (field.options.prop === 'consignorName') {
    base.detailRows.value?.forEach((item: any) => {
      item.consignorName = val.consignorName;
      item.consignorCode = val.consignorCode;
      item.consignorId = val.consignorId;
      item.__ischange__ = true;
    });
  }
  if (field.options.prop === 'storageName') {
    base.detailRows.value?.forEach((item: any) => {
      item.storageId = val.storageId;
      item.storageCode = val.storageCode;
      item.storageName = val.storageName;
      item.__ischange__ = true;
    });
  }
  if (field.options.prop === 'providerShortName') {
    base.detailRows.value?.forEach((item: any) => {
      item.providerCode = val.providerCode;
      item.providerId = val.providerId;
      item.providerShortName = val.providerShortName;
      item.__ischange__ = true;
    });
  }
};

base.onDetailChange = (ref: any, val: any, row: any, field: DetailField, detailRows: Array<any>) => {
  if (['quantityOrder', 'weight', 'purchasePrice'].some((item) => item === field.prop)) {
    row.rowWeight = row.quantityOrder * row.weight;
    row.rowPurchaseAmount = row.quantityOrder * row.purchasePrice;
  }
};

// 明细添加
const detailAdd = () => {
  let formData = masterData.value; // 主表
  if (!formData.consignorName) {
    proxy.$message.error('请选择货主！');
    return;
  }
  if (!formData.providerId) {
    proxy.$message.error('请选择供应商！');
    return;
  } else if (!formData.storageName) {
    proxy.$message.error('请选择仓库！');
    return;
  }

  const selector = proxy.$refs['selector-dialog'];
  selector.setSearchValue('consignorId', formData.consignorId);
  selector.setSearchValue('consignorName', formData.consignorName);
  state.selectorConfig.visible = true;
};

// 批量审核
const multiAuditing = async () => {
  // 选中行id
  var openIds: Array<any> = state.dataListSelections;
  let flag = false;
  for (const item of openIds) {
    if (['新建', '待审核'].indexOf(item.planStatus) == -1) {
      flag = true;
    }
  }
  if (flag) {
    proxy.$message.error('只有新建或者待审核的单据才可以进行审核');
    return;
  }
  if (Array.isArray(state.dataListSelections)) {
    openIds = state.dataListSelections.map((item: any) => {
      return item[state.dataOptions.idField];
    });
  }

  const url = '/inbound/in/orderPlan/multiAuditing/' + openIds.join(',');
  const params = {};
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    proxy.common.showMsg(res);
    base.dataListRef.value.reload(); // 刷新列表数据
  }
};

// 转到预到货单
const toInOrder = async () => {
  proxy
    .$confirm('确定要转到预到货单吗?', '转预到货单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      // const formData = state.dataListSelections[0];
      const ids = state.dataListSelections.map((item: any) => item.planId);
      const url = '/inbound/in/orderPlan/toInOrder/' + ids.join(',');
      const [err, res] = await to(postData(url));
      if (err) {
        return;
      }
      proxy.common.showMsg(res);

      if (res.result) {
        base.dataListRef.value.reload(); // 刷新列表数据
      }
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};

// 将选择器选择中的数据填充到明细表中
const onSelected = (rows: Array<any>) => {
  rows.forEach((item) => {
    item.storageId = base.masterData.value.storageId;
    item.storageName = base.masterData.value.storageName;
    item.providerId = base.masterData.value.providerId;
    item.providerCode = base.masterData.value.providerCode;
    item.providerShortName = base.masterData.value.providerShortName;
  });
  base.editorRef.value.addDetailDataRow(rows);
  state.selectorConfig.visible = false;
};

// 保存后事件
// base.onSaveAfter = (master: any) => {
// 	base.detailRows.value?.forEach((item: any) => {
// 		item.storageId = base.masterData.value.storageId;
// 		item.storageName = base.masterData.value.storageName;
// 		item.providerId = base.masterData.value.providerId;
// 		item.providerCode = base.masterData.value.providerCode;
// 		item.providerShortName = base.masterData.value.providerShortName;
// 	});
// 	master;
// };
base.onSaveBefore = (master: any) => {
  let isQty = true;
  base.detailRows.value?.forEach((item) => {
    if (item.quantityOrder <= 0 || !item.quantityOrder) {
      isQty = false;
    }
  });
  if (!isQty) {
    proxy.$message.error('明细数量必须大于0！');
    return false;
  }
  return true;
};
// 求和
const setTotal = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  // 合计数量求和
  let totalQuantityOrder = 0; // 合计数量
  let totalPurchaseAmount = 0.0; // 合计金额
  let totalWeight = 0.0; // 合计重量
  detailRows &&
    detailRows &&
    detailRows.forEach((item: any) => {
      item.rowPurchaseAmount = Math.Round((item.quantityOrder || 0) * (item.purchasePrice || 0), 2); // 成本金额 = 数量 * 成本单价

      item.rowWeight = Math.Round((item.weight || 0) * (item.quantityOrder || 0)); // 小计毛重
      item.rowCube = Math.Round((item.quantityOrder || 0) * (item.unitCube || 0)); // 小计体积
      item.rowWeightTon = Math.Round((item.quantityOrder || 0) * (item.weight || 0), 4) / 1000; // 合计重量(吨)
      item.bigQty = Math.ceil(item.quantityOrder / item.unitConvert || 0);
      totalQuantityOrder += Number(item.quantityOrder) || 0;
      totalPurchaseAmount += Number(item.rowPurchaseAmount) || 0;
      totalWeight += Number(item.rowWeight) || 0;
      item.surplusQuantity = item.quantityOrder; // 未入库数量=数量
    });
  masterData.value.totalQuantityOrder = Math.Round(totalQuantityOrder, 2); // 合计数量

  masterData.value.totalPurchaseAmount = Math.Round(totalPurchaseAmount, 2); // 合计金额
  masterData.value.totalWeight = Math.Round(totalWeight, 2); // 合计重量
};
// 明细字段触发改变
base.onDetailChange = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  setTotal(ref, val, row, field, detailRows);
};

base.onEditLoadAfter = (master: any) => {
  var planStatus = master.planStatus;
  state.btnReadOnly.stop = true;
  state.btnReadOnly.open = true;
  state.btnReadOnly.auditing = false;
  state.btnReadOnly.detailDelete = false; // 不可编辑
  state.editorOptions.config.disabled = false;
  if (planStatus == '审核成功') {
    state.btnReadOnly.stop = false;
  }
  if (planStatus == '终止') {
    state.btnReadOnly.open = false;
  }
  if (master.auditing == 2) {
    state.btnReadOnly.auditing = true;
    state.editorOptions.config.disabled = true;
  }
};
</script>
