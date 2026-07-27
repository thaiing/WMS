<template>
  <el-popover placement="right-start" title="状态轨迹" width="700" trigger="click" class="state-flow" @show="loadData">
    <template v-slot:reference>
      <div style="cursor: pointer">
        <slot name="content"></slot>
      </div>
    </template>
    <el-table :data="state.tableData" :max-height="200" size="small" style="width: 100%">
      <el-table-column prop="operationType" label="动作"></el-table-column>
      <el-table-column prop="fromStatus" label="变更前状态" width="100"></el-table-column>
      <el-table-column prop="toStatus" label="变更后状态" width="100"></el-table-column>
      <el-table-column prop="remark" label="备注" width="120"></el-table-column>
      <el-table-column prop="createByName" label="操作人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="140">
        <template v-slot="{ row, column, $index }">
          {{ common.formatDate(row.createTime, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
  </el-popover>
</template>

<script setup lang="ts" name="state-flow">
import { ComponentInternalInstance } from 'vue';

import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
import { getPageList, postData } from '/@/api/common/baseApi';
import { DataType, PageListBo, QueryBo, QueryType } from '/@/types/common';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const props = defineProps({
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
        where: {},
        pageIndex: 1,
        pageSize: 100,
        listMethod: '',
        prefixRouter: '',
      };
    },
  },
  // 查询条件
  where: {
    type: Object,
    required: true,
  },
});
const state = reactive({
  tableData: [],
});

// 加载数据
const loadData = async () => {
  let queryBoList: Array<QueryBo> = [];
  Object.keys(props.where).forEach((key) => {
    queryBoList.push({
      column: key,
      values: props.where[key],
      queryType: QueryType.EQ,
      dataType: DataType.INT,
    });
  });
  let pageParams: PageListBo = {
    menuId: props.loadOptions.menuId,
    prefixRouter: props.loadOptions.prefixRouter, // 列表方法名
    tableName: props.loadOptions.tableName,
    pageIndex: 1,
    pageSize: 100,
    orderByColumn: props.loadOptions.idField || '',
    isAsc: 'DESC',
    queryBoList: queryBoList,
  };

  let resResult = await to(getPageList(pageParams));
  let [err, res] = resResult;
  if (err) {
    return;
  }
  proxy.common.showMsg(resResult);
  if (res?.result) {
    state.tableData = res.rows;
  }
};
</script>

<style lang="scss">
.state-flow {
  cursor: pointer;
}
</style>
