<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :quick-search-fields="state.quickSearchFields" :tab-nav-list="state.tabNavList" :open-expand="true" @on-expand-change="onExpandChange">
      <template #expand-slot="{ row, col }">
        <el-table :data="row.orderDataList" border style="margin-left: 50px; font-size: 12px; width: 1000px" row-key="order_Id">
          <el-table-column :index="(index:any) => (row.listDataOptions.pageIndex - 1) * row.listDataOptions.pageSize + index + 1" type="index" fixed="left" class="col-index" label="#" width="30" />
          <el-table-column prop="productCode" :label="$tt('商品编号')" width="120"> </el-table-column>
          <el-table-column prop="productName" :label="$tt('商品名称')"> </el-table-column>
          <el-table-column prop="quantityOrder" :label="$tt('预出库数量')" width="80"> </el-table-column>
          <el-table-column prop="quantityOuted" :label="$tt('已出货数量')" width="80"> </el-table-column>
          <el-table-column prop="sortingStatus" :label="$tt('分拣状态')" width="80"> </el-table-column>
          <el-table-column prop="bigQty" :label="$tt('大单位数量')" width="80"> </el-table-column>
          <el-table-column prop="rowWeight" :label="$tt('小计毛重')" width="80"> </el-table-column>
          <el-table-column prop="productSpec" :label="$tt('商品规格')" width="80"> </el-table-column>
        </el-table>
        <div>
          <el-pagination background v-model:current-page="row.listDataOptions.pageIndex" v-if="row.listDataOptions.total > 15" v-model:page-size="row.listDataOptions.pageSize" layout="prev, pager, next" :total="row.listDataOptions.total || 0" @current-change="(value:any) => handleSizeChange(row, value)"></el-pagination>
        </div>
      </template>
      <template #common-column-slot="{ row, col }">
        <view v-if="col.prop == 'storeOrderCode'"> {{ processStoreOrderCode(row.storeOrderCode) }}</view>
        <template v-else-if="col.prop == 'orderStatus'">
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
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" detailButtonCustom :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-row-change="base.onRowChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" @on-add-load-after="base.onAddLoadAfter" @on-detail-delete-after="base.onDetailDeleteAfter" :use-detail-slot="['sortingStatus', 'lackStorage', 'singleSignCode', 'batchNumber']" :btn-read-only="state.btnReadOnly" @on-row-click="onRowClick">
      <!--自定义字段插槽-->
      <template #detail-column-slot="{ row, col, detail }">
        <template v-if="col.prop == 'sortingStatus'">
          <detailstate-flow :load-options="state.stateLoadOptionsDetail" :where="{ detailID: row.orderDetailId }">
            <template #content>
              <!-- 通用标签颜色着色 -->
              <el-tag :color="common.getTagBgColor(row, col, row[col.prop])" :style="common.getTagColor(row, col, row[col.prop])">
                {{ common.formatData(row, col) }}
              </el-tag>
            </template>
          </detailstate-flow>
        </template>
        <template v-else-if="col.prop == 'lackStorage'">
          <div>
            {{ row[col.prop] }}
            <el-link type="primary" @click="setSortingRule(row)">{{ $tt('设置规则') }}</el-link>
          </div>
        </template>
        <template v-else-if="col.prop == 'batchNumber'">
          <div>
            <span class="sn-text">{{ row.batchNumber }}</span>
            <el-link type="primary" @click="setbatchNumber(row)">{{ $tt('选择') }}</el-link>
          </div>
        </template>
        <template v-else-if="col.prop === 'singleSignCode'">
          <a href="#" @click="showSnEditor(row, detail)" class="flex flex-col">
            <span class="sn-text">{{ row.singleSignCode }}</span>
            <span class="sn-count">[SN数：{{ row.singleSignCode ? row.singleSignCode.split(',').length : 0 }}]</span>
          </a>
        </template>
      </template>
    </yrt-editor>

    <!-- 商品选择器 -->
    <yrt-selector ref="selector-dialog" :config="state.selectorConfig" v-model:visible="state.selectorConfig.visible" @on-selected="onSelected"></yrt-selector>

    <!--商品库存选择器-->
    <yrt-selector ref="selector-position-dialog" :config="state.selectorPositionConfig" v-model:visible="state.selectorPositionConfig.visible" @on-selected="onPositionSelected"></yrt-selector>

    <!--出库单设置规则-->
    <sorting-rule-dialog ref="sortingRule" v-model:visible="state.winSortingRuleVisible" v-model:masterData="base.masterData" :auth-nodes="state.authNodes"></sorting-rule-dialog>

    <!-- 拆分出库单 -->
    <order-split-dialog ref="orderSplit" v-model:visible="state.showSplitOrderSialog" :ids="state.splitOrderIds" :selected-details="state.selectedDetails" @on-closed="onClose"></order-split-dialog>

    <!-- 合并单据 -->
    <incorporation-order-dialog ref="incorporationOrder" v-model:visible="state.showIncorporationOrder" :order-codes="state.orderCodes" :ids="state.ids" @on-closed="onIncorporationClose"></incorporation-order-dialog>

    <!-- 一键出库 -->
    <order-outer-dialog ref="orderOuterDialog" :quick-out-type="state.quickOutType" v-model:visible="state.orderOuterVisible.isShowDialog" @on-closed="onOutClose"></order-outer-dialog>

    <!--生成配送单页面-->
    <update-logistics-dialog ref="updateLogisticsDialog" :dataListSelections="state.dataListSelections" v-model:visible="state.updateLogisticsConfig.isShowDialog" @on-closed="onClose"></update-logistics-dialog>

    <!-- 批量出库 -->
    <batch-out-dialog ref="batchOutDialog" v-model:visible="state.batchOutInfo.isShow" :ids="state.batchOutInfo.ids" @on-closed="onOutClose"></batch-out-dialog>

    <!-- 选择批次号 -->
    <batch-number-dialog ref="numberDialog" v-model:visible="state.batchNumberInfo.isShow" :row="state.detailRow" :load-options="state.productPositionDetail" @on-closed="onNumberClose"></batch-number-dialog>

    <!-- SN编辑器 -->
    <sn-editor-dialog v-model:visible="state.snEditorVisible" :row="state.detailRow" @on-sn-change="onSnChange"> </sn-editor-dialog>
  </div>
</template>

<script setup lang="ts" name="outbound-out-order">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import useDropdownStore from '/@/stores/modules/dropdown';
import { DataType, OrderByType, OrderItem, QueryBo, QueryType } from '/@/types/common';

import baseHook from '/@/components/hooks/baseHook';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import YrtDataList from '/@/components/common/yrtDataList.vue';
import { DeleteBo, DetailDataBo, DetailInfo, EditorOptions } from '/@/api/types';
import useNoticeStore from '/@/stores/modules/notice';
const SnEditorDialog = defineAsyncComponent(() => import('/@/components/common/sn-editor-dialog.vue'));
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const SortingRuleDialog = defineAsyncComponent(() => import('./components/sortingRuleDialog.vue'));

const stateFlow = defineAsyncComponent(() => import('/@/components/common/components/stateflow.vue'));
const detailstateFlow = defineAsyncComponent(() => import('/@/components/common/components/detailstateflow.vue'));
const dropdownStore = useDropdownStore();
const OrderSplitDialog = defineAsyncComponent(() => import('./components/order-split-dialog.vue'));
const BatchOutDialog = defineAsyncComponent(() => import('./components/batch-out-dialog.vue'));
const BatchNumberDialog = defineAsyncComponent(() => import('./components/batch-number-dialog.vue'));
const IncorporationOrderDialog = defineAsyncComponent(() => import('./components/incorporationOrderDialog.vue'));
const OrderOuterDialog = defineAsyncComponent(() => import('./components/order-outer-dialog.vue'));
const UpdateLogisticsDialog = defineAsyncComponent(() => import('./components/updateLogisticsDialog.vue'));
const noticeStore = useNoticeStore();

const config = ref({
  outer_isAuditAfter: false,
});
const base = baseHook({ config });
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

const numberDialog = ref();

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  // 配置参数
  config: config.value,
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
  // 明细分拣状态流加载参数
  stateLoadOptionsDetail: {
    prefixRouter: 'inventory/core/inventoryHolder',
    folder: 'inventory/core',
    // projectName: 'ERP.Storage',
    tableName: 'core_inventory_holder',
    idField: 'holder_id',
    orderBy: 'holder_id DESC, holder_id',
    pageIndex: 1,
    pageSize: 100,
    menuId: -1,
  },
  stateLoadOptions: {
    prefixRouter: 'outbound/out/orderStatusHistory',
    tableName: 'out_order_status_history',
    idField: 'history_id',
    orderBy: '{"history_id":"DESC"}',
    pageIndex: 1,
    pageSize: 100,
  },
  quickSearchFields: [
    {
      label: '商品编号',
      prop: 'orderId',
      type: 'input',
      dataType: 'int',
      value: null,
      // 获取查询条件
      getWhere: (val: any, me: any) => {
        if (!val) return null;

        return {
          dataType: DataType.STRING,
          label: '商品编号',
          column: 'productCode',
          queryType: QueryType.CUSTOM,
          values: val?.toString(),
        } as QueryBo;
      },
    },
  ],
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
  // 当前编辑数据
  formData: {} as any,
  selectRuleRow: null as any,
  splitOrderIds: [] as any[], // 拆分订单ID集合
  selectedDetails: [] as any[], // 拆分订单明细ID集合
  showSplitOrderSialog: false, // 显示拆分订单对话框
  // 导航筛选条件
  tabNavList: [
    {
      type: 'radio', // checkbox=多选, radio=单选
      field: 'orderStatus',
      items: [
        {
          value: '全部',
          label: '全部',
        },
        {
          value: '待审核',
          label: '待审核',
        },
        {
          value: '审核成功',
          label: '审核成功',
        },
        {
          value: '已出库',
          label: '已出库',
        },
      ],
      showCount: 8, // 显示平铺项个数
      value: null, // 选中值：当type=radio时value为数组，当type=checkbox时value为字符串
      getWhere(tab: any, tabs: any) {
        let where = [];
        if (tab.value === '待审核') {
          where.push({
            column: 'orderStatus',
            values: '待审核',
            queryType: QueryType.EQ,
            dataType: DataType.CHAR,
          });
        } else if (tab.value === '审核成功') {
          where.push({
            column: 'orderStatus',
            values: '审核成功',
            queryType: QueryType.EQ,
            dataType: DataType.CHAR,
          });
        } else if (tab.value === '已出库') {
          const idValues: Array<any> = [];
          idValues.push('发运完成');
          idValues.push('打包完成');
          idValues.push('已签收');
          idValues.push('已妥投');
          where.push({
            column: 'orderStatus',
            values: idValues.join(','),
            queryType: QueryType.IN,
            dataType: DataType.CHAR,
          });
        }

        return where;
      },
    },
  ],
  showIncorporationOrder: false,
  orderCodes: [] as any[],
  ids: [] as any[],
  // 一键出库类型
  quickOutType: 'quickOut',
  // 显示确认出库对话框
  orderOuterVisible: {
    // 一键出库对话框
    isShowDialog: false,
    title: '一键出库',
  },
  batchOutInfo: {
    isShow: false,
    ids: [] as any[],
  },
  batchNumberInfo: {
    isShow: false,
    id: '',
  },
  updateLogisticsConfig: {
    // 修改物流信息对话框
    isShowDialog: false,
    title: '修改物流信息',
  } as any,
  orderIds: 0,
  dataListGroupBy: [] as any, // 商品规格统计
  dataList: [] as any[],

  // 显示SN编辑器
  snEditorVisible: false,
  // 当前明细行
  detailRow: {},
  // 明细表信息
  currentDetail: {
    subTableView: '',
  },
  // 明细分拣状态流加载参数
  productPositionDetail: {
    prefixRouter: 'inventory/core/inventory',
    tableName: 'core_inventory',
    idField: 'inventory_id',
    orderBy: '{"inventory_id":"DESC"}',
    pageIndex: 1,
    pageSize: 100,
    menu_Id: 1032,
    listMethod: 'selectInventoryComposeList',
  },
  selectedData: {} as any,
});
//#endregion

//#region 监听websocket消息推送
watch(
  noticeStore.state.billList,
  (newValue, oldValue) => {
    // 更新加载状态
    state.dataListSelections.forEach((row: any) => {
      let item = newValue.find((item) => item.menuId === state.dataOptions.menuId && item.billId === row.orderId);
      if (item && item.otherField) {
        row.sortingStatus = item.otherField.sortingStatus;
      }
    });
  },
  {
    deep: true,
  }
);
//#endregion

onMounted(() => {});

// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    case 'multiAuditing':
      multiAuditing();
      return true;
    case 'sorting':
      sorting();
      return true;
    case 'batchStop':
      batchStop();
      return true;
    case 'stop':
      batchStop();
      return true;
    case 'batchOpen':
      batchOpen();
      return true;
    case 'orderMerge':
      orderMerge();
      return true;
    case 'quickOut':
      // 一键出库
      quickOut('quickOut');
      return true;
    case 'batchOut':
      // 批量出库
      batchOut();
      return true;
    case 'updateLogistics':
      // 修改物流信息
      updateLogistics();
      return true;
  }
};

// 修改物流信息
const updateLogistics = () => {
  let selectInfos: Array<any> = state.dataListSelections;
  if (selectInfos.length !== 1) {
    proxy.$message.error('请选择一条数据');
    return;
  }

  for (const row of state.dataListSelections) {
    if (['待审核', '审核成功', '波次完成', '拣货中', '部分拣货', '拣货完成', '配货中', '配货完成'].indexOf(row.orderStatus) < 0) {
      proxy.$message.error('只允许状态为:待审核，审核成功、波次完成、拣货中、部分拣货、拣货完成、配货中、配货完成的单据操作');
      return;
    }
  }

  proxy.$refs.updateLogisticsDialog.initData(selectInfos);

  state.updateLogisticsConfig.isShowDialog = true;
};

//批量出库
const batchOut = async () => {
  const ids = state.dataListSelections.map((m) => {
    return m['orderId'];
  });
  if (!ids.length) {
    proxy.$message.error('至少选中一行！');
    return;
  }
  for (const row of state.dataListSelections) {
    if (row['sortingStatus'] !== 2) {
      proxy.$message.error('分拣状态必须为已分配！');
      return;
    }
    if (['审核成功', '波次完成', '拣货中', '拣货完成'].indexOf(row.orderStatus) < 0) {
      proxy.$message.error('只有单据状态为【审核成功】、【波次完成】、【拣货中】、【等待配货】时，允许操作批量出库');
      return;
    }
  }
  state.batchOutInfo = {
    isShow: true,
    ids: ids,
  };
};

// 一键出库
const quickOut = (quickOutType: any) => {
  const ids = state.dataListSelections.map((m) => {
    return m['orderId'];
  });
  if (!ids.length) {
    proxy.$message.error('请选中一行数据！');
    return;
  }

  if (ids.length > 1) {
    proxy.$message.error('只能选中一行数据！');
    return;
  }
  state.quickOutType = quickOutType; // 一键出库类型：一键出库、自提出库

  const rowInfo = state.dataListSelections[0];
  if (state.config.outer_isAuditAfter) {
    if (rowInfo.orderStatus === '待审核' || rowInfo.auditing === 0) {
      proxy.$message.error('请先进行审核操作');
      return;
    }
  }

  // 选中行id
  var Ids: Array<any> = state.dataListSelections;
  let flag = false;
  for (const item of Ids) {
    if (['审核成功', '波次完成', '拣货完成'].indexOf(item.orderStatus) == -1) {
      flag = true;
    }
  }
  if (flag) {
    proxy.$message.error('只有审核成功、波次完成、拣货完成的单据才可以进行一键出库');
    return;
  }
  var orderId = rowInfo.orderId;
  var storageId = rowInfo.storageId;
  proxy.$refs.orderOuterDialog.initData(orderId, storageId);

  state.orderOuterVisible.isShowDialog = true;
};

// 编辑页面按钮事件
base.detailButtonClick = (authNode: string, detail: any, btnOpts: any) => {
  switch (authNode) {
    case 'detailAdd':
      detailAdd();
      return true;
    case 'detailAddPosition':
      // 打开库存选择器
      detailAddPosition();
      return true;
    case 'detailSplitOrders':
      // 拆分
      splitOrder(detail.options.detailSelections, detail);
      return true;
  }
};

// 终止
const batchStop = async () => {
  const ids = state.dataListSelections.map((m) => {
    return m['orderId'];
  });
  if (!ids.length) {
    proxy.$message.error('至少选中一行！');
    return;
  }

  proxy
    .$confirm('确定要批量进行终止操作吗?', '批量终止', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const url = '/outbound/out/order/stop';
      const params = {
        ids: ids.join(','),
        menuId: state.dataOptions.menuId,
        tableName: state.dataOptions.tableName,
      };
      const [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }
      if (res.result) {
        proxy.common.showMsg(res);
        base.dataListRef.value.loadData(); // 刷新列表
      }
    })
    .catch(() => {});
};

// 开启
const batchOpen = async () => {
  const ids = state.dataListSelections.map((m) => {
    return m['orderId'];
  });
  if (!ids.length) {
    proxy.$message.error('至少选中一行！');
    return;
  }

  proxy
    .$confirm('确定要批量进行开启操作吗?', '批量开启', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const url = '/outbound/out/order/open';
      const params = {
        ids: ids.join(','),
        menuId: state.dataOptions.menuId,
        tableName: state.dataOptions.tableName,
      };
      const [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }
      if (res.result) {
        proxy.common.showMsg(res);
        base.dataListRef.value.loadData(); // 刷新列表
      }
    })
    .catch(() => {});
};

base.onSaveBefore = (authNode: string) => {
  let isQty = true;
  base.detailRows.value?.forEach((item: any) => {
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
//批量审核
const multiAuditing = async () => {
  debugger;
  const ids = state.dataListSelections.map((m) => {
    return m['orderId'];
  });
  if (!ids.length) {
    proxy.$message.error('至少选中一行！');
    return;
  }
  for (const row of state.dataListSelections) {
    if (row['settlementType'] === '现结') {
      if (row['paymentStatus'] !== '已支付') {
        proxy.$message.error('结算方式为现结时，收款状态为已支付才可以审核！');
        return;
      }
    }

    if (['待审核', '新建'].indexOf(row.orderStatus) < 0) {
      proxy.$message.error('只有待审核的单据才可以进行审核');
      return;
    }
  }
  for (const row of state.dataListSelections) {
    if (!row['orderId']) {
      proxy.$message.error('请先保存表单，再执行审核操作！');
      return;
    }
  }
  proxy
    .$confirm('确定要批量进行审核操作吗?', '批量审核', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const url = '/outbound/out/order/multiAuditing/' + ids;

      const params = {};

      const [err, res] = await to(postData(url, params));
      debugger;
      if (err) {
        return;
      }
      if (res.result) {
        proxy.common.showMsg(res);
        setTimeout(function () {
          base.dataListRef.value.loadData();
        }, 2000);
      }
    })
    .catch(() => {
      proxy.$message.error('已取消审核');
    });
};

//批量分拣
const sorting = async () => {
  const ids = state.dataListSelections.map((m) => {
    return m['orderId'];
  });
  if (!ids.length) {
    proxy.$message.error('至少选中一行！');
    return;
  }

  for (const row of state.dataListSelections) {
    if (row.orderStatus !== '审核成功') {
      proxy.$message.error('只有审核成功的单子才允许分拣');
      return;
    }
  }

  proxy
    .$confirm('确定要批量进行分拣操作吗?', '批量分拣', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const url = '/outbound/out/order/sorting';
      const params = {
        ids: ids.join(','),
        // log日志条件
        menuId: state.dataOptions.menuId,
        tableName: state.dataOptions.tableName,
      };
      const [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }
      if (res.result) {
        proxy.common.showMsg(res);
        base.dataListRef.value.loadData(); // 刷新列表
      }
    })
    .catch(() => {});
};

// 明细添加
const detailAdd = () => {
  let formData = masterData.value; // 主表

  const selector = proxy.$refs['selector-dialog'];
  selector.setSearchValue('storageId', formData.storageId);
  selector.setSearchValue('storageName', formData.storageName);
  selector.setSearchValue('consignorId', formData.consignorId);
  selector.setSearchValue('consignorName', formData.consignorName);

  selector.setSearchValue('providerId', formData.providerId);
  selector.setSearchValue('providerShortName', formData.providerShortName);
  selector.setReadOnly('storageName', true); // 设为只读
  selector.setReadOnly('consignorName', true); // 设为只读
  selector.setReadOnly('providerShortName', true); // 设为只读
  state.selectorConfig.visible = true;
};
// 将选择器选择中的数据填充到明细表中
const onSelected = (rows: Array<any>) => {
  rows.forEach((element) => {
    element.sortingStatus = 1;
    element.discountRate = 100;
    if (element.unitConvert > 0) {
      element.bigQty = element.quantityOrder / element.unitConvert || 0;
    }
  });

  base.editorRef.value.addDetailDataRow(rows);
  state.selectorConfig.visible = false;
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
  selector.setSearchValue('providerId', formData.providerId);
  selector.setSearchValue('providerShortName', formData.providerShortName);
  selector.setReadOnly('storageName', true); // 设为只读
  selector.setReadOnly('providerShortName', true); // 设为只读
  selector.setReadOnly('consignorName', true); //    设为只读
  // selector.init
  state.selectorPositionConfig.visible = true;
  selector.search();
};
// 将选择器选择中的数据填充到明细表中
const onPositionSelected = (rows: Array<any>) => {
  rows.forEach((element) => {
    element.isPurchase = 0;
    element.sortingStatus = 1;
    element.discountRate = 100;
    element.quantityOrder = element.productStorage;
    element.quantityOrderOrigin = element.productStorage;
    element.saleAmount = element.salePrice;
    element.totalWeight = Math.Round((element.weight || 0) * element.quantityOrder, 2);
    element.totalWeightTon = (element.totalWeight || 0) / 1000; // 吨的计算
    element.ratePrice = Math.Round((element.salePrice || 0) * (1 + (element.rate || 0)), 2);
    element.rateAmount = Math.Round(element.ratePrice * element.quantityOrder, 2);
    element.discountRate = 100;
    element.salePriceDiscount = element.salePrice;
    // element.subTotal = element.saleAmount;
    element.validQuantity = element.validStorage;
    element.subCube = element.rowCube;
    if (element.unitConvert > 0) {
      element.bigQty = element.quantityOrder / (element.unitConvert || 0);
    } else {
      element.bigQty = Number(element.bigQty);
    }

    delete element.carrier_name;
    delete element.carrier_plate_number;
    delete element.carrier_driver_name;
    delete element.carrier_driver_idcard;
    delete element.escort;
    delete element.escort_idcard;
    delete element.warehouse_type;
    delete element.way_bill_code;
  });

  base.editorRef.value.addDetailDataRow(rows);
  let detailRows: any = base.detailRows.value;
  setTotal(null, null, null, null, detailRows);
  state.selectorPositionConfig.visible = false;
};

// 字段值改变事件
base.onChange = (ref: any, val: any, field: any, formData: any) => {
  // 记录ID和Name
  if (field.options.prop === 'provinceName') {
    // 改变市级下拉框
    loadChildrenNode(val, 614, field.options.prop);
  } else if (field.options.prop === 'cityName') {
    // 改变区级下拉框
    loadChildrenNode(val, 615, field.options.prop);
  }
};
// 字段值改变事件
const onRowClick = (ref: any, val: any, field: any) => {
  if (field.options.prop === 'clientShortName') {
    // 改变区级下拉框
    getClientInfo(val);
  }
};

// 根据省ID获得市
const loadChildrenNode = async (id: any, dropdownId: any, prop: any) => {
  if (!id) {
    return;
  }
  let whereList: Array<QueryBo> = []; // 查询条件
  whereList.push({
    column: 'parentId',
    values: id,
    queryType: QueryType.EQ,
    dataType: DataType.INT,
  });
  let orderByList: Array<OrderItem> = []; // 排序提交
  orderByList.push({
    column: 'parentId',
    orderByType: OrderByType.DESC,
  });
  let url = '/system/core/common/loadTreeNode';
  let params = {
    tableName: 'baseCity',
    keyName: 'cityId',
    nodeName: 'cityName',
    fixHasChild: false,
    showOutsideNode: false,
    parentName: 'parentId',
    whereList: whereList, // 查询条件
    orderByList: orderByList, // 排序字段
    extendColumns: '',
  };
  let res = await postData(url, params);
  if (res.result) {
    var data = res.data.map((item: { value: any; label: any }) => {
      if (prop === 'provinceName') {
        const newItem = {
          cityId: item.value,
          cityName: item.label,
          value: item.value,
          label: item.label,
        };
        return newItem;
      } else if (prop === 'cityName') {
        const newItem = {
          regionId: item.value,
          regionName: item.label,
          value: item.value,
          label: item.label,
        };
        return newItem;
      }
    });
    dropdownStore.setDropDown(dropdownId, data);
  } else {
    proxy.$message.error(res.msg);
  }
};

const getClientInfo = async (val: any) => {
  try {
    const url = '/basic/client/client/getClientInfo';
    const params = {
      clientId: val.clientId,
    };
    let [err, res] = await to(postData(url, params));
    if (err) {
      return;
    }
    if (res?.result) {
      let formData = masterData.value; // 主表
      let data = res.data;
      if (data) {
        formData.clientId = data.clientId;
        formData.shippingName = data.shippingName;
        formData.telephone = data.tel;
        formData.mobile = data.mobile;
        formData.shippingAddress = data.shippingAddress;
        formData.countryName = data.countryName;
        formData.provinceName = data.provinceName;
        formData.shippingName = data.shippingName;
        formData.cityName = data.cityName;
        formData.regionName = data.regionName;
        formData.email = data.email;
        formData.lineName = data.lineName;
        formData.lineId = data.lineId;
        formData.provinceId = data.provinceId;
        formData.regionId = data.regionId;
        formData.cityId = data.cityId;
        base.detailRows.value?.forEach((item: any) => {
          item.rate = Number(data.rate);
        });
        // 加载省
        if (formData.provinceId) {
          loadChildrenNode(formData.provinceId, 614, 'provinceName');
        }
        // 加载市
        if (formData.cityId) {
          loadChildrenNode(formData.cityId, 615, 'cityName');
        }
      }
    }
  } catch (error: any) {
    proxy.$message.error(error.message);
  }
};

// 求和
const setTotal = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  // 合计数量求和
  let totalQuantityOrder = 0; // 合计数量
  let totalAmount = 0.0; // 合计金额
  let taxAmount = 0.0; // 含税金额
  let totalWeight = 0.0; // 合计重量
  let totalLogisticsWeight = 0.0; // 合计重量
  let totalCube = 0.0; // 合计体积
  let discountAmount = 0.0; // 优惠金额
  let bigQtyTotal = 0; // 大单位数量
  let totalNetWeight = 0.0; // 合计净重

  detailRows &&
    detailRows.forEach((item: any) => {
      item.ratePrice = Math.Round((Number(item.salePrice) || 0) * (1 + (Number(item.rate) || 0)), 5); // 含税单价 = 单价*（1+税率）
      item.rateAmount = Math.Round((item.quantityOrder || 0) * (item.ratePrice || 0), 5); // 含税金额 = 数量 * 含税单价；
      item.saleAmount = Math.Round((item.quantityOrder || 0) * (item.salePrice || 0), 5); // 不含税(销售)金额 = 数量 * 销售单价；

      item.rowWeight = Math.Round((item.weight || 0) * (item.quantityOrder || 0), 2); // 小计毛重
      item.rowLogisticsWeight = Math.Round((item.logisticsWeightTon || 0) * (item.quantityOrder || 0), 2); // 小计物流重量
      item.rowCube = Math.Round((item.quantityOrder || 0) * (item.unitCube || 0), 5); // 小计体积
      item.rowWeightTon = Math.Round((item.quantityOrder || 0) * (item.weight || 0), 5) / 1000; // 合计重量(吨)
      item.rowNetWeight = Math.Round((item.netWeight || 0) * (item.quantityOrder || 0), 2); // 小计净重

      // item.bigQty = item.quantityOrder / (item.unitConvert || 0);

      if (item.unitConvert > 0) {
        item.bigQty = item.quantityOrder / (item.unitConvert || 0);
      } else {
        item.bigQty = Number(item.bigQty || 0);
      }

      if (0.01 > item.rowWeight) {
        item.rowWeight = 0.01;
      }
      if (0.01 > item.rowNetWeight) {
        item.rowNetWeight = 0.01;
      }

      totalQuantityOrder += Number(item.quantityOrder) || 0;
      totalAmount += Number(item.saleAmount) || 0;
      taxAmount += Number(item.rateAmount) || 0;
      totalWeight += Number(item.rowWeight) || 0;
      totalLogisticsWeight += Number(item.rowLogisticsWeight) || 0;
      totalCube += Number(item.rowCube) || 0;
      discountAmount += Number(item.discountAmount);
      bigQtyTotal += Number(item.bigQty);
      totalNetWeight += Number(item.rowNetWeight) || 0;
    });
  masterData.value.totalQuantityOrder = Math.Round(totalQuantityOrder, 5);
  masterData.value.totalAmount = Math.Round(totalAmount, 2); // 合计金额
  masterData.value.taxAmount = Math.Round(taxAmount, 2); // 含税金额
  masterData.value.discountAmount = Math.Round(discountAmount, 2); // 优惠金额
  masterData.value.totalUnpaid = Math.Round(taxAmount - discountAmount, 2); // 本单应收 - 含税金额 - 优惠金额
  masterData.value.totalWeight = Math.Round(totalWeight, 5);
  masterData.value.totalCube = Math.Round(totalCube, 2);
  masterData.value.bigQtyTotal = Math.Round(bigQtyTotal, 2);
  masterData.value.totalNetWeight = Math.Round(totalNetWeight, 5);
  masterData.value.totalLogisticsWeight = Math.Round(totalLogisticsWeight, 5);
};
// 明细字段触发改变
base.onDetailChange = (ref: any, val: any, row: any, field: DetailField, detailRows: Array<any>) => {
  setTotal(ref, val, row, field, detailRows);
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
// 选择批次号
const setbatchNumber = (row: any) => {
  state.detailRow = row;
  state.batchNumberInfo = {
    isShow: true,
    id: row.orderId,
  };
  state.selectedData = row;
  state.selectRuleRow = row;
  numberDialog.value.loadData(state.selectRuleRow, masterData.value.storageId);
};

// const viewInventory = () => {
// 	state.showEditorDialog = true;
// 	this.$refs["roleflow"].loadData(this.selectRuleRow);
// },
base.onEditLoadAfter = (master: any) => {
  // steps 初始化
  let stepsInfo = {
    status: master.orderStatus, //单据状态
    mainId: master.purchaseOrderId, //单据ID
    mainCode: master.purchaseOrderCode, // 单据编号
    storageId: master.storageId, // 仓库Id
    consignorId: master.consignorId, //货主Id
    clientId: master.clientId, // 客户Id
  };
  proxy.$refs['refSteps'].initData(stepsInfo);
  // 加载省
  if (master.provinceId) {
    loadChildrenNode(master.provinceId, 614, 'provinceName');
  }
  // 加载市
  if (master.cityId) {
    loadChildrenNode(master.cityId, 615, 'cityName');
  }

  let userInfo = proxy.common.getUserInfo();
  if (state.authNodes.readOnly && userInfo.nickName !== '超级管理员') {
    state.editorOptions.config.disabled = true;
    state.btnReadOnly.confirm = true;
    state.btnReadOnly.sorting = true;
    state.btnReadOnly.detailAdd = true;
    state.btnReadOnly.detailDelete = true;
    state.btnReadOnly.detailImport = true;
    state.btnReadOnly.detailAddPosition = true;
    state.btnReadOnly.save = true;
    state.btnReadOnly.stop = false;
    state.btnReadOnly.open = true;
    state.btnReadOnly.detailSplitOrders = false;
    state.btnReadOnly.detailSplit = false;
    return;
  }
  var orderStatus = master.orderStatus;
  var sortingStatus = master.sortingStatus;

  state.btnReadOnly.confirm = true;
  state.btnReadOnly.sorting = true;
  state.btnReadOnly.stop = true;
  state.btnReadOnly.open = true;
  state.btnReadOnly.detailAddPosition = true;
  state.btnReadOnly.detailImport = true;

  state.btnReadOnly.detailAdd = true; // 不可编辑
  state.btnReadOnly.detailDelete = true; // 不可编辑
  state.editorOptions.config.disabled = true;
  state.btnReadOnly.detailSplitOrders = true;
  state.btnReadOnly.detailSplit = true;

  if (orderStatus == '待审核') {
    state.btnReadOnly.confirm = false;
    state.btnReadOnly.sorting = false;

    state.btnReadOnly.save = false;
    state.btnReadOnly.stop = false;
    state.btnReadOnly.open = false;
    state.btnReadOnly.detailAdd = false;
    state.btnReadOnly.detailDelete = false;
    state.btnReadOnly.detailAddPosition = false;
    state.btnReadOnly.detailImport = false;
    state.editorOptions.config.disabled = false;
    state.btnReadOnly.detailSplitOrders = false;
    state.btnReadOnly.detailSplit = false;
  } else if (orderStatus == '终止') {
    state.btnReadOnly.confirm = true;
    state.btnReadOnly.sorting = true;
    state.btnReadOnly.stop = true;
    state.btnReadOnly.open = false;
    state.btnReadOnly.detailAdd = true; // 不可编辑
    state.btnReadOnly.detailDelete = true; // 不可编辑
    state.editorOptions.config.disabled = true;
  } else if (orderStatus == '审核成功') {
    state.editorOptions.config.disabled = true;
    state.btnReadOnly.confirm = true;
    state.btnReadOnly.sorting = true;
    state.btnReadOnly.detailAdd = true;
    state.btnReadOnly.detailDelete = true;
    state.btnReadOnly.detailImport = true;
    state.btnReadOnly.detailAddPosition = true;
    state.btnReadOnly.save = true;
    state.btnReadOnly.stop = false;
    state.btnReadOnly.open = true;
    state.btnReadOnly.detailSplitOrders = false;
    state.btnReadOnly.detailSplit = false;
  } else if (orderStatus == '终止') {
    state.btnReadOnly.detailAdd = false;
    state.btnReadOnly.open = false;
  }
  if (sortingStatus === 5) {
    // 部分分拣
    state.btnReadOnly.sorting = false;
  }

  if (master.orderType === '虚拟出库') {
    state.btnReadOnly.confirm = true;
    state.btnReadOnly.sorting = true;
    state.btnReadOnly.stop = true;
    state.btnReadOnly.open = true;
  }
};

base.onAddLoadAfter = () => {
  state.btnReadOnly.detailSplitOrders = false;

  state.btnReadOnly.confirm = false;
  state.btnReadOnly.sorting = false;
  state.btnReadOnly.detailDelete = false;
  state.btnReadOnly.detailAdd = false;

  state.btnReadOnly.detailImport = false;
  state.btnReadOnly.detailAddPosition = false;
  state.btnReadOnly.save = false;
  state.btnReadOnly.stop = false;
  state.btnReadOnly.open = true;
  state.btnReadOnly.detailSplitOrders = false;
  state.btnReadOnly.detailSplit = false;
};

// 批量拆分
const splitOrder = (selectedRows: any, detailInfo: DetailInfo) => {
  // if (selectedRows.length < 1) {
  // 	proxy.$message.error('至少选中一行明细数据!');
  // 	return false;
  // }

  if (base.masterData.value.orderStatus !== '待审核' && base.masterData.value.orderStatus !== '审核成功') {
    proxy.$message.error(`状态为：待审核、审核成功、才允许拆分！`);
    return;
  }

  const groupList = [base.masterData.value].reduce((all: any, next: any) => (all.some((item: any) => item.consignorId === next.consignorId && item.storageId === next.storageId) ? all : [...all, next]), []);
  if (groupList.length !== 1) {
    proxy.$message.error('只有同仓库同货主的才允许进行一起拆分！');
    return;
  }

  state.splitOrderIds = [base.masterData.value].map((m: any) => m.orderId);
  state.selectedDetails = selectedRows;
  let orderId = base.masterData.value.orderId;

  proxy.$refs.orderSplit.initData(orderId);
  state.showSplitOrderSialog = true;
};

// 明细删除后事件
base.onDetailDeleteAfter = (deletedRows: Array<any>, detailInfo: DetailInfo) => {
  let detailRows: any = base.detailRows.value;
  setTotal(null, null, null, null, detailRows);
};

// 关闭窗口刷新列表
const onClose = () => {
  base.dataListRef.value.reload();
  base.editorRef.value.loadEditData(masterData.value.orderId);
  state.showSplitOrderSialog = false;
};
// 关闭窗口刷新列表
const onIncorporationClose = () => {
  base.dataListRef.value.reload();
  state.showIncorporationOrder = false;
};

// 关闭窗口刷新列表
const onOutClose = () => {
  setTimeout(function () {
    base.dataListRef.value.reload();
  }, 800);
  state.orderOuterVisible.isShowDialog = false;
};

// 关闭窗口刷新列表
const onNumberClose = (val: any) => {
  state.orderOuterVisible.isShowDialog = false;
};

// 展开事件
const onExpandChange = async (row: any, expandedRows: any) => {
  row.listDataOptions = {
    pageIndex: 1,
    pageSize: 15,
  };
  LoadData(row);
};

// 分页大小改变
const handleSizeChange = (row: any, value: number) => {
  row.listDataOptions.pageIndex = value;

  LoadData(row);
};

//加载展开时间明细列
const LoadData = async (row: any) => {
  const url = '/outbound/out/orderDetail/pageList';
  const params = {
    isAsc: 'desc',
    menuId: 1650,
    orderByColumn: 'orderDetailId',
    pageIndex: row.listDataOptions.pageIndex,
    pageSize: row.listDataOptions.pageSize,
    prefixRouter: '/outbound/out/orderDetail',
    queryBoList: [
      {
        column: 'orderId',
        dataType: 'LONG',
        label: '预到货单号',
        queryType: 'EQ',
        values: row.orderId,
      },
    ],
    tableName: 'out_order_detail',
    sumColumnNames: [],
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }

  row.listDataOptions.total = res.total;
  if (res.result) {
    row.orderDataList = res.rows.map((item: any) => {
      item.quantityOrder = Number(item.quantityOrder);
      item.rowCube = Number(item.rowCube);
      item.bigQty = Number(item.bigQty);
      item.rowWeight = Number(item.rowWeight);
      item.quantityOuted = Number(item.quantityOuted);
      if (item.sortingStatus == 2) {
        item.sortingStatus = '已分配';
      } else if (item.sortingStatus == 1) {
        item.sortingStatus = '未分配';
      } else if (item.sortingStatus == 3) {
        item.sortingStatus = '缺货中';
      } else if (item.sortingStatus == 5) {
        item.sortingStatus = '部分分配';
      } else if (item.sortingStatus == 4) {
        item.sortingStatus = '问题订单';
      } else {
        item.sortingStatus = '未分配';
      }

      return item;
    });
  }
};
// 合并单据
const orderMerge = () => {
  if (state.dataListSelections.length < 2) {
    proxy.$message.error('至少选择两项进行合并');
    return;
  }
  if (state.dataListSelections.filter((s) => s.orderStatus !== '待审核').length > 0) {
    proxy.$message.error('只允许是待审核的出库单才可以进行合并！');
    return;
  }

  const groupList = state.dataListSelections.reduce((all, next) => (all.some((item: any) => item.clientShortName === next.clientShortName) ? all : [...all, next]), []);
  if (groupList.length > 1) {
    proxy.$message.error('选择的出库单必须是同客户');
    return;
  }
  state.orderCodes = state.dataListSelections.map((m) => m.orderCode);
  state.ids = state.dataListSelections.map((m) => m.orderId);
  state.showIncorporationOrder = true;
};

const processStoreOrderCode = (value: any) => {
  if (!value) {
    return '';
  }
  return value.replace(/\,/g, ',\n');
};

// 显示SN编辑器
const showSnEditor = (row: any, detail: any) => {
  state.currentDetail = detail; // 记录当前明细表信息
  state.detailRow = row;
  state.snEditorVisible = true;
};

// SN改变事件，改变数量
const onSnChange = (currentRow: any, snList: any, snCount: number) => {
  currentRow.quantityOrder = snCount;
};
</script>

<style rel="stylesheet/scss" scoped>
.tip {
  padding: 8px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
  margin: 5px 0;
}

.dialog-info {
  overflow: hidden;
  width: 100%;
}

.dialog-left {
  float: left;
  width: 45%;
}

.dialog-right {
  margin-left: 30px;
  float: left;
  width: 45%;
}

.deleteRule-span {
  cursor: pointer;
}

.page-list-container {
  min-height: calc(100vh - 135px);
  overflow: hidden;
  position: relative;
}

.scrollbar-wrap {
  margin-top: 20px;
  max-height: 400px;
  overflow-x: hidden;
  padding: 0px;
}

.msg-container {
  margin: 0;
  padding: 0;
  padding-bottom: 40px;
}

.msg-item {
  margin: 0;
  padding: 5px 0;
  word-wrap: break-word;
  font-size: 14px;
}

.gutter {
  display: none;
}

@media screen and (max-height: 900px) {
  .page-list-container {
    min-height: 600px;
  }
}
</style>
