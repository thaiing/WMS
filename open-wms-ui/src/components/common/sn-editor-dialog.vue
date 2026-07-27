<template>
  <el-dialog v-model="currentDialogVisible" :top="common.getDialogTop()" :title="props.readonly ? 'SN查看' : 'SN修改'" class="dialog-container" width="1000px" draggable append-to-body>
    <div class="dialog-info">
      <el-form :model="row" label-width="100px">
        <el-form-item label="SN号">
          <el-input v-model="state.sn" :disabled="props.readonly" type="textarea" :rows="6" placeholder="请输入SN号，多个回车换货或者逗号分隔"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="currentDialogVisible = false">关闭</el-button>
        <el-button v-if="!props.readonly" type="primary" @click="modifySn()">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="sn-editor-dialog">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy: BaseProperties = ins.proxy as BaseProperties;

// 事件定义
const emit = defineEmits(['update:visible', 'field-change']);

//#region 定义属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  // 当前行数据
  row: {
    type: Object,
    required: true,
  },
});
//#endregio

//#region 定义变量
const state = reactive({
  sn: '',
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
//#endregion

onMounted(() => {});

//#region watch
// 监听当前行数据
watch(
  () => props.row,
  (val) => {
    let snList = props.row.singleSignCode || '';
    snList = snList ? snList.replace(/,/gi, '\n').replace(/\\r/gi, '') : '';
    state.sn = snList;
  },
  { deep: true, immediate: true }
);

//#endregion

// 修改SN号
const modifySn = () => {
  let snList = [];
  snList = state.sn ? state.sn.replace(/,/gi, '\n').replace(/\\r/gi, '').split('\n') : [];
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
  props.row.singleSignCode = validSnList.join(',');
  props.row.__ischange__ = true;
  proxy.$emit('on-sn-change', props.row, validSnList, validSnList.length); // SN改变事件

  currentDialogVisible.value = false;
};
</script>

<style lang="scss" scoped>
.dialog-container {
  :deep(.el-upload-list) {
    margin-right: 20px;
  }
  :deep(.scrollbar-wrap) {
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
