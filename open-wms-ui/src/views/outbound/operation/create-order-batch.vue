<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :open-expand="true" :on-translate="onTranslate" @on-expand-change="onExpandChange">
      <template #expand-slot="{ row, col }">
        <el-table :data="row.orderDataList" border style="margin-left: 50px; font-size: 12px; width: 1000px" row-key="order_Id">
          <el-table-column :index="(index:number) => (row.listDataOptions.pageIndex - 1) * row.listDataOptions.pageSize + index + 1" type="index" fixed="left" class="col-index" label="#" width="30" />
          <el-table-column prop="productCode" :label="$tt('商品编号')" width="120"> </el-table-column>
          <el-table-column prop="productName" :label="$tt('商品名称')"> </el-table-column>
          <el-table-column prop="productSpec" :label="$tt('商品规格')" width="80"> </el-table-column>
          <el-table-column prop="quantityOrder" :label="$tt('预出库数量')" width="80"> </el-table-column>
          <el-table-column prop="smallUnit" :label="$tt('小单位')" width="80"> </el-table-column>
          <el-table-column prop="bigUnit" :label="$tt('大单位')" width="80"> </el-table-column>
          <el-table-column prop="bigQty" :label="$tt('大单位数量')" width="80"> </el-table-column>
          <el-table-column prop="rowWeight" :label="$tt('小计毛重')" width="80"> </el-table-column>
          <el-table-column prop="rowCube" :label="$tt('小计体积')" width="80"> </el-table-column>
        </el-table>
        <div>
          <el-pagination background v-model:current-page="row.listDataOptions.pageIndex" v-if="row.listDataOptions.total > 15" v-model:page-size="row.listDataOptions.pageSize" layout="prev, pager, next" :total="row.listDataOptions.total || 0" @current-change="(value:any) => handleSizeChange(row, value)"></el-pagination>
        </div>
      </template>
      <template #datalist-footer>
        <div style="margin-top: 10px; padding-bottom: 20px; border-top: 1px solid #ebeef5">
          <div style="padding: 10px 0; font-size: 22px">{{ $tt('商品规格统计') }}</div>
          <el-table :data="state.dataListGroupBy" border max-height="400px">
            <el-table-column prop="productSpec" :label="$tt('商品规格')" sortable></el-table-column>
            <el-table-column prop="quantityOrder" :label="$tt('合计数量')" sortable>
              <template #default="{ row, column }">
                {{ common.formatNumber(row.quantityOrder, '#.##') }}
              </template>
            </el-table-column>
            <el-table-column prop="bigQty" :label="$tt('合计件数')" sortable>
              <template #default="{ row, column }">
                {{ common.formatNumber(row.bigQty, '#.##') }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>

    <!--生成配送单页面-->
    <create-order-dialog ref="setting-dialog" v-model:dataListSelections="state.dataListSelections" v-model:ids="state.ids" v-model:visible="state.createDistConfig.isShowDialog" @on-closed="onClose"></create-order-dialog>
  </div>
</template>

<script setup lang="ts" name="outbound-operation-create-order-batch">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import baseHook from '/@/components/hooks/baseHook';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
const CreateOrderDialog = defineAsyncComponent(() => import('./components/createOrderDialog.vue'));

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const config = ref({
  // 生成波次合计商品明细
  batch_total_CommodityDetails: true,
});
const base = baseHook({ config });
const { baseState, dataListRef, editorRefName, editorInfo, dataListRefName } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  createDistConfig: {
    // 生成配送派车单对话框
    isShowDialog: false,
    title: '生成配送派车单',
  } as any,
  ids: 0,
  dataListGroupBy: [] as any[], // 商品规格统计
  // 配置参数
  config: config.value,
  dataList: [] as any[],
});
//#endregion

//#region watch
watch(
  () => state.dataListSelections,
  (val: any[]) => {
    // 勾选后计算摘要合计
    getOrderProductSpec([]);
  }
);
//#endregion

const onTranslate = (rows: any) => {
  getOrderProductSpec(rows);
};
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    case 'createBatchBill':
      createBatchBill();
      return true;
  }
};
// 生成波次
const createBatchBill = () => {
  let selectInfos: Array<any> = state.dataListSelections;
  if (!selectInfos.length) {
    proxy.$message.error('至少选择一条数据');
    return;
  }
  state.ids = base.masterData.value.orderId;

  state.createDistConfig.isShowDialog = true;
};

// 关闭窗口刷新列表
const onClose = () => {
  base.dataListRef.value.reload();
};

// 加载订单商品规格统计数据
const getOrderProductSpec = async (rows: any) => {
  if (state.config.batch_total_CommodityDetails) {
    var ids = [];

    if (state.dataListSelections.length) {
      ids = state.dataListSelections.map((item: any) => item.orderId);
    } else {
      ids = rows.map((item: any) => item.orderId);
    }

    const url = '/outbound/operation/orderWave/getOrderProductSpec';
    const params = {
      ids: ids.join(','),
    };

    const [err, res] = await to(postData(url, params, false));
    if (err) {
      return;
    }
    if (res) {
      state.dataListGroupBy = res.data;
    } else {
      state.dataListGroupBy = [];
    }
  }
};

// 展开事件
const onExpandChange = async (row: any, expandedRows: any) => {
  // 关闭时不加载数据
  if (!expandedRows.length) return;

  row.listDataOptions = {
    pageIndex: 1,
    pageSize: 15,
  };
  loadDetailData(row);
};

// 分页大小改变
const handleSizeChange = async (row: any, value: number) => {
  row.listDataOptions.pageIndex = value;

  await loadDetailData(row);
};

//加载展开明细数据
const loadDetailData = async (row: any) => {
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
      return item;
    });
  }
};
</script>
