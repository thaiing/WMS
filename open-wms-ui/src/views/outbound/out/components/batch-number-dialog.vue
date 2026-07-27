<template>
  <div>
    <el-dialog draggable v-model="currentVisible" title="选择批次号" width="42%" class="dialog-container">
      <el-table :data="state.tableData" @selection-change="handleSelectionChange" size="small" style="width: 100%" height="450">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="batchNumber" label="批次号" width="180"></el-table-column>
        <el-table-column prop="storageName" label="仓库名称" width="70"></el-table-column>
        <el-table-column prop="positionName" label="货位名称" width="120"></el-table-column>
        <el-table-column prop="productCode" label="商品编号" width="120"></el-table-column>
        <el-table-column prop="productName" label="商品名称" width="120"></el-table-column>
        <el-table-column prop="validStorage" label="有效库存" width="70"></el-table-column>
      </el-table>
      <template class="right" #footer>
        <span>
          <el-button @click="currentVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="create-order-dialog">
import { ComponentInternalInstance } from 'vue';

import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
import { getPageList, postData } from '/@/api/common/baseApi';
import { DataType, PageListBo, QueryBo, QueryType } from '/@/types/common';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const emit = defineEmits(['update:visible', 'on-closed']);
//#region 定义属性
const props = defineProps({
  // 是否显示
  visible: {
    type: Boolean,
    default: false,
  },
  // 加载参数
  loadOptions: {
    type: Object,
    required: true,
    default: () => {
      return {
        projectName: '',
        tableView: '',
        idField: '',
        orderBy: '',
        where: '',
        pageIndex: 1,
        pageSize: 100,
      };
    },
  },
  // 当前行数据
  row: {
    type: Object,
    required: true,
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  tableData: [] as any[],
  deliveryDate: new Date(),
  dataList: null,
  multipleSelection: [] as any[],
});

//#endregion

//#region onMounted

onMounted(() => {});
//#endregion

// 是否显示dialog
const currentVisible = computed({
  get() {
    return props.visible;
  },
  set(newValue) {
    emit('update:visible', newValue); // 双向绑定prop.action，通知父级组件变量值同步更新
  },
});

const handleSelectionChange = (val: any[]) => {
  debugger;
  state.multipleSelection = val;
};

// 批量出库
const save = async () => {
  if (state.multipleSelection.length == 0) {
    proxy.$message.error('至少选择一条数据！');
    return;
  }
  var batchNumber = state.multipleSelection.map((item) => item.batchNumber).join(',');

  let snList = [];
  snList = state.multipleSelection.map((item) => item.batchNumber) ? batchNumber.replace(/,/gi, '\n').replace(/\\r/gi, '').split('\n') : [];
  let validSnList = snList.filter((item: any) => item); // 有效SN
  // 判断是否重复
  const groupList = validSnList
    .map((item: any) => {
      return { sn: item, count: 1 };
    })
    .reduce((all: any, next: any) => {
      const existItem = all.find((item: any) => item.sn === next.sn);
      if (existItem) {
        // 存在+1
        existItem.count++;
        return all;
      } else {
        // 不存在，合并
        next.count = 1;
        return [...all, next];
      }
    }, []);
  // 判断是否存在重复的数据
  const repeatList = groupList.filter((item: any) => item.count > 1);
  const codes = repeatList.map((item: any) => item.sn).join(',');
  if (codes) {
    proxy.$message.error(codes + '重复，已去掉重复项');
    validSnList = groupList.map((item: any) => item.sn); // 已去掉重复项
  }
  validSnList = validSnList.map((item: any) => item.trim());
  debugger;

  currentVisible.value = false;
  props.row.batchNumber = validSnList.join(',');
  props.row.__ischange__ = true;
  proxy.$emit('on-closed'); // 关闭窗口事件
};

const loadData = async (row: any, storageId: any) => {
  debugger;
  state.dataList = row;

  let where: Array<QueryBo> = [];
  where.push({
    column: 'sourceType',
    values: '拣货下架',
    queryType: QueryType.NE,
    dataType: DataType.STRING,
  });
  where.push({
    column: 'productStorage',
    values: 0,
    queryType: QueryType.GT,
    dataType: DataType.INT,
  });
  where.push({
    column: 'validStorage',
    values: 0,
    queryType: QueryType.GT,
    dataType: DataType.INT,
  });
  where.push({
    column: 'positionType',
    values: '1,13,12,16,8,2',
    queryType: QueryType.IN,
    dataType: DataType.STRING,
  });
  if (row.productCode) {
    where.push({
      column: 'productCode',
      values: row.productCode,
      queryType: QueryType.EQ,
      dataType: DataType.STRING,
    });
  }
  if (storageId) {
    where.push({
      column: 'storageId',
      values: storageId,
      queryType: QueryType.EQ,
      dataType: DataType.STRING,
    });
  }
  if (row.positionName) {
    where.push({
      column: 'positionName',
      values: row.positionName,
      queryType: QueryType.EQ,
      dataType: DataType.STRING,
    });
  }

  let pageParams: PageListBo = {
    menuId: props.loadOptions.menuId,
    prefixRouter: props.loadOptions.prefixRouter, // 列表方法名
    tableName: props.loadOptions.tableName,
    pageIndex: 1,
    pageSize: 100,
    orderByColumn: '',
    isAsc: 'DESC',
    queryBoList: where,
    listMethod: 'selectInventoryComposeList',
    sumColumnNames: [],
  };

  let resResult = await to(getPageList(pageParams));
  let [err, res] = resResult;
  if (err) {
    return;
  }
  if (res?.result) {
    res.rows.map((item: any) => {
      item.productStorage = Number(item.productStorage).toFixed(2);
      item.validStorage = Number(item.validStorage).toFixed(2);
      item.purchasePrice = Number(item.purchasePrice).toFixed(2);
      return item;
    });
    state.tableData = res.rows;
  }
};

// 对外暴露属性和方法
defineExpose({
  loadData,
});
</script>
