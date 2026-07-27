<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :quick-search-fields="state.quickSearchFields" :open-expand="true" @on-expand-change="onExpandChange">
      <template #expand-slot="{ row, col }">
        <el-table :data="row.orderDataList" border style="margin-left: 50px; font-size: 12px; width: 1000px" row-key="order_Id">
          <el-table-column :index="(index:any) => (row.listDataOptions.pageIndex - 1) * row.listDataOptions.pageSize + index + 1" type="index" fixed="left" class="col-index" label="#" width="30" />
          <el-table-column prop="productCode" :label="$tt('商品编号')" width="120"> </el-table-column>
          <el-table-column prop="productName" :label="$tt('商品名称')"> </el-table-column>
          <el-table-column prop="packageQuantity" :label="$tt('打包数量')" width="80"> </el-table-column>
          <el-table-column prop="bigQty" :label="$tt('大单位数量')" width="80"> </el-table-column>
          <el-table-column prop="rowPackage" :label="$tt('小计包裹数')" width="80"> </el-table-column>
          <el-table-column prop="rowWeight" :label="$tt('小计重量')" width="80"> </el-table-column>
          <el-table-column prop="rowCube" :label="$tt('小计体积')" width="80"> </el-table-column>
          <el-table-column prop="productSpec" :label="$tt('商品规格')" width="80"> </el-table-column>
          <el-table-column prop="brandName" :label="$tt('品牌')" width="80"> </el-table-column>
        </el-table>
        <div>
          <el-pagination background v-model:current-page="row.listDataOptions.pageIndex" v-if="row.listDataOptions.total > 15" v-model:page-size="row.listDataOptions.pageSize" layout="prev, pager, next" :total="row.listDataOptions.total || 0" @current-change="(value:any) => handleSizeChange(row, value)"></el-pagination>
        </div>
      </template>
    </yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" :use-detail-slot="['images', 'singleSignCode']" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter">
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

<script setup lang="ts" name="outbound-out-package">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import baseHook from '/@/components/hooks/baseHook';
import { DataType, QueryBo, QueryType } from '/@/types/common';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
const SnEditorDialog = defineAsyncComponent(() => import('/@/components/common/sn-editor-dialog.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
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
    // 生成一次性费用
    case 'createBill':
      createBill();
      return true;
  }
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
  const url = '/outbound/out/packageDetail/pageList';
  const params = {
    isAsc: 'desc',
    menuId: 1696,
    orderByColumn: 'packageDetailId',
    pageIndex: row.listDataOptions.pageIndex,
    pageSize: row.listDataOptions.pageSize,
    prefixRouter: '/outbound/out/packageDetail',
    queryBoList: [
      {
        column: 'packageId',
        dataType: 'LONG',
        label: '打包单Id',
        queryType: 'EQ',
        values: row.packageId,
      },
    ],
    tableName: 'out_package_detail',
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
      item.packageQuantity = Number(item.packageQuantity);
      item.bigQty = Number(item.bigQty);
      item.rowPackage = Number(item.rowPackage);
      item.rowCube = Number(item.rowCube);
      item.rowWeight = Number(item.rowWeight);
      return item;
    });
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
        if (['打包完成', '发运完成'].indexOf(item.packageStatus) == -1) {
          flag = true;
        }
      }
      if (flag) {
        proxy.$message.error('只有 "打包完成" 或 "发运完成" 的单据才可以执行生成一次性费用操作！');
        return;
      }

      let ids = selectInfos.map((item) => item.packageId);
      const url = '/outbound/out/package/createBill';
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
</script>
