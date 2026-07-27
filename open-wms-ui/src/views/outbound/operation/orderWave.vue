<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" :on-delete-before="base.onDeleteBefore" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :quick-search-fields="state.quickSearchFields" :open-expand="true" @on-expand-change="onExpandChange">
      <template #expand-slot="{ row, col }">
        <!--波次明细-->
        <div class="wave-detail">
          <div class="expand-title mt-10">波次明细列表</div>
          <el-table :data="row.orderDataList" border style="margin-left: 50px; font-size: 12px; width: 1000px" row-key="order_Id" max-height="400">
            <el-table-column :index="(index:number) => (row.listDataOptions.pageIndex - 1) * row.listDataOptions.pageSize + index + 1" type="index" fixed="left" class="col-index" label="#" width="30" />
            <el-table-column prop="productCode" :label="$tt('商品编号')" width="120"> </el-table-column>
            <el-table-column prop="productName" :label="$tt('商品名称')"> </el-table-column>
            <el-table-column prop="positionName" :label="$tt('拣货货位')" width="80"> </el-table-column>
            <el-table-column prop="quantityOrder" :label="$tt('订单数量')" width="80"> </el-table-column>
            <el-table-column prop="pickQuantity" :label="$tt('拣货数量')" width="80"> </el-table-column>
            <el-table-column prop="quantityOuted" :label="$tt('打包数量')" width="80"> </el-table-column>
            <el-table-column prop="orderCode" :label="$tt('出库单号')" width="120"> </el-table-column>
            <el-table-column prop="clientShortName" :label="$tt('客户名称')" width="150"> </el-table-column>
          </el-table>
          <el-pagination v-if="row.listDataOptions.total > 50" background v-model:current-page="row.listDataOptions.pageIndex" v-model:page-size="row.listDataOptions.pageSize" layout="prev, pager, next" :total="row.listDataOptions.total || 0" style="margin-left: 50px; margin-top: 10px" @current-change="(value:any) => handleSizeChange(row, value)"></el-pagination>
        </div>

        <!--子波次列表-->
        <div v-if="subDataListGroup(row).length" class="expand-title mt-40">子波次列表</div>
        <div class="card-container">
          <el-card v-for="(areaItem, index) in subDataListGroup(row)" :key="index" class="box-card">
            <div slot="header" class="clearfix ml-20">
              <span class="margin-right-5">{{ areaItem.subOrderWaveCode }}</span>
              <span class="margin-right-5">库区：{{ areaItem.areaCode }}</span>
              <span class="margin-right-5">{{ areaItem.subWaveStatus }}</span>
              <span class="margin-right-5">{{ areaItem.pickNickName }}</span>
              <el-button v-if="areaItem.pickNickName && state.authNodes.cancelNickName && areaItem.subWaveStatus !== '拣货完成'" class="margin-top-10 margin-right-20" type="primary" style="padding: 8px" @click="cancelSubNickName(areaItem.subId, areaItem.subWaveStatus)">取消拣货人</el-button>
              <el-button class="margin-top-10" type="success" style="padding: 8px" @click="detailPrint(areaItem.orderWaveId, areaItem.subOrderWaveCode)">打印拣配单</el-button>
            </div>
            <el-scrollbar :noresize="false" :native="false" wrap-class="tree scrollbar-wrap">
              <div v-for="(item, index2) in getSubBatch(row, areaItem)" :key="index2" class="item">
                <el-form inline label-width="80px">
                  <el-form-item class="row-long">
                    {{ item.productName }}
                  </el-form-item>
                  <el-form-item label="商品编号" class="row">
                    {{ item.productCode }}
                  </el-form-item>
                  <el-form-item label="商品条码" class="row">
                    {{ item.productModel }}
                  </el-form-item>
                  <el-form-item label="货位" class="row">
                    {{ item.positionName }}
                  </el-form-item>
                  <el-form-item label="数量" class="row">
                    {{ Number(item.quantityOrder) }}
                  </el-form-item>
                  <el-form-item label="配货位" class="row">
                    {{ item.allotPositionName }}
                  </el-form-item>
                  <el-form-item label="出库单号" class="row">
                    {{ item.orderCode }}
                  </el-form-item>
                </el-form>
                <el-divider class="divider"></el-divider>
              </div>
            </el-scrollbar>
          </el-card>
        </div>
      </template>
      <template #common-column-slot="{ row, col }">
        <template v-if="col.prop == 'waveStatus'">
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
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter">
      <template #footer-button-region="{ formData }">
        <el-button type="primary" v-if="state.authNodes.deleteOrderWave" :disabled="state.btnReadOnly.deleteOrderWave" @click="tempModify(formData)">删除订单</el-button>
        <!-- <el-button type="primary" @click="tempModify(formData)">删除订单</el-button> -->
      </template></yrt-editor
    >

    <el-dialog draggable v-model="state.currentVisible" title="修改优先级" width="30%" class="dialog-container">
      <el-form label-width="150px">
        <el-form-item label="优先级">
          <el-input v-model.number="state.orderNum" class="w-250"></el-input>
        </el-form-item>
      </el-form>
      <template class="right" #footer>
        <span>
          <el-button @click="state.currentVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateOrderNum">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="outbound-operation-orderWave">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import baseHook from '/@/components/hooks/baseHook';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import { DataType, QueryBo, QueryType } from '/@/types/common';
import YrtDataList from '/@/components/common/yrtDataList.vue';

const stateFlow = defineAsyncComponent(() => import('/@/components/common/components/stateflow.vue'));

// import yrtEditor from '/@/components/common/yrtEditor.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData, editorRef } = base;
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  // 在做保存
  isSaving: false,
  // 子波次
  subDataList: [] as any[],
  // 自定义查询条件
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
    {
      label: '出库单号',
      prop: 'orderId',
      type: 'input',
      dataType: 'int',
      value: null,
      // 获取查询条件
      getWhere: (val: any, me: any) => {
        if (!val) return null;

        return {
          dataType: DataType.STRING,
          label: '出库单号',
          column: 'orderCode',
          queryType: QueryType.CUSTOM,
          values: val?.toString(),
        } as QueryBo;
      },
    },
  ],
  config: {
    sale_orderPrint_statusText: false, // 开启波次打印物流单状态校验【发运完成、打包完成】
  } as any,
  createDistConfig: {
    // 生成配送派车单对话框
    isShowDialog: false,
    title: '生成配送派车单',
  } as any,
  wayBillIds: [] as any[], // 选中波次对应运单ID
  // 编辑页面主表标签使用插槽的字段
  useLabelSlot: ['totalWeight'] as any[],
  stateLoadOptions: {
    prefixRouter: 'outbound/out/orderWaveStatusHistory',
    tableName: 'out_order_wave_status_history',
    idField: 'history_id',
    orderBy: '{"history_id":"DESC"}',
    pageIndex: 1,
    pageSize: 100,
  },
  currentVisible: false,
  orderNum: 0,
});
//#endregion

//#region 按钮事件
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    case 'delete':
      deleteData();
      return true;
    case 'printOut':
      printOut();
      return true;
    case 'printExpress':
      printExpress();
      return true;
    case 'detailPrint':
      detailPrint();
      return true;
    case 'updatePriority':
      updatePriority();
      return true;
    case 'cancelNickName':
      // 取消拣货人
      cancelNickName();
      break;
  }
};
//#endregion

// 调整优先级
const updatePriority = async () => {
  let ids = [] as any[];
  state.dataListSelections.forEach((item) => {
    ids.push(item[state.dataOptions.idField]);
  });
  if (!ids.length) {
    proxy.$message.error('至少选择一项！');
    return;
  }
  state.currentVisible = true;
};

// 修改优先级
const updateOrderNum = async () => {
  let ids = [] as any[];
  state.dataListSelections.forEach((item) => {
    ids.push(item[state.dataOptions.idField]);
  });
  if (!ids.length) {
    proxy.$message.error('至少选择一项！');
    return;
  }

  if (state.orderNum < 0) {
    proxy.$message.error('优先级必须大于等于0');
    return;
  }
  let url = '/outbound/operation/orderWave/updatePriority';
  let params = {
    idList: ids.join(','),
    orderNum: state.orderNum,
  };

  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }

  base.dataListRef.value.reload(); // 刷新列表数据

  state.currentVisible = false;
};

// 打印拣配单
const detailPrint = async (orderWaveId?: number, subOrderWaveCode?: string) => {
  let ids = [] as any[];
  if (orderWaveId) {
    ids = [orderWaveId];
  } else {
    state.dataListSelections.forEach((item) => {
      ids.push(item[state.dataOptions.idField]);
    });
  }
  if (!ids.length) {
    proxy.$message.error('至少选择一项！');
    return;
  }
  // 查询条件
  let queryBoList: Array<QueryBo> = [
    {
      column: 'subOrderWaveCode',
      values: subOrderWaveCode,
      queryType: QueryType.EQ,
      dataType: DataType.STRING,
    },
  ];

  let url = `/system/print/base-template-id/10013/0/${ids.join(',')}?key=${proxy.common.getGUID()}&autoPrint=false&printQuery=${decodeURI(JSON.stringify(queryBoList))}`;
  window.open(url);
};

// 打印出库单
const printOut = async () => {
  let ids = [] as any[];
  state.dataListSelections.forEach((item) => {
    ids.push(item[state.dataOptions.idField]);
  });
  if (!ids.length) {
    proxy.$message.error('至少选择一项！');
    return;
  }
  let url = '/outbound/out/order/getOutIds';
  let params = {
    ids: ids,
  };

  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }

  let order_Ids = [] as any[];
  res.data.dataList.forEach((item: any) => {
    order_Ids.push(item.orderId);
  });

  url = `/system/print/base-template-id/167101/0/${order_Ids.join(',')}?key=${proxy.common.getGUID()}&autoPrint=false`;
  window.open(url);
};
// 打印物流单
const printExpress = async () => {
  let ids = [] as any[];
  state.dataListSelections.forEach((item) => {
    ids.push(item[state.dataOptions.idField]);
  });
  if (!ids.length) {
    proxy.$message.error('至少选择一项！');
    return;
  }
  let url = '/outbound/out/order/getOutAndExpress';
  let params = {
    ids: ids,
  };

  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }

  let obj = [] as any[];
  let newArr = res.data.dataList.reduce((item: any, next: any) => {
    obj[next.expressCorpName] ? '' : (obj[next.expressCorpName] = true && item.push(next));
    return item;
  }, []);

  for (let item of newArr) {
    const dataList = res.data.dataList.filter((f: any) => f.expressCorpName === item.expressCorpName);
    let orderId = dataList
      .map((item: any) => {
        return item.orderId;
      })
      .join(',');
    orderId;

    let url = `/system/print/base-template-id/${item.menuId}/0/${orderId}?key=${proxy.common.getGUID()}&autoPrint=false`;
    window.open(url);
  }
};

base.onDeleteBefore = (rows: any) => {
  let statusText = true;
  let Status = null;
  let originStatus = null;
  rows.forEach((element: any) => {
    originStatus = element.waveStatus;
    Status = element.waveStatus;

    if (originStatus === '波次生成') {
      statusText = false;
    }
    if (originStatus === '拣货中') {
      statusText = false;
    }
    if (originStatus === '等待配货') {
      statusText = false;
    }
    if (originStatus === '配货中') {
      statusText = false;
    }
  });

  if (!statusText) {
    proxy.$message.error('波次单状态为：' + Status + '，不允许删除!');
    return false;
  }
};

onMounted(() => {});

// 删除数据
const deleteData = async () => {
  if (state.dataListSelections.length !== 1) {
    proxy.$message.error('请选择一条数据！');
    return;
  }
  let openIds: Array<any> = state.dataListSelections;
  if (Array.isArray(state.dataListSelections)) {
    openIds = state.dataListSelections.map((item: any) => {
      return item[state.dataOptions.idField];
    });
  }
  proxy
    .$confirm('此操作将永久删除选中的数据, 是否继续?', '删除操作', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const url = '/outbound/operation/orderWave/deleteData';
      const params = {
        ids: openIds.join(','),
      };
      const [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }
      if (res.result) {
        base.dataListRef.value.reload(); // 刷新列表数据
      }
    })
    .catch(() => {
      proxy.$message.info('已取消删除');
    });
};

// 取消拣货人
const cancelNickName = async () => {
  const ids = state.dataListSelections.map((item: any) => item.orderWaveId);

  let selectInfos: Array<any> = state.dataListSelections;
  if (!selectInfos.length) {
    proxy.$message.error('请至少选择一行数据！');
    return;
  }

  let url = '/outbound/operation/orderWave/cancelNickName';
  const params = {
    ids: ids.join(','),
  };

  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    proxy.common.showMsg(res);
    base.dataListRef.value.reload();
  }
};
// 取消子波次拣货人
const cancelSubNickName = async (subId: number, waveStatus: string) => {
  if (!subId) {
    proxy.$message.error('参数不全，请重新执行操作！');
    return;
  }
  const statusList = ['波次完成', '拣货中', '部分拣货'];
  if (statusList.indexOf(waveStatus) === -1) {
    proxy.$message.error('只有波次完成、拣货中、部分拣货才可以操作！');
    return;
  }

  let url = '/outbound/operation/orderWave/cancelSubNickName/' + subId;
  let params = {};
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    proxy.common.showMsg(res);
    base.dataListRef.value.reload();
  }
};

// 显示生成配送派车单对话框
const distributionbill = async () => {
  let selectInfos: Array<any> = state.dataListSelections;
  if (!selectInfos.length) {
    proxy.$message.error('请选择一条波次单操作！');
  }

  if (base.masterData.value.waveStatus !== '波次完成') {
    proxy.$message.error('只有状态为波次完成的才允许生成！');
    return;
  }
  const orderWaveId = base.masterData.value.orderWaveId;

  // 获取波次单下生成的对应运单ID
  const url = '/api/outbound/orderBatch/getWayBillIds';
  const params = {
    orderWaveId: orderWaveId,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    state.createDistConfig.isShowDialog = true;
    state.wayBillIds = res.data.ids;
    // 配送任务单
    proxy.$refs.childData.childListInfo(res.data.ids, {
      totalQuantity: res.data.totalQuantity,
      totalNumber: res.data.totalNumber,
      totalWeight: res.data.totalWeight,
      totalVolume: res.data.totalVolume,
      distributionRoute: res.data.distributionRoute,
    });
  }
};

// 剔除订单
const tempModify = (formData: any) => {
  if (!formData.orderWaveId) {
    proxy.$message.error('请先保存数据！');
    return;
  }
  proxy
    .$prompt('需要剔除的订单号', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
    .then(({ value }) => {
      tempModifyInfo(formData.orderWaveId, value);
    })
    .catch(() => {
      proxy.$message.error('已取消');
    });
};
// 剔除订单号
const tempModifyInfo = async (orderWaveId: any, orderCode: any) => {
  if (!orderCode) {
    proxy.$message.error('订单号不能为空!');
    return false;
  }
  const url = '/outbound/operation/orderWave/onFrozenOrder';
  const params = {
    orderWaveId: orderWaveId,
    orderCode: orderCode,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  proxy.common.showMsg(res);

  if (res.result) {
    editorRef.value.loadEditData(masterData.value.orderId);
    base.dataListRef.value.loadData();
  }
};

base.onEditLoadAfter = (master: any) => {
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
};

// 展开事件
const onExpandChange = async (row: any, expandedRows: any) => {
  // 已经加载后不再重新加载
  if (row.isLoadExpanded) return;

  await loadDetailList(row);
  await loadSubWave(row);
  row.isLoadExpanded = true; // 已加载
};

// 分页大小改变
const handleSizeChange = async (row: any, value: number) => {
  row.listDataOptions.pageIndex = value;

  await loadDetailList(row);
};

//加载展开时间明细列
const loadDetailList = async (row: any) => {
  if (!row.listDataOptions) {
    row.listDataOptions = {
      pageIndex: 1,
      pageSize: 50,
    };
  }

  const url = '/outbound/operation/orderWaveDetail/pageList';
  const params = {
    isAsc: 'desc',
    menuId: 1650,
    orderByColumn: 'orderWaveDetailId',
    pageIndex: row.listDataOptions.pageIndex,
    pageSize: row.listDataOptions.pageSize,
    prefixRouter: '/outbound/operation/orderWaveDetail',
    queryBoList: [
      {
        column: 'orderWaveId',
        dataType: 'LONG',
        label: '波次Id',
        queryType: 'EQ',
        values: row.orderWaveId,
      },
    ],
    tableName: 'out_order_wave_detail',
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
      item.pickQuantity = Number(item.pickQuantity);
      item.quantityOuted = Number(item.quantityOuted);
      return item;
    });
  }
};

//加载展开子波次数据
const loadSubWave = async (row: any) => {
  const url = '/outbound/operation/orderWave/getSubWave/' + row.orderWaveId;
  const params = {};
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }

  let compare = function (prop: any) {
    return function (obj1: any, obj2: any) {
      let val1 = obj1[prop];
      let val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    };
  };
  res.data = res.data.sort(compare('productName'));

  const existRow = state.subDataList.find((item) => item.orderWaveCode === row.orderWaveCode);
  if (existRow) {
    existRow.data = res.data;
  } else {
    state.subDataList.push({
      orderWaveCode: row.orderWaveCode,
      data: res.data,
    });
  }
};

// 获得子波次
const subDataListGroup = (row: any) => {
  const existRow = state.subDataList.find((item) => item.orderWaveCode === row.orderWaveCode);
  if (!existRow) return [];

  const groupList = existRow.data.reduce((all: any[], next: any) => (all.some((item) => item.areaCode === next.areaCode) ? all : [...all, next]), []);
  return groupList;
};
// 当前子波次
const getSubBatch = (row: any, subRow: any) => {
  const existRow = state.subDataList.find((item) => item.orderWaveCode === row.orderWaveCode);
  if (!existRow) return [];

  return existRow.data.filter((item: any) => item.areaCode === subRow.areaCode);
};
</script>

<style lang="scss" scoped>
.expand-title {
  line-height: 30px;
  font-size: 20px;
  font-weight: bolder;
  padding-left: 50px;
}
.card-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding-left: 50px;
  margin-top: 10px;
}
.box-card {
  width: 450px;
  margin-right: 10px;
  margin-bottom: 10px;
  .row-long {
    width: 96%;
    margin-bottom: 0;
  }
  .item {
    text-align: left;
  }
  .row {
    width: 49%;
    margin-bottom: 0;
  }
  .divider {
    margin: 10px 0;
  }
  ::v-deep .el-card__body {
    padding: 0px;
  }
  ::v-deep .el-form-item--medium .el-form-item__content,
  ::v-deep .el-form-item--medium .el-form-item__label {
    line-height: 24px;
    padding-right: 2px;
  }
  ::v-deep .el-form-item--medium .el-form-item__label {
    color: rgb(177, 177, 177);
  }
  ::v-deep .el-form--inline .el-form-item {
    margin-right: 2px;
  }
  ::v-deep .tree.scrollbar-wrap {
    max-height: 400px;
    overflow-x: hidden;
    padding: 10px 10px 20px;
    .el-tree {
      margin-bottom: 10px;
    }
  }
}
</style>
