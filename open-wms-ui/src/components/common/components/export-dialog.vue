<template>
  <div class="export-dialog-container">
    <el-dialog v-model="currentDialogVisible" :top="common.getDialogTop()" title="批量导出操作" class="dialog-container" append-to-body width="800px" draggable @open="onOpen">
      <el-alert :closable="false" title="点击左侧导出模板导出进行导出数据" type="success" class="alert-msg"></el-alert>
      <el-row ref="uploadRef" :gutter="20">
        <el-col :span="10">
          <ul>
            <li v-for="(item, index) in state.vueDataList" :key="index" :class="{ active: state.currentTemplate === item }" class="template-item" @click="selectTemplate(item)">
              {{ item.label }}
            </li>
          </ul>
          <slot name="export-module-list"></slot>
        </el-col>
        <el-col :span="14">
          <el-scrollbar :noresize="false" :native="false" wrap-class="scrollbar-wrap">
            <el-tag v-for="(vueInfo, index) in state.currentTemplate.vueData" :key="index" class="margin-top-10 margin-right-10">
              {{ vueInfo.cnName }}
              <span v-if="vueInfo.aliasName" class="sub-title">别名：{{ vueInfo.aliasName }}</span>
              <span v-if="vueInfo.colExpression" class="sub-title">表达式：{{ vueInfo.colExpression }}</span>
            </el-tag>
          </el-scrollbar>
        </el-col>
      </el-row>
      <template #tempExport>
        <slot :name="'blank-tempExport'"></slot>
      </template>
      <div class="margin-10" v-html="state.importMsg"></div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="currentDialogVisible = false">取 消</el-button>
          <el-button :loading="state.isLoading" type="primary" @click="startExport">
            <template #icon>
              <svg-icon name="icon-daochu1"></svg-icon>
            </template>
            开始导出
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="import-dialog">
import { ComponentInternalInstance, ref } from 'vue';
import { BaseProperties, DataOptions } from '/@/types/base-type';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import { globalHeaders } from '/@/utils/request';
import { QueryBo, QueryType, DataType, OrderItem, OrderByType } from '/@/types/common';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
// 事件定义
const emit = defineEmits(['on-close', 'update:visible']);
const headers = ref(globalHeaders());

//#region 定义属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  // 导出方法
  exportData: {
    type: Function,
    default: () => {
      return () => {};
    },
  },
  exportOptions: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

//#region 定义变量
const state = reactive({
  // 当前选中菜单下的导出模板列表
  vueDataList: [] as any[],
  // 当前选中模板
  currentTemplate: {
    vueDataId: 0,
    vueData: {} as any,
  },
  isLoading: false,
  isInit: false,
  // 导出消息
  importMsg: null,
});
//#endregion

//#region 计算属性
// 显示窗口
const currentDialogVisible = computed({
  get: function () {
    return props.visible;
  },
  set: function (val) {
    emit('update:visible', val);
  },
});
//#endregion

onMounted(async () => {});

// 弹出对话框时
const onOpen = async () => {
  await getTemplateList();
};

// 获得模板
const getTemplateList = async () => {
  if (state.isInit) return;
  state.isInit = true;
  if (!props.exportOptions.exportId) return;

  let url = '/system/dataHandler/export/selectExportColumnList';
  // 查询条件
  let params = {
    exportId: props.exportOptions.exportId,
  };

  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }

  if (res.result) {
    // 初始化标准模板
    let vueData = res.data.map((item: any, index: number) => {
      return {
        cnName: item.cnName,
        colExpression: item.colExpression,
        aliasName: item.aliasName,
        key: index,
      };
    });

    state.vueDataList = [
      {
        vueDataId: 0, // 0表示为主模板
        exportId: 0,
        label: '系统标准模板',
        vueData: vueData,
      },
    ];
    state.currentTemplate = state.vueDataList[0];
  }

  // 加载vueData列表
  loadVueDtaList();
};

// 加载VueData列表
const loadVueDtaList = async () => {
  state.isLoading = true;
  // 查询条件
  let queryBoList: Array<QueryBo> = [
    {
      column: 'exportId',
      values: props.exportOptions.exportId,
      queryType: QueryType.EQ,
      dataType: DataType.LONG,
    },
    {
      column: 'orderNum',
      values: 'orderNum',
      queryType: QueryType.ORDERBYDESC, // 字段排序
      dataType: DataType.STRING,
    },
  ];

  let url = '/system/dataHandler/exportVueData/selectList';
  let params = queryBoList;

  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }

  proxy.common.showMsg(res);
  if (res.result) {
    res.data.forEach((item: any) => {
      let vueDataItem = JSON.parse(item.vueData);
      vueDataItem.vueDataId = item.vueDataId;
      state.vueDataList.push(vueDataItem);
    });
  }
  state.isLoading = false;
};

// 开始导出
const startExport = () => {
  state.isLoading = true;
  let exportId = props.exportOptions.exportId;
  let detailInfo = props.exportOptions.detailInfo;
  let vueDataId = state.currentTemplate.vueDataId;
  props.exportData(exportId, vueDataId, detailInfo);
  state.isLoading = false;
};

// 选中模板
const selectTemplate = (item: any) => {
  state.currentTemplate = item;
};

// 对外暴露属性和方法
defineExpose({
  /**
   * 弹出对话框时,获得模板
   */
  getTemplateList: getTemplateList,
});
</script>

<style lang="scss">
.dialog-container {
  :deep(.el-upload-list) {
    margin-right: 20px;
  }
  .scrollbar-wrap {
    max-height: 400px;
    overflow-x: hidden;
    padding: 0px;
    .el-scrollbar__view .el-tag:last-child {
      margin-bottom: 30px;
    }
  }
  .template-item {
    margin: 10px 0 0 10px;
    padding: 10px;
    background-color: rgb(247, 250, 252);
    border: 1px solid #c8e3ff;
    border-radius: 5px;
    cursor: pointer;
    &.active {
      background-color: #409eff;
      color: #fff;
    }
  }
  .sub-title {
    color: #999;
    margin-left: 10px;
  }
}
</style>
