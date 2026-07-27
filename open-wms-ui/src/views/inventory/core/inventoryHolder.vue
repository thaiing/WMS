<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" :fixed-where="state.fixedWhere" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes">
      <template #common-column-slot="{ row, col }">
        <template v-if="col.prop === 'singleSignCode'">
          <span class="sn-text">{{ row.singleSignCode }}</span>
          <span v-if="row.singleSignCode" class="sn-count">[SN数：{{ row.singleSignCode ? row.singleSignCode.split(',').length : 0 }}]</span>
          <el-link v-if="row.singleSignCode || row.isSn" type="primary" @click="viewSn(row)">查看</el-link>
        </template>
      </template>

      <template #button-tool2-slot>
        <el-checkbox v-model="state.showAll" @change="onShowAll" label="显示全部" />
      </template>
    </yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>

    <!--查看SN列表-->
    <sn-dialog v-model:visible="state.snVisible" :sn-data-list="state.snDataList"></sn-dialog>
  </div>
</template>

<script setup lang="ts" name="inventory-core-inventoryHolder">
import { ComponentInternalInstance, nextTick } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
import baseHook from '/@/components/hooks/baseHook';
import { QueryType, DataType, QueryBo } from '/@/types/common';
import to from 'await-to-js';
import { deleteData, postData } from '/@/api/common/baseApi';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
const SnDialog = defineAsyncComponent(() => import('/@/components/common/sn-dialog.vue'));

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
  fixedWhere: {
    holderStorage: {
      queryType: QueryType.GT,
      value: 0,
    },
  },
  //显示全部
  showAll: false,
  ...toRefs(baseState),
  // 显示SN列表对话框
  snVisible: false,
  // sn数据列表
  snDataList: [] as any[],
});
//#endregion

onMounted(() => {});

// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    case 'delete':
      deleteHolder();
      return true;
  }
};
const onShowAll = () => {
  if (!state.showAll) {
    state.fixedWhere = {
      holderStorage: {
        queryType: QueryType.GT,
        value: 0,
      },
    };
  } else {
    state.fixedWhere = {} as any;
  }
  nextTick(() => {
    base.dataListRef.value.loadData();
  });
};

//删除
const deleteHolder = async () => {
  const ids = state.dataListSelections.map((m) => {
    return m['holderId'];
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
      const url = `/composite/coreInventory/releaseHolder/${ids.join(',')}`;
      const params = {
        idList: ids.join(','),
      };
      const [err, res] = await to(deleteData(url, params));
      if (err) {
        proxy.$message.error(err.message);
        return;
      }
      if (res.result) {
        proxy.common.showMsg(res);
        base.dataListRef.value.loadData();
      }
    })
    .catch(() => {
      proxy.$message.error('已取消审核');
    });
};

// 查看SN列表
const viewSn = async (row: any) => {
  let singleSignCode = row.singleSignCode;
  let snList = singleSignCode ? singleSignCode.replace(/,/gi, '\n').replace(/\\r/gi, '').split('\n') : [];
  snList = state.snDataList.filter((item: string) => item); // 清除空值

  state.snDataList = [];
  state.snVisible = true;

  let queryBoList: Array<QueryBo> = []; // 查询条件
  queryBoList.push({
    column: 'storageId',
    values: row.storageId,
    queryType: QueryType.EQ,
    dataType: DataType.LONG,
  });
  queryBoList.push({
    column: 'snNo',
    values: singleSignCode,
    queryType: QueryType.IN,
    dataType: DataType.STRING,
  });
  const url = '/inventory/core/inventorySn/selectList';
  const [err, res] = await to(postData(url, queryBoList));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res?.result) {
    state.snDataList = res.data.map((item: any) => {
      item.enable = item.enable === 1 ? '是' : '否';
      item.createDate = proxy.common.formatDate(item.createDate, 'YYYY-MM-DD HH:mm:ss');
      if (item.outDate) {
        item.outDate = proxy.common.formatDate(item.outDate, 'YYYY-MM-DD HH:mm:ss');
      }
      return item;
    });
    state.snDataList.sort((a, b) => {
      return a.enable > b.enable ? -1 : 1;
    });
  }
};
</script>
