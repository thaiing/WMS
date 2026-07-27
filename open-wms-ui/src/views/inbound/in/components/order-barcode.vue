<template>
  <!-- 打印对话框 -->
  <print-dialog v-model:visible="currentVisible" :data-options="state.printOptions" :dataListSelections="state.printOptions.dataListSelections" :printOptions="state.printOptions" :on-custom-print="onCustomPrint">
    <template #print-bottom-slot>
      <el-alert title="提示：下面可改变需要打印的实际数量" type="success"></el-alert>
      <el-table :data="state.tableData" stripe style="width: 100%">
        <el-table-column prop="productModel" label="条码" width="180">
          <template #default="{ row, col, index }">
            <template v-if="row.templateName === '中条码打印'">
              {{ row.middleBarcode || row.productModel }}
            </template>
            <template v-else-if="row.templateName === '大条码打印'">
              {{ row.middleBarcode || row.productModel }}
            </template>
            <template v-else>
              {{ row.productModel }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="printQty" label="打印数量" width="180">
          <template #default="{ $idnex, row }">
            <el-input-number v-model.number="row.printQty" controls-position="right" class="w-100"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="productSpec" label="规格"> </el-table-column>
      </el-table>
    </template>
  </print-dialog>
</template>

<script setup lang="ts" name="order-barcode">
import { ComponentInternalInstance, defineExpose } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import printDialog from '/@/components/common/components/print-dialog.vue';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:visible']);

//#region 定义属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
    required: true,
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  id: '',
  tableData: [] as any[],
  formLabelWidth: '80px',
  type: '',
  printOptions: {
    idField: '',
    menuId: 0,
    baskReportUrl: '',
    dataListSelections: [] as any[],
  },
});
//#endregion

//#region 是否显示dialog
const currentVisible = computed({
  get() {
    return props.visible;
  },
  set(newValue) {
    emit('update:visible', newValue); // 双向绑定prop.action，通知父级组件变量值同步更新
  },
});
//#endregion

const showData = (rows: any, type: any) => {
  state.type = type;
  state.tableData = rows;

  let menuId = 1758;
  if (state.type === 'middleBarcode') {
    menuId = 12302;
  } else if (state.type === 'bigBarcode') {
    menuId = 12303;
  } else if (state.type === 'SN') {
    menuId = 21759;
  }
  state.printOptions.menuId = menuId;
};

const onCustomPrint = (dataOptions: any, printTemplateId: any) => {
  if (!state.tableData.length) {
    proxy.$message.error('执行选择一项');
    return;
  }
  let ids = state.tableData.map((m) => m.productId).join(',');
  let printQtys = state.tableData.map((m) => {
    return {
      id: m.productId,
      qty: m.printQty,
    };
  });
  if (state.type === 'SN') {
    ids = state.tableData.map((m) => m.snId).join(',');
  }

  var url = `/system/print/base-template-id/${dataOptions.menuId}/${printTemplateId}/${ids}?key=${proxy.common.getGUID()}&printQtys=${JSON.stringify(printQtys)}&autoPrint=false`;
  window.open(url);
};

// 对外暴露属性和方法
defineExpose({
  showData,
});
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding: 0px 10px;
}
</style>
