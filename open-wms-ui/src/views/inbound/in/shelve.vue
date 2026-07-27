<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :quick-search-fields="state.quickSearchFields"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :use-detail-slot="['images', 'singleSignCode']" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter">
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

<script setup lang="ts" name="inbound-in-shelve">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import baseHook from '/@/components/hooks/baseHook';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import { ElMessageBox } from 'element-plus';
import { DataType, QueryBo, QueryType } from '/@/types/common';
const SnEditorDialog = defineAsyncComponent(() => import('/@/components/common/sn-editor-dialog.vue'));

import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  shelverVisible: false,
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

// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    case 'forceShelve':
      forceShelve();
      return true;
    case 'cancelShelve':
      cancelShelve();
      return true;
    case 'cancelNickName':
      cancelNickName();
      return true;
  }
};

const forceShelve = async () => {
  // state.dataListSelections
  const url = '/inbound/in/shelve/forceShelve';
  let selectInfos: Array<any> = state.dataListSelections;
  if (!selectInfos.length) {
    proxy.$message.error('至少选择一项进行“强制上架”');
    return;
  }
  let flag = false;
  for (const item of selectInfos) {
    if (['上架中', '部分上架', '待上架'].indexOf(item.shelveStatus) == -1) {
      flag = true;
    }
  }
  if (flag) {
    proxy.$message.error('只有“上架中”，“部分上架”，“待上架”,才可以强制上架');
    return;
  }
  let ids = selectInfos.map((item) => item.shelveId);

  ElMessageBox.confirm('确定操作当前选中的单据吗', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const params = {
        ids: ids.join(','),
      };
      const [err, res] = await to(postData(url, params));
      if (err) {
        proxy.$message.error(err.message);
        return;
      }
      if (res.result) {
        base.dataListRef.value.loadData();
        proxy.common.showMsg(res);
      }
    })
    .catch(() => {});
};

// 取消上架
const cancelShelve = async () => {
  proxy
    .$confirm('确定要执行取消上架操作?', '取消上架', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const url = '/inbound/in/shelve/cancelShelve';
      let selectInfos: Array<any> = state.dataListSelections;
      if (!selectInfos.length) {
        proxy.$message.error('请至少选择一行上架数据！');
        return;
      }
      if (selectInfos.find((item) => item.onShelveStatus == '待上架')) {
        proxy.$message.error('只有上架的单据才可以执行取消操作！！');
        return;
      }
      let ids = selectInfos.map((item) => item.shelveId);
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
        base.dataListRef.value.loadData(); // 刷新页面
      }
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};

const cancelNickName = async () => {
  // state.dataListSelections
  const url = '/inbound/in/shelve/cancelNickName';
  let selectInfos: Array<any> = state.dataListSelections;
  if (!selectInfos.length) {
    proxy.$message.error('至少选择一项！');
    return;
  }
  let ids = selectInfos.map((item) => item.shelveId);
  const params = {
    ids: ids.join(','),
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res.result) {
    base.dataListRef.value.loadData();
    proxy.common.showMsg(res);
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
