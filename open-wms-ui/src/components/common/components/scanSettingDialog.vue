<template>
  <el-dialog v-model="currentDialogVisible" :top="common.getDialogTop()" title="扫描字段设置" class="dialog-container" width="780px" draggable overflow append-to-body>
    <el-alert :closable="false" title="列宽不填将自适应，排序数字越小排在前面" type="success" class="alert-msg"></el-alert>
    <el-table ref="filterTable" :data="currentFields" style="width: 100%" height="400">
      <el-table-column prop="prop" label="英文名" sortable header-align="center"></el-table-column>
      <el-table-column prop="label" label="字段名" header-align="center"></el-table-column>
      <el-table-column prop="width" label="列宽" width="120" header-align="center">
        <template #default="{ row }">
          <el-input v-model.number="row.width" placeholder="请输入宽度" class="w-100pc" @change="(val:any) => fiedChange(row, val)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="order" label="排序" width="120" header-align="center">
        <template #default="{ row }">
          <el-input v-model.number="row.order" placeholder="排序号" class="w-100pc" @change="(val:any) => fiedChange(row, val)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="visible" label="显示" width="100" align="center">
        <template #default="{ row }">
          <el-switch v-model="row.visible" @change="(val:any) => fiedChange(row, val)"></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="flex-end">
        <el-button @click="currentDialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="ele-Delete" @click="cancel">还原默认</el-button>
        <el-button :loading="state.isLoading" type="primary" icon="ele-Select" @click="save">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="inbound-scan-order">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy: BaseProperties = ins.proxy as BaseProperties;
// 事件定义
const emit = defineEmits(['update:visible', 'field-change']);

//#region 定义属性
const props = defineProps({
  // 是否显示
  visible: {
    type: Boolean,
    default: false,
  },
  // 名称
  name: {
    type: String,
    required: true,
  },
  // 字段数据
  fields: {
    type: Array<any>,
    default: () => {
      return [];
    },
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  // 当前选中菜单下的导出模板列表
  vueDataList: [],
  // 当前选中模板
  currentTemplate: {},
  isLoading: false,
});
//#endregion

//#region 计算属性
// 显示窗口
const currentDialogVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const currentFields = computed(() => {
  const _fields = JSON.parse(JSON.stringify(props.fields));
  return _fields.sort(function (a: any, b: any) {
    if (a.order > b.order) {
      return 1;
    } else if (a.order === b.order) {
      return 0;
    } else {
      return -1;
    }
  });
});
//#endregion

const fiedChange = (newRow: any, val: any) => {
  const row = props.fields.find((item: any) => {
    return item.prop === newRow.prop;
  });
  if (row) {
    row.width = newRow.width;
    row.order = newRow.order;
    row.visible = newRow.visible;
  }
};

const cancel = () => {
  localStorage.removeItem(props.name + '-setting');
  proxy.$message.success('还原成功');
  currentDialogVisible.value = false;
  emit('field-change');
};

const save = () => {
  const _fields = JSON.stringify(currentFields.value);
  localStorage[props.name + '-setting'] = _fields;
  proxy.$message.success('保存成功');
  currentDialogVisible.value = false;
  emit('field-change');
};
</script>
