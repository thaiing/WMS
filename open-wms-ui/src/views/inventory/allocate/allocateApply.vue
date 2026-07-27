<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes">
      <!--自定义字段插槽-->
      <template #common-column-slot="{ row, col }">
        <template v-if="col.prop == 'applyStatus'">
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
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" @on-detail-delete-after="base.onDetailDeleteAfter" :btn-read-only="state.btnReadOnly" :use-detail-slot="['lackStorage', 'sortingStatus', 'images']" @on-row-change="base.onRowChange">
      <!--自定义字段插槽-->
      <template #detail-column-slot="{ row, col }">
        <template v-if="col.prop === 'lackStorage'">
          <div>
            {{ row[col.prop] }}
            <el-link type="primary" @click="setSortingRule(row)">{{ $tt('设置规则') }}</el-link>
          </div>
        </template>
        <template v-else-if="col.prop == 'sortingStatus'">
          <detailstate-flow :load-options="state.stateLoadOptionsDetail" :where="{ detailID: row.allocateApplyDetailId, mainID: row.allocateApplyId }">
            <template #content>
              <!-- 通用标签颜色着色 -->
              <el-tag :color="common.getTagBgColor(row, col, row[col.prop])" :style="common.getTagColor(row, col, row[col.prop])">
                {{ common.formatData(row, col) }}
              </el-tag>
            </template>
          </detailstate-flow>
        </template>
        <template v-else-if="col.prop === 'images'">
          <el-image v-for="(pic, index) in base.getPicList(row[col.prop])" :src="base.showSmallPic(pic)" class="pic-small" fit="contain" preview-teleported :preview-src-list="base.getPicList(row[col.prop])" />
        </template>
      </template>
    </yrt-editor>
    <!--商品库存选择器-->
    <yrt-selector ref="selector-position-dialog" :config="state.selectorPositionConfig" v-model:visible="state.selectorPositionConfig.visible" @on-selected="onPositionSelected"></yrt-selector>
    <!--出库单设置规则-->
    <sorting-rule-dialog ref="sortingRule" v-model:visible="state.winSortingRuleVisible" v-model:masterData="base.masterData"></sorting-rule-dialog>
  </div>
</template>

<script setup lang="ts" name="inventory-allocate-allocateApply">
import { ComponentInternalInstance } from 'vue';
import { DataType, OrderByType, OrderItem, QueryBo, QueryType } from '/@/types/common';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
import baseHook from '/@/components/hooks/baseHook';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import useDropdownStore from '/@/stores/modules/dropdown';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
const stateFlow = defineAsyncComponent(() => import('/@/components/common/components/stateflow.vue'));

const detailstateFlow = defineAsyncComponent(() => import('/@/components/common/components/detailstateflow.vue'));
const dropdownStore = useDropdownStore();

const SortingRuleDialog = defineAsyncComponent(() => import('./components/sortingRuleDialog.vue'));

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),

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
  // 状态流加载参数
  stateLoadOptions: {
    prefixRouter: '/inventory/allocate/allocateApplyStatusHistory',
    tableName: 'storage_allocate_apply_status_history',
    idField: 'history_id',
    orderBy: '{"history_id":"DESC"}',
    pageIndex: 1,
    pageSize: 100,
  },
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
  winSortingRuleVisible: false,
});
//#endregion

onMounted(() => {});

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
    element.sortingStatus = 1;
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
  let totalCube = 0.0;
  let bigQtyTotal = 0.0;
  detailRows &&
    detailRows.forEach((item: any) => {
      item.applyQuantity = Number(item.applyQuantity || 0);
      item.purchasePrice = Number(item.purchasePrice || 0);
      item.rate = Number(item.rate || 0);

      item.purchaseAmount = Math.Round(item.applyQuantity * item.purchasePrice, 5);
      item.ratePrice = Math.Round(item.purchasePrice * (item.rate + 1), 5);
      item.rateAmount = Math.Round(item.ratePrice * item.applyQuantity, 5);
      item.rowWeight = Math.Round(item.applyQuantity * item.weight, 5);
      item.rowWeightTon = Math.Round(item.rowWeight / 1000, 5);
      item.rowNetWeight = Math.Round(item.applyQuantity * item.netWeight, 5);
      item.rowCube = Math.Round(item.applyQuantity * item.unitCube, 5);

      totalQuantity += Number(item.applyQuantity) || 0;
      totalAmount += Number(item.purchaseAmount) || 0;
      totalWeight += Number(item.rowWeight) || 0;
      taxAmount += Number(item.rateAmount) || 0;
      totalCube += Number(item.rowCube) || 0;
      bigQtyTotal += Number(item.bigQty) || 0;
    });
  masterData.value.totalQuantity = Math.Round(totalQuantity, 5);
  masterData.value.totalAmount = Math.Round(totalAmount, 2); // 合计金额
  masterData.value.taxAmount = Math.Round(taxAmount, 2); // 含税金额
  masterData.value.totalWeight = Math.Round(totalWeight, 5);
  masterData.value.totalCube = Math.Round(totalCube, 5);
  masterData.value.bigQtyTotal = Math.Round(bigQtyTotal, 5);
  masterData.value.totalUnpaid = Math.Round(Number(masterData.value.taxAmount) + Number(masterData.value.shippingAmount));
};
// 明细字段触发改变
base.onDetailChange = (ref: any, val: any, row: any, field: DetailField, detailRows: Array<any>) => {
  setTotal(ref, val, row, field, detailRows);
};

base.onSaveBefore = (master: any) => {
  let flag = false;

  base.detailRows.value?.forEach((item: any) => {
    if (item.applyQuantity <= 0 || !item.applyQuantity) {
      proxy.$message.error('明细数量必须大于0！');
      flag = true;
      return;
    }
  });
  if (flag) {
    return false;
  }
  if (!base.detailRows.value.length) {
    proxy.$message.error('最少添加一条明细');
    return false;
  }
  return true;
};

// 明细删除后事件
base.onDetailDeleteAfter = (deletedRows: Array<any>, detailInfo: any) => {
  setTotal(null, null, null, null, base.detailRows.value);
  return true;
};

base.onEditLoadAfter = (master: any) => {
  var applyStatus = master.applyStatus;
  state.btnReadOnly.stop = true;
  state.btnReadOnly.open = true;
  state.btnReadOnly.auditing = false;
  state.btnReadOnly.detailDelete = false; // 不可编辑
  state.editorOptions.config.disabled = false;
  if (applyStatus == '审核成功') {
    state.btnReadOnly.stop = false;
  }
  if (applyStatus == '终止') {
    state.btnReadOnly.open = false;
  }
  if (master.auditing == 2) {
    state.btnReadOnly.auditing = true;
    state.editorOptions.config.disabled = true;
  }
  loadChildrenNode(master.provinceId, 614, 'provinceName');
  loadChildrenNode(master.cityId, 615, 'cityName');
};

base.onAddLoadAfter = () => {
  state.btnReadOnly.stop = true;
  state.btnReadOnly.open = true;
  state.btnReadOnly.auditing = false;
  state.btnReadOnly.detailDelete = false; // 不可编辑
  state.editorOptions.config.disabled = false;
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
  if (rows.filter((item) => item.applyStatus != '审核成功').length) {
    proxy.$message.error('只有【审核成功】的单据才允许操作！');
  }

  proxy
    .$confirm('确定要操作此功能吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      let ids = rows.map((item) => item.allocateApplyId);
      const url = '/composite/allocateApply/toOutOrder';
      const params = {
        ids: ids.join(','),

        allocateType: 'toOutOrder', //转到出库单
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

// 字段值改变事件
base.onChange = (ref: any, val: any, field: any, formData: any) => {
  // 记录ID和Name
  if (field.options.prop === 'provinceName') {
    // 改变市级下拉框
    loadChildrenNode(val, 614, field.options.prop);
  } else if (field.options.prop === 'cityName') {
    // 改变区级下拉框
    loadChildrenNode(val, 615, field.options.prop);
  } else if (field.options.prop === 'storageNameIn') {
    formData.virtualStorageName = formData.storageNameIn;
    formData.virtualStorageId = formData.storageIdIn;
  }
  setTotal(null, null, null, null, base.detailRows.value);
};

// 字段值改变事件
base.onRowChange = (ref: any, val: any, field: any) => {
  let formData = masterData.value; // 主表

  if (field.options.prop === 'consignorName') {
    formData.consignorNameTarget = val.consignorName;
    formData.consignorCodeTarget = val.consignorCode;
    formData.consignorIdTarget = val.consignorId;
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
          city_Id: item.value,
          cityName: item.label,
          value: item.value,
          label: item.label,
        };
        return newItem;
      } else if (prop === 'cityName') {
        const newItem = {
          region_Id: item.value,
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

// 批量审核
const multiAuditing = async () => {
  // 选中行id
  var openIds: Array<any> = state.dataListSelections;
  let flag = false;
  for (const item of openIds) {
    if (['新建', '待审核'].indexOf(item.applyStatus) == -1) {
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
  proxy
    .$confirm('确定要审核单据吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const url = '/inventory/allocate/allocateApply/multiAuditing';
      const params = {
        ids: openIds,
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
  if (rows.filter((item) => item.applyStatus != '审核成功').length) {
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
      let ids = rows.map((item) => item.allocateApplyId);
      const url = '/composite/allocateApply/toOutOrder';
      const params = {
        ids: ids.join(','),
        allocateType: 'validateOut', //确认出库
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
// 设置分拣规则
const setSortingRule = (row: any) => {
  state.winSortingRuleVisible = true;
  state.selectRuleRow = row;
  state.sortingRuleForm.productCode = state.selectRuleRow['productCode'];
  state.winSortingRuleVisible = true;
  const allocateApplyDetailId = state.selectRuleRow['allocateApplyDetailId'];
  proxy.$refs.sortingRule.state.allocateApplyDetailId = allocateApplyDetailId;
  proxy.$refs.sortingRule.loadData(state.sortingRuleForm); // 刷新列表
  proxy.$refs.sortingRule.getSortingRuleList();
};
</script>
