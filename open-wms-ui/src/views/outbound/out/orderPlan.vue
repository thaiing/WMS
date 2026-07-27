<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" @on-row-change="onRowChange">
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
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" :btn-read-only="state.btnReadOnly" @on-row-change="onRowChange"></yrt-editor>

    <!-- 商品选择器 -->
    <yrt-selector ref="selector-dialog" :config="state.selectorConfig" v-model:visible="state.selectorConfig.visible" @on-selected="onSelected"></yrt-selector>
    <!--商品库存选择器-->
    <yrt-selector ref="selector-position-dialog" :config="state.selectorPositionConfig" v-model:visible="state.selectorPositionConfig.visible" @on-selected="onPositionSelected"></yrt-selector>
  </div>
</template>

<script setup lang="ts" name="inbound-in-orderPlan">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import baseHook from '/@/components/hooks/baseHook';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import { QueryBo, QueryType, DataType, OrderItem, OrderByType } from '/@/types/common';
import useDropdownStore from '/@/stores/modules/dropdown';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
const yrtSelector = defineAsyncComponent(() => import('/@/components/common/yrtSelector.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const stateFlow = defineAsyncComponent(() => import('/@/components/common/components/stateflow.vue'));
const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;
const dropdownStore = useDropdownStore();

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
  // 状态流加载参数
  stateLoadOptions: {
    prefixRouter: '/outbound/out/orderPlanStatusHistory',
    tableName: 'out_order_plan_status_history',
    idField: 'history_id',
    orderBy: '{"history_id":"DESC"}',
    pageIndex: 1,
    pageSize: 100,
  },
});
//#endregion

onMounted(() => {});

// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    case 'multiAuditing':
      multiAuditing();
      return true;
    case 'confirmTheWeight':
      confirmTheWeight();
      return true;
    case 'toOutOrder':
      toOutOrder();
      return true;
  }
};
// 编辑页面按钮事件
base.detailButtonClick = (authNode: string) => {
  switch (authNode) {
    case 'detailAdd':
      detailAdd();
      return true;
    case 'detailAddPosition':
      // 打开库存选择器
      detailAddPosition();
  }
};

const multiAuditing = async () => {
  const ids = state.dataListSelections.map((m) => {
    return m['orderPlanId'];
  });
  if (!ids.length) {
    proxy.$message.error('至少选中一行！');
    return;
  }
  proxy
    .$confirm('确定要批量进行审核操作吗?', '批量审核', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const url = '/outbound/out/orderPlan/multiAuditing';

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
};

const confirmTheWeight = async () => {
  const ids = state.dataListSelections.map((m) => {
    return m['orderPlanId'];
  });
  if (ids.length <= 0) {
    proxy.$message.error('至少选择一条数据');
    return;
  }
  proxy
    .$confirm('确定要批量进行审核操作吗?', '批量审核', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const url = '/outbound/out/orderPlan/confirmTheWeight';
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
        base.dataListRef.value.reload();
      }
    })
    .catch(() => {
      proxy.$message.error('已取消');
    });
};

const toOutOrder = async () => {
  const ids = state.dataListSelections.map((m) => {
    return m['orderPlanId'];
  });
  let selectInfos: Array<any> = state.dataListSelections;
  let flag = false;
  for (const item of selectInfos) {
    if (['审核成功'].indexOf(item.planStatus) == -1) {
      flag = true;
    }
  }
  if (flag) {
    proxy.$message.error('只有审核成功的单据才可以进行操作');
    return;
  }

  if (ids.length <= 0) {
    proxy.$message.error('至少选择一条数据');
    return;
  }
  proxy
    .$confirm('确定要转到出库单?', '转出库单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const url = '/outbound/out/orderPlan/toOutOrder/' + ids.join(',');
      const [err, res] = await to(postData(url));
      if (err) {
        proxy.$message.error(err.message);
        return;
      }
      if (res.result) {
        proxy.common.showMsg(res);
        base.dataListRef.value.reload();
      }
    })
    .catch(() => {
      proxy.$message.error('已取消');
    });
};

// 明细添加
const detailAdd = () => {
  state.selectorConfig.visible = true;
};
// 将选择器选择中的数据填充到明细表中
const onSelected = (rows: Array<any>) => {
  rows.forEach((item) => {
    item.storageId = '';
    item.storageName = '';
  });
  if (base.masterData.value.clientId) {
    var val = {
      clientId: base.masterData.value.clientId,
    };
    getClientInfo(val);
  }
  base.editorRef.value.addDetailDataRow(rows);
  state.selectorConfig.visible = false;
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
const onRowChange = (ref: any, val: any, field: any) => {
  debugger;
  if (field.options.prop === 'clientShortName') {
    // 改变区级下拉框
    getClientInfo(val);
  }
};

// 根据省ID获得市
const loadChildrenNode = async (id: any, dropdownId: any, prop: any) => {
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
      formData.clientId = data.clientId;
      formData.shippingName = data.shippingName;
      formData.telephone = data.tel;
      formData.mobile = data.mobile;
      formData.shippingAddress = data.shippingAddress;
      formData.countryName = data.countryName;
      formData.provinceName = data.provinceName;
      formData.provinceId = data.provinceId;
      formData.shippingName = data.shippingName;
      formData.cityName = data.cityName;
      formData.cityId = data.cityId;
      formData.regionName = data.regionName;
      formData.regionId = data.regionId;
      formData.email = data.email;
      formData.lineName = data.lineName;
      base.detailRows.value?.forEach((item: any) => {
        item.rate = Number(data.rate);
      });
    }
  } catch (error: any) {
    proxy.$message.error(error.message);
  }
};

// 明细字段触发改变
base.onDetailChange = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  setTotal(ref, val, row, field, detailRows);
  // 大单位数量取整= 数量*大单位换算关系
  detailRows &&
    detailRows.forEach((item) => {
      item.bigUnitRounding = Math.floor((item.quantity || 0) * (item.unitConvert || 0));
    });
};

// 求和
const setTotal = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  // 合计数量求和
  let totalWeight = 0.0; // 合计重量
  let totalQuantity = 0; // 合计数量
  let totalAmount = 0; // 合计金额
  let totalCube = 0; // 合计体积
  let bigQtyTotal = 0; // 大单位数量
  detailRows &&
    detailRows &&
    detailRows.forEach((item: any) => {
      item.rowPurchaseAmount = Math.Round((item.quantityOrder || 0) * (item.purchasePrice || 0), 2); // 成本金额 = 数量 * 成本单价

      if (item.settlementType === '重量结算') {
        item.saleAmount = item.rowWeight * item.salePrice;
      } else {
        item.saleAmount = Math.Round(item.quantity, 2) * item.salePrice;
      }
      totalQuantity += Math.Round(item.quantity, 2);
      totalAmount += item.saleAmount;
      // 行小计重量
      if (field) {
        // weight 单位毛重  /   totalWeight 小计毛重 quantity 数量
        if (field.prop === 'quantity' || field.prop === 'weight' || field.prop === 'unitCube') {
          // 小计  =  数量 * 单位毛重
          item.rowWeight = Math.Round((Math.Round(item.quantity, 2) || 0) * (item.weight || 0), 5);
          item.rowCube = Math.Round((Math.Round(item.quantity, 2) || 0) * (item.unitCube || 0), 5);
        } else if (field && field.prop === 'rowWeight') {
          // 修改合计重量，计算出单位重量
          if (Math.Round(item.quantity, 2)) {
            item.weight = Math.Round((item.rowWeight || 0) / (Math.Round(item.quantity, 2) || 0), 5);
          } else {
            item.weight = 0;
          }
        }
        item.bigQty = Number(item.unitConvert) ? Math.ceil(item.quantity / item.unitConvert) : null;
        let rate = 1 + Number(item.rate);
        item.ratePrice = (item.salePrice || 0) * rate; // 含税单价 = 单价*（1+税率）
        item.rateAmount = Math.Round((item.quantity || 0) * (item.ratePrice || 0), 2); // 含税金额 = 数量 * 含税单价；

        bigQtyTotal += Number(item.bigQty);
      }
      // 合计重量
      totalWeight += item.rowWeight;
      // 合计体积
      item.surplusQuantity = item.quantity;

      // 合计体积
      totalCube += item.rowCube;
    });
  // masterData.value.totalQuantityOrder = Math.Round(totalQuantityOrder, 2); // 合计数量

  // masterData.value.totalPurchaseAmount = Math.Round(totalPurchaseAmount, 2); // 合计金额
  // masterData.value.totalWeight = Math.Round(totalWeight, 2); // 合计重量
  masterData.value.totalQuantity = Math.Round(totalQuantity, 2);
  masterData.value.totalAmount = Math.Round(totalAmount, 2);
  masterData.value.totalWeight = Math.Round(totalWeight, 2);
  masterData.value.totalCube = Math.Round(totalCube, 2);
  masterData.value.bigQtyTotal = Math.Round(bigQtyTotal, 2);
};

// 保存前
base.onSaveBefore = (master: any) => {
  let isQty = true;
  let isStorageName = true;
  base.detailRows.value?.forEach((item) => {
    if (item.quantity <= 0 || !item.quantity) {
      isQty = false;
    }
    if (!item.storageName) {
      isStorageName = false;
    }
  });
  if (!isQty) {
    proxy.$message.error('明细预出库数量必须大于0！');
    return false;
  }
  if (!isStorageName) {
    proxy.$message.error('明细仓库必填！');
    return false;
  }
  return true;
};
// 打开库存选择器
const detailAddPosition = () => {
  let formData = masterData.value; // 主表
  // if (!formData.consignorName) {
  //   proxy.$message.error('请选择货主！');
  //   return;
  // }
  const selector = proxy.$refs['selector-position-dialog'];

  selector.setSearchValue('consignorId', formData.consignorId);
  selector.setSearchValue('consignorName', formData.consignorName);

  state.selectorPositionConfig.visible = true;
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
    element.validQuantity = element.usingStorage;
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

  if (base.masterData.value.clientId) {
    var val = {
      clientId: base.masterData.value.clientId,
    };
    getClientInfo(val);
  }
  base.editorRef.value.addDetailDataRow(rows);
  let detailRows: any = base.detailRows.value;
  setTotal(null, null, null, null, detailRows);
  state.selectorPositionConfig.visible = false;
};

base.onEditLoadAfter = (master: any) => {
  // 加载省
  if (master.provinceId) {
    loadChildrenNode(master.provinceId, 614, 'provinceName');
  }
  // 加载市
  if (master.cityId) {
    loadChildrenNode(master.cityId, 615, 'cityName');
  }
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
