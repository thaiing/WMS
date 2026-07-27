<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes">
      <!--自定义字段插槽-->
      <template #common-column-slot="{ row, col }">
        <template v-if="col.prop == 'returnStatus'">
          <!-- {{ state.dataOptions.idField }} -->
          <state-flow :load-options="state.stateLoadOptions" :where="{ billId: row[state.dataOptions.idField] }">
            <template #content>
              <el-tag :color="common.getTagBgColor(row, col, row[col.prop])" :style="common.getTagColor(row, col, row[col.prop])">
                {{ proxy.common.formatData(row, col) }}
              </el-tag>
            </template>
          </state-flow>
        </template>
      </template>
    </yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" @on-detail-delete-after="base.onDetailDeleteAfter" :btn-read-only="state.btnReadOnly" :use-detail-slot="['lackStorage']">
      <!--自定义字段插槽-->
      <template #detail-column-slot="{ row, col, detail }">
        <template v-if="col.prop == 'lackStorage'">
          <div>
            {{ row[col.prop] }}
            <el-link type="primary" @click="setSortingRule(row)">{{ $tt('设置规则') }}</el-link>
          </div>
        </template>
      </template>
    </yrt-editor>

    <!-- 商品选择器 -->
    <yrt-selector ref="selector-dialog" :config="state.selectorConfig" v-model:visible="state.selectorConfig.visible" @on-selected="onSelected"></yrt-selector>

    <!--商品库存选择器-->
    <yrt-selector ref="selector-position-dialog" :config="state.selectorPositionConfig" v-model:visible="state.selectorPositionConfig.visible" @on-selected="onPositionSelected"></yrt-selector>

    <!--出库单设置规则-->
    <sorting-rule-dialog ref="sortingRule" v-model:visible="state.winSortingRuleVisible" v-model:masterData="base.masterData" :auth-nodes="state.authNodes"></sorting-rule-dialog>
  </div>
</template>

<script setup lang="ts" name="inbound-in-orderPlan">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
import { DataType, QueryBo, QueryType } from '/@/types/common';
const stateFlow = defineAsyncComponent(() => import('/@/components/common/components/stateflow.vue'));
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const SortingRuleDialog = defineAsyncComponent(() => import('./components/sortingRuleDialog.vue'));

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
  // 状态流加载参数
  stateLoadOptions: {
    prefixRouter: '/inbound/service/returnStatusHistory',
    tableName: 'in_return_status_history',
    idField: 'history_id',
    orderBy: '{"history_id":"DESC"}',
    pageIndex: 1,
    pageSize: 100,
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
  // 自动加载预到货单字段
  orderField: ['consignorName', 'consignorId', 'consignorCode', 'storageName', 'deptId', 'deptName', 'applyDate', 'providerId', 'providerCode', 'providerShortName', 'shippingName', 'shippingAddress', 'mobile', 'storageId'],
  winSortingRuleVisible: false,
  sortingRuleForm: {
    productCode: '',
    positionName: '',
    batchNumber: '',
    produceDate: '',
    plateCode: '',
    singleSignCode: '',
    choosePositionNameArray: [],
  } as any,
  selectRuleRow: null as any,
});
//#endregion

onMounted(() => {});

// 明细按钮事件
base.detailButtonClick = (authNode: string, detail: any, btnOpts: any) => {
  switch (authNode) {
    case 'detailAdd':
      detailAdd();
      return true;
    case 'detailAddPosition':
      // 打开库存选择器
      detailAddPosition();
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
  // selector.setReadOnly('storageId', true); // 设为只读
  // selector.setReadOnly('consignorId', true); // 设为只读

  state.selectorPositionConfig.visible = true;
};

// 将选择器选择中的数据填充到明细表中
const onSelected = (rows: Array<any>) => {
  rows.forEach((item) => {
    item.ratePrice = item.purchasePrice;

    item.returnQuantity = 1;
    item.sortingStatus = 1;
  });
  base.editorRef.value.addDetailDataRow(rows);
  state.selectorConfig.visible = false;
  total(base.detailRows.value);
};

// 将选择器选择中的数据填充到明细表中
const onPositionSelected = (rows: Array<any>) => {
  rows.forEach((element) => {
    element.ratePrice = element.purchasePrice;
    element.returnQuantity = 1;
    element.sortingStatus = 1;
  });
  base.editorRef.value.addDetailDataRow(rows);

  state.selectorPositionConfig.visible = false;
  total(base.detailRows.value);
};

//主表改变事件
base.onChange = async (ref: any, val: any, field: any, master: any) => {
  if (field.options.prop == 'orderCode') {
    let url = '/inbound/in/qualityCheck/onBlurGetByCode';
    let params = {
      orderCode: master.orderCode,
      type: '退货单',
    };
    const [err, res] = await to(postData(url, params));
    if (err) {
      return;
    }

    proxy.common.showMsg(res);
    if (res.result) {
      //主表赋值
      state.orderField.map((item) => {
        //申请日期不赋值
        if (item != 'applyDate') {
          master[item] = res.data.order[item];
        }
      });
      if (res.data.details) {
        // 默认为第一个明细表名称
        res.data.details.forEach((item: any) => {
          item.purchaseMoney = item.purchaseAmount;
          item.amountRefunded = item.purchaseAmount;
          item.returnQuantity = item.quantity;
          item.sortingStatus = 1;

          item.totalWeight = item.rowWeight;
          item.sourceMainId = item.orderId;
          item.sourceDetailId = item.orderDetailId;
        });
        base.editorRef.value.clearDetailDataRow();

        base.editorRef.value.addDetailDataRow(res.data.details);
        total(base.detailRows.value);
      }
    }
  }
};
//明细改变事件
base.onDetailChange = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  total(detailRows);
};
//明细合计到主表
const total = (detailRows: any) => {
  let formData = masterData.value; // 主表

  let returnQuantity = 0;
  let amountRefunded = 0;
  let rateAmount = 0;
  let bigQty = 0;
  let totalWeight = 0;
  let rowCube = 0;
  detailRows &&
    detailRows.forEach((item: any) => {
      item.returnQuantity = Number(item.returnQuantity);
      item.purchasePrice = Number(item.purchasePrice);
      item.amountRefunded = Math.Round(item.returnQuantity * item.purchasePrice, 5);
      item.ratePrice = Math.Round(item.purchasePrice * (Number(item.rate) + 1), 5);
      item.rateAmount = Math.Round(item.returnQuantity * item.ratePrice, 5);
      item.bigQty = Math.Round(item.returnQuantity / item.unitConvert, 5);
      item.totalWeight = Math.Round(item.returnQuantity * item.weight, 5);
      item.rowCube = Math.Round(item.returnQuantity * item.unitCube, 5);

      returnQuantity += item.returnQuantity;
      amountRefunded += item.amountRefunded;
      rateAmount += item.rateAmount;
      bigQty += item.bigQty;
      totalWeight += item.totalWeight;
      rowCube += item.rowCube;
    });
  formData.totalReturnQuantity = Math.Round(returnQuantity, 5);
  formData.returnAmount = Math.Round(amountRefunded, 5);
  formData.totalRateAmount = Math.Round(rateAmount, 5);
  formData.bigQtyTotal = Math.Round(bigQty, 5);
  formData.totalWeight = Math.Round(totalWeight, 5);
  formData.totalCube = Math.Round(rowCube, 5);
};

base.buttonClick = (authNode: string) => {
  switch (authNode) {
    case 'toOutOrder':
      // 转到出库单
      toOutOrder();
      return true;
    case 'validateOut':
      // 确认出库
      validateOut();
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

//转到出库单
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
  if (rows.filter((item) => item.returnStatus != '审核成功').length) {
    proxy.$message.error('只有【审核成功】的单据才允许操作！');
  }

  proxy
    .$confirm('确定要操作此功能吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      let ids = rows.map((item) => item.returnId);
      const url = '/composite/in/return/toOutOrder';
      const params = {
        ids: ids.join(','),

        returnType: 'toOutOrder', //转到出库单
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

// 批量审核
const multiAuditing = async () => {
  // 选中行id
  var openIds: Array<any> = state.dataListSelections;
  let flag = false;
  for (const item of openIds) {
    if (['新建', '待审核'].indexOf(item.returnStatus) == -1) {
      flag = true;
    }
  }
  if (flag) {
    proxy.$message.error('只有新建或者待审核的单据才可以进行审核');
  }
  if (Array.isArray(state.dataListSelections)) {
    openIds = state.dataListSelections.map((item: any) => {
      return item[state.dataOptions.idField];
    });
  }
  proxy
    .$confirm('确定要审核单据吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const url = '/inbound/service/return/multiAuditing';
      const params = openIds;
      const [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }
      if (res.result) {
        proxy.common.showMsg(res);
        base.dataListRef.value.reload(); // 刷新列表数据
      }
    })
    .catch(() => {
      proxy.$message.info('取消操作');
    });
};
//确认出库
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
  if (rows.filter((item) => item.returnStatus != '审核成功').length) {
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
      let ids = rows.map((item) => item.returnId);
      const url = '/composite/in/return/toOutOrder';
      const params = {
        ids: ids.join(','),
        returnType: 'validateOut', //确认出库
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
// 明细删除后事件
base.onDetailDeleteAfter = (deletedRows: Array<any>, detailInfo: any) => {
  total(base.detailRows.value);
};

base.onEditLoadAfter = (master: any) => {
  var returnStatus = master.returnStatus;
  state.btnReadOnly.stop = true;
  state.btnReadOnly.open = true;
  state.btnReadOnly.auditing = false;
  state.btnReadOnly.detailDelete = false; // 不可编辑
  state.editorOptions.config.disabled = false;
  if (returnStatus == '审核成功') {
    state.btnReadOnly.stop = false;
  }
  if (returnStatus == '终止') {
    state.btnReadOnly.open = false;
  }
  if (master.auditing == 2) {
    state.btnReadOnly.auditing = true;
    state.editorOptions.config.disabled = true;
  }
};
// 设置分拣规则
const setSortingRule = (row: any) => {
  state.winSortingRuleVisible = true;
  state.selectRuleRow = row;
  state.sortingRuleForm.productCode = state.selectRuleRow['productCode'];
  state.winSortingRuleVisible = true;
  const orderDetailId = state.selectRuleRow['orderDetailId'];
  proxy.$refs.sortingRule.state.orderDetailId = orderDetailId;
  proxy.$refs.sortingRule.loadData(state.sortingRuleForm); // 刷新列表
  proxy.$refs.sortingRule.getSortingRuleList();
};
</script>
