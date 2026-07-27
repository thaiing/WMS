<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :quick-search-fields="state.quickSearchFields" :open-expand="true" @on-expand-change="onExpandChange" @onLoadDataAfter="onLoadDataAfter">
      <template #expand-slot="{ row, col }">
        <el-table :data="row.orderDataList" border style="margin-left: 50px; font-size: 12px; width: 1000px" row-key="order_Id">
          <el-table-column :index="(index:number) => (row.listDataOptions.pageIndex - 1) * row.listDataOptions.pageSize + index + 1" type="index" fixed="left" class="col-index" label="#" width="30" />
          <el-table-column prop="productCode" :label="$tt('商品编号')" width="120"> </el-table-column>
          <el-table-column prop="productName" :label="$tt('商品名称')"> </el-table-column>
          <el-table-column prop="quantity" :label="$tt('预到货数量')" width="80"> </el-table-column>
          <el-table-column prop="enterQuantity" :label="$tt('入库数量')" width="80"> </el-table-column>
          <el-table-column prop="shelvedQuantity" :label="$tt('上架数量')" width="80"> </el-table-column>
          <el-table-column prop="bigQty" :label="$tt('大单位数量')" width="80"> </el-table-column>
          <el-table-column prop="rowWeight" :label="$tt('小计毛重')" width="80"> </el-table-column>
          <el-table-column prop="productSpec" :label="$tt('商品规格')" width="80"> </el-table-column>
          <el-table-column prop="brandName" :label="$tt('品牌')" width="80"> </el-table-column>
        </el-table>
        <el-pagination background v-model:current-page="row.listDataOptions.pageIndex" v-if="row.listDataOptions.total > 15" v-model:page-size="row.listDataOptions.pageSize" layout="prev, pager, next" :total="row.listDataOptions.total || 0" @current-change="(pageIndex:number) => handleSizeChange(row, pageIndex)"></el-pagination>
      </template>

      <!--自定义字段插槽-->
      <template #common-column-slot="{ row, col }">
        <template v-if="col.prop == 'orderStatus'">
          <!-- {{ state.dataOptions.idField }} -->
          <state-flow :load-options="state.stateLoadOptions" :where="{ billId: row[state.dataOptions.idField] }">
            <template #content>
              <el-tag v-loading="row.isLoading" :overlay-style="{ color: '#13ce66', 'font-size': '30px' }" :color="common.getTagBgColor(row, col, row[col.prop])" :style="common.getTagColor(row, col, row[col.prop])">
                {{ proxy.common.formatData(row, col) }}
              </el-tag>
            </template>
          </state-flow>
        </template>
        <template v-else-if="col.prop == 'tags'">
          <template v-for="value of getValue(row[col.prop])">
            <el-tag :overlay-style="{ color: '#13ce66', 'font-size': '30px' }" :color="common.getTagBgColor(row, col, value)" :style="common.getTagColor(row, col, value)">
              {{ value }}
            </el-tag>
          </template>
        </template>
      </template>
    </yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :use-detail-slot="['images', 'singleSignCode']" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" @on-row-click="onRowClick" :btn-read-only="state.btnReadOnly" :on-detail-delete-before="base.onDetailDeleteBefore">
      <!--自定义字段插槽-->
      <template #detail-column-slot="{ row, col, detail }">
        <template v-if="col.prop === 'images'">
          <el-image v-for="(pic, index) in base.getPicList(row[col.prop])" :src="base.showSmallPic(pic)" class="pic-small" fit="contain" preview-teleported :preview-src-list="base.getPicList(row[col.prop])" />
        </template>
        <template v-else-if="col.prop === 'singleSignCode'">
          <a href="#" @click="showSnEditor(row, detail)" class="flex flex-col">
            <span class="sn-text">{{ row.singleSignCode }}</span>
            <span class="sn-count">[SN数：{{ row.singleSignCode ? row.singleSignCode.split(',').length : 0 }}]</span>
          </a>
        </template>
      </template>
      <template #footer-button-region="{ formData, details }">
        <!--打印条码按钮-->
        <el-button v-if="state.authNodes.printBarcode" type="success" @click="printBarcode(formData, details)">
          <template #icon>
            <svg-icon name="ele-Printer" class="text-size-n" :size="14" />
          </template>
          {{ $tt('打印条码') }}
        </el-button>
        <!--打印中条码按钮-->
        <el-button v-if="state.authNodes.printMiddleBarcode" type="success" @click="printBarcode(formData, details, 'middleBarcode')">
          <template #icon>
            <svg-icon name="ele-Printer" class="text-size-n" :size="14" />
          </template>
          {{ $tt('打印中条码') }}
        </el-button>
        <!--打印大条码按钮-->
        <el-button v-if="state.authNodes.printBigBarcode" type="success" @click="printBarcode(formData, details, 'bigBarcode')">
          <template #icon>
            <svg-icon name="ele-Printer" class="text-size-n" :size="14" />
          </template>
          {{ $tt('打印大条码') }}
        </el-button>
      </template>
    </yrt-editor>

    <!-- 商品选择器 -->
    <yrt-selector ref="selector-dialog" :config="state.selectorConfig" v-model:visible="state.selectorConfig.visible" @on-selected="onSelected"></yrt-selector>

    <!--商品库存选择器-->
    <yrt-selector ref="selector-position-dialog" :config="state.selectorPositionConfig" v-model:visible="state.selectorPositionConfig.visible" @on-selected="onPositionSelected"></yrt-selector>

    <!--明细拆分单据-->
    <!-- <order-detail-split ref="detailsplitDialog" v-model:visible="state.detailsplitimportVisible" @on-closed="onClose"></order-detail-split> -->

    <!-- 一键出库 -->
    <order-in-dialog ref="checkInDialog" v-model:visible="state.isShowDialog" @on-closed="onOutClose"></order-in-dialog>

    <!--打印条码弹出页面-->
    <order-barcode ref="barcodeDialogRef" v-model:visible="state.barcodeVisible"></order-barcode>

    <!-- SN编辑器 -->
    <sn-editor-dialog v-model:visible="state.snEditorVisible" :row="state.detailRow" @on-sn-change="onSnChange"> </sn-editor-dialog>
  </div>
</template>

<script setup lang="ts" name="inbound-in-order">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import baseHook from '/@/components/hooks/baseHook';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import useNoticeStore from '/@/stores/modules/notice';
import moment from 'moment';
import { ElMessageBox } from 'element-plus';
import { DataType, QueryBo, QueryType } from '/@/types/common';
import { DeleteBo, DetailDataBo, DetailInfo, EditorOptions } from '/@/api/types';
import YrtDataList from '/@/components/common/yrtDataList.vue';
import { getRowDeployId } from '/@/api/workflow/deploy';

const noticeStore = useNoticeStore();
const SnEditorDialog = defineAsyncComponent(() => import('/@/components/common/sn-editor-dialog.vue'));
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
const orderBarcode = defineAsyncComponent(() => import('./components/order-barcode.vue'));
const stateFlow = defineAsyncComponent(() => import('/@/components/common/components/stateflow.vue'));
const OrderDetailSplit = defineAsyncComponent(() => import('./components/order-detail-split.vue'));

const OrderInDialog = defineAsyncComponent(() => import('./components/order-in-dialog.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const config = ref({});
const base = baseHook({ config });
const { baseState, dataListRefName, editorRefName, editorInfo, masterData, editorRef } = base;

const barcodeDialogRef = ref();

//#region 定义变量
const state = reactive({
  isShowDialog: false,
  openExpand: true,
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
  // 状态流加载参数
  stateLoadOptions: {
    prefixRouter: '/inbound/in/orderStatusHistory',
    tableName: 'in_order_status_history',
    idField: 'history_id',
    orderBy: '{"history_id":"DESC"}',
    pageIndex: 1,
    pageSize: 100,
  },
  config: {
    in_isAuditAfter: false,
    // 开启溯源码
    in_productSecurity: false,
  } as any,

  // 批量拆分是否显示
  detailsplitimportVisible: false,
  // 条码打印对话框
  barcodeVisible: false,
  // 数据行loading
  loadingRows: [] as any[],

  // 显示SN编辑器
  snEditorVisible: false,
  // 当前明细行
  detailRow: {},
  // 明细表信息
  currentDetail: {
    subTableView: '',
  },
});
//#endregion

//#region 监听消息推送
watch(
  noticeStore.state.billList,
  (newValue, oldValue) => {
    // 更新加载状态
    for (let billInfo of newValue) {
      state.loadingRows.forEach((row: any) => {
        if (billInfo.menuId === state.dataOptions.menuId && billInfo.billId === row.orderId) {
          row.orderStatus = billInfo.otherField.toStatus;
          // 上架状态
          if (billInfo.otherField.shelveStatus) {
            row.shelveStatus = billInfo.otherField.shelveStatus;
          }
          // 关闭加载状态
          if (billInfo.otherField.isLastStep) {
            row.isLoading = false;
          }
        }
      });
    }
  },
  {
    deep: true,
  }
);
//#endregion

onMounted(() => {
  getBaseConfig();
});
base.onDetailDeleteBefore = (deletedRows: Array<any>, detailInfo: DetailInfo) => {
  let msg = '';
  base.detailRows.value?.forEach((item: any) => {
    // 要删除的数据不去判断条件
    if (!deletedRows.find((i) => i == item)) {
      if (item.quantity <= 0 || !item.quantity) {
        msg = '明细数量必须大于0！';
      }

      if (!item.providerShortName) {
        msg = '明细供应商不允许为空！';
      }
    }
  });
  if (msg) {
    proxy.$message.error(msg);
    return false;
  }
  return true;
};

const getBaseConfig = async () => {
  let keys = Object.keys(state.config).join(',');
  let url = '/system/core/config/getConfigValues';
  let params = {
    keys: keys,
  };
  let [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res?.result) {
    // 获得参数值列表，将数字转换为对象
    res.data.forEach((item: any) => {
      let configKey = item.configKey; // 字段名称
      let configValue = Number(item.configValue);
      state.config[configKey] = !!configValue;
    });
  }
};

// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    case 'multiAuditing':
      multiAuditing();
      return true;
    // 确认在途
    case 'onInTransit':
      onInTransit();
      return true;
    // 强制完成
    case 'forceFinish':
      forceFinish();
      return true;
    // 一键入库
    case 'confirmQuickEnter':
      confirmQuickEnter();
      return true;
    //过磅确认
    case 'weightConfirm':
      weightConfirm();
      return true;
    //零库存出库
    case 'zeroOut':
      zeroOut();
      return true;
  }
};

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
    case 'detailSplitOrders':
      // 拆分
      detailSplitOrders(detail.options.detailSelections, detail);
      return true;
  }
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
  selector.setReadOnly('consignorName', true); // 设为只读

  state.selectorPositionConfig.visible = true;
};

//审核
const multiAuditing = async () => {
  const url = '/inbound/in/order/multiAuditing';
  let selectInfos: Array<any> = state.dataListSelections;
  if (!selectInfos.length) {
    proxy.$message.error('至少选择一项进行审核');
    return;
  }
  let ids = selectInfos.map((item) => item.orderId);

  if (state.dataOptions.openAuditFlow) {
    let deployId = state.dataOptions.deployId;
    state.loadingRows = [];
    // 记录当前审核单据
    state.dataListSelections.forEach((item: any) => {
      item.isLoading = true;
      state.loadingRows.push(item);
    });

    // 开启审核流
    if (state.dataListSelections.length > 1) {
      proxy.$message.error('只能选择一行');
      return;
    }

    const dataInfo = state.dataListSelections[0];
    state.billInfo = {
      menuId: state.dataOptions.menuId,
      menuName: proxy.$route.meta.title,
      billId: dataInfo.orderId,
      billCode: dataInfo.orderCode,
    };

    // 获取行关联流程部署ID
    // let oldDeployId = await getRowDeployId(state.billInfo.menuId, state.billInfo.billId);
    // bizFlowDialogRef.value.initData(state.billInfo, deployId, oldDeployId); // 初始化审核流数据
  } else {
    for (const item of selectInfos) {
      if (['新建', '待审核'].indexOf(item.orderStatus) == -1) {
        proxy.$message.error('只有新建或者待审核的单据才可以进行审核');
        return;
      }
    }
    // 普通审核
    ElMessageBox.confirm('确定要审核单据吗', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        const params = ids;
        const [err, res] = await to(postData(url, params));
        if (err) {
          proxy.$message.error(err.message);
          return;
        }

        if (res.result) {
          proxy.common.showMsg(res);
          base.dataListRef.value.loadData();
        }
      })
      .catch(() => {});
  }
};

//确定为在途中
const onInTransit = async () => {
  // state.dataListSelections
  let selectInfos: Array<any> = state.dataListSelections;
  if (!selectInfos.length) {
    proxy.$message.error('至少选择一项进行确认为在途中');
    return;
  }
  let flag = false;
  for (const item of selectInfos) {
    if ('审核成功' !== item.orderStatus) {
      flag = true;
    }
  }
  if (flag) {
    proxy.$message.error('只有审核成功的单据才可以进行操作在途中');
    return;
  }
  // 记录当前审核单据
  state.dataListSelections.forEach((item: any) => {
    item.isLoading = true;
    state.loadingRows.push(item);
  });

  ElMessageBox.confirm('确定操作当前选中的单据吗', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let ids = selectInfos.map((item) => item.orderId);

      const url = '/inbound/in/order/onInTransit/' + ids.join(',');

      const params = {};
      const [err, res] = await to(postData(url, params));
      if (err) {
        proxy.$message.error(err.message);
        return;
      }

      if (res.result) {
        proxy.common.showMsg(res);
        base.dataListRef.value.loadData();
      }
    })
    .catch(() => {});
};

//强制完成
const forceFinish = async () => {
  // state.dataListSelections
  let selectInfos: Array<any> = state.dataListSelections;
  if (!selectInfos.length) {
    proxy.$message.error('至少选择一项进行强制完成');
    return;
  }
  let flag = false;
  for (const item of selectInfos) {
    if ('部分交货' !== item.orderStatus) {
      flag = true;
    }
  }
  if (flag) {
    proxy.$message.error('只有部分交货的单据才可以强制完成！');
    return;
  }

  ElMessageBox.confirm('确定操作当前选中的单据吗', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let ids = selectInfos.map((item) => item.orderId);
      const url = '/inbound/in/order/forceFinish/' + ids.join(',');

      const params = {};
      const [err, res] = await to(postData(url, params));
      if (err) {
        proxy.$message.error(err.message);
        return;
      }

      if (res.result) {
        proxy.common.showMsg(res);
        base.dataListRef.value.loadData();
      }
    })
    .catch(() => {});
};

// 将选择器选择中的数据填充到明细表中
const onSelected = (rows: Array<any>) => {
  rows.forEach((item) => {
    item.subCube = item.rowCube;
    item.overcharges = item.overcharges || 0;
  });
  base.editorRef.value.addDetailDataRow(rows);
  state.selectorConfig.visible = false;
  let formData = masterData.value; // 主表
  base.detailRows.value?.forEach((item) => {
    item.providerShortName = formData.providerShortName;
    item.providerCode = formData.providerCode;
    item.providerId = formData.providerId;
  });
  if (base.masterData.value.providerId) {
    var val = {
      providerShortName: base.masterData.value.providerShortName,
    };
    getProviderInfo(val);
  }
};

// 将选择器选择中的数据填充到明细表中
const onPositionSelected = (rows: Array<any>) => {
  rows.forEach((element) => {
    element.overcharges = element.overcharges || 0;
    element.isPurchase = 0;
    element.sortingStatus = 1;
    element.rowWeightTon = (element.rowWeight || 0) / 1000; // 吨的计算
    element.ratePrice = Math.Round((element.salePrice || 0) * (1 + (Number(element.rate) || 0)), 5);
    element.discountRate = 1;
    element.salePriceDiscount = element.salePrice;
    element.validQuantity = element.usingStorage;
    element.subCube = element.rowCube;

    delete element.carrier_name;
    delete element.productStorage;
    delete element.carrier_plate_number;
    delete element.carrier_driver_name;
    delete element.carrier_driver_idcard;
    delete element.escort;
    delete element.escort_idcard;
    delete element.warehouse_type;
    delete element.way_bill_code;
    delete element.batchNumber;
    delete element.produceDate;
    delete element.limitDate;
    delete element.inStorageDate;
  });
  base.editorRef.value.addDetailDataRow(rows);

  state.selectorPositionConfig.visible = false;
  let formData = masterData.value; // 主表
  base.detailRows.value?.forEach((item) => {
    item.providerShortName = formData.providerShortName;
    item.providerCode = formData.providerCode;
    item.providerId = formData.providerId;
  });
  if (base.masterData.value.providerId) {
    var val = {
      providerShortName: base.masterData.value.providerShortName,
    };
    getProviderInfo(val);
  }
};

// 求和
const setTotal = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  const lastRow = detailRows[detailRows.length - 1];
  let originPlace = lastRow ? lastRow.originPlace : '';
  detailRows.forEach((row: any) => {
    if (originPlace && !row.originPlace) {
      row.originPlace = originPlace;
    }
    if (row.originPlace) {
      originPlace = row.originPlace;
    }
  });
  // 合计数量求和
  let totalQuantity = 0; // 合计数量
  let totalAmount = 0.0; // 合计金额
  let totalRateAmount = 0.0; // 合计价税
  let totalWeight = 0.0; // 合计重量
  let totalCube = 0.0; // 合计体积
  var nameArr: any = [];
  let trackingNumbers: any = [];
  detailRows &&
    detailRows.forEach((item: any) => {
      item.ratePrice = Math.Round((item.purchasePrice || 0) * (1 + (Number(item.rate) || 0)), 5);
      // 明细不含税金额 = 数量 * 不含税单价；
      item.purchaseAmount = Math.Round((item.quantity || 0) * (item.purchasePrice || 0), 5);
      item.rowTotal = item.purchaseAmount;
      item.subTotal = (item.purchaseAmount * item.detailsDiscount) / 100;
      // 含税金额 = 数量 * 含税单价；
      item.rateAmount = Math.Round((item.quantity || 0) * (item.ratePrice || 0), 5);
      item.rateMoney = item.rateAmount;
      item.planQty = item.quantity;

      item.unitPriceBeforeTax = Math.Round((item.purchasePrice || 0) * (item.exchangeRate || 0), 5);
      item.rowWeight = Math.Round(Number(item.weight) * Number(item.quantity), 5); //小计毛重
      item.rowCube = Math.Round((item.quantity || 0) * (item.unitCube || 0), 5); // 小计体积

      item.rowWeightTon = Math.Round((item.quantity || 0) * (item.weight || 0), 5) / 1000;
      item.unitPackage = Math.ceil(item.unitPackage);
      if (field) {
        if (field.prop === 'quantity') {
          // 总数量同步于数量
          item.totalPackageQty = item.quantity;
        }
        if (field.prop === 'totalPackageQty') {
          item.totalPackageQty = item.totalPackageQty;
        }
        if (field.prop === 'paiQty') {
          item.paiQty = Math.ceil(item.paiQty);
        } else {
          item.paiQty = item.unitPackage ? Math.ceil(item.totalPackageQty / item.unitPackage) : 0;
        }
      }
      // item.totalPackageQty = item.quantity;
      // 建议拍数 = 总件数 / 打包配置
      // item.paiQty = item.unitPackage ? Math.ceil(item.totalPackageQty || 0 / item.unitPackage || 0) : 0;

      totalQuantity += item.quantity || 0;
      totalAmount += item.purchaseAmount || 0;
      totalRateAmount += item.rateAmount || 0;
      totalWeight += item.rowWeight || 0;
      totalCube += item.rowCube || 0;
      if (item.unitPackageType === '按数量') {
        item.totalPackageQty = item.quantity;
      } else if (item.unitPackageType === '按毛重') {
        item.totalPackageQty = item.rowWeight;
      } else if (item.unitPackageType === '按大单位数量') {
        item.totalPackageQty = item.bigUnitRounding;
      }
      // 交货单号拼接
      var arr = JSON.parse(item.expandFields);
      if (arr && arr.delivery) {
        if (arr.delivery) {
          nameArr.push(arr.delivery);
        }
      }
      trackingNumbers.push(item.batchNumber);
    });
  let list = Array.from(new Set(trackingNumbers));
  list = list.filter((item) => item);
  masterData.value.trackingNumber = list.join(',');
  masterData.value.totalQuantity = Math.Round(totalQuantity, 2);
  masterData.value.totalAmount = Math.Round(totalAmount, 2);
  masterData.value.totalRateAmount = Math.Round(totalRateAmount, 2);
  masterData.value.totalWeight = Math.Round(totalWeight, 2);
  masterData.value.totalCube = Math.Round(totalCube, 2);
};

// 明细字段触发改变
base.onDetailChange = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  setTotal(ref, val, row, field, detailRows);
  if (field.prop === 'quantity') {
    // 计算大单位数量(大单位换算关系大于0且小单位换算关系大于0)
    if (row.unitConvert > 0 && row.quantity >= 0) {
      // 大单位数量=小单位数量/换算数 只有大单位数量
      row.bigQty = Math.Round(row.quantity / row.unitConvert, 4);
      row.bigUnitRounding = Math.ceil(row.bigQty);
    } else {
      row.bigQty = 0;
      row.bigUnitRounding = 0;
    }
    row.rowNetWeight = Number(row.quantity) * Number(row.netWeight);
  }

  let bigQtyTotal = 0; // 大单位数量
  detailRows &&
    detailRows.forEach((item: any) => {
      bigQtyTotal += Number(item.bigQty);
    });
  masterData.value.bigQtyTotal = Math.Round(bigQtyTotal, 4); // 大单位数量

  if (row.produceDate) {
    row.limitDate = moment(row.produceDate)
      .add(row.shelfLifeDay || 0, 'days')
      .format('YYYY-MM-DD');
  }
  if ('containerNo,sealNo'.indexOf(field.prop) >= 0) {
    masterData.value.containerNos = Array.from(new Set(detailRows.map((item) => item.containerNo).filter((item) => item))).join(',');
    masterData.value.sealNos = Array.from(new Set(detailRows.map((item) => item.sealNo).filter((item) => item))).join(',');
  }
  if (field.prop === 'batchNumber') {
    getProductSecurity(row);
  }
};
const getProductSecurity = async (row: any) => {
  if (row.batchNumber && state.config.in_productSecurity) {
    const url = '/basic/product/productSecurityDetail/getProductSecurity';
    const params = {
      productId: row.productId,
      batchNumber: row.batchNumber,
      quantity: row.quantity,
    };
    const [err, res] = await to(postData(url, params));
    if (err) {
      return;
    }
    if (res.result) {
      row.singleSignCode = res.data.securityCode;
    }
  }
};

base.onSaveBefore = (master: any) => {
  let flag = false;

  if (!master.sourceType) {
    master.sourceType = '新建生成';
  }
  base.detailRows.value?.forEach((item: any) => {
    if (item.quantity <= 0 || !item.quantity) {
      proxy.$message.error('明细数量必须大于0！');
      flag = true;
      return;
    }

    if (!item.providerShortName) {
      proxy.$message.error('明细供应商不允许为空！');
      flag = true;
      return;
    }
  });
  if (flag) {
    return false;
  }
  return true;
};
const onRowClick = (ref: any, val: any, field: any) => {
  if (field.options.prop == 'providerShortName') {
    base.detailRows.value?.forEach((item) => {
      item.providerShortName = val.providerShortName;
      item.providerCode = val.providerCode;
      item.providerId = val.providerId;
    });
    getProviderInfo(val);
  }
};
// 一键入库
const confirmQuickEnter = () => {
  if (!state.dataListSelections.length) {
    proxy.$message.error('请选择一条预到货单进行操作');
    return false;
  }

  const rowInfo = state.dataListSelections[0];
  proxy.$refs.checkInDialog.initData(rowInfo);
};
// 页面加载后事件
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
  if (master.orderStatus == '终止') {
    state.btnReadOnly.open = false;
    state.editorOptions.config.disabled = true;
  } else {
    state.btnReadOnly.open = true;
  }

  if (['审核成功', '在途中', '新建'].indexOf(master.orderStatus) >= 0) {
    state.btnReadOnly.stop = false;
  } else {
    state.btnReadOnly.stop = true;
  }
};

// 批量拆分
const detailSplitOrders = (selectedRows: any, detailInfo: DetailInfo) => {
  const rows = [] as any[];
  if (selectedRows.length < 1) {
    proxy.$message.error('至少选中一行明细数据!');
    return false;
  }

  state.detailsplitimportVisible = true;
  const datas = state.editorOptions.fields.filter((item: any) => item.type === 'detail-grid')[0].options.detailSelections;
  const splitDetails = JSON.parse(JSON.stringify(datas));
  const order_Id = masterData.value.orderId;
  proxy.$refs.detailsplitDialog.initData(splitDetails, order_Id);
};
// 关闭窗口刷新列表
const onClose = () => {
  editorRef.value.loadEditData(masterData.value.orderId);
  base.dataListRef.value.loadData(); // 刷新列表
};

// 展开事件
const onExpandChange = async (row: any, expandedRows: any) => {
  row.listDataOptions = {
    pageIndex: 1,
    pageSize: 15,
  };
  loadDataDetail(row);
};

// 分页大小改变
const handleSizeChange = (row: any, pageIndex: number) => {
  row.listDataOptions.pageIndex = pageIndex;

  loadDataDetail(row);
};
// 展开事件
const loadDataDetail = async (row: any) => {
  const url = '/inbound/in/orderDetail/pageList';
  const params = {
    isAsc: 'desc',
    orderByColumn: 'orderDetailId',
    pageIndex: row.listDataOptions.pageIndex,
    pageSize: row.listDataOptions.pageSize,
    prefixRouter: '/inbound/in/orderDetail',
    queryBoList: [
      {
        column: 'orderId',
        dataType: 'LONG',
        label: '预到货单号',
        queryType: 'EQ',
        values: row.orderId,
      },
    ],
    tableName: 'in_order_detail',
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
      item.quantity = Number(item.quantity);
      item.enterQuantity = Number(item.enterQuantity);
      item.shelvedQuantity = Number(item.shelvedQuantity);
      item.bigQty = Number(item.bigQty);
      item.rowWeight = Number(item.rowWeight);
      return item;
    });
  }
};
const getProviderInfo = async (val: any) => {
  try {
    const url = '/basic/product/provider/getByShortName';
    const params = {
      providerShortName: val.providerShortName,
    };
    let [err, res] = await to(postData(url, params));
    if (err) {
      return;
    }
    if (res?.result) {
      let formData = masterData.value; // 主表
      let data = res.data;
      if (data) {
        formData.providerShortName = data.providerShortName;
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
        base.detailRows.value?.forEach((item: any) => {
          item.rate = Number(data.rate);
        });
      }
    }
  } catch (error: any) {
    proxy.$message.error(error.message);
  }
};

// 关闭窗口刷新列表
const onOutClose = () => {
  base.dataListRef.value.reload();
  state.isShowDialog = false;
};

// 打印条码
const printBarcode = async (formData: any, details: any, type?: any) => {
  // 得到，明细选中项
  var detailSelections = details[0].options.detailSelections;
  if (!detailSelections.length) {
    proxy.$message.error('1至少选择一项！');
    return;
  }
  detailSelections.forEach((item: any) => {
    const mainData = proxy.common.deepCopy(formData);
    delete mainData.Purchase_OrderList;
    Object.assign(item, mainData);
  });
  if (['middleBarcode', 'bigBarcode'].indexOf(type) >= 0) {
    const url = '/basic/product/product/selectList';
    // 查询条件
    let params: Array<QueryBo> = [
      {
        column: 'productCode',
        values: detailSelections
          .map((item: any) => {
            return item.productCode;
          })
          .join(','),
        queryType: QueryType.IN,
        dataType: DataType.STRING,
      },
    ];

    const [err, res] = await to(postData(url, params));
    if (err) {
      proxy.$message.error(err.message);
      return;
    }
    proxy.common.showMsg(res);
    if (res.result) {
      let rows: any[] = JSON.parse(JSON.stringify(detailSelections));
      rows = rows.filter((item: any) => {
        return res.data.some((row: any) => {
          const exist = row.productCode === item.productCode;
          if (exist) {
            item.productModel = row[type];
          }
          return exist;
        });
      });

      rows.forEach((row: any) => {
        row.printQty = row.quantity; // 打印数量
      });
      state.barcodeVisible = true;
      barcodeDialogRef.value.showData(rows, type);
    }
  } else {
    state.barcodeVisible = true;

    var rows: any[] = JSON.parse(JSON.stringify(detailSelections));
    rows.forEach((row: any) => {
      row.printQty = row.quantity; // 打印数量
    });
    barcodeDialogRef.value.showData(rows, type);
  }
};

/*******************************************************************
 * 以下为审核相关代码
 *******************************************************************/
const onLoadDataAfter = () => {
  state.loadingRows = []; // 清空loading暂存
};

// 取消loading事件
const cancelLoading = () => {
  let row = state.loadingRows.find((item) => item.orderId === state.billInfo.billId);
  if (row) {
    row.isLoading = false;
  }
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

// 过磅完成
const weightConfirm = () => {
  const url = '/composite/xianggang/InOrder/weightConfirm';
  base.commonSubmit(url, '确定要过磅完成操作吗？');
};

// 零库存出库
const zeroOut = () => {
  let url = '/inbound/in/order/zeroOut';
  base.commonSubmit(url, '确定要进行零库存出库吗？', () => {
    // 记录当前单据
    state.dataListSelections.forEach((item: any) => {
      item.isLoading = true;
      state.loadingRows.push(item);
    });
  });
};

const getValue = (value: any) => {
  let values: any = [];
  if (!value) {
    return values;
  }
  let expandFields = value;
  if (typeof expandFields !== 'object') {
    expandFields = JSON.parse(expandFields);
  }

  Object.keys(expandFields).forEach((key) => {
    values.push(expandFields[key]);
  });
  return values;
};
</script>
