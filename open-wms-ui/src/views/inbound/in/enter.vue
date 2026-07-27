<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :quick-search-fields="state.quickSearchFields" :open-expand="true" @on-expand-change="onExpandChange">
      <template #expand-slot="{ row, col }">
        <el-table :data="row.orderDataList" border style="margin-left: 50px; font-size: 12px; width: 1000px" row-key="order_Id">
          <el-table-column :index="(index:number) => (row.listDataOptions.pageIndex - 1) * row.listDataOptions.pageSize + index + 1" type="index" fixed="left" class="col-index" label="#" width="30" />
          <el-table-column prop="productCode" :label="$tt('商品编号')" width="120"> </el-table-column>
          <el-table-column prop="productName" :label="$tt('商品名称')"> </el-table-column>
          <el-table-column prop="enterQuantity" :label="$tt('入库数量')" width="80"> </el-table-column>
          <el-table-column prop="shelvedQuantity" :label="$tt('上架数量')" width="80"> </el-table-column>
          <el-table-column prop="bigQty" :label="$tt('大单位数量')" width="80"> </el-table-column>
          <el-table-column prop="rowWeight" :label="$tt('小计毛重')" width="80"> </el-table-column>
          <el-table-column prop="productSpec" :label="$tt('商品规格')" width="80"> </el-table-column>
          <el-table-column prop="positionName" :label="$tt('收货位')" width="80"> </el-table-column>
          <el-table-column prop="detailStatus" :label="$tt('明细状态')" width="80"></el-table-column>
        </el-table>
        <el-pagination background v-model:current-page="row.listDataOptions.pageIndex" v-if="row.listDataOptions.total > 15" v-model:page-size="row.listDataOptions.pageSize" layout="prev, pager, next" :total="row.listDataOptions.total || 0" @current-change="(value:any) => handleSizeChange(row, value)"></el-pagination>
      </template>

      <!--自定义字段插槽-->
      <template #common-column-slot="{ row, col }">
        <template v-if="col.prop == 'enterStatus'">
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
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :use-detail-slot="['images', 'singleSignCode']" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" :btn-read-only="state.btnReadOnly">
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
    </yrt-editor>

    <!-- SN编辑器 -->
    <sn-editor-dialog v-model:visible="state.snEditorVisible" readonly :row="state.detailRow" @on-sn-change="onSnChange"> </sn-editor-dialog>
  </div>
</template>

<script setup lang="ts" name="inbound-in-enter">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const SnEditorDialog = defineAsyncComponent(() => import('/@/components/common/sn-editor-dialog.vue'));

// import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import { DataType, QueryBo, QueryType } from '/@/types/common';

const stateFlow = defineAsyncComponent(() => import('/@/components/common/components/stateflow.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
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
    prefixRouter: '/inbound/in/enterStatusHistory',
    tableName: 'in_enter_status_history',
    idField: 'history_id',
    orderBy: '{"history_id":"DESC"}',
    pageIndex: 1,
    pageSize: 100,
  },
  ...toRefs(baseState),

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

onMounted(() => {});

base.buttonClick = (authNode: string) => {
  switch (authNode) {
    case 'cancelEnter':
      cancelEnter();
      return true;
    // 生成一次性费用
    case 'createBill':
      createBill();
      return true;
    // 导出
    case 'inExport':
      inExport();
      return true;
  }
};

const inExport = () => {
  if (state.dataListSelections.length !== 1) {
    proxy.$message.error('请选择一条数据！');
    return;
  }
  var sss = JSON.stringify({ enter_id: state.dataListSelections[0].enterId });
  var url = `http://120.27.134.172:8080/baskserver/baskreport/view?file=6507&parameters=${encodeURIComponent(sss)}`;

  window.open(url);
};

// 取消入库
const cancelEnter = async () => {
  if (state.dataListSelections.length !== 1) {
    proxy.$message.error('请选择一条数据！');
    return;
  }

  proxy
    .$confirm('确定将选中的数据撤销入库吗？', '撤销入库', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      // 选中行id
      var selectInfos: Array<any> = state.dataListSelections;
      let flag = false;
      for (const item of selectInfos) {
        if (['确认入库', '完全上架'].indexOf(item.enterStatus) == -1) {
          flag = true;
        }
      }
      if (flag) {
        proxy.$message.error('只有 "确认入库" 或 "完全上架" 的单据才可以执行取消操作！');
        return;
      }

      let ids = selectInfos.map((item) => item.enterId);
      const url = '/inbound/in/enter/cancelEnter';
      const params = {
        ids: ids.join(','),
      };
      const [err, res] = await to(postData(url, params));
      if (err) return;

      proxy.common.showMsg(res);
      if (res.result) {
        base.dataListRef.value.loadData(); // 刷新页面
      }
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};

// 生成一次性费用
const createBill = async () => {
  if (state.dataListSelections.length !== 1) {
    proxy.$message.error('请选择一条数据！');
    return;
  }

  proxy
    .$confirm('确定要生成一次性费用吗？', '生成一次性费用', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      // 选中行id
      var selectInfos: Array<any> = state.dataListSelections;
      let flag = false;
      for (const item of selectInfos) {
        if (['确认入库', '完全上架'].indexOf(item.enterStatus) == -1) {
          flag = true;
        }
      }
      if (flag) {
        proxy.$message.error('只有 "确认入库" 或 "完全上架" 的单据才可以执行生成一次性费用操作！');
        return;
      }

      let ids = selectInfos.map((item) => item.enterId);
      const url = '/inbound/in/enter/createBill';
      const params = {
        ids: ids,
      };
      const [err, res] = await to(postData(url, params));
      if (err) return;

      proxy.common.showMsg(res);
      if (res.result) {
        base.dataListRef.value.loadData(); // 刷新页面
      }
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};

// 展开事件
const onExpandChange = async (row: any, expandedRows: any) => {
  row.listDataOptions = {
    pageIndex: 1,
    pageSize: 15,
  };
  LoadData(row);
};

base.onEditLoadAfter = (master: any) => {
  state.btnReadOnly.printCaseNum = false;
  state.btnReadOnly.repeatingSorting = false;
};

//加载展开时间明细列
const LoadData = async (row: any) => {
  const url = '/inbound/in/enterDetail/pageList';
  const params = {
    isAsc: 'desc',
    menuId: 1650,
    orderByColumn: 'enterDetailId',
    pageIndex: row.listDataOptions.pageIndex,
    pageSize: row.listDataOptions.pageSize,
    prefixRouter: '/inbound/in/enterDetail',
    queryBoList: [
      {
        column: 'enterId',
        dataType: 'LONG',
        label: '预到货单号',
        queryType: 'EQ',
        values: row.enterId,
      },
    ],
    tableName: 'in_enter_detail',
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

// 明细按钮事件
base.detailButtonClick = (authNode: string, detail: any, btnOpts: any) => {
  switch (authNode) {
    case 'printCaseNum':
      printCaseNum(detail.options.detailSelections);
      return true;
    case 'repeatingSorting':
      repeatingSorting(detail.options.detailSelections);
      return true;
  }
};

// 分页大小改变
const handleSizeChange = (row: any, value: number) => {
  row.listDataOptions.pageIndex = value;

  LoadData(row);
};

const printCaseNum = (rows: any) => {
  if (!rows.length) {
    proxy.$message.error('至少选择一项进行打印');
  }
  let productIds = rows.map((m: any) => m.productId).join(',');
  let data = rows.map((m: any) => {
    m.quantity = m.enterQuantity;
    return m;
  });

  let key = proxy.common.getGUID();
  sessionStorage.setItem('static_' + key, JSON.stringify(data));
  var url = `/system/print/base-template-id/12001/0/${productIds}?key=${key}&autoPrint=false`;
  window.open(url);
};
const repeatingSorting = async (rows: any) => {
  if (!rows.length) {
    proxy.$message.error('至少选择一条明细进行分拣');
    return;
  }
  if (!window.confirm('是否进行重复分拣, 是否继续?')) return;
  const url = '/inbound/in/enter/repeatingSorting';
  const params = {
    ids: rows.map((item: any) => item.enterDetailId).join(','),
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  proxy.common.showMsg(res);
  if (res.result) {
    base.dataListRef.value.loadData(); // 刷新页面
    base.editorRef.value.cancel();
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
</script>
