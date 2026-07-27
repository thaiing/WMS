<template>
  <el-dialog draggable v-model="currentVisible" width="900px" title="预到货订单" append-to-body>
    <el-alert :closable="false" title="预到货订单" type="success" class="alert-msg"></el-alert>
    <el-table :data="state.tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="orderCode" label="预到货单号" width="200"> </el-table-column>
      <el-table-column prop="consignorName" label="货主"> </el-table-column>
      <el-table-column prop="storageName" label="仓库" width="150"> </el-table-column>
      <el-table-column prop="providerShortName" label="供应商"> </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="currentVisible = false">取 消</el-button>
      <el-button type="primary" @click="clickSelect">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="purchase-order-dialog">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy: BaseProperties = ins.proxy as BaseProperties;

// 事件定义
const emit = defineEmits(['update:visible', 'click-select']);

//#region 定义属性
const props = defineProps({
  // 是否显示
  visible: {
    type: Boolean,
    default: false,
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  // 明细数据
  tableData: [],
  multipleSelection: [],
});
//#endregion

//#region 计算属性
// 显示窗口
const currentVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});
//#endregion

const reload = (data: any) => {
  debugger;
  state.tableData = data;
};

const handleSelectionChange = (val: any) => {
  state.multipleSelection = val;
};

// 选择预到货单
const clickSelect = () => {
  if (state.multipleSelection.length !== 1) {
    proxy.$message.error('请选中一条您需要加载的数据');
    return;
  }
  emit('click-select', state.multipleSelection[0]);
};

defineExpose({
  reload,
});
</script>
