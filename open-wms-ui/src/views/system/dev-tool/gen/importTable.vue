<template>
  <div class="import-table">
    <!-- 导入表 -->
    <el-dialog v-model="visible" draggable overflow title="导入表" width="1200px" top="5vh" append-to-body
      :lock-scroll="false" class="import-table">
      <el-form :model="queryParams" ref="queryFormRef" :inline="true">
        <el-form-item label="数据源" prop="dataName">
          <el-select v-model="queryParams.dataName" filterable placeholder="请选择/输入数据源名称" style="width: 200px">
            <el-option v-for="item in dataNameList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表名称" prop="tableName">
          <el-input v-model="queryParams.tableName" placeholder="请输入表名称" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="表描述" prop="tableComment">
          <el-input v-model="queryParams.tableComment" placeholder="请输入表描述" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-table @row-click="clickRow" ref="tableRef" :data="dbTableList" @selection-change="handleSelectionChange"
          height="360px">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="tableName" label="表名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="tableComment" label="表描述" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageIndex"
          v-model:limit="queryParams.pageSize" @pagination="getList" />
      </el-row>
      <el-divider />
      <el-form ref="form" :model="state.formField" inline label-width="100px" class="mt-20">
        <el-form-item label="项目名称" required class="w-300">
          <el-select v-model="state.formField.packageName" placeholder="请选择项目名称" class="w-100pc">
            <el-option label="com.yiruantong.basic" value="com.yiruantong.basic"></el-option>
            <el-option label="com.yiruantong.outbound" value="com.yiruantong.outbound"></el-option>
            <el-option label="com.yiruantong.inbound" value="com.yiruantong.inbound"></el-option>
            <el-option label="com.yiruantong.inventory" value="com.yiruantong.inventory"></el-option>
            <el-option label="com.yiruantong.system" value="com.yiruantong.system"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件夹" required>
          <el-input v-model="state.formField.folderName"></el-input>
        </el-form-item>
        <el-form-item label="父级ID" required>
          <el-input v-model.number="state.formField.parentId" type="number"></el-input>
        </el-form-item>
      </el-form>
      <el-divider style="margin: 0 0 10px" />
      <template #footer>
        <div class="flex-end">
          <el-button type="primary" v-loading.fullscreen.lock="state.isLoading" @click="createField">确 定</el-button>
          <el-button @click="visible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { listDbTable, importTable, getDataNames } from '/@/api/tool/gen';
import { DbTableQuery, DbTableVO } from '/@/api/tool/gen/types';
import { ComponentInternalInstance } from 'vue';
import { ElTable, ElForm } from 'element-plus';
import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';

const total = ref(0);
const visible = ref(false);
const tables = ref<Array<string>>([]);
const dbTableList = ref<Array<DbTableVO>>([]);
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const tableRef = ref(ElTable);
const queryFormRef = ref(ElForm);

const queryParams = reactive<DbTableQuery>({
  pageIndex: 1,
  pageSize: 10,
  dataName: '',
  tableName: '',
  tableComment: '',
});
const dataNameList = ref<Array<string>>([]);

//#region 定义属性
const props = defineProps({
  onImportSaveAfter: {
    type: Function,
    default: null,
  },
});
//#endregion

const state = reactive({
  selectionRows: [] as DbTableVO[],
  formField: {
    packageName: '',
    folderName: null,
    parentId: null,
  },
  // 正在提取
  isLoading: false,
});

const emit = defineEmits(['ok']);

/** 查询参数列表 */
const show = (tableInfo: any) => {
  getDataNameList();
  queryParams.dataName = tableInfo.dataName || 'master'; // 数据源
  state.formField.packageName = tableInfo.packageName;
  state.formField.folderName = tableInfo.moduleName;
  state.formField.parentId = tableInfo.parentId;

  getList();
  visible.value = true;
};
/** 单击选择行 */
const clickRow = (row: DbTableVO) => {
  tableRef.value.toggleRowSelection(row);
};
/** 多选框选中数据 */
const handleSelectionChange = (selection: DbTableVO[]) => {
  state.selectionRows = selection;
  tables.value = selection.map((item) => item.tableName);
};
/** 查询表数据 */
const getList = async () => {
  const res: any = await listDbTable(queryParams);
  dbTableList.value = res.rows;
  total.value = res.total;
};
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageIndex = 1;
  getList();
};
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  handleQuery();
};

/** 导入按钮操作 */
const handleImportTable = async () => {
  const tableNames = tables.value.join(',');
  if (tableNames == '') {
    proxy?.$modal.msgError('请选择要导入的表');
    return;
  }
  for (let dbTableVO of state.selectionRows) {
    if (!dbTableVO.tableComment) {
      proxy.$message.error('请在表设计中填写表备注描述');
      return;
    }
  }

  let params = Object.assign(
    {},
    {
      dataName: queryParams.dataName,
      tables: tableNames,
    },
    state.formField
  );

  let url = '/tool/gen/importTable';
  const res = await postData(url, params);
  if (res.code === 200) {
    visible.value = false;
    proxy.common.showMsg(res);

    if (typeof props.onImportSaveAfter === 'function') {
      props.onImportSaveAfter(res.data);
    }
  }
};

/** 查询多数据源名称 */
const getDataNameList = async () => {
  const res = await getDataNames();
  dataNameList.value = res.data;
};

// 提取字段
const createField = async () => {
  if (!state.formField.packageName) {
    proxy.$message.error('项目名称不能为空');
    return;
  }
  if (!state.formField.folderName) {
    proxy.$message.error('文件夹不能为空');
    return;
  }
  if (!state.formField.parentId) {
    proxy.$message.error('父级ID不能为空');
    return;
  }

  state.isLoading = true;
  await handleImportTable();
  state.isLoading = false;
};

defineExpose({
  show,
});
</script>

<style lang="scss">
.import-table {
  .el-dialog__body {
    padding: 0 10px !important;
  }
}
</style>
